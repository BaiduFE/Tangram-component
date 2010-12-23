/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * @author: meizz
 * @namespace: baidu.fx.moveBy
 * @version: 2010-06-04
 */


///import baidu.dom.g;
///import baidu.fx.move;
///import baidu.object.extend;
///import baidu.dom.getStyle;

/**
 * 将元素按指定的移动量移动
 * 
 * @param   {HTMLElement}   element     DOM元素或者ID
 * @param   {Array|JSON}    distance    移动的距离
 * @param   {JSON}          options     类实例化时的参数配置
 * @return  {fx}     效果类的实例
 */
baidu.fx.moveBy = function(element, distance, options) {
    if (!(element = baidu.dom.g(element))
        || baidu.dom.getStyle(element, "position") == "static"
        || typeof distance != "object") return null;

    var d = {};
    d.x = distance[0] || distance.x || 0;
    d.y = distance[1] || distance.y || 0;

    var fx = baidu.fx.move(element, baidu.object.extend(d, options||{}));

    return fx;
};
