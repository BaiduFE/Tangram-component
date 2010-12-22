/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/menubar/create.js
 * author: rocy
 * version: 1.0.0
 * date: 2010-06-01
 */


///import baidu.ui.menubar;
///import baidu.ui.menubar.Menubar;
/**
 * 获得menubar实例
 * @param {Array} data
 * @param {Object} options
 * @return {baidu.ui.menubar.Menubar}
 */
baidu.ui.menubar.create = function(data,options){
	options = options || {};
	options.data = data || [];
	return new baidu.ui.menubar.Menubar(options);
};