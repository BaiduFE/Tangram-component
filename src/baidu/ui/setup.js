/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/ui/setup.js
 * author: berg
 * version: 1.0.0
 * date: 2010/07/27 00:38:11
 */

///import baidu.ui;
///import baidu.ui.getAttribute;

///import baidu.dom.getParent;

/**
 * 从当前页面批量setup所有控件（DOM - 控件）
 *
 * @param {DOMElement} element 渲染查找的根元素
 */
baidu.ui.setup = function(element){
    var i = 0,
        len = 0,
        o = element.getElementsByTagName('*'),
        elements = [element],
        instance,
        type,
        uiPackage;

    for (; element = o[i]; ) {
        elements[++i] = element;
    }

    for (i = 0; element = elements[i++]; ) {
        if (baidu.dom.getParent(element)) { 
            o = baidu.ui.getAttribute(element);
            if (type = o.ui) { //0907修改此处为ui，berg
                uiPackage = baidu.ui[type];
                if(typeof uiPackage.setup == 'function'){
                    //如果有setup静态方法，直接调用
                    uiPackage.setup(element, o);
                }
            }
        }
    }
};
