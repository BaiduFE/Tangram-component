
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */
///import baidu.widget;
///import baidu.widget.get;
///import baidu.widget._isWidget;
///import baidu.lang.isFunction;
/**
 * 析构widget. 如果widget有dispose方法,则执行.
 * @name baidu.widget.dispose
 * @function
 * @grammar baidu.widget.dispose(widget)
 * @param {String} name widget名.
 * @author rocy
 */
baidu.widget.dispose = function(name) {
    var widget = baidu.widget.get(name);
    if (!baidu.widget._isWidget(widget)) {
        return;
    }
    //执行widget的dispose方法
    if (baidu.lang.isFunction(widget.dispose)) {
        widget.dispose();
    }
    delete baidu.widget._widgetAll[name];
};
