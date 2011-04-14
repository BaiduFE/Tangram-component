/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.dom.g;

///import baidu.ui.suggestion;
///import baidu.ui.suggestion.Suggestion;
///import baidu.ui.behavior.coverable;

baidu.extend(baidu.ui.suggestion.Suggestion.prototype,{
    coverable: true,
    coverableOptions: {}
});

baidu.ui.suggestion.Suggestion.register(function(me){

    if(me.coverable){

        me.addEventListener("onshow", function(){
            me.Coverable_show();
        });

        me.addEventListener("onhide", function(){
            me.Coverable_hide();
        });
    }
});
