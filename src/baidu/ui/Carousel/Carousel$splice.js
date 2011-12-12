/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Carousel;
///import baidu.dom.children;
///import baidu.array.indexOf;
///import baidu.array.find;
///import baidu.array.each;
///import baidu.lang.guid;
///import baidu.lang.isNumber;
///import baidu.event.un;

/**
 * 为滚动组件提供动态增加或是删减滚动项功能
 * @name baidu.ui.Carousel.Carousel$splice
 * @addon baidu.ui.Carousel
 */
baidu.ui.Carousel.extend(
/**
 *  @lends baidu.ui.Carousel.prototype
 */
{
    /**
     * 增加一个滚动项
     * @param {String} content 需要插入项的字符内容
     * @param {Number} index 插入位置
     * @private
     */
    _addText: function(content, index){
        var me = this,
            child = baidu.dom.children(me.getScrollContainer()),
            index = Math.min(Math.max(baidu.lang.isNumber(index) ? index : me._dataList.length, 0), me._dataList.length),
            item = me.getItem(me.scrollIndex),
            firstIndex = baidu.array.indexOf(me._itemIds, child[0].id),
            newIndex;
        
        me._dataList.splice(index, 0, {content: content});
        me._itemIds.splice(index, 0, baidu.lang.guid());
        index <= me.scrollIndex && me.scrollIndex++;
        //
        newIndex = item ? me.scrollIndex : baidu.array.indexOf(me._itemIds, child[0].id);
        index >= firstIndex && index <= firstIndex + me.pageSize - 1
            && me._renderItems(newIndex, baidu.array.indexOf(child, me.getItem(newIndex)));
    },
        /**
     * 移除索引指定的某一项
     * @param {Number} index 要移除项的索引
     * @return {HTMLElement} 当移除项存在于页面时返回该节点
     * @private
     */
    _removeItem: function(index){
        if(!baidu.lang.isNumber(index) || index < 0
            || index > this._dataList.length - 1){return;}
        var me = this,
            removeItem = me.getItem(index),
            currItem = me.getItem(me.scrollIndex),
            itemId = me._itemIds[index],
            item = me._items[itemId],
            child = baidu.dom.children(me.getScrollContainer()),
            currIndex = me.scrollIndex,
            newIndex,
            scrollOffset;
        item && baidu.array.each(item.handler, function(listener){
            baidu.event.un(item.element, listener.evtName, listener.handler);
        });
        delete me._items[itemId];
        me._dataList.splice(index, 1);
        me._itemIds.splice(index, 1);
        (me.scrollIndex > me._dataList.length - 1
            || me.scrollIndex > index) && me.scrollIndex--;
        if(removeItem){
            index == currIndex && me.focus(me.scrollIndex);
            newIndex = currItem ? me.scrollIndex : baidu.array.indexOf(me._itemIds,
                baidu.array.find(child, function(item){return item.id != itemId;}).id);
            scrollOffset = baidu.array.indexOf(child, me.getItem(newIndex));
            index <= newIndex && newIndex < me.pageSize && scrollOffset--;
            me._renderItems(newIndex, scrollOffset);
        }
        return removeItem;
    },
    /**
     * 将一个字符串的内容插入到索引指定的位置
	 * @name baidu.ui.Carousel.Carousel$splice.addText
	 * @addon baidu.ui.Carousel.Carousel$splice
	 * @function 
     * @param {String} content 需要插入项的字符内容
     * @param {Number} index 插入位置
     */
    addText: function(content, index){
        var me = this;
        me._addText(content, index);
        me.dispatchEvent('onaddtext', {index: index});
    },
    /**
     * 将一个element项的内容插入到索引指定的位置
	 * @name baidu.ui.Carousel.Carousel$splice.addItem
	 * @addon baidu.ui.Carousel.Carousel$splice
	 * @function 
     * @param {HTMLElement} element 需要插入项的元素
     * @param {Number} index 插入位置
     */
    addItem: function(element, index){
        var me = this;
        me._addText(element.innerHTML, index);
        me.dispatchEvent('onadditem', {index: index});
    },
    /**
     * 移除索引指定的某一项
	 * @name baidu.ui.Carousel.Carousel$splice.removeItem
	 * @addon baidu.ui.Carousel.Carousel$splice
	 * @function 
     * @param {Number} index 要移除项的索引
     * @return {HTMLElement} 当移除项存在于页面时返回该节点
     */
    removeItem: function(index){
        var me = this,
            item = me._removeItem(index);
        me.dispatchEvent('onremoveitem', {index: index});
        return item;
    }
});
