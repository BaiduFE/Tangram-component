/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/menubar/Menubar$fx.js
 * author: walter
 * version: 1.0.0
 * date: 2010-12-09
 */
///import baidu.ui.menubar.Menubar;
///import baidu.fx.expand;
///import baidu.fx.collapse;

///import baidu.dom.g;
/**
 * 为Menubar添加效果支持
 */
baidu.object.extend(baidu.ui.menubar.Menubar.prototype,{
	showFx : baidu.fx.expand,
	showFxOptions : {duration:200},
	hideFx : baidu.fx.collapse,
	hideFxOptions : {duration:500,restoreAfterFinish:true}
});


baidu.ui.menubar.Menubar.register(function(me){
    //TODO: 这砣代码比较乱，而且这里的错误捕获不应使用try-cache
	me.addEventListener('onopen', function(){
		!baidu.ui.menubar.showing && 'function' == typeof me.showFx && me.showFx(baidu.g(me.getId()),me.showFxOptions);
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
