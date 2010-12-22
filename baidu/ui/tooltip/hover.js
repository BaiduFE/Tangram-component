/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/tooltip/hover.js
 * author: rocy
 * version: 1.0.0
 * date: 2010-06-01
 */

///import baidu.ui.tooltip;
///import baidu.ui.tooltip.create;
///import baidu.event.on;
///import baidu.event.get;
///import baidu.object.clone;
///import baidu.object.extend;

baidu.extend(baidu.ui.tooltip.Tooltip.prototype, {
	showDelay : 100,
	hideDelay : 500,
	offset : [0,0]
});
/**
 * 创建一个鼠标hover触发的tooltip
 * @param {Array} elements
 * @param {Object} options
 * @return baidu.ui.tooltip.Tooltip
 * @see baidu.ui.tooltip.Tooltip
 */
baidu.ui.tooltip.hover = function(elements,options){
	var tooltips = baidu.ui.tooltip.create(elements,options),
        tooltipArr = baidu.lang.isArray(tooltips)? tooltips : [tooltips];
    baidu.array.each(tooltipArr, function(tooltip){
        
		baidu.on(tooltip.getTarget(), 'mouseover',function(e){
			clearTimeout(tooltip.hideHandler);
			tooltip.showHandler = setTimeout(function(){
				tooltip.open();
			},tooltip.showDelay);
		});
		tooltip.addEventListener('onopen', function(){
			baidu.on(tooltip.getBody(), 'mouseover', function(){
	            clearTimeout(tooltip.hideHandler);
	        });
		});
		
		function closeMe(){
			clearTimeout(tooltip.showHandler);
			clearTimeout(tooltip.hideHandler);
			tooltip.hideHandler = setTimeout(function(){
                tooltip.close();
			},tooltip.hideDelay);
		}
		
		baidu.on(tooltip.getTarget(), 'mouseout', closeMe);
		tooltip.addEventListener('onopen', function(){
			baidu.on(tooltip.getBody(),'mouseout', closeMe);
		});
    });

	return tooltips;
};
