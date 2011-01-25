/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/smartPosition/mouse.js
 * author: berg
 * version: 1.0.0
 * date: 2010-07-14
 */



///import baidu.ui.smartPosition.SmartPosition;
///import baidu.page.getMousePosition;
///import baidu.event.on;

/**
 * 让元素按照鼠标所在位置定位。
 * @function
 * @param  {string|HTMLElement} element            需要定位的元素
 * @param  {Object}             [options]          选项
 * @config {string}             insideScreen       fix/surround/false 三种不同的定位方式。<br/>fix:当弹出层超出页面可视区域时，弹出层与页面可视区域边缘相邻的边将会与可视区域边缘重合，弹出层以改边为基准向可视区域内部绘制。<br/>surround:当弹出层超出页面可视区域时，弹出层与coordinate坐标点基准向可视区域内部绘制。<br/>false:当弹出层超出页面可视区域时，弹出层不做任何调整。<br/>
 * @returns {baidu.ui.smartPosition.SmartPosition} SmartPosition实例
 */

baidu.ui.smartPosition.mouse = function(element, options){
    options = options || {};

    options.source = element;
    options.coordinate = baidu.page.getMousePosition();
    options['once'] = true;

    var sp = new baidu.ui.smartPosition.SmartPosition(options);
    sp.update();
    return sp;
};
