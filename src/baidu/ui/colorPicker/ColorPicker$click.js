/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/colorPicker/ColorPicker$click.js
 * author: walter
 * version: 1.0.0
 * date: 2010-12-20
 */

///import baidu.ui.colorPicker;
///import baidu.ui.get;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.event.getTarget;
///import baidu.dom.getAncestorBy;
///import baidu.object.extend;
///import baidu.fn.bind;

/**
 * 创建一个鼠标点击触发的colorPicker
 */
baidu.object.extend(baidu.ui.colorPicker.ColorPicker.prototype, {
    /**
     * 插件触发方式，默认为点击
     * @param {String} [options.type = 'click']
     */
    type: 'click',
    
    /**
     * body点击事件，点击body关闭菜单
     * @param {Object} e 事件
     */
    bodyClick: function(e){
        var me = this;
            target = baidu.event.getTarget(e || window.event),
            judge = function(el){
                return el == me.getTarget();
            };

        //判断如果点击的是菜单或者target则返回，否则直接关闭菜单
        if (!target || judge(target) || baidu.dom.getAncestorBy(target, judge) || baidu.ui.get(target) == me) 
            return;
        me.close();
    }
});

baidu.ui.colorPicker.ColorPicker.register(function(me){
    if (me.type != 'click') 
        return;
		
    me.targetOpenHandler = baidu.fn.bind("open", me);
    me.bodyClickHandler = baidu.fn.bind("bodyClick", me);

    me.addEventListener('onload', function(){
        var target = me.getTarget();
        if (target) {
            baidu.on(target, 'click', me.targetOpenHandler);
            baidu.on(document, 'click', me.bodyClickHandler);
        }
    });

    me.addEventListener("ondispose", function(){
        var target = me.getTarget();
        if (target) {
            baidu.un(target, 'click', me.targetOpenHandler);
            baidu.un(document, 'click', me.bodyClickHandler);
        }
    });
});
