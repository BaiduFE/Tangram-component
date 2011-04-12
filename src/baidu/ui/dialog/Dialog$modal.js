/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Dialog.dialog;
///import baidu.ui.modal;
///import baidu.ui.modal.create;
///import baidu.ui.modal.Modal$coverable;

baidu.extend(baidu.ui.dialog.Dialog.prototype, {
    modal : true,
    modalColor : "#000000",
    modalOpacity : 0.4,
    hideModal : function(){
        var me = this;
        (me.modal && me.modalInstance) && me.modalInstance.hide();
    }
});
baidu.ui.dialog.Dialog.register(function(me){
    if(me.modal){
        me.addEventListener("onopen", function(){
            //防止一个dialog创建两个modal
            if(!me.modalInstance){
                me.modalInstance = baidu.ui.modal.create();
            }

            me.modalInstance.show({
                targetUI    : me,
                styles:{
                    color       : me.modalColor,
                    opacity     : me.modalOpacity,
                    zIndex      : me.modalZIndex ? me.modalZIndex : me.zIndex - 1
                }
            });
        });

        me.addEventListener("onclose", me.hideModal);
        me.addEventListener("ondispose", me.hideModal);
    }
});
