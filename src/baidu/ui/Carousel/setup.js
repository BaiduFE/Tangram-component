/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:ui/Carousel/setup.js
 * @author:linlingyu
 * @version:1.0.0
 * @date:2010-09-06
 */

///import baidu.dom.g;
///import baidu.dom.children;
///import baidu.array.each;
///import baidu.ui.Carousel;
 
 /**
 * 依据页面已有元素建立一个跑马灯。
 * @function
 * @param  {Element}element 一个存放数据的容器，例如：<div id="cId"><div>item-1</div><div>item-2</div><div>item-3</div></div>
 * @param  {Object} [options] 生成carousel的参数，具体参考baidu.ui.carousel.Carousel的opt参数
 * @config {String} orientation 排列方式，取值：horizontal（默认），vertical。
 * @config {String} flip 滚动按钮方式，取值：item（一次滚动一个项），page(翻页滚动)。
 * @config {Number} pageSize 一行显示几个item，默认值3。
 * @config {Boolean} isCycle 是否循环滚动，默认值false。
 * @config {Boolean} showButton 是否显示翻转按钮，默认值true。
 * @config {Number} offsetWidth 用户自定义的滚动宽度
 * @config {Number} offsetHeight 用户自定义的滚动高度
 * @config {Function} onload 初始化时的触发事件
 * @config {Function} onbeforescroll 开始滚动时的触发事件
 * @config {Function} onafterscroll 结束滚动时的触发事件
 * @config {Function} onprevitem 当跳到上一个滚动项时触发该事件
 * @config {Function} onnextitem 当跳到下一个滚动项时触发该事件
 * @config {Function} onprevpage 当跳到上一页时触发该事件
 * @config {Function} onnextPage 当跳到下一页时触发该事件
 * @config {Function} onitemclick 点击某个滚动项时的触发事件
 * @config {Function} onmouseover 当鼠标悬停在某个滚动项时的触发事件
 * @config {Function} onmouseout 当鼠标移开某个滚动项时的触发事件
 * @returns {baidu.ui.carousel.Carousel} Carousel实例
 */
baidu.ui.carousel.setup = function(ele, opt){
	var ele = baidu.g(ele),
		opt = opt || {},
		child = baidu.dom.children(ele);
	opt.contentText = [];
	baidu.array.each(child, function(item, i){
		opt.contentText.push({
			content : item.innerHTML
		});
	});
	ele.innerHTML = "";
	var carousel = new baidu.ui.Carousel(opt);
		carousel.render(ele);
	return carousel;
};
