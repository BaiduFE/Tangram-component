/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * @path:ui/table/Cell.js
 * @author:linlingyu
 * @version:1.0.0
 * @date:2010-9-30
 */
///import baidu.ui.table.Table;
///import baidu.ui.table.Row;
///import baidu.dom.g;
///import baidu.dom.setAttrs;
/**
 *
 * 表格单元格控件
 * 这是一个特殊的控件，他没有render等方法，无法直接使用，必须通过table的row控件调用
 *
 * @param options
 */
baidu.ui.table.Cell = baidu.ui.createUI(function(options){}).extend({
	uiType : "table-cell",
	
	/**
	 * 初始化cell并提供父级对象参数row
	 * @param {Object} _parent
	 * @memberOf {TypeName} 
	 */
	_initialize : function(_parent){
		var me = this;
		me.setParent(_parent);
		baidu.dom.setAttrs(me.target, {id : me.getId(), "data-guid" : me.guid});
	},
	
	/**
	 * 重写Main方法
	 * @memberOf {TypeName} 
	 * @return {html-td} 
	 */
	getMain : function(){
		return baidu.dom.g(this.getId());
	},
	
	/**
	 * 取得baidu.ui.table.Row对象
	 * @memberOf {TypeName} 
	 * @return {baidu.ui.table.Row} 
	 */
	getParent : function(){
		return this._parent;
	},
	
	/**
	 * 设置父对象
	 * @param {Object} _parent
	 * @memberOf {TypeName} 
	 */
	setParent : function(_parent){
		this._parent = _parent;
	},
	
	/**
	 * 取得单元格的字符串内容
	 * @memberOf {TypeName} 
	 * @return {string} 
	 */
	getHTML : function(){
//		return baidu.dom.getText(this.getMain());
		return this.getMain().innerHTML;
	},
	
	/**
	 * 设置单元格的字符串内容
	 * @param {Object} content
	 * @memberOf {TypeName} 
	 */
	setHTML : function(content){
		var me = this, parent = me.getParent();
		parent.getParent().data[parent.getMain().rowIndex].content[me.getMain().cellIndex] = content;
		me.getMain().innerHTML = content;
	}
});
