/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * @path:ui/table/Table$btn.js
 * @author:linlingyu
 * @version:1.0.0
 * @date:2010-9-30
 */
///import baidu.ui.table.Table;
///import baidu.ui.table.Table$page;
///import baidu.dom.insertHTML;
///import baidu.ui.pager.Pager;
///import baidu.event.on;
///import baidu.dom.g;
///import baidu.dom.setStyle;
///import baidu.lang.Class.addEventListeners;

baidu.ui.table.Table.register(function(me){
	me.addEventListeners("load, update", function(){
		if(me.withPager){
			baidu.dom.insertHTML(me.getTarget(), "beforeEnd", "<div id='" + me.getId("-pager") + "' align='right'></div>");
			me.pager = new baidu.ui.pager.Pager({
				endPage : me.getTotalPage() + 1,
				ongotopage : function(evt){me.gotoPage(evt.page);}
			});
			me.pager.render(me.getPagerContainer());
			me.addEventListeners("addrow, removerow", function(){
				me.pager.update({endPage : me.getTotalPage() + 1});
			});
			me.resize();
			baidu.event.on(window, "resize", function(){me.resize();});
		}
	});
});
baidu.object.extend(baidu.ui.table.Table.prototype, {
	/**
	 * 取得存放pager的容器
	 * @memberOf {TypeName} 
	 * @return {html-element} 
	 */
	getPagerContainer : function(){
		return baidu.g(this.getId("-pager"));
	},
	
	/**
	 * 重设pager容器的大小
	 * @memberOf {TypeName} 
	 */
	resize : function(){
		var me = this;
		baidu.dom.setStyle(me.getPagerContainer(), "width", me.getBody().offsetWidth + "px");
	}
});