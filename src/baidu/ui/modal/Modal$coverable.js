/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.modal;
///import baidu.ui.modal.Modal;
///import baidu.ui.behavior.coverable;

///import baidu.browser.isWebkit;
///import baidu.browser.isGecko;

///import baidu.lang.Class.addEventListeners;

baidu.extend(baidu.ui.modal.Modal.prototype,{
    coverable: true,
    coverableOptions: {}
});

baidu.ui.modal.Modal.register(function(me){

    if(me.coverable){

        if(!baidu.browser.isWebkit && !baidu.browser.isGecko){
            me.addEventListener("onload", function(){
                me.Coverable_show();
            });

            me.addEventListeners("onupdate,onshow",function(){
                me.Coverable_update();
            });
        }
    }
});
