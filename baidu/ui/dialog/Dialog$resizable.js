/*
  * Tangram
  * Copyright 2009 Baidu Inc. All rights reserved.
  * 
  * path: ui/dialog/Dialog$resizable.js
  * author: lixiaopeng
  * version: 1.0.0
  * date: 2010-05-18
  */


///import baidu.ui.dialog.Dialog;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.dom.resizable;
///import baidu.ui.behavior.resizable;

/**
 * 为Dialog添加缩放功能
 * 可选参数
 * @param {Number} minWidth 最小宽度
 * @param {Number} minHeight 最小高度
 * */
baidu.extend(baidu.ui.dialog.Dialog.prototype,{
    resizable  : true,
    minWidth   : 100,
    minHeight  : 100
});
baidu.ui.dialog.Dialog.register(function(me){
    if(me.resizable){
       var content,mr,body; 
        me.addEventListener("onload",function(){
            content = me.getContent();
            body = me.getBody();
            mr = baidu.getStyle(content,"marginRight");
            me.resizeUpdate({target:content,container:body,classPrefix:me.classPrefix});
        });
    
        me.addEventListener("onresize",function(){
            me.dispatchEvent("onupdate");
        });
    
        me.addEventListener("onresizeend",function(){
            me.width = baidu.getStyle(body,"width");
            me.height = baidu.getStyle(body,"height");

            me.width = baidu.getStyle(content,"width");
            me.height = baidu.getStyle(content,"height");
        });
    }
});

