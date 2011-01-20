/*
 * Tangram Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/combox/create.js author: rocy version: 1.0.0 date: 2010-06-01
 */

///import baidu.ui.combox;
///import baidu.ui.combox.Combox;
///import baidu.array.each;
///import baidu.lang.isArray;
///import baidu.dom.g;
/**
 * 获得combox实例
 * @function
 * @param  {Array}                data             储存combox每个条目的数据。每个条目数据格式: { content: 'some html string', value : ''}。
 * @param  {Object}               options          选项，用于创建combox。
 * @config {Element}              target           combox的触发元素
 * @config {Number|String}        width            宽度值。当指定element时，默认为element宽度；否则不设置（可以通过css指定）。
 * @config {Number|String}        height           高度值。当指定element时，默认为element宽度；否则不设置（可以通过css指定）。
 * @config {String}               skin             自定义样式前缀
 * @config {Boolean}              editable         是否可以输入
 * @config {Array|Object}         offset           偏移量，若为数组，索引0为x方向，索引1为y方向; 若为Object，键x为x方向，键y为y方向。单位：px，默认值：[0,0]。
 * @config {Number}               zIndex           浮起combox层的z-index值，默认为1200。
 * @config {Function}             onitemclick      combox中单个条目鼠标点击的回调函数，参数:<pre>{data : {value: Item对应的数据, index : Item索引值}}</pre>
 * @config {Function}             onbeforeclose    关闭之前触发
 * @config {Function}             onclose          关闭时触发
 * @config {Function}             onbeforeopen     打开之前触发
 * @config {Function}             onopen           打开时触发
 * @config {Function}             onmouseover      悬停时触发
 * @config {Function}             onmouseout       离开时触发
 * @config {Function}             onmousedown      鼠标按下时触发
 * @config {Function}             onmouseup        鼠标抬起时触发
 * @return {baidu.ui.combox.Combox}combox实例
 */
baidu.ui.combox.create = function(data, options){
	options = options || {};
	options.data = data || [];
	var combox = new baidu.ui.combox.Combox(options);
	combox.render();
	return combox;
};