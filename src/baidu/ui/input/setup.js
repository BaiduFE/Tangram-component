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
 * @function
 * @param  {DOMElement}             target        存放input控件的元素，input控件会渲染到该元素内
 * @param  {Object}                 [options]     选项
 * @config {Function}               onfocus       聚焦时触发
 * @config {Function}               onblur        失去焦点时触发
 * @config {Function}               onchage       input内容改变时触发
 * @config {Function}               onkeydown     按下键盘时触发
 * @config {Function}               onkeyup       释放键盘时触发
 * @config {Function}               onmouseover   鼠标悬停在input上时触发
 * @config {Function}               onmouseout    鼠标移出input时触发
 * @config {Function}               ondisable     当调用input的实例方法disable，使得input失效时触发。
 * @config {Function}               onenable      当调用input的实例方法enable，使得input有效时触发。
 * @config {Function}               ondispose     销毁实例时触发
 * @return baidu.ui.input.Input
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
