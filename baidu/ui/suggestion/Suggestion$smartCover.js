/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/suggestion/Suggestion$smartCover.js
 * author: berg
 * version: 1.0.0
 * date: 2010-05-18
 */


///import baidu.ui.suggestion.Suggestion;
///import baidu.ui.smartCover;
/**
 * addon
 *
 * 智能遮罩，在ie6下遮住select等玩意儿
 * 当suggestion显示的时候显示遮罩，隐藏的时候同时隐藏
 */
baidu.ui.suggestion.Suggestion.register(function(suggestion){
    suggestion.addEventListener("onshow", function(){
        baidu.ui.smartCover.show(this);
    });
    suggestion.addEventListener("onhide", function(){
        baidu.ui.smartCover.hide(this);
    });
});
