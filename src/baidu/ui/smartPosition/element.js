/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/smartPosition/element.js
 * author: berg
 * version: 1.0.0
 * date: 2010-07-14
 */


///import baidu.ui.smartPosition.SmartPosition;
///import baidu.dom.getPosition;

/**
 * 让元素按照已有元素定位。
 * @function
 * @param {string|HTMLElement}  source             需要定位的元素
 * @param {string|HTMLElement}  target             定位目标
 * @param {Object}              [options]          选项，和smartPosition中update方法相同
 * @config {String}             position           left/right和top/bottom的组合，确定定位方式
 * @config {string}             insideScreen       fix/surround/false 三种不同的定位方式。<br/>fix:当弹出层超出页面可视区域时，弹出层与页面可视区域边缘相邻的边将会与可视区域边缘重合，弹出层以改边为基准向可视区域内部绘制。<br/>surround:当弹出层超出页面可视区域时，弹出层与coordinate坐标点基准向可视区域内部绘制。<br/>false:当弹出层超出页面可视区域时，弹出层不做任何调整。<br/>
 * @returns {baidu.ui.smartPosition.SmartPosition} SmartPosition实例
 */

baidu.ui.smartPosition.element = function(element, target, options){
    element = baidu.g(element);
    target = baidu.g(target);

    options = options || {};
    options.coordinate = options.coordinate || {};
    options.source = element;

    var sp = new baidu.ui.smartPosition.SmartPosition(options);

    //在update之前，修正coordinate
    sp.addEventListener("onbeforeupdate", function(){
        var sp = this,
            targetPos = baidu.dom.getPosition(target);
            //取消了根据parent位置的修正
        sp['coordinate']['x'] = targetPos.left + (sp.position.indexOf("right") >= 0 ? target.offsetWidth : 0);
        sp['coordinate']['y'] = targetPos.top + (sp.position.indexOf("bottom") >= 0 ? target.offsetHeight : 0);
    });

    sp.update();

    return sp;
};
