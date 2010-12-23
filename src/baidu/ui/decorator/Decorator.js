/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/decorator/Decorator.js
 * author: berg
 * version: 1.0.0
 * date: 2010/08/17
 */


///import baidu.ui;
///import baidu.ui.createUI;

///import baidu.ui.decorator;

///import baidu.dom.insertBefore;
///import baidu.dom.children;
///import baidu.array.each;

/**
 * 装饰器控件基类
 */

baidu.ui.decorator.Decorator = baidu.ui.createUI(function(ui){

}).extend({
    uiType : "decorator",

    //装饰器模板
    tpl : {
        "box" : "<table cellspacing='0'><tr><td #{class}></td><td #{class}></td><td #{class}></td></tr><tr><td #{class}></td><td #{class} id='#{innerWrapId}'></td><td #{class}></td></tr><tr><td #{class}></td><td #{class}></td><td #{class}></td></tr></table>"
    },

    //装饰器模板的Class填充列表
    tplClass : {
        "box" : ['lt', 'ct', 'rt', 'lc', 'cc', 'rc', 'lb', 'cb', 'rb']
    },

    /**
     * 获得装饰器内部ui的body元素
     */
    getInner : function(){
        return baidu.g(this.innerId);
    },

    /**
     * 获得装饰器内部ui的main元素的外包装
     */
    _getBodyWrap : function(){
        return baidu.g(this.getId("body-wrap"));
    },

    /**
     *
     * 渲染装饰器
     *
     * 2010/11/15 调整实现方式，新的实现不会修改ui原来的main元素
     */
    render : function(){
        var me = this,
            decoratorMain = document.createElement('div'),
            uiMain = me.ui.getMain(),
            style = uiMain.style,
            ruleCount = 0;

        document.body.appendChild(decoratorMain);
        me.renderMain(decoratorMain),

        decoratorMain.className = me.getClass(me.type + "-main");

        decoratorMain.innerHTML = baidu.format(
            me.tpl[me.type], {
                'class' : function (value){
                    return "class='" + me.getClass(me.type + "-" + me.tplClass[me.type][ruleCount++]) + "'"
                },
                innerWrapId : me.getId("body-wrap")
            }
        );

        baidu.each(baidu.dom.children(uiMain), function(child){
            me._getBodyWrap().appendChild(child);
        });
        uiMain.appendChild(decoratorMain);

        me.innerId = uiMain.id;
        uiMain.getBodyHolder = me._getBodyWrap();

    }
    
});

