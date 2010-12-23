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
 * @param {String|HTMLElment} target
 * @param {Object} options
 * @return baidu.ui.input.Input
 */

baidu.ui.input.create = function(target,options){
	options = options || {};
	var input = new baidu.ui.input.Input(options);
	var targetEle = baidu.g(target);
    input.render(targetEle);
    return input;
};
