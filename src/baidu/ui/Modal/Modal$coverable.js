/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Modal;
///import baidu.ui.behavior.coverable;

///import baidu.browser.isWebkit;
///import baidu.browser.isGecko;
///import baidu.lang.Class.addEventListeners;

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
