///import baidu.ui.Tooltip;
///import baidu.fx.fadeIn;
///import baidu.fx.fadeOut;

///import baidu.dom.g;

baidu.ui.Tooltip.extend({
	//是否使用效果,默认开启
	enableFx : true,
	//显示效果,默认是fadeIn
	showFx : baidu.fx.fadeIn,
	showFxOptions : {duration:500},
	//消失效果,默认是fadeOut
	hideFx : baidu.fx.fadeOut,
	hideFxOptions : {duration:500}
});

/**
 * 为Tooltip添加效果支持
 */
baidu.ui.Tooltip.register(function(me){
	if(me.enableFx){
		me.addEventListener('onopen', function(){
	        'function' == typeof me.showFx && me.showFx(me.getMain(),me.showFxOptions)
	    });
		me.addEventListener('beforeclose',function(e){
	        me.hideFx(me.getMain(), me.hideFxOptions)
	          .addEventListener('onafterfinish',function(){
	              me._close();
	          });
	        e.returnValue = false;
		});
	}
});
