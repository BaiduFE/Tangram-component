
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */
///import baidu.widget;
///import baidu.lang.isString;
///import baidu.lang.isObject;
///import baidu.lang.isFunction;
/**
 * 检查传入对象是否为widget
 * @name baidu.widget._isWidget
 * @author rocy
 * @function
 * @private
 * @grammar baidu.widget._isWidget(widget)
 * @param {Object} widget 待检测widget.
 *
 * @return {Boolean} 是否为widget.
 */
baidu.widget._isWidget = function(widget) {
    if (!widget ||
        !baidu.lang.isString(widget.id) ||
        !baidu.lang.isObject(widget.exports) ||
        !baidu.lang.isFunction(widget.main)) {
        return false;
    }
    return true;
};
