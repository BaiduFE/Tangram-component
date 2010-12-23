/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:ui/carousel/Carousel.js
 * @author:linlingyu
 * @version:1.0.0
 * @date:2010-09-06
 */

///import baidu.dom.insertHTML;
///import baidu.dom.setStyles;
///import baidu.array.each;
///import baidu.dom.g;
///import baidu.dom.children;
///import baidu.dom.remove;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.lang.isNumber;
///import baidu.string.format;
///import baidu.ui.createUI;
///import baidu.ui.carousel;
/**
 * 跑马灯组件
 * @param {Object} opts :
 * {target : 存放carousel的容器,
 * 	contentText : 各个滚动的项，格式：[{content:"content-1"}, {content:"content-2"}],
 * 	orientation : 排列方式，取值：horizontal(默认), vertical,
 * 	flip : 滚动按钮方式，取值：item(一次滚动一个项), page(翻页滚动),
 * 	pageSize : 一行显示几个item，默认值3
 * 	isCycle : 是否循环滚动，默认值false
 * 	withButton : 是否显示翻转按钮
 * 	btnLabel : 按钮上的标签文字，格式，{prev:"prevPage", next:"nextPage"}
 * 	offsetWidth : 用户自定义的滚动宽度
 * 	offsetHeight : 用户自定义的滚动高度
 * 	onload : 初始化时的触发事件
 * 	onbeforescroll : 开始滚动时的触发事件
 * 	onafterscroll : 结束滚动时的触发事件
 * 	onprevitem : 当翻转到上一个滚动项时触发该事件
 * 	onnextitem : 当翻转到下一个滚动项时触发该事件
 * 	onprevpage : 当翻转到上一页时触发该事件
 * 	onnextpage : 当翻转到下一页时触发该事件
 * 	onitemclick : 点击某个滚动项时的触发事件
 * }
 */

baidu.ui.carousel.Carousel = baidu.ui.createUI(function(opts){
	this.contentText = opts.contentText || [];	//数组或对象在prototype中定义时会造成新建对象共用数据
}).extend({

	uiType : "carousel",		// ui控件的类型 **必须**
	orientation : "horizontal",	//横竖向的排列方式，取值horizontal,vertical
	pageSize : 3,				//每页显示多少个item

	scrollIndex : -1,			//当前焦点滚动到的项索引

	totalCount : 0,				//总记录数
	itemCount : 0,				//用于创建item的自增数
	offsetWidth : 0,			//单个item的宽度
	offsetHeight : 0,		//单个item的高度
	
	axis : {
		horizontal : {offsetPos : "offsetLeft", offsetSize : "offsetWidth", scroll : "scrollLeft"},
		vertical : {offsetPos : "offsetTop", offsetSize : "offsetHeight", scroll:"scrollTop"}
	},//关于位置的换算

	tplDOM : "<div id='#{id}' class='#{class}'>#{content}</div>",

	tplItem : "<div id='#{id}' class='#{class}' onclick=\"#{handler}\" onmouseover=\"#{mouseoverHandler}\" onmouseout=\"#{mouseoutHandler}\">#{content}</div>",
	
	/**
	 * 渲染carousel到指定的target容器中
	 * @param {html-element} target table的父层容器
	 * @memberOf {TypeName} 
	 */
	render : function(target){
		var me = this;
		baidu.dom.insertHTML(me.renderMain(target || me.target), "beforeEnd", me.getString());
		me.totalCount = me.contentText.length || 0;
		me._resize();
		me.dispatchEvent("onload");
	},
	
	/**
	 * 根据item的尺寸运算可视区域的大小和滚动层的大小
	 * @param {boolean} val true:第一次resize, false:一般的resize
	 */
	_resize : function(){
		var me = this,
			offset_x = me.axis[me.orientation].offsetSize,//由pageSize决定长度的一方
			offset_y = me.axis["horizontal"==me.orientation ? "vertical" : "horizontal"].offsetSize,//直接设置成item长度的一方
			item = me.getItem(0);
		if(item && (me.getBody()[offset_x] < me.pageSize * item[offset_x] || me.getBody()[offset_y] < item[offset_y])){
			me.offsetWidth = me.offsetWidth || item.offsetWidth;
			me.offsetHeight = me.offsetHeight || item.offsetHeight;
			//这里设置container的宽度和高度让用户可以看到一个按照pageSize和orientation计算出来的固定介面
			baidu.dom.setStyles(me.getBody(), {
				width : me.offsetWidth * ("horizontal" == me.orientation ? me.pageSize : 1) + "px",
				height : me.offsetHeight * ("vertical" == me.orientation ? me.pageSize : 1) + "px"
			});
		}
		//这里运算scrollContainer的宽度是为了让item都能展开排成一行
		if("horizontal" == me.orientation){
			baidu.setStyles(me.getScrollContainer(), {width : me.offsetWidth * me.totalCount + "px"});
		}
	},
	
	/**
	 * 生成滚动结构的html字符串代码
	 * @memberOf {TypeName} 
	 * @return {String} 生成html字符串
	 */
	getString : function(){
		var me = this, itemStr = [], scrollStr;
		baidu.array.each(me.contentText, function(item){
			itemStr.push(baidu.format(me.tplItem, {
				id : me.getId("item" + me.itemCount),//这里的编号只是一个识别符，不包含任何业务联系
				"class" : me.getClass("item"),
				handler : me.getCallString("focus", me.getId("item" + me.itemCount)),
				mouseoverHandler : me.getCallString("_onMouse", me.getId("item" + me.itemCount)),
				mouseoutHandler : me.getCallString("_onMouse",  me.getId("item" + me.itemCount++)),
				content : item.content
			}));
		});
		scrollStr = baidu.format(me.tplDOM, {
			id : me.getId("scroll"),
			"class" : me.getClass("scroll"),
			content : itemStr.join("")
		});
		return baidu.format(me.tplDOM, {
			id : me.getId(),
			"class" : me.getClass(),
			content : scrollStr
		});
	},
	
	/**
	 * 取得滚动容器
	 * @memberOf {TypeName} 
	 * @return {html-element} 
	 */
	getScrollContainer : function(){
		return baidu.g(this.getId("scroll"));
	},
	
	/**
	 * 取得参数索引值对应的item
	 * @param {Number} index 取item的索引
	 * @memberOf {TypeName} 
	 * @return {html-element} 返回该索引下的html对象
	 */

	getItem : function(index){
		return baidu.dom.children(this.getScrollContainer())[index];
	},
	
	/**
	 * 插入一个item到末端，当存在第二参数表示要在该索引对应的item之前插入
	 * @param {html-element} ele 需要插入的item，只取ele的内容
	 * @param {Number} index 在该索引指定的item前面插入
	 * @memberOf {TypeName} 
	 */

	addItem : function(ele, index) {

		var me = this,

			item = baidu.format(me.tplItem, {

				id : me.getId("item" + me.itemCount),

				"class" : me.getClass("item"),

				handler : me.getCallString("focus", me.getId("item" + me.itemCount)),
				mouseoverHandler : me.getCallString("_onMouse", 'over', me.getId("item" + me.itemCount)),
				mouseoutHandler : me.getCallString("_onMouse", 'out',  me.getId("item" + me.itemCount++)),

				content : ele.innerHTML

			});
		if(baidu.lang.isNumber(index)){

			baidu.dom.insertHTML(me.getItem(index), "beforeBegin", item);

			index <= me.scrollIndex && me.scrollIndex++;//当插入一个item，需要更新原来的scrollIndex

		}else{

			baidu.dom.insertHTML(me.getScrollContainer(), "beforeEnd", item);

		}
		me.totalCount++;

		//这里不重新设置会造成掉行

		me._resize();

	},
	

	/**

	 * 

	 * @param Number:index 被移除item的索引

	 * @return htmlElement:被移除的html

	 */
	/**
	 * 移除一个item
	 * @param {Number} index 需移除的item的索引
	 * @memberOf {TypeName} 
	 * @return {html-element} 被移除的项
	 */

	removeItem : function(index) {

		var me = this,

			item = me.getItem(index);

		if(item){

			baidu.dom.remove(item.id);

			me.scrollIndex = (index == me.scrollIndex) ? 0 : (index<me.scrollIndex ? me.scrollIndex-1 : me.scrollIndex);

			me.totalCount--;
//			if("horizontal" == me.orientation){
//				baidu.setStyles(me.getScrollContainer(), {width : me.getScrollContainer().offsetWidth - me.offsetWidth + "px"});
//			}
			me._resize();

		}
		return item;

	},
	
	/**
	 * 滚动到索引指定的item
	 * @param {Number} index 目标索引
	 * @param {Number} scrollOffset 把item滚动到的位置，取值(0-pageSize)
	 * @memberOf {TypeName} 
	 */

	scrollTo : function(index, scrollOffset) {

		var me = this,
			scrollOffset = scrollOffset || 0;
		if(me.dispatchEvent("onbeforescroll", {index : index, scrollOffset : scrollOffset})){
			me._scrollTo(index, scrollOffset);
		}

	},
	
	/**
	 * 直接滚动到索引指定的item(无动画效果)
	 * @param {Number} index 目标索引
	 * @param {Number} scrollOffset 把item滚动到的位置，定义域(0, pageSize-1)
	 * @memberOf {TypeName} 
	 */

	_scrollTo : function(index, scrollOffset) {

		var me = this,
			scrollOffset = scrollOffset || 0,

			item = me.getItem(index);

		if(item){
			me.dispatchEvent("onbeforestartscroll", {index : index, scrollOffset : scrollOffset});
			me.getBody()[me.axis[me.orientation].scroll] = me[me.axis[me.orientation].offsetSize] * (index - scrollOffset);
			me.dispatchEvent("onafterscroll", {index : index, scrollOffset : scrollOffset});
		}
	},
	
	/**
	 * 设置索引对应的item的焦点
	 * @param {Number} index 目标索引
	 * @memberOf {TypeName} 
	 */

	focus : function(index) {

		var me = this, item;

		me.dispatchEvent("onitemclick");

		//这里当index是传入id时转换成索引

		if("string" == typeof(index)){

			baidu.array.each(baidu.dom.children(me.getScrollContainer()), function(item, i){

				if(index == item.id){

					index = i;

					return;

				}

			});

		}

		item = me.getItem(index);

		if(item && me.scrollIndex != index){

			me._blur();

			baidu.dom.addClass(item, me.getClass("item-focus"));

			me.scrollIndex = index;

		}

	},
	
	/**
	 * 失去焦点
	 * @memberOf {TypeName} 
	 */

	_blur : function() {

		var me = this,

			item = me.getItem(me.scrollIndex);

		if(item){

			baidu.dom.removeClass(item, me.getClass("item-focus"));

			me.scrollIndex = -1;

		}

	},
	/**
	 * 控件单个项的鼠标移入或移出的样式
	 * @param {String} type 事件类型
	 * @param {Number} index 目标id
	 */
	_onMouse : function(type, rsid){
		this.dispatchEvent("mouse" + type, {target : baidu.g(rsid)});
	},
	
	/**
	 * 销毁实例
	 */
	dispose : function(){
		var me = this;
        me.dispatchEvent("dispose");
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
	}

});
