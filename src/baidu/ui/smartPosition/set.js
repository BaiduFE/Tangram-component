/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/smartPosition/set.js
 * author: berg
 * version: 1.0.0
 * date: 2010-07-14*
 */

///import baidu.ui.smartPosition.SmartPosition;
///import baidu.dom.g;

/**
 * 让已有的元素支持smartPosition。
 * @function
 * @param {string|HTMLElement} element            需要定位的元素
 * @param {Array|Object}       coordinate         定位方式，可以是{x:200,y:300}格式，也可以是[200, 300]格式。
 * @param  {Object}            [options]          选项
 * @config {String}            position           left/right和top/bottom的组合，确定定位方式。
 * @config {Boolean}           once               只定位一次
 * @config {Array|Object}      coordinate         定位的坐标
 * @config {Function}          onbeforeupdate     update之前触发此事件
 * @config {Function}          onupdate           update之后触发此事件
 * @config {string}            insideScreen       fix/surround/false 三种不同的定位方式。<br/>fix:当弹出层超出页面可视区域时，弹出层与页面可视区域边缘相邻的边将会与可视区域边缘重合，弹出层以改边为基准向可视区域内部绘制。<br/>surround:当弹出层超出页面可视区域时，弹出层与coordinate坐标点基准向可视区域内部绘制。<br/>false:当弹出层超出页面可视区域时，弹出层不做任何调整。<br/>
 * @returns {baidu.ui.smartPosition.SmartPosition} SmartPosition实例
 */



baidu.ui.smartPosition.set = function(element, coordinate, options){
    options = options || {};

    options.source = baidu.g(element);
    options.coordinate = coordinate || [0,0];

    var sp = new baidu.ui.smartPosition.SmartPosition(options);
    sp.update();

    return sp;
};
