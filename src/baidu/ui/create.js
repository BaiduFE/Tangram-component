/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: baidu/ui/create.js
 * author: berg
 * version: 1.1.0
 * date: 2010/12/02
 */

///import baidu.ui;
///import baidu.object.extend;

/**
 * 创建一个ui控件
 *
 * @param {object} UI控件类
 * @param {object} options optional 控件的初始化属性
 *
 * autoRender : 是否自动render，默认true
 * element : render到的元素
 * parent : 父控件
 *
 * @return {object} 创建好的控件实例
 */
baidu.ui.create = function(UI, options){
    /*
     * 如果加上autoRender = true，现在代码改动比较大，等到一个大的版本再改动比较安全
     *options = baidu.extend({
     *    autoRender : true
     *}, options);
     */
    var parent = options.parent,
        element = options.element,
        autoRender = options.autoRender;

    options.autoRender = options.parent = options.element = null;

    var ui = new UI(options);

    if(parent && ui.setParent){
        ui.setParent(parent);
    }
    if(autoRender && ui.render){ 
        ui.render(element);
    }
    return ui;
};
