/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/accordion/Accordion$fx.js
 * author: linlingyu
 * version: 1.0.0
 * date: 2010/12/16
 */

///import baidu.ui.accordion.Accordion;
///import baidu.fx.TimeLine;
///import baidu.fx.create;
///import baidu.fx.current;
///import baidu.fx.expand;
///import baidu.dom.getStyle;

/**
 * 手风琴的动画效果
 */
baidu.ui.accordion.Accordion.register(function(me) {
//  me._fxElement = null;//用于存放当前正在进行动画的对象
    me.addEventListener('beforeswitchbyhead', function(evt) {
        var currHead = me.getCurrentHead(),
            currBody = me.getBodyByHead(currHead),
            switchBody = me.getBodyByHead(evt.element),
            height;
        if (currHead.id != evt.element.id && !baidu.fx.current(me._fxElement)) {
            me._fxElement = switchBody;
            baidu.fx.expand(switchBody, {
                onbeforestart: function() {
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
                },
                onafterfinish: function() {
                    me._switch(evt.element);
                    currBody.style.height = switchBody.style.height;
                    currBody.style.overflow = 'auto';
                }
            });
        }
        evt.returnValue = false;
    });
});
