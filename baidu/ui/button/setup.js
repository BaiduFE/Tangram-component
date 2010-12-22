/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/ui/button/setup.js
 * author: berg
 * version: 1.0.0
 * date:2010/09/02 
 */

///import baidu.ui.button.Button;

///import baidu.dom.insertAfter;
///import baidu.dom.remove;
///import baidu.dom.create;


/**
 * setup button控件
 *
 * 两个问题：
 * 1. 外层的事件可能会丢掉  for循环或者outterHTML
 * 2. input回填会失效
 *
 * @param {DOMElement} element 要渲染成button的元素
 */

baidu.ui.button.setup = function(element, options){
    var button = new baidu.ui.button.Button(options),
        main = baidu.dom.create("DIV", {
            "style" : "display:inline"
        });

    baidu.dom.insertAfter(main, element);

    button.content = element.innerHTML;
    
    button.render(main);

    baidu.dom.remove(element);

    return button;
};
