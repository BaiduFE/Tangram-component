/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/menubar/Combox$statable.js
 * author: walter
 * version: 1.0.0
 * date: 2010-12-09
 */

///import baidu.ui.combox.Combox;
///import baidu.ui.behavior.statable;
///import baidu.event.on;
///import baidu.event.un;

/**
 * 提供enable、disable行为
 */
baidu.ui.combox.Combox.extend({
    statable: true
}); 

baidu.ui.combox.Combox.register(function(me){
    
    me.addEventListener('onenable', function(){
        var input = me.getInput();
            
        baidu.on(me.getArrow(), 'click', me._showAllMenuHandler);
        baidu.on(input, "focus", me._showMenuHandler);
        
        if(me.editable){
            input.readOnly = '';
            baidu.on(input, "keyup", me._showMenuHandler);
        }    
    });
	
    me.addEventListener('ondisable', function(){
        var input = me.getInput();

        baidu.un(input, "keyup", me._showMenuHandler);
        baidu.un(input, "focus", me._showMenuHandler);
        baidu.un(me.getArrow(), 'click', me._showAllMenuHandler);
        
        input.readOnly = 'readOnly';
    });
});
