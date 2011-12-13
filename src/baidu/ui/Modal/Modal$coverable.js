/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Modal;
///import baidu.ui.behavior.coverable;

///import baidu.browser.isWebkit;
///import baidu.browser.isGecko;
///import baidu.lang.Class.addEventListeners;
/**
 * 支持背景遮罩掩盖select、flash、iframe元素
 * @name baidu.ui.Modal.Modal$coverable
 * @addon baidu.ui.Modal
 */
baidu.extend(baidu.ui.Modal.prototype,{
    coverable: true,
    coverableOptions: {}
});

baidu.ui.Modal.register(function(me){

    if(me.coverable){

        if(!baidu.browser.isWebkit && !baidu.browser.isGecko){
            me.addEventListener("onload", function(){
                me.Coverable_show();
            });

            me.addEventListeners("onshow,onupdate",function(){
                me.Coverable_update();
            });

            me.addEventListener("onhide", function(){
                me.Coverable_hide();
            })
        }
    }
});
