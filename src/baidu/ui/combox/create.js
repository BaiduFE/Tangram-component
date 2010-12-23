/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/combox/create.js
 * author: rocy
 * version: 1.0.0
 * date: 2010-06-01
 */


///import baidu.ui.combox;
///import baidu.ui.combox.Combox;
///import baidu.array.each;
///import baidu.lang.isArray;
///import baidu.dom.g;
/**
 * 获得combox实例
 * @param {Array} data
 * @param {Object} options
 * @return {baidu.ui.combox.Combox}
 */
baidu.ui.combox.create = function(data,options){
	options = options || {};
	options.data = data || [];
	var combox = new baidu.ui.combox.Combox(options);
	combox.render();
	return combox;
};