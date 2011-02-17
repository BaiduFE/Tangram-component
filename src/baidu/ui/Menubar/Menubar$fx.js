/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/Menubar/Menubar$fx.js
 * author: walter
 * version: 1.0.0
 * date: 2010-12-09
 */
///import baidu.ui.Menubar;
///import baidu.fx.expand;
///import baidu.fx.collapse;

///import baidu.dom.g;
/**
 * 为Menubar添加效果支持
 */
baidu.ui.Menubar.extend({
	showFx : baidu.fx.expand,
	showFxOptions : {duration:200},
	hideFx : baidu.fx.collapse,
	hideFxOptions : {duration:500,restoreAfterFinish:true}
});


baidu.ui.Menubar.register(function(me){
    //TODO: 这砣代码比较乱，而且这里的错误捕获不应使用try-cache
	me.addEventListener('onopen', function(){
		!baidu.ui.Menubar.showing && 'function' == typeof me.showFx && me.showFx(baidu.g(me.getId()),me.showFxOptions);
	});
	me.addEventListener('onbeforeclose',function(e){
		try{
			me.hideFx(baidu.g(me.getId()),me.hideFxOptions)
				.addEventListener('onafterfinish',function(){me.close(true)});
			e.returnValue = false;
		}catch(error){}
		return false;
	});
});
