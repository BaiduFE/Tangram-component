/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/popup/Popup.js
 * author: berg,rocy
 * version: 1.0.0
 * date: 2010-05-18
 */


///import baidu.ui.popup.Popup;
///import baidu.ui.smartCover;
/**
 *
 * 智能遮罩，在ie6下遮住select等玩意儿
 * 当popup显示的时候显示遮罩，隐藏的时候同时隐藏
 */
baidu.ui.popup.Popup.register(function(popup){
    popup.addEventListener("onopen", function(){
        baidu.ui.smartCover.show(this);
    });
    popup.addEventListener("onclose", function(){
        baidu.ui.smartCover.hide(this);
    });
    popup.addEventListener("onupdate", function(){
        baidu.ui.smartCover.update(this);
    });
});
