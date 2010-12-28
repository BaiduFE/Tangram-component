/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:ui/carousel/setup.js
 * @author:linlingyu
 * @version:1.0.0
 * @date:2010-09-06
 */

///import baidu.dom.g;
///import baidu.dom.children;
///import baidu.array.each;
///import baidu.ui.carousel.Carousel;
/**
 * 依据页面已有元素建立一个跑马灯
 * @param {Object} element 一个存放数据的容器，例如：<div id="cId"><div>item-1</div><div>item-2</div><div>item-3</div></div>
 * @param {Object} options 生成carousel的参数，具体参考baidu.ui.carousel.Carousel的opt参数
 * @return {baidu.ui.carousel.Carousel} 
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
	opt.target = ele;
	var carousel = new baidu.ui.carousel.Carousel(opt);
		carousel.render();
	return carousel;
};
