/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */


///import baidu.ui.Console;
///import baidu.ui.behavior.draggable;

baidu.ui.Console.prototype.draggable = true;
baidu.ui.Dialog.register(function(me){
    if(me.draggable){
        //对Console window 提供拖拽支持
    }
});
