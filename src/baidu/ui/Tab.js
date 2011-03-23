/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * path :  ui/Tab.js
 * author :  berg
 * version :  1.0.0
 * date :  2010-06-11
 */


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
 * @class
 * @param      {Object}                 [options]          选项
 * @config     {Function}               items              tab中的内容<pre> [{head : "label1",body : "<p>content1</p>"},{head : "label2",body : "<p>content2</p>"},{head : "label3",body : "<p>content3</p>"}]</pre>
 * @plugin      dom                让Tab类支持从已有dom渲染出tab。
 */
 
baidu.ui.Tab = baidu.ui.createUI( function (options) {
    var me = this;
    me.items = me.items || [];//初始化防止空
}, {superClass : baidu.ui.ItemSet}).extend( 
    /**
     *  @lends baidu.ui.Tab.prototype
     */
{
	//ui控件的类型 **必须**
    uiType             :  "tab", 
    tplDOM           :  "<div id='#{id}' class='#{class}'>#{heads}#{bodies}</div>", 
    tplHeads        :  "<ul id='#{id}' class='#{class}'>#{heads}</ul>", 
    tplBodies      :  "<div id='#{id}' class='#{class}'>#{bodies}</div>", 
    tplHead     :  "<li id='#{id}' bodyId='#{bodyId}' class='#{class}' ><a href='#' onclick='return false'>#{head}</a></li>", 
    tplBody   :  "<div id='#{id}' class='#{class}' style='display : #{display};'>#{body}</div>", 
	/**
	 * 获得tab的html string
	 * @private
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
	 * @private
	 * @param {Object} item
	 * @param {int} index
	 */
	insertItemHTML : function(item, index) {
		var me = this;
		baidu.dom.insertHTML(baidu.g(me.getId("head-container")),  "beforeEnd",  this._getHeadString(item, index));
		baidu.dom.insertHTML(baidu.g(me.getId("body-container")),  "beforeEnd",  this._getBodyString(item, index));
	},
    /**
	 * @private
	 * 
	 */
    insertContentHTML: function(item, index){
        var me = this;
        baidu.dom.insertHTML(me.bodies[index],'beforeEnd',item);
    },

	/**
	* 兼容原接口getLabel
	* @private
	* @return {HTMLObject} head
	*/
	getLabel : function() {
		return this.getHead();
	}, 
	/**
	 * 兼容原接口getContent
	 * @private
	 * @return {HTMLObject} body
	 */
	getContent : function() {
		return this.getBody();
	}, 
	/**
	 * 兼容原接口getAllLabelItems
	 * @private
	 * @return {Array[HTMLObject]} heads	
	 */
	getAllLabelItems : function() {
		return this.getHeads();
	}, 
	/**
	 * 兼容原接口focus
	 * @private
	 * @param {Number} index	标签索引
	 */
	focus : function(index) {
		this.selectByIndex(index);
	}

});
