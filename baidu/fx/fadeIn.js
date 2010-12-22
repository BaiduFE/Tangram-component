/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * @author: meizz
 * @namespace: baidu.fx.fadeIn
 * @version: 2010-01-23
 */

///import baidu.dom.g;
///import baidu.fx.opacity;

/**
 * DOM元素渐显效果
 * 
 * @param {HTMLElement} element DOM元素或者ID
 * @param {JSON}        options 类实例化时的参数配置
 * @return {Effect}     效果类的实例
 */

baidu.fx.fadeIn = function(element, options) {
    if (!(element = baidu.dom.g(element))) return null;

    var fx = baidu.fx.opacity(element,
        baidu.object.extend({from:0, to:1, restoreAfterFinish:true}, options||{})
    );
    fx._className = "baidu.fx.fadeIn";

    return fx;
};
