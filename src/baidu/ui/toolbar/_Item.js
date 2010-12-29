/**
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/toolBar/_Item.js
 * @author lixiaopeng
 * @version 1.0.0
 * date: 2010/11/28
 * */

///import baidu.ui.createUI;
///import baidu.ui.toolbar;

/**
 * 全局唯一的toolbar_item id 索引
 * 此对象不对外暴露
 * @protected
 * */
baidu.ui.toolbar._itemIndex = 0;

/**
 * toolbar._Item基类,原则上此基类不向外暴露
 * @constructor
 * @param {Object}              options config参数
 * @param {String|HTMLElement}  [options.container=document.body]   实例容器
 * @returns void
 * */
baidu.ui.toolbar._Item = baidu.ui.createUI(function (options){
    var me = this;
    me._setName(options.name);
}).extend({

    /**
     * 自身状态
     * @private
     * */
    _isEnable:true,

    /**
     * 是否自动render,默认为否
     * @public
     * */
    autoRender:false,

    /**
     * uiType
     * */
    uiType:"toolbar-item",

    /**
     * item容器,默认为document.body
     * @public
     * */
    container : document.body,

    /**
     * item唯一标识符
     * @public
     * */
    name:"",
    
    /**
     * 为ui组创建自己的唯一的标识
     * @private
     * @param {String} [name] 若传入了name，则使用传入的name为标识符
     * */
    _setName:function(name){
        var me = this;
        me.name = (name && typeof(name) === "string") ? name : "tangram_toolbar_item_" + baidu.ui.toolbar._itemIndex++;
    },

    /**
     * @private
     * @param {String} fnName 需要执行的方法名
     * @param {Object[]} arg传入触发函数的参数数组
     * @return void
     * */
    _fire:function(fnName,arg){
        var me = this;
        
        if(me._uiInstance){
           me._uiInstance[fnName] && me._uiInstance[fnName].apply(me._uiInstance,arg);
        }else{
           me["_" + fnName] && me["_" + fnName].apply(me,arg);
        }  
    },

    /**
     * 绘制item
     * @public
     * @return void
     * */
    render:function(){
        var me = this;
        me._fire("render",arguments);
    },

    /**
     * 将自己设置为enable
     * @public
     * @return void
     * */
    enable:function(){
        var me = this;
        me._fire("enable");
        me._isEnable = true;
    },

    /**
     * 将自己设置为disable
     * @public
     * @return void
     * */
    disable:function(){
        var me = this;
        me._fire("disable");
        me._isEnable = false;
    },

    /**
     * 设置高亮状态
     * @public
     * @return void
     * */
    setHighLight:function(){
        var me = this;

        if(me._uiInstance){
            me._uiInstance.setState("highlight");
        }else{
            me._highLight && me._highLight();
        }
        me.dispatchEvent("onhighlight");
    },

    /**
     * 取消高亮状态
     * @public
     * @return void
     * */
    cancelHighLight:function(){
        var me = this;

        if(me._uiInstance){
            me._uiInstance.removeState("highlight");
        }else{
            me._unHighLight && me._unHighLight();
        }
        me.dispatchEvent("oncancelhighlight");
    },

    /**
     * 获取自身状态
     * @public
     * @returns {Boolean}
     * */
    isEnable:function(){
        var me = this;
        return me._isEnable;
    },

    /**
     * 添加事件监听函数,重写baodu.lang.class.addEventListener
     * @public
     * @param {String}   type    自定义事件的名称
     * @param {Function} handler 自定义事件被触发时应该调用的回调函数
     * @param {String}   [key]   绑定到事件上的函数对应的索引key
     * @reurn void
     * */
    addEventListener:function(eventName,eventHandle,key){
        var me = this;
        if(me._uiInstance)
            me._uiInstance.addEventListener(eventName,eventHandle,key);
        else
            baidu.lang.Class.prototype.addEventListener.call(me,eventName,eventHandle,key);
    }
});
