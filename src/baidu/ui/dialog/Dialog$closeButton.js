/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/dialog/Dialog$closeButton.js
 * author: berg,lixiaopeng
 * version: 1.0.0
 * date: 2010-05-18
 */


///import baidu.ui.dialog.Dialog;
///import baidu.dom.insertHTML;

///import baidu.ui.button.Button;
///import baidu.event.stopPropagation;

/**
 * addon
 *
 * 关闭按钮
 */

baidu.extend(baidu.ui.dialog.Dialog.prototype,{
    closeText  : "",
    closeButton : true
});
baidu.ui.dialog.Dialog.register(function(me){
    
    me.closeButton && me.addEventListener("onload", function(){
        var buttonInstance = baidu.ui.button.create({
            parent : me,
            classPrefix : me.classPrefix + "-close",
            skin : me.skin ? me.skin + "-close" : "",
            onclick : function(){
                me.close();
            },
            onmousedown : function(e){
               baidu.event.stopPropagation(e.DOMEvent);
            },
            element:me.getTitle(),
            autoRender:true
        });
        me.closeButtonInstance = buttonInstance;

        me.addEventListener("ondispose",function(){
            buttonInstance.dispose();
        });
    });
});
