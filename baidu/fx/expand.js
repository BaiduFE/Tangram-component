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

/**
 * 展开DOM元素
 * 
 * @param   {HTMLElement}   element DOM元素或者ID
 * @param   {JSON}          options 类实例化时的参数配置
 * @return  {Effect}                效果类的实例
 */

baidu.fx.expand = function(element, options) {
    if (!(element = baidu.dom.g(element))) return null;

    var e = element, offsetHeight, height, 
        stylesValue = ["paddingBottom","paddingTop","borderTopWidth","borderBottomWidth"];

    var fx = baidu.fx.create(e, baidu.object.extend({
        //[Implement Interface] initialize
        initialize : function() {
            baidu.dom.show(e);
            this.protect("height");
            this.protect("overflow");
            height = offsetHeight = e.offsetHeight;
            
            function getStyleNum(d,style){
                var result = parseInt(baidu.getStyle(d,style));
                result = isNaN(result) ? 0 : result;
                result = baidu.lang.isNumber(result) ? result : 0;
                return result;
            }
            
            baidu.each(stylesValue,function(item){
                height -= getStyleNum(e,item);
            });
            e.style.overflow = "hidden";
            e.style.height = "1px";
        }

        //[Implement Interface] transition
        ,transition : function(percent) {return Math.sqrt(percent);}

        //[Implement Interface] render
        ,render : function(schedule) {
            e.style.height = Math.floor(schedule * height) +"px";
        }
    }, options || {}), "baidu.fx.expand_collapse");

    return fx.launch();
};
