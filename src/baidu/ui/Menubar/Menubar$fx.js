/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Menubar;
///import baidu.fx.expand;
///import baidu.fx.collapse;

///import baidu.dom.g;
/**
 * 为Menubar增加动画效果
 * @name baidu.ui.Menubar.Menubar$fx
 * @addon baidu.ui.Menubar
 */
baidu.ui.Menubar.extend({
    enableFx:true,
    showFx : baidu.fx.expand,
	showFxOptions : {duration:200},
	hideFx : baidu.fx.collapse,
	hideFxOptions : {duration:500,restoreAfterFinish:true}
});

baidu.ui.Menubar.register(function(me){
    
    if(me.enableFx){
       
        var fxHandle = null;

        me.addEventListener('onopen', function(){
            !baidu.ui.Menubar.showing && 'function' == typeof me.showFx && me.showFx(baidu.g(me.getId()),me.showFxOptions);
        });

        me.addEventListener('onbeforeclose',function(e){
            me.dispatchEvent("onclose");
            
            fxHandle = me.hideFx(baidu.g(me.getId()),me.hideFxOptions);
            fxHandle.addEventListener('onafterfinish',function(){
                me._close();
            });
            
            e.returnValue = false;
        });
        
        me.addEventListener('ondispose', function(){
            fxHandle && fxHandle.end(); 
        });
    }
});
