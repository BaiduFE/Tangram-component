/**
 * Tangram UI
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * path: ui/behavior/statable/setStateHandler.js
 * author: berg
 * version: 1.0.0
 * date: 2010/12/14
 */

///import baidu.ui.behavior.statable;
///import baidu.object.extend;

/**
 * 为statable行为添加DOM节点添加事件支持
 */

baidu.extend(baidu.ui.behavior.statable, {

    /**
     * dom的事件触发侦听器
     * @param {String} eventType 事件类型
     * @param {Object} group 状态类型，同一类型的相同状态会被加上相同的css
     * @param {Object} key 索引，在同一类中的索引
     * @param {Event} evnt 事件触发时的Event对象
     */
    _statableMouseHandler : function(eventType, group, key, evnt){
        this._fireEvent(eventType, group, key, evnt);
    },
    
    /**
     * 使用dom的形式为该节点增加事件
     * @param {html-element} element 事件源
     * @param {Object} group 状态类型，同一类型的相同状态会被加上相同的css
     * @param {Object} key 索引，在同一类中的索引
     * @memberOf {TypeName}
     * @return {Object} 格式：{evntName0 : handler0, evntName1 : handler1}
     */
    setStateHandler : function(element, group, key){
        var me = this, handler = {};
        if(typeof key == 'undefined'){group = key = "";}
        baidu.array.each(me._allEventsName, function(item){
            handler[item] = baidu.fn.bind("_statableMouseHandler", me, item, group, key);
            baidu.event.on(element, item, handler[item]);
        });
        me.addEventListener("dispose", function(){
            baidu.object.each(handler, function(item, key){
                baidu.event.un(element, key, item);
            });
        });
    }
});