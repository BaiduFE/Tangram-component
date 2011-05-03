/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.fx.current;
///import baidu.fx.scrollTo;
///import baidu.array.indexOf;
///import baidu.dom.children;
///import baidu.lang.isFunction;

baidu.ui.Carousel.register(function(me){
    //实现思路：两种情况：
    //<a>当index项存在于buff，移动之前动态运算需要移动N个单位，先插入N个item到容器中
    //<b>当index项不存于buff，运算滚动方向前虚拟移动pageSize个单位
    //移动完成后使用renderItems重新归位
    if(!me.enableFx){return;}
    me.addEventListener('onbeforescroll', function(evt){
        if(baidu.fx.current(me.getBody())){return;}
        //滚动前需要运算出array(需要添加的总数item-id), direction(滚动方向)
        var axis = me._axis[me.orientation],
            orie = me.orientation == 'horizontal',
            child = baidu.dom.children(me.getScrollContainer()),
            item = me.getItem(evt.index),
            itemIndex = item ? baidu.array.indexOf(child, item) : -1,
            direction = item ? itemIndex - evt.scrollOffset - me.pageSize : me.pageSize,
            array = [],
            count = Math.abs(direction),
            i = 0,
            currItem,
            val;
        for(; i < count; i++){
            if(item){
                array.push(direction < 0 ? evt.index - itemIndex - count + i
                    : child.length - itemIndex + evt.index + i);
            }else{
                itemIndex = evt.index - evt.scrollOffset + i;
                currItem = me.getItem(itemIndex);
                currItem && direction--;
                !currItem && array.push(itemIndex);
            }
        }
        !item && (direction = (direction + me.pageSize)
            * (baidu.array.indexOf(me._itemIds, child[me.pageSize].id)
                > evt.index ? -1 : 1));
        val = me.getBody()[axis.scrollPos] + me[axis.offset] * direction;
        me.scrollFxOptions = baidu.object.extend(me.scrollFxOptions, {
            carousel: me,
            items: array,
            index: evt.index,
            scrollOffset: evt.scrollOffset,
            direction: direction
        });
        baidu.lang.isFunction(me.scrollFx)
            && me.scrollFx(me.getBody(),
                {x: orie ? val : 0, y: orie ? 0 : val},
                me.scrollFxOptions);
        evt.returnValue = false;
    });
});
//
baidu.ui.Carousel.extend({
    enableFx: true,
    scrollFx: baidu.fx.scrollTo,
    scrollFxOptions: {
        duration: 500,
        onbeforestart: function(evt){
            var timeLine = evt.target,
                me = timeLine.carousel,
                axis = me._axis[me.orientation],
                is = timeLine.direction < 0,
                sContainer = me.getScrollContainer(),
                fragment = document.createDocumentFragment(),
                array = timeLine.items,
                count = array.length,
                i = 0;
            for(; i < count; i++){
                fragment.appendChild(me._getItemElement(array[i]));
            }
            is ? sContainer.insertBefore(fragment, sContainer.firstChild)
                : sContainer.appendChild(fragment);
            me.orientation == 'horizontal'
                && (sContainer.style[axis.size] = parseInt(sContainer.style[axis.size])
                    + count * me[axis.offset] + 'px');
            is && (me.getBody()[axis.scrollPos] += count * me[axis.offset]);
            me.dispatchEvent('onbeforestartscroll', {
                index: timeLine.index,
                scrollOffset: timeLine.scrollOffset
            });
        },
        onafterfinish: function(evt){
            var timeLine = evt.target,
                me = timeLine.carousel,
                axis = me._axis[me.orientation],
                sContainer = me.getScrollContainer();
            me.orientation == 'horizontal'
                && (sContainer.style[axis.size] = parseInt(sContainer.style[axis.size])
                    - timeLine.items.length * me[axis.offset] + 'px');
            me._renderItems(timeLine.index, timeLine.scrollOffset);
            me._moveCenter();
            me.dispatchEvent('onafterscroll', {
                index: timeLine.index,
                scrollOffset: timeLine.scrollOffset
            });
        }
    }
});