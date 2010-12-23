/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/starRate/create.js
 * author: rocy
 * version: 1.0.0
 * date: 2010-06-01
 */


///import baidu.ui.starRate;
///import baidu.ui.starRate.StarRate;
/**
 * 获得starRate实例
 * @param {Array} data
 * @param {Object} options
 * @return {baidu.ui.starRate.StarRate}
 */
baidu.ui.starRate.create = function(element,options){
	options = options || {};
	//options.target = element;
	//return new baidu.ui.starRate.StarRate(options);
	var ret = new baidu.ui.starRate.StarRate(options);
	ret.render(element);
	return ret;
};