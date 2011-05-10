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
 * @param {Object} options config参数
 * @config {Boolean} isCycle 是否支持循环滚动，默认支持
 * @author linlingyu
 */
baidu.ui.Carousel.register(function(me){
    if(!me.isCycle){return;}
    me._itemsBuff = {};//重复项的缓存
    /**
     * 对core方法重写
     * @private
     */
    me._getItemElement = function(index){//不覆盖prototype链上的方法
        var me = this,
            count = me._datas.length,
            index = (index + count) % count,
            itemId = me._itemIds[index],
            item = baidu.dom.g(itemId),
            element;
        if(item){//如果item已经存在于页面，则从buff中取另一个
            element = me._itemsBuff[itemId + '-buff'];
            if(!element){
                element = baidu.dom.create('div', {
                    id: itemId + '-buff',
                    'class': me.getClass('item')
                });
                element.innerHTML = me._datas[index].content;
                me._itemsBuff[itemId + '-buff'] = element;
            }
        }else{
            element = me._baseItemElement(index);
        }
        return element;
    }
    /**
     * 对core方法重写
     * @private
     */
    me._getFlipIndex = function(type){
        var me = this,
            is = me.flip == 'item',
            type = type == 'prev',
            currIndex = me.scrollIndex,
            index = currIndex + (is ? 1 : me.pageSize) * (type ? -1 : 1),
            offset = is ? (type ? 0 : me.pageSize - 1)
                : baidu.array.indexOf(baidu.dom.children(me.getScrollContainer()), me.getItem(currIndex)),
            count = me._datas.length;
        return {index: (index + count) % count, scrollOffset: offset};
    }
    
    me.addEventListener('onremoveitem', function(evt){
        delete this._itemsBuff[evt.id + '-buff'];
    });
});
baidu.ui.Carousel.prototype.isCycle = true;