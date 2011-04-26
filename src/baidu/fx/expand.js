/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * @author: meizz
 * @namespace: baidu.fx.expand
 * @version: 2010-01-23
 */

///import baidu.fx.create;

///import baidu.dom.g;
///import baidu.dom.show;
///import baidu.object.extend;
///import baidu.array.each;
///import baidu.dom.getStyle;
///import baidu.lang.isNumber;
///import baidu.dom.setBorderBoxHeight;
///import baidu.dom.setBorderBoxWidth;

 
/**
 * 自上而下展开DOM元素的效果。
 * @function
 * @param     {string|HTMLElement}    element            元素或者元素的ID
 * @param     {Object}                options            选项。参数的详细说明如下表所示
 * @config    {Number}                duration           500,//效果持续时间，默认值为500ms
 * @config    {Number}                interval           16, //动画帧间隔时间，默认值为16ms
 * @config    {String}                orientation        动画展开方向，取值：horizontal（默认），vertical
 * @config    {Function}              transition         function(schedule){return schedule;},时间线函数
 * @config    {Function}              onbeforestart      function(){},//效果开始前执行的回调函数
 * @config    {Function}              onbeforeupdate     function(){},//每次刷新画面之前会调用的回调函数
 * @config    {Function}              onafterupdate      function(){},//每次刷新画面之后会调用的回调函数
 * @config    {Function}              onafterfinish      function(){},//效果结束后会执行的回调函数
 * @config    {Function}              oncancel           function(){},//效果被撤销时的回调函数
 * @see baidu.fx.collapse
 */

baidu.fx.expand = function(element, options) {
    if (!(element = baidu.dom.g(element))) return null;

    var e = element, width, height;

    var fx = baidu.fx.create(e, baidu.object.extend({
        orientation: 'horizontal',
        
        //[Implement Interface] initialize
        initialize : function() {
            baidu.dom.show(e);
            this.protect("overflow");
            e.style.overflow = "hidden";
            this.restoreAfterFinish = true;
            
            if(this.orientation == 'horizontal'){
                this.protect("height");
                height = e.offsetHeight;
                e.style.height = "1px";
            }else{
                this.protect("width");
                width = e.offsetWidth;
                e.style.width = "1px";
            }
        },

        //[Implement Interface] transition
        transition : function(percent) {return Math.sqrt(percent);},

        //[Implement Interface] render
        render : function(schedule) {
            if(this.orientation == 'horizontal'){
                 baidu.dom.setBorderBoxHeight(e, Math.floor(schedule * height));
            }else{
                baidu.dom.setBorderBoxWidth(e, Math.floor(schedule * width));
            } 
        }
    }, options || {}), "baidu.fx.expand_collapse");

    return fx.launch();
};
