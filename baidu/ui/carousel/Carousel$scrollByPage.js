/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:ui/carousel/Carousel$scrollByPage.js
 * @author:linlingyu
 * @version:1.0.0
 * @date:2010-09-06
 */
///import baidu.ui.carousel.Carousel;
/**
 * 单次滚动一页的模式
 */
baidu.object.extend(baidu.ui.carousel.Carousel.prototype, {
	onbeforestartscroll : function(evt){this.focus(evt.index);},//onbeforestartscroll不能开放给用户使用,不能使用addEventListener注册
	/**
	 * 翻到上一页
	 * @param
	 * @return void
	 */
	prevPage : function(){this._gotoPage("prev")},
	/**
	 * 翻到下一页
	 * @param
	 * @return void
	 */
	nextPage : function(){this._gotoPage("next")},
	/**
	 * 翻页的共用方法，通过参数来决定是否要翻到上一页或是下一页
	 * @param {String} pos 取值:prev:next
	 */
	_gotoPage : function(pos){
		var me = this,
			totalPage = Math.ceil(me.totalCount / me.pageSize),
			currPage = Math.ceil((me.scrollIndex + 1) / me.pageSize),
			page = "prev"==pos ? (currPage <= 1 ? (me.isCycle ? totalPage : 1) : currPage - 1)
					: (currPage >= totalPage ? (me.isCycle ? 1 : totalPage) : currPage + 1),
			index = (page - 1) * me.pageSize;
		me.scrollTo(index);
		me.dispatchEvent(pos + "page");
	}
});