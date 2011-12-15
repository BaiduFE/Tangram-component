/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui;
///import baidu.ui.getUI;
///import baidu.lang.isString;

/**
 * 创建一个ui控件
 * @function
 * @grammar baidu.ui.create(UI, options)
 * @param {object|String} UI控件类或者uiType
 * @param {object} options optional 控件的初始化属性
 * @config {Boolean} autoRender 是否自动render，默认true
 * @config {String|HTMLElement} render render到的元素
 * @config {Object} parent 父控件
 * @return {Object} 创建好的控件实例
 * @author berg
 */
baidu.ui.create = function(UI, options){
    if(baidu.lang.isString(UI)){
        UI = baidu.ui.getUI(UI);
    }
    return new UI(options);
};
