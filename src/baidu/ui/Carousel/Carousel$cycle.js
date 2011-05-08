/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */
///import baidu.ui.Carousel;
///import baidu.dom.create;
baidu.ui.Carousel.register(function(me){
    if(!me.isCycle){return;}
    me.itemsBuff = {};
    me._getItemElement = function(index){//不覆盖prototype链上的方法
        var me = this,
            count = me._datas.length,
            index = (index + count) % count,
            itemId = me._itemIds[index],
            item = baidu.dom.g(itemId),
            element;
        if(item){//如果item已经存在于页面，则从buff中取另一个
            element = me.itemsBuff[itemId + '-buff'];
            if(!element){
                element = baidu.dom.create('div', {
                    id: itemId + '-buff',
                    'class': me.getClass('item')
                });
                element.innerHTML = me._datas[index].content;
                me.itemsBuff[itemId + '-buff'] = element;
            }
        }else{
            element = me._baseItemElement(index);
        }
        return element;
    }
    /**
     * 
     */
    me._getFlipIndex = function(type){
        var me = this,
            is = me.flip == 'item',
            type = type == 'prev',
            currIndex = me.scrollIndex,
            index = me.scrollIndex + (is ? 1 : me.pageSize) * (type ? -1 : 1),
            item = !is && me.getItem(me.scrollIndex),
            offset = is ? (type ? 0 : me.pageSize - 1)
                : baidu.array.indexOf(baidu.dom.children(me.getScrollContainer()), item),
            count = me._datas.length;
        return {index: (index + count) % count, scrollOffset: offset};
    }
});

baidu.ui.Carousel.extend({
    isCycle: true
});