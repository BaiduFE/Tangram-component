/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/behavior/draggable.js
 * author: berg
 * version: 1.0.0
 * date: 2010/09/16
 */


///import baidu.ui.behavior;

///import baidu.dom.drag;
///import baidu.dom.getStyle;


/**
 * 为ui控件添加拖拽行为
 */
(function(){
    var Draggable = baidu.ui.behavior.draggable = function(){
        this.addEventListener("onload", function(){
            var me = this;
            me.dragUpdate();
        });
        this.addEventListener("ondispose", function(){
            var me  = this;
            baidu.un(me._dragOption.handler, "mousedown", me._dragFn);
            me._dragOption.handler = me.dragHandler = me._lastDragHandler = null;
        });
    };
    /**
     * 更新拖拽行为
     * @param {object} options 拖拽行为的选项，支持:
     * dragRange : 拖拽的范围
     * dragHandler : 拖拽手柄
     */
    Draggable.dragUpdate = function(options){
        var me = this;
        options = options || {};
        if(!me.draggable){
            return ;
        }
        //me.dragHandler != me._lastDragHandler,这个判断会造成当调用两次dragUpdate更新range时上次的事件没有被注销
        if(me._lastDragHandler && me._dragFn){
            baidu.event.un(me._lastDragHandler, "onmousedown", me._dragFn); //把上次的拖拽事件取消掉
        }
        baidu.object.extend(me, options);
        me._dragOption = {
            ondragstart : function(){
                me.dispatchEvent("ondragstart");
            },  
            ondrag : function(){
                me.dispatchEvent("ondrag");
            },
            ondragend : function(){
                me.dispatchEvent("ondragend");
            },
            autoStop : true
        };

        me._dragOption.range = me.dragRange || [];
        me._dragOption.handler = me._lastDragHandler = me.dragHandler || me.getMain();

        if (me._dragOption.handler) {
            baidu.event.on(me._dragOption.handler, "onmousedown", me._dragFn = function() {
                baidu.dom.drag(me.dragTarget || me.getMain(), me._dragOption);
            });
        }
    };
})();
