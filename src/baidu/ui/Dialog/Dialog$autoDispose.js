/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Dialog;

///import baidu.lang.isString;
///import baidu.object.extend;

/**
 * 关闭后自动销毁插件
 * @name baidu.ui.Dialog.Dialog$autoDispose
 * @addon baidu.ui.Dialog
 */

baidu.extend(baidu.ui.Dialog.prototype,{
    autoDispose: true
});

baidu.ui.Dialog.register(function(me){

    if(me.autoDispose){
        me.addEventListener("onload",function(){

            //默认自动dispose
            if (typeof me.autoDispose == 'undefined' || me.autoDispose) {
                me.addEventListener('onclose', function() {
                    me.dispose();
                });
            }
        });
    }
});
