module("baidu.widget.create");

(function() {
	// 添加路径配置信息，并迁移所有用例依赖到单独的js目录中
	baidu.widget._pathInfo = {
		'dialogBase' : 'dialog.js'
	};
	baidu.widget._basePath = upath + "js/";
	te.fnQueue = {
		q : [],
		ci : 0,
		next : function() {// 每个单独项仅能运行2秒，超时就直接下一个了
			var c = this;
			clearTimeout(c.timeout);
			c.timeout = setTimeout(function() {
				c.end();
			}, 1000);
			try {
				(c.q.shift() || c.end)();
			} catch (e) {
				console && console.log && console.log(e);
				// setTimeout(c.next, 1);
				c.end();
			}
		},
		end : function() {
			var c = te.fnQueue;
			clearTimeout(c.timeout);
			if (c.expect)
				window.QUnit.expect(c.expect);
			c.expect = 0;
			c.q = [];
			start();
		},
		/**
		 * 添加一个函数到队列并添加期待校验数
		 * 
		 * @param fn
		 * @param ex
		 */
		add : function(fn, ex) {
			var c = this;
			c.q.push(fn);
			ex && (c.expect = c.expect + ex);
		},
		expect : 0,
		start : function() {
			var c = this;
			stop();
			c.next();
		}
	};
})();

// The "require" function accepts a module identifier.
test("参数类型验证", function() {
	// 指定相对根路径
	var w = baidu.widget.create("t1", function(require, exports) {
		equal(typeof require, "function", "require类型为function");
		equal(typeof exports, "object", "exports 类型为object");
	});
});

test("依赖验证", function() {
	stop();
	baidu.widget.create("t2", function(require, exports) {
		var uibase = require('uibase');
		equal(uibase.create(), 'uibase_create', "测试api方法调用");
		start();
	}, {
		depends : "uibase"
	});
});

test("多个依赖widget验证", function() {// 这个用例同步验证了重复加载的处理逻辑
	stop();
	baidu.widget.create("t3", function(require, exports) {
		var dialog = require('dialog');
		equal(dialog.create(), 'dialog_create', "测试api方法调用");
		var dialogBase = require('dialogBase');
		equal(dialogBase.create(), 'dialogBase_create', "测试api方法调用");
		start();
	}, {
		depends : "dialog,dialogBase,uibase,core.log"
	});
});

test("lazy load", function() {
	var count = 0,
	//
	w1 = baidu.widget.create("t4", function() {
		count++;
	}, {
		lazyLoad : true
	});
	equals(count, 0, 'before load');
	w1.load();
	equals(count, 1, 'before load');
	baidu.widget.create("t5", function() {
		count++;
	}, {
		lazyLoad : false
	});
	equals(count, 2, 'before load');
});

//
// /*
// * If there is a dependency cycle, the foreign module may not have finished
// * executing at the time it is required by one of its transitive dependencies;
// * in this case, the object returned by "require" must contain at least the
// * exports that the foreign module has prepared before the call to require
// that
// * led to the current module's execution.
// */
// // test("cycle dependency", function() {
// // // a->b->a
// // });
/**
 * The "require" function may have a "paths" attribute, that is a prioritized
 * Array of path Strings, from high to low, of paths to top-level module
 * directories.
 * <li>The "paths" property must not exist in "sandbox" (a secured module
 * system).
 * <li>The "paths" attribute must be referentially identical in all modules.
 * <li>Replacing the "paths" object with an alternate object may have no
 * effect.
 * <li>If the "paths" attribute exists, in-place modification of the contents
 * of "paths" must be reflected by corresponding module search behavior.
 * <li>If the "paths" attribute exists, it may not be an exhaustive list of
 * search paths, as the loader may internally look in other locations before or
 * after the mentioned paths.
 * <li>If the "paths" attribute exists, it is the loader's prorogative to
 * resolve, normalize, or canonicalize the paths provided.
 */

test('depends', function() {
	var c = te.fnQueue;
	c.add(function() {// 递归加载
		baidu.widget.create('t7', function(r, e) {
			equals(r('t7_2').exec(), 2, "t7_2");
			equals(r('t7_1').exec(), 3, "t7_1依赖t7_2");
			equals(r('t7_1').exec1(), 3, "t7_1依赖t7_2");
			c.next();
		}, {
			depends : 't7_1'
		});
	}, 3);

	c.add(function() {// 加载过的module再次加载并执行
		baidu.widget.create('t8', function(r, e) {
			equals(r('t7_2').exec(), 2, "t8依赖已经加载过的项");
			c.next();
		}, {
			depends : 't7_2'
		});
	}, 1);

	c.add(function() {// 前后颠倒一下,http://icafe.baidu.com:8100/jtrac/app/item/PUBLICGE-408/
		baidu.widget.create('t6', function(r, e) {
			equals(r('t6_2').exec(), "t6_2", "check exports");
			equals(r('t6_1').exec(), "t6_2", "check exports");// 这地方抛异常
			c.next();
		}, {// 前后颠倒的依赖关系
			depends : [ 't6_2', 't6_1' ]
		});
	}, 2);

	c.start();
});

test('test load', function() {
	var c = te.fnQueue;
	c.add(function() {// load
		baidu.widget.load('t9_1,t9_2', function(r, e) {// 加载
			equal(r('t9_1').exec(), 3);
			equal(r('t9_2').exec(), 2);
			c.next();
		});
	}, 2);
	c.add(function() {// load loaded
		baidu.widget.load([ 't7_1' ], function(r, e) {// 加载
			equal(r('t7_2').exec(), 2);
			equal(r('t7_1').exec(), 3);
			c.next();
		});
	}, 2);
	c.start();
});

test('test get', function() {
	equals(baidu.widget.get('notexist'), undefined);
	equals(baidu.widget.get('t9_2').exports.exec(), 2);
});

test("不存在的资源", function() {
	expect(1);
	stop();
	var w1 = baidu.widget.create("t1", function(require, exports) {
		var dd = require('t5_notexist');
		ok(false, "见 说明 wiki.commonjs.org/wiki/Modules/1.1.1");
		start();
	}, {
		depends : [ 't5_notexist' ]
	});
	setTimeout(function(){
		ok(true, "抛错误了。。。");
		start();
	}, 500);
});
