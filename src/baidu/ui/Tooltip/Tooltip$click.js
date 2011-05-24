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
///import baidu.array.contains;

///import baidu.event.stop;

baidu.ui.Tooltip.register(function(me) {
    
    if (me.type == 'click') {

        //onload时绑定显示方法
        me.addEventListener("onload",function(){
            baidu.each(me.target,function(target){
                baidu.on(target, 'click', showFn); 
            });
        });

        //dispose时接触事件绑定
        me.addEventListener("ondispose",function(){
            baidu.each(me.target,function(target){
                baidu.un(target, 'click', showFn); 
            });

            baidu.un(document, 'click', hideFn);
        });

        //tooltip打开时，绑定和解除方法
        me.addEventListener('onopen', function(){
            baidu.un(me.currentTarget, 'click', showFn);
            baidu.on(me.currentTarget, 'click', hideFn);
            baidu.on(document, 'click', hideFn);
        });

        //tooltip隐藏时，绑定和解除方法
        me.addEventListener('onclose', function(){
            
            baidu.on(me.currentTarget, 'click', showFn);
            baidu.un(me.currentTarget, 'click', hideFn);
            baidu.un(document, 'click', hideFn);

        });

        //显示tooltip
        function showFn(e){
            me.open(this);
            
            //停止默认事件及事件传播
            baidu.event.stop(e || window.event);
        }

        //隐藏tooltip
        function hideFn(e){
            var target = baidu.event.getTarget(e || window.event),
                judge = function(el){
                    return me.getBody() == el;
                };
            if(judge(target) || baidu.dom.getAncestorBy(target, judge) || baidu.ui.get(target) == me){
                return;
            }

            me.close();
            //停止默认事件及事件传播
            baidu.event.stop(e || window.event);
        }
    }
});
