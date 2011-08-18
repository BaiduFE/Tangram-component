/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * path: ui/Accordion.js
 * author: zhangyao
 * version: 1.0.0
 * date: 2010-09-03
 */


///import baidu.ui.createUI;

///import baidu.array.each;
///import baidu.string.format;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.insertHTML;
///import baidu.dom.g;
///import baidu.dom.remove;
///import baidu.ui.ItemSet;

/**
 * 手风琴组件，说明：该组件继承于baidu.ui.ItemSet，相关的方法请参考ItemSet
 * @class
 * @grammar new baidu.ui.Accordion(options)
 * @param {Object} options 选项
 * @config {Array} items 数据项，格式如：[{head: 'text-0', body: 'content-0'}, {head: 'text-1', body: 'content-1'}...]
 * @return {baidu.ui.Accordion} Accordion实例
 */
baidu.ui.Accordion = baidu.ui.createUI(function (options){
    var me = this;
    me.items = me.items || [];//初始化防止空
},{superClass:baidu.ui.ItemSet}).extend(
    /**
     *  @lends baidu.ui.Accordion.prototype
     */
    {
    //ui控件的类型 **必须**
    uiType      : "accordion",
    //ui控件的class样式前缀 可选
    //classPrefix     : "tangram-accordion-",
    target      : document.body,
    tplDOM      : "<div id='#{id}' class='#{class}'>#{items}</div>",
    tplHead     : '<div id="#{id}" bodyId="#{bodyId}" class="#{class}" >#{head}</div>',
    tplBody     : "<div id='#{id}' class='#{class}' style='display:#{display};'>#{body}</div>",
    /**
     * 获得accordion的html string
     * @return {HTMLString}string
     */
    getString : function(){
        var me = this,
            items = this.items,
            itemsStrAry = [];
        baidu.each(items, function(item, key){  
            itemsStrAry.push(me._getHeadString(item) + me._getBodyString(item));
        });
        return baidu.format(this.tplDOM, {
            id      : me.getId(),
            "class" : me.getClass(),
            items   : itemsStrAry.join("")
        });
    },
    /**
     * 插入item html
     * @param {Object} item     插入项
     * @param {number} index    索引，默认插入在最后一项
     */
    insertItemHTML:function(item, index){
        var me = this;
            ids = me._headIds,
            index = ids[index] ? index : ids.length,
            container = baidu.dom.g(ids[index]) || me.getBody(),
            pos = ids[index] ? 'beforeBegin' : 'beforeEnd';
        baidu.dom.insertHTML(container, pos, me._getHeadString(item, index));
        baidu.dom.insertHTML(container, pos, me._getBodyString(item, index));
        me._addSwitchEvent(baidu.dom.g(ids[index]));
    },
    
    /**
     * 关闭当前打开的项
     */
    collapse: function(){
        var me = this;
        if(me.dispatchEvent('beforecollapse')){
            if(me.getCurrentHead()){
                me._switch(null);
                me.setCurrentHead(null);
            }
        }
    },
    
    /**
     * 销毁实例的析构
     */
    dispose: function(){
        var me = this;
        me.dispatchEvent('ondispose');
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});
