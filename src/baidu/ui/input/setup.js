/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/input/setup.js
 * author: zhangyao
 * version: 1.0.0
 * date:2010/09/06 
 */

///import baidu.ui.input.Input;

///import baidu.dom.create;
///import baidu.dom.insertAfter;
///import baidu.dom.remove;



/**
 * setup：将已定义的input转换成input控件
 *
 * @param {DOMElement} element
 * @param {DOMElement} input选项
 */

baidu.ui.input.setup = function(element, options){
    var input = new baidu.ui.input.Input(options),
        main = baidu.dom.create("DIV", {
            "style" : "display:inline"
        });

    baidu.dom.insertAfter(main, element);
	
    input.text = element.value;
    input.disabled = element.disabled;
    
    input.render(main);
		
    baidu.dom.remove(element);

    return input;
};
