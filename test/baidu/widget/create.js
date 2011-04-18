
module("baidu.widget.create");

//指定相对根路径
baidu.widget._basePath = '../../baidu/widget/';
test("参数类型验证", function(){
    baidu.widget.create("widget1", function(require, exports, thisPtr){
        equal(typeof require, "function", "require类型为function");
        equal(typeof exports, "object", "exports 类型为object");
        equal(thisPtr.exports, exports, "第三个参数是本身");
    });
});

test("依赖验证", function(){
    stop();
    baidu.widget.create("widget2", function(require, exports, thisPtr){
        var uibase = require('uibase');
        equal(uibase.create(),'uibase_create',"测试api方法调用");
        start();
    },{depends:"uibase"});
});

//添加路径配置信息
baidu.widget._pathInfo = {
    'dialogBase' : 'dialog.js'
}
test("多个依赖widget验证", function(){
    stop();
    baidu.widget.create("widget2", function(require, exports, thisPtr){
        var dialog = require('dialog');
        equal(dialog.create(),'dialog_create',"测试api方法调用");
        var dialogBase = require('dialogBase');
        equal(dialogBase.create(),'dialogBase_create',"测试api方法调用");
        start();
    },{depends:"dialog,dialogBase,uibase,core.log"});
});