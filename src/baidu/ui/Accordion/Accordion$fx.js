/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/Accordion/Accordion$fx.js
 * author: zhangyao, linlingyu
 * version: 1.0.0
 * date: 2010/12/16 
 */

///import baidu.ui.Accordion;
///import baidu.fx.current;
///import baidu.fx.expand;
///import baidu.fx.collapse;
///import baidu.dom.getStyle;
///import baidu.lang.Class.addEventListeners;
/**
 * 手风琴的动画效果
 */
baidu.ui.Accordion.register(function(me) {
//  me._fxElement = null;//用于存放当前正在进行动画的对象
    me.addEventListeners({
        beforeswitchbyhead: function(evt){
            var currHead = me.getCurrentHead(),
                currBody = currHead && me.getBodyByHead(currHead),
                switchBody = me.getBodyByHead(evt.element),
                rsid = currHead && currHead.id,
                opts,
                height;
            if(!baidu.fx.current(me._fxElement) && rsid != evt.element.id){
                me._fxElement = switchBody;
                baidu.fx.expand(switchBody, baidu.object.extend({
                    onafterfinish: function() {
                        me._switch(evt.element);
                        if(currBody){
                            currBody.style.height = switchBody.style.height;
                            currBody.style.overflow = 'auto';
                        }
                    }
                }, currBody ? {
                        onbeforestart: function() {
                            baidu.dom.removeClass(currHead, me.getClass(me.currentClass));
                            baidu.dom.addClass(evt.element, me.getClass(me.currentClass));
                            currBody.style.overflow = 'hidden';
                            currBody.style.height = parseInt(baidu.dom.getStyle(currBody, 'height')) - 1 + 'px';
                        },
                        onbeforeupdate: function() {
                            height = parseInt(baidu.dom.getStyle(switchBody, 'height'));//取得switchBody未改变的高度
                        },
                        onafterupdate: function() {
                            currBody.style.height = parseInt(baidu.dom.getStyle(currBody, 'height'))
                                - parseInt(baidu.dom.getStyle(switchBody, 'height'))
                                + height + 'px';
                        }
                } : {}));
            }
            evt.returnValue = false;
        },
        
        beforecollapse: function(evt){
            evt.returnValue = false;
            var currHead = me.getCurrentHead(),
                body = currHead && me.getBodyByHead(currHead);
            if(baidu.fx.current(me._fxElement) || !body){return}
            baidu.fx.collapse(body, {
                onafterfinish: function(){
                    me.setCurrentHead(null);
                }
            });
            
        }
    });
});