/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */


///import baidu.ui.Dialog;
///import baidu.dom.insertHTML;

///import baidu.ui.Button;
///import baidu.event.stopPropagation;

/**
  * 支持关闭按钮插件
 * @name baidu.ui.Dialog.Dialog$closeButton
 * @addon baidu.ui.Dialog
 */

baidu.extend(baidu.ui.Dialog.prototype,{
    closeText  : "",
    closeButton : true
});
baidu.ui.Dialog.register(function(me){
    
    me.closeButton && me.addEventListener("onload", function(){
        var buttonInstance = new baidu.ui.Button({
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
