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
 * Tab标签组，说明：该组件继承于baidu.ui.ItemSet，相关的方法请参考ItemSet
 * @class
 * @grammar new baidu.ui.Tab(options)
 * @param      {Object} [options] 选项
 * @config {Array} items 数据项，格式如：[{head: 'text-0', body: 'content-0'}, {head: 'text-1', body: 'content-1'}...]
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
	 * @param {Object} item     选项内容
	 * @param {int} index       选项的索引
	 */
	insertItemHTML : function(item, index) {
		var me = this,
            headIds = me._headIds,
            bodyIds = me._bodyIds,
            index = headIds[index] ? index : headIds.length,
            headContainer = baidu.dom.g(headIds[index] || me.getId('head-container')),
            bodyContainer = baidu.dom.g(bodyIds[index] || me.getId('body-container')),
            pos = headIds[index] ? 'beforeBegin' : 'beforeEnd';
        baidu.dom.insertHTML(headContainer, pos, me._getHeadString(item, index));
        baidu.dom.insertHTML(bodyContainer, pos, me._getBodyString(item, index));
        me._addSwitchEvent(baidu.dom.g(headIds[index]));
	},
    /**
	 * @private
	 * 
	 */
    insertContentHTML: function(item, index){
        var me = this;
        baidu.dom.insertHTML(me.getBodies()[index], 'beforeEnd', item);
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
