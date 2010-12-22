/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/accordion/Accordion$fx.js
 * author: zhangyao, linlingyu
 * version: 1.0.0
 * date: 2010/12/16 
 */
/**
 * 手风琴的动画效果
 */
///import baidu.ui.accordion.Accordion;
///import baidu.fx.TimeLine;
///import baidu.fx.create;
///import baidu.fx.current;
///import baidu.fx.collapse;
///import baidu.dom.setStyles;
///import baidu.dom.getStyle;


baidu.ui.accordion.Accordion.register(function(me){
        me.addEventListener("beforeswitch", function(evt){
	        var currHead = me.getCurrentHead(),
	            currBody = me.getBodyByHead(currHead),
	            switchBody = me.getBodyByHead(evt.element),
	            height;
	        if(currHead.id != evt.element.id && !baidu.fx.current(currBody)){
	                //同时做了collapse和expand，这里没有使用baidu.fx.expand是由于expand中运算每次移动的距离和collapse不相等
	                baidu.fx.collapse(currBody, {
	                        onbeforestart : function(){
	                                baidu.dom.setStyles(switchBody, {
	                                        display : "",
	                                        overflow : "hidden",
	                                        height : "0px"
	                                });
	                                currBody.style.overflow = "hidden";
	                        },
	                        onbeforeupdate : function(){
	                                height = parseInt(baidu.dom.getStyle(currBody, "height"));//取得currbody未改变的高度
	                        },
	                        onafterupdate : function(){
	                                switchBody.style.height = parseInt(baidu.dom.getStyle(switchBody, "height"), 10) -
				                                  parseInt(baidu.dom.getStyle(currBody, "height"), 10) +
				                                  height + "px";
	                        },
	                        onafterfinish : function(){
	                                me.switchByHead(evt.element);
	                                switchBody.style.overflow = "auto";
	                        }
	                });
	        }
	        evt.returnValue = false;
        });
});