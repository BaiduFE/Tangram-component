/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/dialog/confirm.js
 * author: bergi,lixiaopeng
 * version: 1.0.0
 * date: 2010-05-18
 */

/**
 * 应用实现 confirm
 * 
 * @param  {String|DOMElement}             content                 内容或者内容对应的元素
 * @param  {Object}             options optional        选项参数
 * @config {bool}               autoOpen optional    是否一开始就打开，默认为true
 *
 */

///import baidu.ui.dialog;
///import baidu.ui.dialog.Dialog;
///import baidu.ui.dialog.Dialog$button;
///import baidu.ui.dialog.Dialog$keyboard;
///import baidu.lang.isString;
///import baidu.object.extend;

baidu.ui.dialog.confirm = function(content, options){
    var dialogInstance;
    
    options = baidu.extend({
        type    : "confirm",
        buttons : {
            "accept" : {
                "content" : "确定",
                "onclick" : function(){
                    var me = this,
                        parent = me.getParent();
                    parent.dispatchEvent("onaccept") && parent.close();
                }
            },
            "cancel" : {
                "content" : "取消",
                "onclick" : function(){
                    var me = this,
                        parent = me.getParent();
                    parent.dispatchEvent("oncancel") && parent.close();
                }
            }
        }
    },options || {}); 
    
    if(baidu.isString(content)){
        options.contentText = content;
    } else {
        options.content = content;
    }
    
    dialogInstance = new baidu.ui.dialog.Dialog(options);
    
    //默认自动dispose
    if(typeof options.autoDispose == 'undefined' || options.autoDispose){
        dialogInstance.addEventListener("onclose", function(){
            this.dispose();
        });
    }
    dialogInstance.render();
    //默认打开dialog
    if(typeof options.autoOpen == 'undefined' || options.autoOpen){
        dialogInstance.open();
    }

    //注册ontener事件
    dialogInstance.addEventListener("onenter",function(e){
        this.buttonInstances["accept"].fire("click",e); 
    });
    return dialogInstance;
};
