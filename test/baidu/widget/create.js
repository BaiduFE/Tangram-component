module("baidu.widget.create");
// The "require" function accepts a module identifier.
test("参数类型验证", function() {
	// 指定相对根路径
	baidu.widget._basePath = '../../baidu/widget/';

	baidu.widget.create("widget1", function(require, exports, thisPtr) {
		equal(typeof require, "function", "require类型为function");
		equal(typeof exports, "object", "exports 类型为object");
	});
});

test("依赖验证", function() {
	stop();
	baidu.widget.create("widget2", function(require, exports) {
		var uibase = require('uibase');
		equal(uibase.create(), 'uibase_create', "测试api方法调用");
		start();
	}, {
		depends : "uibase"
	});
});

// 添加路径配置信息
baidu.widget._pathInfo = {
	'dialogBase' : 'dialog.js'
};

test("多个依赖widget验证", function() {
	stop();
	baidu.widget.create("widget2", function(require, exports) {
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
	w1 = baidu.widget.create("widget3_1", function() {
		count++;
	}, {
		lazyLoad : true
	});
	equals(count, 0, 'before load');
	baidu.widget.load([], w1.main);
	equals(count, 1, 'before load');
	baidu.widget.create("widget3_2", function() {
		count++;
	}, {
		lazyLoad : false
	});
	equals(count, 2, 'before load');
});

test("不存在的资源", function() {
	expect(1);
	var w1 = baidu.widget.create("widget4_1", function(require, exports) {
		try {// 当前情况不抛错误
			var dd = require('notexist');
			ok(false, "见 说明 wiki.commonjs.org/wiki/Modules/1.1.1");
		} catch (e) {
			ok(e.message.indexOf("notexist") >= 0, 'message信息包含不存在资源');
		}
	});
});

/*
 * If there is a dependency cycle, the foreign module may not have finished
 * executing at the time it is required by one of its transitive dependencies;
 * in this case, the object returned by "require" must contain at least the
 * exports that the foreign module has prepared before the call to require that
 * led to the current module's execution.
 */
test("cycle dependency", function() {
	// a->b->a
});

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
test("require and exports", function() {
	expect(1);
	baidu.widget.load(['a'], function(require, exports) {
		var a = require('a');
		equals(a.a(), "b");
	});
});