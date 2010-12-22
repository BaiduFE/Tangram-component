/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/behavior/switchable.js
 * author: berg,rocy
 * version: 1.0.0
 * date: 2010/09/16
 */


///import baidu.ui.behavior;

///import baidu.event.on;
///import baidu.event.un;
///import baidu.event.getTarget;

///import baidu.array.each;

/**
 *
 * 为ui控件添加可切换行为
 *
 * @param {object} ui ui控件实例
 * @param {object} options 选项:
 * {
 * 	triggers: 触发元素集合
 *  reciever: 受体元素集合
 *  triggerEvent: 触发事件,如 click, mouseover
 *  currentIndex: 当前索引,默认为0
 * }
 */


(function(){
	var Switchable = baidu.ui.behavior.switchable = function(options){
		options = options || {};
		var me = this;
		me._triggers = options.triggers || [];
		me._recievers = options.recievers || [];
		me._triggerEvent = options.triggerEvent || '';
		me.currentIndex = options.currentIndex || 0;
		me.rebindTriggers();
		me.addEventListener("ondispose", function(){me.unbindTriggers();});
	};
	
	/**
	 * 切换到指定索引
	 * @param index 索引
	 */
	Switchable.switchTo = function(index){
		var me = this;
		if(me.dispatchEvent("onbeforeswitch",me._getEventArgs(me.currentIndex, index))){
			me.dispatchEvent("onswitch", me._getEventArgs(me.currentIndex,me.currentIndex = index));
		}
	};
	
	/**
	 * 切换到触发器
	 * @param trigger {HTMLElement} 目标元素
	 */
	Switchable.switchToTrigger = function(trigger){
		var me = this,
			index = 0, 
			triggers = me._triggers,
			len = triggers.length;
		for(; index < len; ++index){
			if(trigger === me._triggers[index]){
				break;
			}
		}
		if(index < len) me.switchTo(index);
	};
	
	/**
	 * 切换到下一个元素
	 */
	Switchable.next = function(){
		var me = this;
		me.switchTo( (me.currentIndex + 1) % me._triggers.length);
	};
	
	/**
	 * 切换到上一个元素
	 */
	Switchable.prev = function(){
		var me = this,
			length = me._triggers.length;
		me.switchTo( (me.currentIndex - 1 + length) % length);
	};
	
	/**
	 * 获取当前的节点信息,包含索引,触发器,接收器
	 * @return {index: 索引, trigger: 触发器, reciever: 接收器}
	 */
	Switchable.getCurrent = function(){
		var me = this,
			index = me.currentIndex;
		return {
			index : index,
			trigger : me._triggers[index],
			reciever : me._recievers[index]
		}
	};
	
	/**
	 * 获取事件的参数
	 * @param fromIndex 原索引
	 * @param toIndex 目标索引
	 * @return Object 
	 * {
	 *  fromIndex: 原索引, 
	 * 	fromTrigger: 对应原索引的触发元素,
	 *  fromReciever: 对应原索引的受体元素,
	 *  toIndex: 目标索引,
	 *  toTrigger: 对应原索引的触发元素,
	 *  toReciever: 对应目标索引的受体元素
	 * }
	 */
	Switchable._getEventArgs = function(fromIndex, toIndex){
		var me = this;
		return {
			fromIndex : fromIndex,
			fromTrigger : me._triggers[fromIndex],
			fromReciever : me._recievers[fromIndex],
			toIndex : toIndex,
			toTrigger : me._triggers[toIndex],
			toReciever : me._recievers[toIndex]
		}
	};
	//绑定事件
	Switchable.rebindTriggers = function(){
		var me = this;
		me._triggerHandler = me._triggerHandler || function(event){
			me.switchToTrigger(baidu.event.getTarget(window.event || event));
		};
		me.unbindTriggers(me);
		baidu.each(me._triggers, function( trigger){
			baidu.on(trigger, me._triggerEvent, me._triggerHandler);
		});
	};
	//解绑事件
	Switchable.unbindTriggers = function(){
		var me = this;
		baidu.each(me._triggers, function( trigger){
			baidu.un(trigger, me._triggerEvent, me._triggerHandler);
		});
	};
})();