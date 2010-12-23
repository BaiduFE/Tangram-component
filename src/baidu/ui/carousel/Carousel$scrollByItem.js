/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:ui/carousel/Carousel$scrollByItem.js
 * @author:linlingyu
 * @version:1.0.0
 * @date:2010-09-06
 */

///import baidu.ui.carousel.Carousel;
/**
 * 单次滚动单个元素的模式
 */
baidu.object.extend(baidu.ui.carousel.Carousel.prototype, {
	/**
	 * onbeforestartscroll的说明：item和page插件的实现初忠是移动和焦点分离，用户可只实现翻页而不定位焦点，
	 * 当fx引入时，在内核中占用了fx的onbeforescroll事件，则当连续点击翻页（第一次翻还同结束时）没有办法得到当次滚动是否生效，
	 * 则这里只能通过定义一个onbeforestartscroll来处理滚动生效之前的动作，同时在内核中可以实现滚动时对第二参数的设置
	 * 如果这里使用addEventListener进行注册，则如果同时导入item和page或是重复导文件会造成多次注册，同时执行时造成多次执行的错误
	 */
	onbeforestartscroll : function(evt){this.focus(evt.index);},//onbeforestartscroll不能开放给用户使用,不能使用addEventListener注册
	/**
	 * 翻到上一个item
	 * @param
	 * @return void
	 */
	prev : function(){this._gotoItem("prev")},
	/**
	 * 翻到下一个item
	 * @param
	 * @return void
	 */
	next : function(){this._gotoItem("next");},
	/**
	 * 根据参数来决定是要滚动到下一个项还是上一个项
	 * @param {String} pos 方向：取值 prev:next
	 */
	_gotoItem : function(pos){
		var me = this, index, item;
		if("next" == pos){//如果是滚动到下一个
			if(me.scrollIndex >= me.totalCount - 1){
				index = me.isCycle ? 0 : me.totalCount - 1;
			}else{
				index = me.scrollIndex + 1;
			}
		}else{//如果是滚动到上一个
			if(me.scrollIndex <= 0){
				index = me.isCycle ? me.totalCount - 1 : 0;
			}else{
				index = me.scrollIndex - 1
			}
		}
		item = me.getItem(index);
		if(item){
			var position = item[me.axis[me.orientation].offsetPos] - me.getBody()[me.axis[me.orientation].scroll],
				offset = item[me.axis[me.orientation].offsetSize];
			if(position < 0 || position+offset > me.getBody()[me.axis[me.orientation].offsetSize]){//如果不在可视区
				me.scrollTo(index, ("prev" == pos ? 0 : me.pageSize - 1));
			}else{
				me.focus(index);
			}
			me.dispatchEvent(pos + "item");
		}
	}
});