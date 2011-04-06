/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Suggestion;
///import baidu.ui.behavior.coverable;

baidu.extend(baidu.ui.Suggestion.prototype,{
    coverable: true
});

baidu.ui.Suggestion.register(function(me){

    if(me.coverable){

        me.addEventListener("onopen", function(){
            me.Coverable_show();
        });

        me.addEventListener("onclose", function(){
            me.Coverable_hide();
        });

        //me.Coverable_update();
    }
});
