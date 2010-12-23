/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/tab/create.js
 * author: berg
 * version: 1.0.0
 * date: 2010-06-24
 */


///import baidu.ui.tab;
///import baidu.ui.tab.Tab;

///import baidu.dom.g;
///import baidu.array.each;
///import baidu.event.on;

/**
 * 创建一个基本tab
 * @param {HTMLElement} element
 * @param {Object} options
 * @return {baidu.ui.tab.Tab}
 */
baidu.ui.tab.create = function(main, options){
    var t = new baidu.ui.tab.Tab(options);
    t.render(main);
    return t;
};
