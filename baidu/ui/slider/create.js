/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/slider/create.js
 * author: berg
 * version: 1.0.0
 * date: 2010/09/08 
 */



/**
 * 基础方法
 *
 * 创建一个slider实例
 *
 * @param {string|HTMLElement} target 创建的目标元素
 * @param {object} options optional 创建时的选项
 *
 * @return {baidu.ui.slider.Slider} slider实例
 *
 */


///import baidu.ui.slider.Slider;

baidu.ui.slider.create = function(target, options){
    var slider = new baidu.ui.slider.Slider(options);
    slider.render(target);
    return slider;
};