/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/input/create.js
 * author: zhangyao
 * version: 1.0.0
 * date: 2010-08-26
 */


///import baidu.ui.input;
///import baidu.ui.input.Input;
///import baidu.dom.g;
/**
 * 获取一个Input实例
 * @function
 * @param {String|HTMLElment}       target        存放input控件的元素，input控件会渲染到该元素内
 * @param {Object}                  [options]     选项
 * @config {String}                 text          input文本信息
 * @config {Boolean}                disabled      控件是否有效，默认为false（有效）。
 * @config {Function}               onfocus       聚焦时触发
 * @config {Function}               onblur        失去焦点时触发
 * @config {Function}               onchage       input内容改变时触发
 * @config {Function}               onkeydown     按下键盘时触发
 * @config {Function}               onkeyup       释放键盘时触发
 * @config {Function}               onmouseover   鼠标悬停在input上时触发
 * @config {Function}               onmouseout    鼠标移出input时触发
 * @config {Function}               ondisable     当调用input的实例方法disable，使得input失效时触发。
 * @config {Function}               onenable      当调用input的实例方法enable，使得input有效时触发。
 * @config {Function}               ondispose     销毁实例时触发
 * @return baidu.ui.input.Input
 * @remark     创建input文本框控件时，会自动为控件加上四种状态的style class，分别为正常情况(tangram-input)、鼠标悬停在控件上(tangram-input-hover)、失去焦点时(tangram-input-focus)、控件失效时(tangram-input-disable)，用户可自定义样式。
 */

baidu.ui.input.create = function(target,options){
	options = options || {};
	var input = new baidu.ui.input.Input(options);
	var targetEle = baidu.g(target);
    input.render(targetEle);
    return input;
};
