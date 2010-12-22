/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * @author: meizz
 * @namespace: baidu.fx.moveTo
 * @version: 2010-06-07
 */

///import baidu.dom.g;
///import baidu.fx.move;
///import baidu.object.extend;
///import baidu.dom.getStyle;

/**
 * 将元素移动到指定的坐标点
 * 
 * @param   {HTMLElement}   element     DOM元素或者ID
 * @param   {Array|JSON}    point       目标点坐标
 * @param   {JSON}          options     类实例化时的参数配置
 * @return  {fx}     效果类的实例
 */
baidu.fx.moveTo = function(element, point, options) {
    if (!(element = baidu.dom.g(element))
        || baidu.dom.getStyle(element, "position") == "static"
        || typeof point != "object") return null;

    var p = [point[0] || point.x || 0,point[1] || point.y || 0];
    var x = parseInt(baidu.dom.getStyle(element, "left")) || 0;
    var y = parseInt(baidu.dom.getStyle(element, "top"))  || 0;

    var fx = baidu.fx.move(element, baidu.object.extend({x: p[0]-x, y: p[1]-y}, options||{}));

    return fx;
};
