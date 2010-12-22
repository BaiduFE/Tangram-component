/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:ui/carousel/Carousel.js
 * @author:linlingyu
 * @version:1.0.0
 * @date:2010-09-09
 */
///import baidu.fx.current;
///import baidu.fx.scrollTo;
///import baidu.ui.carousel.Carousel;
/**
 * 为跑马灯添加动画效果
 */
baidu.ui.carousel.Carousel.register(function(me){
	/**
	 * 一个动画插件，用来实现滚动图片项
	 */
	me.addEventListener("onbeforescroll", function(evt){
		if(!baidu.fx.current(me.getBody())){
			var val = 0, item = me.getItem(evt.index),
				pos = "vertical" == me.orientation;
			if(item){
				val = me[me.axis[me.orientation].offsetSize] * (evt.index - evt.scrollOffset);
				baidu.fx.scrollTo(me.getBody(), {x : (pos ? 0 : val), y : (pos ? val : 0)}, {
					onbeforestart : function(){
						me.dispatchEvent("onbeforestartscroll", {
							index : evt.index,
							scrollOffset : evt.scrollOffset
						})
					},
					onafterfinish : function(){
						me.dispatchEvent("onafterscroll", {
							index : evt.index,
							scrollOffset : evt.scrollOffset
						})
					}
				});
			}
		}
		evt.returnValue = false;
	});
});