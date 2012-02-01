/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.createUI;

///import baidu.dom.g;
///import baidu.dom.insertHTML;
///import baidu.string.format;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.fn.bind;
///import baidu.dom.remove;

/**
 * 星级评价条
 * @class
 * @grammar new baidu.ui.StarRate(options)
 * @param {Object} [options] 选项
 * @param {Number} total 总数,默认5个
 * @param {Number} current 当前亮着的星星数
 * @param {String} classOn 星星点亮状态的className
 * @param {String} classOff 星星未点亮状态的className
 */
//TODO: 实现一个支持任意刻度的星的显示
baidu.ui.StarRate = baidu.ui.createUI(function(options){
   var me = this; 
   me.element = null; 
}).extend(
    /**
     *  @lends baidu.ui.StarRate.prototype
     */ 
    {
    uiType  : "starRate",
    // 总共需要多少个星星【可选，默认显示5个】
    total : 5,
    // 亮着的星星数【可选，默认无】
    current : 0,
    // 鼠标移出焦点区域触发函数【可选】
    //leave : function(){}
    // 鼠标经过的触发功能函数【可选】
    //hover : function(num){}
    // 点击的触发功能函数【可选】
    //click : function(num){}
    tplStar : '<span id="#{id}" class="#{className}" onmouseover="#{onmouseover}" onclick="#{onclick}"></span>',
    
    classOn : 'on',
    
    classOff : 'off',
    isDisable : false,
    /**
     * 获得控件的string
     * @private
     */
    getString : function(){
        var me = this, ret = [], i;
        for(i=0; i < me.total; ++i){
            ret.push(baidu.string.format(me.tplStar, {
                id          : me.getId(i),
                className   : i < me.current ? me.getClass(me.classOn) : me.getClass(me.classOff),
                onmouseover : me.getCallString("hoverAt",i+1),
                onclick     : me.getCallString("clickAt", i+1)
            }));
        }
        return ret.join('');
    },
    /**
     * 渲染控件
     * @public 
     * @param   {HTMLElement}   element       目标父级元素
     */
    render : function(element){
        var me = this;
            me.element = baidu.g(element);
        baidu.dom.insertHTML(me.element, "beforeEnd",me.getString());
    
        me._mouseOutHandle = baidu.fn.bind(function(){
            var me = this;
            me.starAt(me.current);
            me.dispatchEvent("onleave");
        },me);

        me.on(me.element, 'mouseout', me._mouseOutHandle);
    },

    /**
     * 指定高亮几个星星
     * @public 
     * @param   {number}  num  索引
     */
    starAt : function(num){
        var me = this, i;
        for(i=0; i < me.total; ++i){
            baidu.g(me.getId(i)).className = i < num ? me.getClass(me.classOn) : me.getClass(me.classOff);
        }
    },
    /**
     * 鼠标悬停指定高亮几个星星
     * @public 
     * @param   {number}  num  索引
     */
    hoverAt : function(num){
        if(!this.isDisable){
            this.starAt(num);
            this.dispatchEvent("onhover",{data : {index : num}});
        }
    },
    /**
     * 鼠标点击指定高亮几个星星
     * @public 
     * @param   {number}  num  索引
     */
    clickAt : function(num){
        if(!this.isDisable){
            this.current = num;
            this.dispatchEvent("onclick",{data : {index : num}});
        }
    },
    
    /**
     * 值不可更改,即不响应鼠标事件
     */
    disable : function(){
        var me = this;
        me.isDisable = true;
    },
    /**
     * disable之后的恢复
     */
    enable : function(){
        var me = this;
        me.isDisable = false;
    },
    /**
     * 销毁控件
     */
    dispose:function(){
        var me = this;
       
        for(i=0; i < me.total; ++i){
            baidu.dom.remove(me.getId(i));
        }
        
        me.dispatchEvent("ondispose");
        baidu.lang.Class.prototype.dispose.call(me);
    }
});
