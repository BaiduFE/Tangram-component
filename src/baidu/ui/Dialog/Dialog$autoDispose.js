/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Dialog;

///import baidu.lang.isString;
///import baidu.object.extend;
baidu.ui.Dialog.register(function(me){
    me.addEventListener("onload",function(){

        //默认自动dispose
        if (typeof me.autoDispose == 'undefined' || me.autoDispose) {
            me.addEventListener('onclose', function() {
                me.dispose();
            });
        }

        //默认打开dialog
        if (typeof me.autoOpen == 'undefined' || me.autoOpen) {
            me.open();
        }

    });
});
