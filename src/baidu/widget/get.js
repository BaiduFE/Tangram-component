/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.widget;

/**
 * 获取已加载的widget.
 * @name baidu.widget.get
 * @function
 * @grammar baidu.widget.get(name)
 * @param {String} name widget名.
 * @remark
 *   get方法仅获取已加载的widget,并不做加载. 。
 *
 * @return {Object} widget
 * @author rocy
 */
baidu.widget.get = function(name) {
    return baidu.widget._widgetAll[name] || null;
};
