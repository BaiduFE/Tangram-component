/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.popup;
///import baidu.ui.popup.Popup;
///import baidu.ui.behavior.coverable;
///import baidu.lang.Class.addEventListeners;

baidu.extend(baidu.ui.popup.Popup.prototype,{
    coverable: true,
    coverableOptions: {}
});

baidu.ui.popup.Popup.register(function(me){

    if(me.coverable){

        me.addEventListeners("onopen,onload", function(){
            me.Coverable_show();
        });

        me.addEventListener("onclose", function(){
            me.Coverable_hide();
        });

        me.addEventListener("onupdate",function(){
            me.Coverable_update();
        });
    }
});
