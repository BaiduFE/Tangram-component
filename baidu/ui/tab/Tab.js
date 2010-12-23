/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * path :  ui/tab/Tab.js
 * author :  berg
 * version :  1.0.0
 * date :  2010-06-11
 */


///import baidu.ui.tab;
///import baidu.ui.createUI;
///import baidu.array.each;

///import baidu.string.format;

///import baidu.dom.g;
///import baidu.dom.children;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.getAttr;
///import baidu.dom.insertHTML;
///import baidu.ui.ItemSet;
///import baidu.object.extend;

/**
 * Tab标签组
 * @param {Object} [options] 选项
 * @return {baidu.ui.tab.Tab}
 */
baidu.ui.tab.Tab = baidu.ui.createUI( function (options) {

}, {superClass : baidu.ui.ItemSet}).extend( {
	//ui控件的类型 **必须**
    uiType             :  "tab", 
    tplDOM           :  "<div id='#{id}' class='#{class}'>#{heads}#{bodies}</div>", 
    tplHeads        :  "<ul id='#{id}' class='#{class}'>#{heads}</ul>", 
    tplBodies      :  "<div id='#{id}' class='#{class}'>#{bodies}</div>", 
    tplHead     :  "<li id='#{id}' bodyId='#{bodyId}' class='#{class}' ><a href='#' onclick='return false'>#{head}</a></li>", 
    tplBody   :  "<div id='#{id}' class='#{class}' style='display : #{display};'>#{body}</div>", 
	/**
	 * 获得tab的html string
	 * @return {HTMLString} string
	 */
	getString  :  function() {
        var me = this, 
            items = this.items, 
            bodies = [], 
            heads = [];
        baidu.each(items,  function(_item,  key) {
            bodies.push(me._getBodyString(_item, key));
            heads.push(me._getHeadString(_item, key));
        });
		return baidu.format(me.tplDOM,  {
            id       :  me.getId(), 
            "class"  :  me.getClass(), 
            heads   :  baidu.format(me.tplHeads,  {
                    id :  me.getId("head-container"), 
                    "class" :  me.getClass("head-container"), 
                    heads :  heads.join("")
                }), 
            bodies :  baidu.format(me.tplBodies,  {
                    id           :  me.getId("body-container"), 
                    "class"      :  me.getClass("body-container"), 
                    bodies       :  bodies.join("")
                }
            )
        });
	}, 
	/**
	 * 插入item html
	 * @param {Object} item
	 * @param {int} index
	 */
	insertItemHTML : function(item, index) {
		var me = this;
		baidu.dom.insertHTML(baidu.g(me.getId("headParent")),  "beforeEnd",  this._getHeadString(item, index));
		baidu.dom.insertHTML(baidu.g(me.getId("bodyParent")),  "beforeEnd",  this._getBodyString(item, index));
	}, 
	/**
	*兼容原接口getLabel
	*@return {HTMLObject} head
	*/
	getLabel : function() {
		return this.getHead();
	}, 
	/**
	*兼容原接口getContent
	*@return {HTMLObject} body
	*/
	getContent : function() {
		return this.getBody();
	}, 
	/**
	*兼容原接口getAllLabelItems
	*@return {Array[HTMLObject]} heads	
	*/
	getAllLabelItems : function() {
		return this.getHeads();
	}, 
	/*
	*兼容原接口focus
	*@param {int} index	
	*/
	focus : function(index) {
		this.selectByIndex(index);
	}

});
