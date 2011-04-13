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

/**
 * carousel滚动控件。
 * @class carousel类
 * @param  {Object}   [options]           carousel的参数选项
 * @config {HTMLElement}   target              存放控件的元素
 * @config {Array}    contentText         用于生成滚动的条目
 * @config {String}   orientation         排列方式，取值：horizontal（默认），vertical。
 * @config {String}   flip                滚动按钮方式，取值：item（一次滚动一个项），page（翻页滚动）。
 * @config {Number}   pageSize            一行显示几个item，默认值3。
 * @config {Boolean}  isCycle             是否循环滚动，默认值false。
 * @config {Boolean}  autoScroll          是否自动滚动。
 * @config {Boolean}  showButton          是否显示翻转按钮，默认值true。
 * @config {Number}   offsetWidth         用户自定义的滚动宽度
 * @config {Number}   offsetHeight        用户自定义的滚动高度
 * @config {Function} onload              初始化时的触发事件
 * @config {Function} onbeforescroll      开始滚动时的触发事件
 * @config {Function} onafterscroll       结束滚动时的触发事件
 * @config {Function} onprevitem          当跳到上一个滚动项时触发该事件
 * @config {Function} onnextitem          当跳到下一个滚动项时触发该事件
 * @config {Function} onprevpage          当跳到上一页时触发该事件
 * @config {Function} onnextPage          当跳到下一页时触发该事件
 * @config {Function} onitemclick         点击某个滚动项时的触发事件
 * @config {Function} onmouseover         当鼠标悬停在某个滚动项时的触发事件
 * @config {Function} onmouseout          当鼠标移开某个滚动项时的触发事件
 * @plugin autoScroll                     自动滚动
 * @plugin btn                            为跑马灯添加控制按钮插件
 * @plugin fx                             为跑马灯添加动画效果
 * @plugin scrollByItem                   单次滚动单个元素的模式
 * @plugin scrollByPage                   单次滚动一页的模式
 * @plugin table                          让跑马灯支持多行多列
 */

baidu.ui.Carousel = baidu.ui.createUI(
    
    function(opts){
    this.contentText = opts.contentText || [];  //数组或对象在prototype中定义时会造成新建对象共用数据
}).extend(
    /**
     *  @lends baidu.ui.carousel.Carousel.prototype
     */
{
    
    uiType : "carousel",        // ui控件的类型 **必须**
    orientation : "horizontal", //横竖向的排列方式，取值horizontal,vertical
    pageSize : 3,               //每页显示多少个item

    scrollIndex : -1,           //当前焦点滚动到的项索引

    totalCount : 0,             //总记录数
    itemCount : 0,              //用于创建item的自增数
    offsetWidth : 0,            //单个item的宽度
    offsetHeight : 0,       //单个item的高度
    
    axis : {
        horizontal : {offsetPos : "offsetLeft", offsetSize : "offsetWidth", scroll : "scrollLeft"},
        vertical : {offsetPos : "offsetTop", offsetSize : "offsetHeight", scroll:"scrollTop"}
    },//关于位置的换算

    tplDOM : "<div id='#{id}' class='#{class}'>#{content}</div>",

    tplItem : "<div id='#{id}' class='#{class}' onclick=\"#{handler}\" onmouseover=\"#{mouseoverHandler}\" onmouseout=\"#{mouseoutHandler}\">#{content}</div>",
    
    /**
     * 渲染carousel到指定的target容器中
     * @public
     * @param {HTMLElement} target table的父层容器
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
            offset_y = me.axis["horizontal" == me.orientation ? "vertical" : "horizontal"].offsetSize,//直接设置成item长度的一方
            item = me.getItem(0);
            
        me.offsetWidth = me.offsetWidth || item.offsetWidth;
        me.offsetHeight = me.offsetHeight || item.offsetHeight;
        //这里设置container的宽度和高度让用户可以看到一个按照pageSize和orientation计算出来的固定介面
        baidu.dom.setStyles(me.getBody(), {
            width : me.offsetWidth * ("horizontal" == me.orientation ? me.pageSize : 1) + "px",
            height : me.offsetHeight * ("vertical" == me.orientation ? me.pageSize : 1) + "px"
        });
        //这里运算scrollContainer的宽度是为了让item都能展开排成一行
        if("horizontal" == me.orientation){
            baidu.setStyles(me.getScrollContainer(), {width : me.offsetWidth * me.totalCount + "px"});
        }
    },
    
    /**
     * 生成滚动结构的html字符串代码
     * @private
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
     * @return {HTMLElement}  滚动容器
     */
    getScrollContainer : function(){
        return baidu.g(this.getId("scroll"));
    },
    
    /**
     * 取得参数索引值对应的item
     * @param {Number} index 取item的索引
     * @return {HTMLElement} 返回该索引下的html对象
     */

    getItem : function(index){
        return baidu.dom.children(this.getScrollContainer())[index];
    },
    
    /**
     * 插入一个item到末端，当存在第二参数表示要在该索引对应的item之前插入
     * @param {HTMLElement} ele 需要插入的item，只取ele的innerHTML内容
     * @param {Number} index 在该索引指定的item前面插入
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
     * 移除一个item
     * @public
     * @param {Number} index 需移除的item的索引 
     * @return {HTMLElement} 被移除的项
     */

    removeItem : function(index) {

        var me = this,

            item = me.getItem(index);

        if(item){

            baidu.dom.remove(item.id);

            me.scrollIndex = (index == me.scrollIndex) ? 0 : (index<me.scrollIndex ? me.scrollIndex-1 : me.scrollIndex);

            me.totalCount--;
//          if("horizontal" == me.orientation){
//              baidu.setStyles(me.getScrollContainer(), {width : me.getScrollContainer().offsetWidth - me.offsetWidth + "px"});
//          }
            me._resize();

        }
        return item;

    },
    
    /**
     * 滚动到索引指定的item
     * @public
     * @param {Number} index 目标索引
     * @param {Number} scrollOffset 把item滚动到的位置，取值(0-pageSize)
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
     */

    focus : function(index) {

        var me = this, item;

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
        
        me.dispatchEvent("onitemclick");

    },
    
    /**
     * 失去焦点
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
     * @param {Number} rsid 目标id
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