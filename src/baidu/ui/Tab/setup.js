/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/Tab/setup.js
 * author: berg
 * version: 1.0.0
 * date:2010/07/29 
 */

///import baidu.ui.tab.Tab;

///import baidu.event.on;
///import baidu.array.each;


/**
 * setup tab控件
 *
 * @param   {DOMElement}             element            要渲染成tab的元素
 * @param   {Object}                 options            选项
 * @config  {Function}               items              tab中的内容<pre> [{head : "label1",body : "<p>content1</p>"},{head : "label2",body : "<p>content2</p>"},{head : "label3",body : "<p>content3</p>"}]</pre>
 */

baidu.ui.Tab.setup = function(element, options){
    var tab = new baidu.ui.tab.Tab(options),
        labelArr = baidu.dom.children(element),
        labels;
    
    //生成labels
    baidu.dom.insertHTML(element, "beforeEnd", tab.getBody('', ''));
    labels = tab.getBodies();

    //处理每个label和其对应的content
    baidu.array.each(labelArr, function(element, key){
        element.id = tab.getId("body"+key);
        baidu.dom.addClass(element, tab.getClass("body"));
        var content = baidu.g(element.getAttribute("bodyId"));
        if(!key){
            baidu.dom.addClass(element, tab.getClass("current"));
        }else{
            content.style.display = "none";
        }
        labels.appendChild(element);
    });

    baidu.each(tab.getHeads(), function(item, key){
        baidu.on(item, "click", function(e){
            tab.switchByItem(item);
        });
    });

    return tab;
};
