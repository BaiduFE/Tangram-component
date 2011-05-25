/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Dialog;
///import baidu.ui.Button;
///import baidu.object.each;
///import baidu.ui.Dialog.Dialog$autoDispose;

///import baidu.i18n;
///import baidu.i18n.string;
///import baidu.i18n.cultures.zh-CN;

/**
 * 根据this.buttons创建dialog下部的buttons
 * butions格式
 * {
 *  name,{baidu.ui.button.Button相同的参数}
 * }
 */
baidu.extend(baidu.ui.Dialog.prototype,{
    
    /**
     * 创建底部按钮
     * @param {Object} option 创建按钮的options
     * @param {String} name 按钮的唯一标识符
     * @return void
     */
    createButton:function(option,name){
        var me = this;
        baidu.extend(option,{
            classPrefix : me.classPrefix + "-" + name,
            skin : me.skin ? me.skin + "-" + name : "",
            element : me.getFooter(),
            autoRender : true,
            parent : me
        });
        var buttonInstance = new baidu.ui.Button(option);
        me.buttonInstances[name] = buttonInstance;
    },
   
    /**
     * 删除底部按钮
     * @param {String} name 按钮的唯一标识符
     * @return void
     */
    removeButton:function(name){
        var me = this,
            button = me.buttonInstances[name];
        if(button){
            button.dispose();
            delete(me.buttonInstances[name]);
            delete(me.buttons[name]);
        }
    }
});
baidu.ui.Dialog.register(function(me){
    //存储button实例
    me.buttonInstances = {};
    me.language = me.language || 'zh-CN';
    
    var accept,cancel,tmpButtons = {},
        language = baidu.i18n.cultures[me.language].language;
    
    accept = {
        'content' : language['ok'],
        'onclick' : function() {
            var me = this,
                parent = me.getParent();
            parent.dispatchEvent('onaccept') && parent.close();
        }
    };
    cancel = {
        'content' : language['cancel'],
        'onclick' : function() {
            var me = this,
                parent = me.getParent();
            parent.dispatchEvent('oncancel') && parent.close();
        }
    };

    //在onLoad时创建buttons
    me.addEventListener("onload",function(){
        switch(me.type){
            case "alert":
                me.submitOnEnter = me.submitOnEnter || true;
                tmpButtons = {accept:accept};
                break;
            case "confirm":
                me.submitOnEnter = me.submitOnEnter || true;
                tmpButtons = {accept:accept,cancel:cancel};
                break;
            default:
        }
        me.buttons = baidu.extend(tmpButtons,me.buttons || {});
        baidu.object.each(me.buttons,function(opt, name){
            me.createButton(opt,name);
        });

        //注册ontener事件
        me.submitOnEnter && me.addEventListener('onenter', function(e) {
            me.buttonInstances['accept'].fire('click', e);
        });
    });

    //在dispose时同时dispose buttons
    me.addEventListener("ondispose",function(){
        baidu.object.each(me.buttons,function(opt, name){
            me.removeButton(name);
        });
    });

    //在update时同时update buttons
    me.addEventListener("onupdate",function(){
        baidu.object.each(me.buttons,function(opt, name){
            me.buttonInstances[name] ? me.buttonInstances[name].update(opt) : me.createButton(opt,name); 
        });
    });
});
