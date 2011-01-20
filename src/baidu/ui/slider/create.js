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
 * 基础方法,创建一个slider实例
 * @function
 * @param   {string|HTMLElement}     target       创建的目标元素
 * @param   {Object}                 [options]    创建时的选项
 * @config  {Number}                 value        记录滑块的当前进度值
 * @config  {Number}                 layout       滑块的布局[水平：horizontal,垂直：vertical]
 * @config  {Number}                 min          进度条最左边代表的值
 * @config  {Number}                 max          进度条最右边代表的值
 * @config  {Boolean}                disabled     是否禁用
 * @config  {String}                 skin         自定义样式名称前缀
 * @return  {baidu.ui.slider.Slider} slider实例
 */


///import baidu.ui.slider.Slider;

baidu.ui.slider.create = function(target, options){
    var slider = new baidu.ui.slider.Slider(options);
    slider.render(target);
    return slider;
};