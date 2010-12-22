/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/tooltip/click.js
 * author: rocy
 * version: 1.0.0
 * date: 2010-06-01
 */

///import baidu.ui.tooltip;
///import baidu.ui.tooltip.create;
///import baidu.ui.get;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.event.getTarget;
///import baidu.dom.getAncestorBy;

///import baidu.lang.isArray;
///import baidu.array.each;



//位置偏移
baidu.ui.tooltip.Tooltip.prototype.offset = [0,0];

/**
 * 创建一个鼠标点击触发的tooltip
 * @param {Array} elements
 * @param {Object} options
 * @see baidu.ui.tooltip.Tooltip
 * @return baidu.ui.tooltip.Tooltip
 */
baidu.ui.tooltip.click = function(elements,options){
	var tooltips = baidu.ui.tooltip.create(elements,options),
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
