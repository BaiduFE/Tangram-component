/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/Tooltip/create.js
 * author: rocy
 * version: 1.0.0
 * date: 2010-06-01
 */

///import baidu.ui.Tooltip;
///import baidu.array.each;
///import baidu.lang.toArray;
///import baidu.dom.g;
///import baidu.dom.getPosition;
/**
 * 获取Tooltip实例
 * @function
 * @param    {String|HTMLElment|Array}    elements        字符串或者元素数组，用于初始化tooltip，字符串为目标元素的ID值。
 * @param    {Object}                     options         选项
 * @config   {Element}                    content         Tooltip元素的内部html。当指定target时，默认为target的title属性，否则默认为空。
 * @config   {String}                     width           宽度
 * @config   {String}                     height          高度
 * @config   {Array|Object}               offset          偏移量。若为数组，索引0为x方向，索引1为y方向；若为Object，键x为x方向，键y为y方向。单位：px，默认值：[0,0]。
 * @config   {boolean}                    single          是否全局单例。若该值为true，则全局共用唯一的浮起tooltip元素，默认为true。
 * @config   {Number}                     zIndex          浮起tooltip层的z-index值，默认为3000。
 * @config   {String}                     positionBy      浮起tooltip层的位置参考，取值['mouse','element']，分别对应针对鼠标位置或者element元素计算偏移，默认mouse。
 * @config   {Function}                   onopen          打开tooltip时触发。
 * @config   {Function}                   onclose         关闭tooltip时触发。
 * @config   {Function}                   onbeforeopen    打开tooltip前触发。
 * @config   {Function}                   onbeforeclose   关闭tooltip前触发。
 * @config   {Number}                     showDelay       触发显示的延迟，默认为100毫秒。
 * @config   {Number}                     hideDelay       触发隐藏的延迟，默认为500毫秒。
 * @return baidu.ui.Tooltip
 * @see baidu.ui.Tooltip
 */
baidu.ui.Tooltip.create = function(elements,options){
	if(!elements)
        return null;
	var ret = [],me, targetPosition,
        elementArr = baidu.lang.toArray(elements);
	options = options || {};
	
	baidu.array.each(elementArr, function(element){
		me = new baidu.ui.Tooltip(options);
        me.render(baidu.g(element));
		me.addEventListener("open", function(){this.contentElement && (this.contentElement.style.display = "");});
		ret.push(me);
	});
	// 返回值和参数照应, 传入数组或HTMLCollection则返回数组,否则返回单个实例
    return elements.splice || elements.item ? ret : ret[0];
};
