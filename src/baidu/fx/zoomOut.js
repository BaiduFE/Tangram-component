/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * @author: meizz
 * @namespace: baidu.fx.zoomOut
 * @version: 2010-06-07
 */

///import baidu.dom.g;
///import baidu.dom.hide;
///import baidu.object.extend;

///import baidu.fx.scale;

/**
 * 将DOM元素缩小
 *
 * @param   {HTMLElement}   element     DOM元素或者ID
 * @param   {JSON}          options     类实例化时的参数配置
 *          {transformOrigin, from,     to}
 *          {"0px 0px"        number    number}
 * @return  {fx}     效果类的实例
 */
baidu.fx.zoomOut = function(element, options) {
    if (!(element = baidu.dom.g(element))) return null;

    options = baidu.object.extend({
        to:0.1
        ,from:1
        ,opacityTrend:false
        ,restoreAfterFinish:true
        ,transition:function(n){return 1 - Math.pow(1 - n, 2);}
    },  options||{});

    var effect = baidu.fx.scale(element, options);
    effect.addEventListener("onafterfinish", function(){baidu.dom.hide(this.element);});

    return effect;
};
