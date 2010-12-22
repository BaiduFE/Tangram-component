/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/tooltip/create.js
 * author: rocy
 * version: 1.0.0
 * date: 2010-06-01
 */


///import baidu.ui.tooltip;
///import baidu.ui.tooltip.Tooltip;
///import baidu.array.each;
///import baidu.lang.toArray;
///import baidu.dom.g;
///import baidu.dom.getPosition;
/**
 * 获取Tooltip实例
 * @param {String|HTMLElment|Array} elements
 * @param {Object} options
 * @return baidu.ui.tooltip.Tooltip
 * @see baidu.ui.tooltip.Tooltip
 */
baidu.ui.tooltip.create = function(elements,options){
	if(!elements)
        return null;
	var ret = [],me, targetPosition,
        elementArr = baidu.lang.toArray(elements);
	options = options || {};
	
	baidu.array.each(elementArr, function(element){
		me = new baidu.ui.tooltip.Tooltip(options);
        me.render(baidu.g(element));
		me.addEventListener("open", function(){this.contentElement && (this.contentElement.style.display = "");});
		ret.push(me);
	});
	// 返回值和参数照应, 传入数组或HTMLCollection则返回数组,否则返回单个实例
    return elements.splice || elements.item ? ret : ret[0];
};
