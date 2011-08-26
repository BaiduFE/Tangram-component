/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/behavior/droppable.js
 * author: rocy
 * version: 1.0.0
 * date: 2010/09/16
 */
///import baidu.ui.behavior;
///import baidu.dom.droppable;

/**
 *
 * 为ui控件添加容纳拖拽控件的行为
 * ui控件初始化参数增加如下:
 * {
 * 	droppable  : 是否有drop行为
 *  dropHandler: 用于drop的DOM元素,
 *  dropOptions: 与baidu.dom.droppable的参数一致,
 *  
 * }
 */
(function(){
	var Droppable = baidu.ui.behavior.droppable = function(){
		var me = this;
		//默认仅发送事件
		me.dropOptions = baidu.extend({
            ondropover : function(event){
                me.dispatchEvent("ondropover",event);
            },
            ondropout : function(event){
                me.dispatchEvent("ondropout", event);
            },
            ondrop : function(event){
                me.dispatchEvent("ondrop", event);
            }
        },me.dropOptions);
        
		me.addEventListener("onload",function(){
			me.dropHandler = me.dropHandler || me.getBody();
			me.dropUpdate(me);
		});
	};
	
	Droppable.dropUpdate = function(options){
		var me = this;
		options && baidu.extend(me, options);
		//使已有drop失效,必须在droppable判定之前,使droppable支持动态修改
		me._theDroppable && me._theDroppable.cancel();
		if(!(me.droppable)){
			return;
		}
		me._theDroppable = baidu.dom.droppable(me.dropHandler, me.dropOptions);
	};
})();
