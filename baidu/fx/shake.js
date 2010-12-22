/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * @author: meizz
 * @namespace: baidu.fx.shake
 * @version: 2010-01-23
 */

///import baidu.dom;
///import baidu.object.extend;
///import baidu.dom.getStyle;

///import baidu.fx.create;

/**
 * 颤动的效果
 * 说明：在效果执行过程中会修改DOM元素的position属性，可能会对包含的DOM元素带来影响
 * 
 * @param   {HTMLElement}   element     DOM元素或者ID
 * @param   {Array|JSON}    offset      移动的距离 [,] | {x,y}
 * @param   {JSON}          options     类实例化时的参数配置
 * @return  {fx}            效果类的实例
 */
baidu.fx.shake = function(element, offset, options) {
    if (!(element = baidu.dom.g(element))) return null;

    var e = element;
    offset = offset || [];
    function tt() {
        for (var i=0; i<arguments.length; i++) {
            if (!isNaN(arguments[i])) return arguments[i];
        }
    }

    var fx = baidu.fx.create(e, baidu.object.extend({
        //[Implement Interface] initialize
        initialize : function() {
            this.protect("top");
            this.protect("left");
            this.protect("position");
            this.restoreAfterFinish = true;

            if (baidu.dom.getStyle(e, "position") == "static") {
                e.style.position = "relative";
            }
			var original = this['\x06original'];
            this.originX = parseInt(original.left|| 0);
            this.originY = parseInt(original.top || 0);
            this.offsetX = tt(offset[0], offset.x, 16);
            this.offsetY = tt(offset[1], offset.y, 5);
        }

        //[Implement Interface] transition
        ,transition : function(percent) {
            var line = 1 - percent;
            return Math.floor(line * 16) % 2 == 1 ? line : percent - 1;
        }

        //[Implement Interface] render
        ,render : function(schedule) {
            e.style.top  = (this.offsetY * schedule + this.originY) +"px";
            e.style.left = (this.offsetX * schedule + this.originX) +"px";
        }
    }, options || {}), "baidu.fx.shake");

    return fx.launch();
};
