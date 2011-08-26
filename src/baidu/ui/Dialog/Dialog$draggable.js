/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */


///import baidu.ui.Dialog;
///import baidu.dom.draggable;
///import baidu.page.getWidth;
///import baidu.page.getHeight;

///import baidu.ui.behavior.draggable;

/**
 * 为Dialog添加拖拽功能
 * @param {Boolean} draggable 是否启用draggable
 * */
baidu.ui.Dialog.prototype.draggable = true;

baidu.ui.Dialog.register(function(me){
    if(me.draggable){
        /**
         * 更新拖拽的范围，通过调用draggable行为中提供的dragUpdate实现
         * @private
         * @return void
         */
        function updateDragRange(){
            me.dragRange = [0,baidu.page.getWidth(),baidu.page.getHeight(),0];
            me.dragUpdate();
        };

        me.addEventListener("onload", function(){
            me.dragHandler = me.dragHandler || me.getTitle();

            //默认的拖拽范围是在窗口内
            if(!me.dragRange){
                updateDragRange();

                //如果用户窗口改变，拖拽的范围也要跟着变
                me.on(window, "resize", updateDragRange);
            }else{
                me.dragUpdate();
            }
        });

        me.addEventListener("ondragend", function(){
            me.left = baidu.dom.getStyle(me.getMain(), "left");
            me.top = baidu.dom.getStyle(me.getMain(), "top");
        });
    }
});
