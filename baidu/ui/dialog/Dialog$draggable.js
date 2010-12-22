/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/dialog/Dialog$draggable.js
 * author: berg
 * version: 1.0.0
 * date: 2010-05-18
 */


///import baidu.ui.dialog.Dialog;
/**
 * 为Dialog添加可拖拽行为
 *
 */
///import baidu.dom.draggable;
///import baidu.page.getWidth;
///import baidu.page.getHeight;
///import baidu.event.on;
///import baidu.event.un;

///import baidu.ui.behavior.draggable;

baidu.ui.dialog.Dialog.prototype.draggable = true;

baidu.ui.dialog.Dialog.register(function(me){
    /**
     * @private
     * 更新拖拽的范围，通过调用draggable行为中提供的dragUpdate实现
     */
    function updateDragRange(){
        me.dragRange = [0,baidu.page.getWidth(),baidu.page.getHeight(),0];
        me.dragUpdate();
    };
    me.addEventListener("onload", function(){
        me.dragHandler = me.dragHandler || me.getTitle();
        if(!me.dragRange){ //默认的拖拽范围是在窗口内
            updateDragRange();
            baidu.on(window, "resize", updateDragRange);  //如果用户窗口改变，拖拽的范围也要跟着变
        }else{
            me.dragUpdate();
        }
    });

    me.addEventListener("ondragend", function(){
        me.left = baidu.dom.getStyle(me.getMain(), "left");
        me.top = baidu.dom.getStyle(me.getMain(), "top");
    });

    me.addEventListener("ondispose", function(){
        baidu.un(window, "resize", updateDragRange);
    });
});
