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
 * @function
 * @param   {HTMLElement}            element            存放选项卡的元素，选项卡会渲染到该元素内。
 * @param   {Object}                 options            选项
 * @config  {Function}               items              tab中的内容<pre> [{head : "label1",body : "<p>content1</p>"},{head : "label2",body : "<p>content2</p>"},{head : "label3",body : "<p>content3</p>"}]</pre>
 * @return  {baidu.ui.tab.Tab}
 */
baidu.ui.tab.create = function(main, options){
    var t = new baidu.ui.tab.Tab(options);
    t.render(main);
    return t;
};
