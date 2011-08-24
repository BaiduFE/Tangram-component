/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */
///import baidu.widget;
///import baidu.widget.get;
///import baidu.widget.load;
///import baidu.array.each;
/**
 * 根据传入的widget名, 初始化方法等,创建widget.
 * @id baidu.widget.create
 * @class
 * @grammar baidu.widget.create(id, main, options)
 * @param {String} id widget名.
 * @param {Function} main widget的初始化方法,第一个参数为获取依赖widget API的方法(require), 第二个参数为API挂载点(exports).
 * @param {Object} [options] 配置参数.
 * @config {Array<String>|String} depends 依赖列表, 支持逗号分隔的字符串描述.
 * @config {Function} dispose 析构函数,在dispose时调用.
 * @config {Boolean} lazyLoad 延迟加载.该参数为true时不加载依赖模块,也不执行初始化方法,需显示调用 baidu.widget.load方法.
 * @remark
 * 该方法是commonjs中module部分的一个异步实现.
 * 该规范以及 require, exports 的定义等, 参考 http://wiki.commonjs.org/wiki/Modules/1.1.1
 * 若存在同名widget,将直接覆盖.
 * @see baidu.widget
 * @author rocy
 */
baidu.widget.create = function(id, main, options) {
    options = options || {};
    var widget = {
        id: id,
        main: main,
        depends: options.depends || [],
        exports: {},
        dispose: options.dispose
    };
    baidu.widget._widgetLoading[id] = widget;
    baidu.widget._widgetAll[id] = widget;
    widget.load = function() {
        var widget = this;
        if(widget._loaded){
            return;
        }
        widget._loaded = true;
        baidu.widget.load(widget.depends, function(require) {
            baidu.widget._widgetLoading[widget.id] = undefined;
            widget.context = require.context || baidu.widget._defaultContext;
            widget.main.call(widget, require, widget.exports);
        });
    };
    if (!options.lazyLoad) {
        widget.load();
    }
    return widget;
};
