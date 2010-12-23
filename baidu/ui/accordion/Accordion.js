/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * path: ui/accordion/Accordion.js
 * author: zhangyao
 * version: 1.0.0
 * date: 2010-09-03
 */


///import baidu.ui.accordion;
///import baidu.ui.createUI;

///import baidu.array.each;
///import baidu.string.format;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.insertHTML;
///import baidu.dom.g;
///import baidu.event.on;
///import baidu.dom.remove;
///import baidu.ui.ItemSet;

/**
 * 手风琴组件
 * @param {Object} 	   [options] 选项
 * @param {HTMLElment} [options.target] 渲染的容器元素
 */
baidu.ui.accordion.Accordion = baidu.ui.createUI(function (options){

},{superClass:baidu.ui.ItemSet}).extend({
	//ui控件的类型 **必须**
    uiType      : "accordion",
    //ui控件的class样式前缀 可选
    //classPrefix     : "tangram-accordion-",
    target		: document.body,
    tplDOM      : "<div id='#{id}' class='#{class}'>#{items}</div>",
	tplHead		: '<div id="#{id}" bodyId="#{bodyId}" class="#{class}" >#{head}</div>',
	tplBody		: "<div id='#{id}' class='#{class}' style='display:#{display};'>#{body}</div>",
	/**
	 * 获得accordion的html string
	 * @return {HTMLString}string
	 */
	getString : function(){
        var me = this,
            items = this.items,
            itemsStrAry = [];
        baidu.each(items, function(item, key){	
			itemsStrAry.push(me._getHeadString(item,key) + me._getBodyString(item,key));
        });
        return baidu.format(this.tplDOM, {
            id      : me.getId(),
            "class" : me.getClass(),
            items	: itemsStrAry.join("")
        });
	},
	/**
	 * 插入item html
	 * @param {Object} item
	 * @param {int} index
	 */
	insertItemHTML:function(item,index){
        var me = this;
		baidu.dom.insertHTML(me.getMain(), "beforeEnd", me._getHeadString(item,index));
		baidu.dom.insertHTML(me.getMain(), "beforeEnd", me._getBodyString(item,index));
	}
	
});
