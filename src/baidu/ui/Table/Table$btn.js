/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * @path:ui/Table/Table$btn.js
 * @author:linlingyu
 * @version:1.0.0
 * @date:2010-9-30
 */
///import baidu.ui.Table;
///import baidu.ui.Table.Table$page;
///import baidu.dom.insertHTML;
///import baidu.ui.Pager;
///import baidu.event.on;
///import baidu.dom.g;
///import baidu.dom.setStyle;
///import baidu.lang.Class.addEventListeners;
/**
 * 为翻页功能增加相关按钮
 * @name  baidu.ui.Table.Table$btn
 * @addon baidu.ui.Table
 * @param {Object} options config参数
 * @config {Object} widthPager 当该参数要在table的结尾处增加翻页按钮
 */
baidu.ui.Table.register(function(me){
    me.addEventListeners("load, update", function(){
        if(me.withPager){
            baidu.dom.insertHTML(me.getTarget(), "beforeEnd", "<div id='" + me.getId("-pager") + "' align='right'></div>");
            me.pager = new baidu.ui.Pager({
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

baidu.object.extend(baidu.ui.Table.prototype, {
    /**
     * 取得存放pager的容器
	 * @name  baidu.ui.Table.Table$btn.getPagerContainer
	 * @addon baidu.ui.Table.Table$btn
     * @return {html-element} 
     */
    getPagerContainer : function(){
        return baidu.g(this.getId("-pager"));
    },
    
    /**
     * 重设pager容器的大小
	 * @name  baidu.ui.Table.Table$btn.resize
	 * @addon baidu.ui.Table.Table$btn
     */
    resize : function(){
        var me = this;
        baidu.dom.setStyle(me.getPagerContainer(), "width", me.getBody().offsetWidth + "px");
    }
});