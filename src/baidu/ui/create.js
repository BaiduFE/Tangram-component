/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui;
///import baidu.ui.getUI;
///import baidu.lang.isString;

/**
 * 创建一个ui控件
 * @author berg
 * @param {object|String} UI控件类或者uiType
 * @param {object} options optional 控件的初始化属性
 *
 * autoRender : 是否自动render，默认true
 * element : render到的元素
 * parent : 父控件
 *
 * @return {object} 创建好的控件实例
 */
baidu.ui.create = function(UI, options){
    if(baidu.lang.isString(UI)){
        UI = baidu.ui.getUI(UI);
    }
    return new UI(options);
};
