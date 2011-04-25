/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Tooltip;
///import baidu.ui.get;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.event.getTarget;
///import baidu.dom.getAncestorBy;

///import baidu.lang.isArray;
///import baidu.array.each;

///import baidu.event.stop;

baidu.ui.Tooltip.extend({
    hideDelay: 500
});

baidu.ui.Tooltip.register(function(me) {
    
    if (me.type == 'hover') {

        var hideHandle = null;

        //onload时绑定显示方法
        me.addEventListener("onload",function(){
            baidu.each(me.target,function(target){
                baidu.on(target, 'mouseover', showFn);
            });
        });

        //dispose时接触事件绑定
        me.addEventListener("ondispose",function(){
            baidu.each(me.target,function(target){
                baidu.un(target, 'mouseover', showFn);
                baidu.un(target, 'mouseout', hideFn);
            });
        });

        //tooltip打开时，绑定和解除方法
        me.addEventListener('onopen', function(){
            baidu.on(me.currentTarget, 'mouseout', hideFn);
        });

        //tooltip隐藏时，绑定和解除方法
        me.addEventListener('onclose', function(){
            baidu.on(me.currentTarget, 'mouseover', showFn);
            baidu.un(me.currentTarget, 'mouseout', hideFn);
        });

        //显示tooltip
        function showFn(e){
            hideHandle && clearTimeout(hideHandle);
            me.open(this);

            //停止默认事件及事件传播
            baidu.event.stop(e || window.event);
        }

        //隐藏tooltip
        function hideFn(e){
            hideHandle = setTimeout(function(){
                me.close();
            },me.hideDelay);

            //停止默认事件及事件传播
            baidu.event.stop(e || window.event); 
        }
    }
});
