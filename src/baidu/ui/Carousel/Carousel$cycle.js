/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */
///import baidu.ui.Carousel;
///import baidu.dom.g;
///import baidu.dom.create;
///import baidu.array.indexOf;
///import baidu.dom.children;
/**
 * 为滚动组件增加无限循环滚动功能
 * @name baidu.ui.Carousel.Carousel$cycle
 * @addon baidu.ui.Carousel
 * @param {Object} options config参数.
 * @config {Boolean} isCycle 是否支持循环滚动，默认支持
 * @author linlingyu
 */
baidu.ui.Carousel.register(function(me) {
    if (!me.isCycle) {return;}
    me._itemsPool = {};//重复项的缓存
    /**
     * 对core方法重写
     * @private
     */
    me._getItemElement = function(index) {//不覆盖prototype链上的方法
        var me = this,
            count = me._dataList.length,
            index = (index + count) % count,
            itemId = me._itemIds[index],
            entry = baidu.dom.g(itemId) ? me._itemsPool[itemId + '-buff']
                : me._baseItemElement(index);
        if (!entry) {//如果entry还未存在于buff中
            entry = me._itemsPool[itemId + '-buff'] = {
                element: baidu.dom.create('div', {
                    id: itemId + '-buff',
                    'class': me.getClass('item')
                }),
                content : me._dataList[index].content,
                setContent: function(){
                    this.content && (this.element.innerHTML = this.content);
                    this.content && (delete this.content);
                }
            };
        }
        return entry;
    }
    /**
     * 对core方法重写
     * @private
     */
    me._getFlipIndex = function(type) {
        var me = this,
            is = me.flip == 'item',
            type = type == 'prev',
            currIndex = me.scrollIndex,
            index = currIndex + (is ? 1 : me.pageSize) * (type ? -1 : 1),
            offset = is ? (type ? 0 : me.pageSize - 1)
                : baidu.array.indexOf(baidu.dom.children(me.getScrollContainer()), me.getItem(currIndex)),
            count = me._dataList.length;
        return {index: (index + count) % count, scrollOffset: offset};
    }

    me.addEventListener('onremoveitem', function(evt) {
        delete this._itemsPool[evt.id + '-buff'];
    });
});
baidu.ui.Carousel.prototype.isCycle = true;
