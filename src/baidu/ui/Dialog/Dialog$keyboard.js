/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Dialog;
///import baidu.lang.instance;
///import baidu.object.each;
///import baidu.event.on;
///import baidu.event.un;

/**
 *
 * 键盘支持模块
 * 1. esc 关闭最上层的dialog
 * 2. enter 确认alert和confirm
 */
baidu.extend(baidu.ui.Dialog.prototype,{
    enableKeyboard : true,
    closeOnEscape : true
});
baidu.ui.Dialog.register(function(me){

    baidu.ui.Dialog.keyboardHandler = baidu.ui.Dialog.keyboardHandler || function(e){
        e = window.event || e;
        var keyCode = e.keyCode || e.which, onTop, eachDialog;
        
        //所有操作针对zIndex最大的dialog
        baidu.object.each(baidu.ui.Dialog.instances, function(item, key){
            if(item == "show"){
                eachDialog = baidu.lang.instance(key);
                if(!onTop || eachDialog.zIndex > onTop.zIndex){
                    onTop = eachDialog;
                }
            }
        });
        if(onTop){
            switch (keyCode){
                //esc按键触发
                case 27:
                    onTop.closeOnEscape && onTop.close();
                    break;
                //回车键触发
                case 13:
                    onTop.dispatchEvent("onenter");
                    break;
                default:
            }
        }
    };

    if(me.enableKeyboard && !baidu.ui.Dialog.keyboardEventReady){
        baidu.on(document, "keyup", baidu.ui.Dialog.keyboardHandler);
        baidu.ui.Dialog.keyboardEventReady = true;
    }
    
    //如果一个instance都没有了，才把事件删除
    me.addEventListener("ondispose", function(){
        var noInstance = true;
        baidu.object.each(baidu.ui.Dialog.instances, function(item, key){
            noInstance = false;
            return false;
        });        
        if(noInstance){
            baidu.event.un(document, "keyup", baidu.ui.Dialog.keyboardHandler);
            baidu.ui.Dialog.keyboardEventReady = false;
        }
    });
});
