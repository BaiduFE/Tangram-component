/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Popup;
///import baidu.ui.behavior.coverable;
///import baidu.lang.Class.addEventListeners;
/**
 * 支持背景遮罩掩盖select、flash、iframe元素
 * @name baidu.ui.Popup.Popup$coverable
 * @addon baidu.ui.Popup
 */
baidu.extend(baidu.ui.Popup.prototype,{
    coverable: true,
    coverableOptions: {}
});

baidu.ui.Popup.register(function(me){

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
