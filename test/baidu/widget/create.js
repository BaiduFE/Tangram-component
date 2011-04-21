module("baidu.widget.create");

(function() {
	// 添加路径配置信息
	baidu.widget._pathInfo = {
		'dialogBase' : 'dialog.js'
	};
	baidu.widget._basePath = upath;
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
	baidu.widget.load([], w1.main);
	equals(count, 1, 'before load');
	baidu.widget.create("t5", function() {
		count++;
	}, {
		lazyLoad : false
	});
	equals(count, 2, 'before load');
});

test("不存在的资源", function() {
	expect(1);
	stop();
	var w1 = baidu.widget.create("widget4_1", function(require, exports) {
		try {// 当前情况不抛错误
			var dd = require('notexist');
			ok(false, "见 说明 wiki.commonjs.org/wiki/Modules/1.1.1");
		} catch (e) {
			ok(e.message.indexOf("notexist") >= 0, 'message信息包含不存在资源');
		}
		start();
	});
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
test("exports and cycle", function() {
	expect(2);
	stop();
	baidu.widget.create('c', function(r, e) {
		var b = r('b');
		equals(r('b').b(), "b", "check exports");
		var a = r('a');
		equals(r('a').a(), "b", "check exports");
		start();
	}, {
		depends : 'a'
	});
});

test('test load', function() {
	// load loaded
	baidu.widget.load(['a'], function(r, e) {//已经加载的项会有问题
		equals(r('a').a(), 'b', 'load');
		equals(r('b').b(), 'b', 'load depends');
	});
	baidu.widget.load(['c'], function(){
		
	});
});

test('test get', function(){
	
});