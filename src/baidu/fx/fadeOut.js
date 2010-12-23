/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * @author: meizz
 * @namespace: baidu.fx.fadeOut
 * @version: 2010-01-23
 */

///import baidu.dom.g;
///import baidu.dom.hide;
///import baidu.fx.opacity;

/**
 * DOM元素渐隐效果
 * 
 * @param {HTMLElement} element DOM元素或者ID
 * @param {JSON}        options 类实例化时的参数配置
 * @return {Effect}     效果类的实例
 */
baidu.fx.fadeOut = function(element, options) {
    if (!(element = baidu.dom.g(element))) return null;

    var fx = baidu.fx.opacity(element,
        baidu.object.extend({from:1, to:0, restoreAfterFinish:true}, options||{})
    );
    fx.addEventListener("onafterfinish", function(){baidu.dom.hide(this.element);});
    fx._className = "baidu.fx.fadeOut";

    return fx;
};
