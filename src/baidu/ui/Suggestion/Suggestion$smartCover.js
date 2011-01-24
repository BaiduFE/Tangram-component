/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */


///import baidu.ui.Suggestion;
///import baidu.ui.smartCover;
/**
 * 智能遮罩，在ie6下遮住select等玩意儿
 * 当suggestion显示的时候显示遮罩，隐藏的时候同时隐藏
 * @author berg
 */
baidu.ui.Suggestion.register(function(suggestion){
    suggestion.addEventListener("onshow", function(){
        baidu.ui.smartCover.show(this);
    });
    suggestion.addEventListener("onhide", function(){
        baidu.ui.smartCover.hide(this);
    });
});
