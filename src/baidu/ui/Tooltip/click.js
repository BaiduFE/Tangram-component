/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/Tooltip/click.js
 * author: rocy
 * version: 1.0.0
 * date: 2010-06-01
 */

///import baidu.ui.Tooltip;
///import baidu.ui.Tooltip.create;
///import baidu.ui.get;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.event.getTarget;
///import baidu.dom.getAncestorBy;

///import baidu.lang.isArray;
///import baidu.array.each;



//位置偏移
baidu.ui.Tooltip.prototype.offset = [0,0];

/**
 * 创建一个鼠标点击触发的tooltip
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
 * @see baidu.ui.Tooltip
 * @return baidu.ui.Tooltip
 */
baidu.ui.Tooltip.click = function(elements,options){
	var tooltips = baidu.ui.Tooltip.create(elements,options),
        tooltipArr = baidu.lang.isArray(tooltips)? tooltips : [tooltips];
    baidu.array.each(tooltipArr, function(tooltip){
        var showFn = function(e){
				tooltip.open();
			},
			hideFn = function(e){
				if(!tooltip.getBody())
	                return;
				var target = baidu.event.getTarget(e || window.event),
					judge = function(el){
	                    return el == tooltip.getTarget()
	                };
				if(judge(target) || baidu.dom.getAncestorBy(target, judge) || baidu.ui.get(target) == tooltip)
	                return;
				tooltip.close();
			};
		
		baidu.on(tooltip.getTarget(), 'click',showFn);
		
		baidu.on(document, 'click', hideFn);
		//销毁时注销事件注册
		tooltip.addEventListener('ondispose',function(){
			baidu.un(tooltip.getTarget(), 'click',showFn);
			baidu.un(document, 'click', hideFn);
		});
		
		
    });
    return tooltips;
};
