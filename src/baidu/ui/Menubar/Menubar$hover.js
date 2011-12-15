/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 *
 * path: ui/Menubar/Menubar$hover.js
 * author: walter
 * version: 1.0.0
 * date: 2010-12-09
 */
///import baidu.ui.Menubar;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.dom.g;
///import baidu.object.extend;
///import baidu.fn.bind;

/**
 * 鼠标hover触发menubar插件
 * @name baidu.ui.Menubar.Menubar$hover
 * @addon baidu.ui.Menubar
 */
baidu.ui.Menubar.extend({
   
    /**
     * 插件触发方式，默认为点击
	 * @private
     * @param {String} [options.type = 'hover']
     */
    type: 'hover',

    /**
     * 菜单显示延迟时间
	 * @private
     * @param {Number} [options.showDelay = 100]
     */
    showDelay: 100,
    
    /**
     * 菜单关闭延迟时间
	 * @private
     * @param {Number} [options.hideDelay = 500]
     */
    hideDelay: 500,
    
    /**
     * 鼠标浮动到target上显示菜单
	 * @private
     */
    targetHover: function(){
        var me = this;
        clearTimeout(me.hideHandler);
        me.showHandler = setTimeout(function(){
            me.open();
        }, me.showDelay);
    },
    
    /**
     * 鼠标移出target关闭菜单
	 * @private
     */
    targetMouseOut: function(){
        var me = this;
        clearTimeout(me.showHandler);
        clearTimeout(me.hideHandler);
        me.hideHandler = setTimeout(function(){
            me.close();
        }, me.hideDelay);
    },
	
   /**
     * 清除hideHandler
	 * @private
     */
    clearHideHandler:function(){
        clearTimeout(this.hideHandler);
    }
	
});

baidu.ui.Menubar.register(function(me){
    me.targetHoverHandler = baidu.fn.bind('targetHover', me);
    me.targetMouseOutHandler = baidu.fn.bind('targetMouseOut', me);
    me.clearHandler = baidu.fn.bind('clearHideHandler', me)

    if (me.type == 'hover') {
        me.addEventListener('onload', function(){
            var target = me.getTarget();
            if (target) {
                baidu.on(target, 'mouseover', me.targetHoverHandler);
                baidu.on(document, 'click', me.targetMouseOutHandler);
            }
        });
        
        me.addEventListener('onopen', function(){
            var target = me.getTarget(), 
                body = me.getBody();
            if (target) {
                baidu.on(body, 'mouseover', me.clearHandler);
                baidu.on(target, 'mouseout', me.targetMouseOutHandler);
                baidu.on(body, 'mouseout', me.targetMouseOutHandler);
            }
        });
        
        me.addEventListener('ondispose', function(){
            var target = me.getTarget(), 
                body = me.getBody();
            if (target) {
                baidu.un(target, 'mouseover', me.targetHoverHandler);
                baidu.un(target, 'mouseout', me.targetMouseOutHandler);
				baidu.un(document, 'click', me.targetMouseOutHandler);
            }
            if (body) {
                baidu.un(body, 'mouseover', me.clearHandler);
                baidu.un(body, 'mouseout', me.targetMouseOutHandler);
            }
        });
    }
});
