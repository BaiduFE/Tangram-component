/**
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/toolBar/Menu.js
 * @author lixiaopeng
 * @version 1.0.0
 * date: 2010/11/28
 * */

///import baidu.ui.toolbar._Item;
///import baidu.ui.menubar.Menubar;

///import baidu.dom.insertHTML;
///import baidu.dom.g;
///import baidu.array.each;

/**
 * toolBar基类，建立toolBar实例
 * @constructor
 * @param {Object}              options config参数
 * @param {String|HTMLElemnt}   [options.container=document.body]   实例容器
 * @param {String}              [options.items.name="ToolBar_item_xxx"] ui控件的唯一标识符
 * @param {Object}              [options.items.options]         创建ui控件所需要的config参数
 * @returns void
 * */
baidu.ui.toolbar.Menubar = baidu.ui.createUI(function(options){
    var me = this,
        optArray  = ["name"];

    baidu.each(optArray,function(item,i){
        options[item] && delete(options[item]);
    });
    me._uiInstance = new baidu.ui.menubar.Menubar(options);
},{superClass:baidu.ui.toolbar._Item}).extend({
    
    /**
     * uiType
     * */
    uiType:"toolbar-menu"
});
