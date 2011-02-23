/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */


///import baidu.ui.Console;
///import baidu.ui.behavior.resizable;

baidu.extend(baidu.ui.Console.prototype, {
    resizable: true,
    minWidth: 100,
    minHeight: 100,
    direction: ['s', 'e', 'se']
});

baidu.ui.Dialog.register(function(me){
    if(me.resizable){
        //对Console window 提供resizable支持
    }
});
