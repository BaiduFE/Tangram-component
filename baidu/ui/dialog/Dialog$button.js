/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/dialog/Dialog$button.js
 * author: lixiaopeng
 * version: 1.0.0
 * date: 2010/11/18
 */

/**
 * plugin button
 * 
 */

///import baidu.ui.dialog;
///import baidu.ui.dialog.Dialog;
///import baidu.ui.button.Button;
///import baidu.object.each;


/**
 * 根据this.buttons创建dialog下部的buttons
 * butions格式
 * {
 *  name,{baidu.ui.button.Button相同的参数}
 * }
 * */
baidu.extend(baidu.ui.dialog.Dialog.prototype,{
    
    /**
     * 创建底部按钮
     * @return void
     * */
    createButtons:function(){
        var me = this;
        baidu.object.each(this.buttons,function(opt, name){
           baidu.extend(opt,{
               classPrefix : me.classPrefix + "-" + name,
               skin : me.skin ? me.skin + "-" + name : "",
               element : me.getFooter(),
               autoRender : true,
               parent : me
           });
           var buttonInstance = baidu.ui.create(baidu.ui.button.Button, opt);
           me.buttonInstances[name] = buttonInstance;
       });                     
    },
   
    /**
     * 删除底部按钮
     * @return void
     * */
    removeButtons:function(){
        var me = this;
        baidu.object.each(me.buttonInstances,function(button,key){
            button.dispose();
        });
        me.buttonInstances = {};
    }
});
baidu.ui.dialog.Dialog.register(function(me){
    //存储button实例
    me.buttonInstances = {}; 
    
    //在onLoad时创建buttons
    me.addEventListener("onload",function(){
        me.createButtons(); 
    });

    //在dispose时同时dispose buttons
    me.addEventListener("ondispose",function(){
        me.removeButtons(); 
    });
});
