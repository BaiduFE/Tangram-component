/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * @path:ui/Table/Table$title.js
 * @author:linlingyu
 * @version:1.0.0
 * @date:2010-11-05
 */
///import baidu.ui.Table;
///import baidu.dom.insertHTML;
///import baidu.dom.setStyles;
///import baidu.dom.setStyle;
///import baidu.array.each;
///import baidu.dom.g;
///import baidu.string.format;
///import baidu.lang.Class.addEventListeners;
/**
 * 增加列标题
 * @name  baidu.ui.Table.Table$title
 * @addon baidu.ui.Table
 * @param   {Object} options config参数
 * @config  {Object} title 在表格头上增加一个行来说明各个表格列的标题，参数格式：['column-1', 'column-2', 'column-3'...]
 */
baidu.ui.Table.register(function(me){
	if(me.title){
		me.addEventListeners("load, update", function(){
			if(!me.getTitleBody()){
				baidu.dom.insertHTML(me.getTarget(), "afterBegin", me._getTitleString());
				me.dispatchEvent("titleload");//这个事件派发主要是解决select插件
				baidu.dom.setStyles(me.getBody(), {tableLayout : "fixed"});//这一步设置需要在getTitleBody之前，防止宽度提前撑开
				baidu.dom.setStyles(me.getTitleBody(), {width : me.getBody().offsetWidth + "px", tableLayout : "fixed"});//这个地方很奇怪，不能用clientWidth，需要用offsetWidth各浏览器才显示正确
				
			}
			if(me.getTitleBody() && me.columns){
				baidu.array.each(me.columns, function(item){
					if(item.hasOwnProperty("width")){
						baidu.dom.setStyles(me.getTitleBody().rows[0].cells[item.index], {width : item.width});
					}
				});
			}
		});
		//
		me.addEventListener("addrow", function(){
            if(me.getRowCount() == 1){
            	baidu.dom.setStyles(me.getTitleBody(), {width : me.getBody().offsetWidth + "px"});//当是IE6时，当没有row时，offsetWidth会为0
            }
		});
	}
});
//
baidu.object.extend(baidu.ui.Table.prototype, {
	tplTitle : '<div><table id="#{rsid}" class="#{tabClass}" cellspacing="0" cellpadding="0" border="0"><tr class="#{trClass}">#{col}</tr></table></div>',
	
	/**
	 * 取得表格列标题的拼接字符串
	 * @memberOf {TypeName} 
	 * @return {TypeName} 
	 */
	_getTitleString : function(){
		var me = this,
			col = [],
			clazz = "";
		baidu.array.each(me.title, function(item){
			col.push("<td>", item, "</td>");
		});
		return baidu.string.format(me.tplTitle, {
			rsid : me.getId("title"),
			tabClass : me.getClass("title"),
			trClass : me.getClass("title-row"),
			col : col.join("")
		});
	},
	
	/**
	 * 取得表格的table对象
	 * @name  baidu.ui.Table.Table$title.getTitleBody
	 * @addon baidu.ui.Table.Table$title
	 * @function
	 * @return {html-element} 
	 */
	getTitleBody : function(){
		return baidu.g(this.getId("title"));
	}
});