/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * @author: meizz
 * @namespace: baidu.fx.pulsate
 * @version: 2010-01-23
 */

///import baidu.dom.g;
///import baidu.object.extend;

///import baidu.fx.create;

/**
 * 心跳效果
 *
 * @param   {HTMLElement}   element     DOM元素或者ID
 * @param   {Number}        loop        心跳的次数 [loop]为必传，小于0则永远心跳不停
 * @param   {JSON}          options     类实例化时的参数配置
 * @return  {Effect}     效果类的实例
 */
baidu.fx.pulsate = function(element, loop, options) {
    if (!(element = baidu.dom.g(element))) return null;
    if (isNaN(loop) || loop == 0) return null;

    var e = element;

    var fx = baidu.fx.create(e, baidu.object.extend({
        //[Implement Interface] initialize
        initialize : function() {this.protect("visibility");}

        //[Implement Interface] transition
        ,transition : function(percent) {return Math.cos(2*Math.PI*percent);}

        //[Implement Interface] render
        ,render : function(schedule) {
            e.style.visibility = schedule > 0 ? "visible" : "hidden";
        }

        //[Implement Interface] finish
        ,finish : function(){
            setTimeout(function(){
                baidu.fx.pulsate(element, --loop, options);
            }, 10);
        }
    }, options), "baidu.fx.pulsate");

    return fx.launch();
};
