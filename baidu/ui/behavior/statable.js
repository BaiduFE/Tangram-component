/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/behavior/statable.js
 * author: berg, lingyu
 * version: 1.0.0
 * date: 2010/09/04
 */
///import baidu.ui.behavior;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.hasClass;
///import baidu.event.getTarget;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.array.each;
///import baidu.object.each;
///import baidu.fn.bind;

/**
 * 为ui控件添加状态管理行为
 */
(function(){
    var Statable = baidu.ui.behavior.statable = function(){
        //行为初始化
    };
    //保存实例中所有的状态，格式：group+elementId : {stateA : 1, stateB : 1}
    Statable._states = {};
    //所有可用的状态，调用者通过addState添加
    Statable._allStates = ['hover', 'press', 'disabled'];
    Statable._allEventsName = ["mouseover", "mouseout", "mousedown", 'mouseup'];
    Statable._eventsHandler = {
        'mouseover' : function(id, group){
            var me = this;
            if(!me.getState(id, group)['disabled']){
                me.setState("hover", id, group);
                return true;
            }
        },
        'mouseout' : function(id, group){
            var me = this;
            if(!me.getState(id, group)['disabled']){
                me.removeState("hover", id, group);
                me.removeState("press", id, group);
                return true;
            }
        },
        'mousedown' : function(id, group){
            var me = this;
            if(!me.getState(id, group)['disabled']){
                me.setState("press", id, group);
                return true;
            }
        },
        'mouseup' : function(id, group){
            var me = this;
            if(!me.getState(id, group)['disabled']){
                me.removeState("press", id, group);
                return true;
            }
        }
    };

    /**
     * 获得状态管理方法的字符串，用于插入元素的HTML字符串的属性部分
     *
     * @param {string} group optional    状态分组，同一组的相同状态会被加上相同的css
     * @param {string} key optional 索引，在同一类中的索引
     *
     * @return {string} 元素属性字符串
     */
    Statable._getStateHandlerString = function(group, key){
        var me = this,
            i = 0,
            len = me._allEventsName.length,
            ret = [],
            eventType;
        if(typeof group == 'undefined'){
            group = key = "";
        }
        for( ; i<len ; i++){
            eventType = me._allEventsName[i];
            ret[i] = "on" + eventType + "=\"" + me.getCallRef() + "._fireEvent('" + eventType + "', '" +  group + "', '"+ key + "', event)\""
        }
        
        return ret.join(" ");
    };
    
    /**
     * 触发指定类型的事件
     * @param {string} eventType  事件类型
     * @param {string} group optional    状态分组，同一组的相同状态会被加上相同的css
     * @param {string} key 索引，在同一类中的索引
     * @param {DOMEvent} e DOM原始事件
     */
    Statable._fireEvent = function(eventType, group, key, e){
        var me = this,
        	id = me.getId(group + key);
        if(me._eventsHandler[eventType].call(me, id, group)){
            me.dispatchEvent(eventType, {
                element : id,
                group : group,
                key : key,
                DOMEvent : e
            });
        }
    };

    /**
     * 让一个元素处于disable状态
     */
    Statable.disable = function(element, group){
        var me = this;
        element = element || me.getMain();
        if(!me.getState(element.id, group)['disabled']){
            me.removeState("press", element.id, group);
            me.removeState("hover", element.id, group);
            me.setState("disabled", element.id, group);
            me.dispatchEvent("ondisable");
        }
    };

    /**
     * 让一个元素处于enable状态
     */
    Statable.enable = function(element, group){
        var me = this;
        element = element || me.getMain();
        if(me.getState(element.id, group)['disabled']){
            me.removeState("disabled", element.id, group);
            me.dispatchEvent("onenable");
        }
    };

    /**
     * 添加一个可用的状态
     * @param {string} state 要添加的状态
     * @param {string} eventNam optional DOM事件名称 
     * @param {string} eventHandler optional DOM事件处理函数
     */
    Statable.addState = function(state, eventName, eventHandler){
        var me = this;
        me._allStates.push(state);
        if(eventName){
            me._allEventsName.push(eventName);
            if(!eventHandler){
                eventHandler = function(){return true;};
            }
            me._eventsHandler[eventName] = eventHandler;
        }
    };

    /**
     * 获得指定索引的元素的状态
     * @param {string} elementId 元素id，默认是main元素id
     * @param {string} group optional    状态分组，同一组的相同状态会被加上相同的css
     */
    Statable.getState = function(elementId, group){
        group = group ? group + '-' : "";
        elementId  = elementId ? elementId : this.getId();
        var _states = this._states[group + elementId];
        return _states ? _states : {};
    };

    /**
     * 设置指定索的元素的状态
     * @param {string} state 枚举量 in ui._allStates
     * @param {string} elementId optional 元素id，默认是main元素id
     * @param {string} group optional    状态分组，同一组的相同状态会被加上相同的css
     */
    Statable.setState = function(state, elementId, group){
        group = group ? group + '-' : "";
        elementId  = elementId ? elementId : this.getId();
        var me = this,
            stateId = group + elementId,
            currentState;
        me._states[stateId] = me._states[stateId] || {};
        currentState = me._states[stateId][state];
        if(!currentState){
            me._states[stateId][state] = 1;
            baidu.addClass(elementId, me.getClass(group + state));
        }
    };

    /**
     * 移除指定索引的元素的状态
     * @param {string} state 枚举量 in ui._allStates
     * @param {string} element optional 元素id，默认是main元素id
     * @param {string} group optional    状态分组，同一组的相同状态会被加上相同的css
     */
    Statable.removeState = function(state, elementId, group){
        group = group ? group + '-' : "";
        elementId  = elementId ? elementId : this.getId();
        var me = this, stateId = group + elementId;
        if(me._states[stateId]){
            me._states[stateId][state] = 0;
            baidu.removeClass(elementId, me.getClass(group + state));
        }
    };
})();
