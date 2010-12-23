/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * @author: meizz
 * @namespace: baidu.fx.remove
 * @version: 2010-01-23
 */

///import baidu.fx.fadeOut;

///import baidu.dom.remove;
///import baidu.object.extend;

/**
 * 在删除元素的时候添加 fadeout 的效果
 * 
 * @param {HTMLElement} element DOM元素或者ID
 * @param {JSON}        options 类实例化时的参数配置
 * @return {Effect}     效果类的实例
 */

baidu.fx.remove = function(element, options) {
    return baidu.fx.fadeOut(element, baidu.object.extend(options||{}, {
        onafterfinish: function(){baidu.dom.remove(this.element);}
    }));
};
