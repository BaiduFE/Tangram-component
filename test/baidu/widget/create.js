module("baidu.widget.create");

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