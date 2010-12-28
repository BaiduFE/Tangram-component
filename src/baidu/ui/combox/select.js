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
///import baidu.dom.getPosition;
/**
 * 获得combox实例
 * @param {Array} select
 * @param {Object} options
 * @return {baidu.ui.combox.Combox}
 */
//TODO: 改成setup
baidu.ui.combox.select = function(select,options){
	select = baidu.g(select);
	if('select' != select.tagName.toLowerCase()) return;
	
	options = options || {};
	var menuData = [], oriPosition;
	baidu.array.each(select.options, function(opt){
		menuData.push({value:opt.value || opt.innerHTML, content: opt.innerHTML});
	});
	options.data = menuData.concat(options.data || []);
	
	oriPosition = baidu.dom.getPosition(select);
	options.position = {x:oriPosition.left, y: oriPosition.top};
	select.style.display = "none";
	//同步原select的value,用于表单提交
	options.onitemchosen = function(data){
		select.value = data.value.value || data.value.content;
	};
	
	var combox = new baidu.ui.combox.Combox(options);
	combox.render();
	return combox;
	
};