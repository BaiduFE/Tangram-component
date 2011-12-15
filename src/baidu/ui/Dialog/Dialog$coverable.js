/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Dialog;
///import baidu.ui.behavior.coverable;
///import baidu.lang.Class.addEventListeners;
/**
 * 支持遮盖页面的任意元素
 * @name baidu.ui.Dialog.Dialog$coverable
 * @addon baidu.ui.Dialog
 */

baidu.extend(baidu.ui.Dialog.prototype,{
    coverable: true,
    coverableOptions: {}
});

baidu.ui.Dialog.register(function(me){

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
