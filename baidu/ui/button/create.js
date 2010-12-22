/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/button/create.js
 * author: zhangyao
 * version: 1.0.0
 * date: 2010-08-06
 */


///import baidu.ui.button;
///import baidu.ui.button.Button;
///import baidu.dom.g;
/**
 * 获取一个Button实例
 * @param {String|HTMLElment} target
 * @param {Object} options
 * @return baidu.ui.button.Button
 */
baidu.ui.button.create = function(target,options){
	var button = new baidu.ui.button.Button(options);
    button.render(baidu.g(target));
    return button;
};
