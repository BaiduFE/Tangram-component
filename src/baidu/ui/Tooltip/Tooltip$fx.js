/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Tooltip;
///import baidu.fx.fadeIn;
///import baidu.fx.fadeOut;

///import baidu.dom.g;

baidu.ui.Tooltip.extend({
	//是否使用效果,默认开启
	enableFx: true,
	//显示效果,默认是fadeIn
	showFx: baidu.fx.fadeIn,
	showFxOptions: {duration: 500},
	//消失效果,默认是fadeOut
	hideFx: baidu.fx.fadeOut,
	hideFxOptions: {duration: 500}
});

/**
 * 为Tooltip添加效果支持
 */
baidu.ui.Tooltip.register(function(me) {
	if (me.enableFx) {
	
        var fxHandle = null;

        me.addEventListener('beforeopen', function(e) {
	        me.dispatchEvent('onopen');
            'function' == typeof me.showFx && me.showFx(me.getMain(), me.showFxOptions);
            e.returnValue = false;
	    });
		
        me.addEventListener('beforeclose', function(e) {
	        me.dispatchEvent('onclose');
            
            fxHandle = me.hideFx(me.getMain(), me.hideFxOptions);
            fxHandle.addEventListener('onafterfinish', function() {
	              me._close();
	        });
	        e.returnValue = false;
		});

        me.addEventListener('ondispose', function(){
            fxHandle && fxHandle.end(); 
        });
	}
});
