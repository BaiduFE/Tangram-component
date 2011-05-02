/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.fx.current;
///import baidu.fx.scrollTo;
///import baidu.array.indexOf;

baidu.ui.Carousel.register(function(me){
    if(!me.enableFx){return;}
    me.addEventListener('onbeforescroll', function(evt){
        if(baidu.fx.current(me.getBody())){return;}
        
//        var item = me.getItem(evt.index),
//            axis = me._axis[me.orientation],
//            sContainer = me.getScrollContainer(),
//            child = baidu.dom.children(sContainer),
//            itemIndex = baidu.array.indexOf(child, item),
//            count = Math.abs(me._recruitCount = itemIndex - evt.scrollOffset - me.pageSize),
//            i = 0,
//            element;
//        //{start
//        for(; i < count; i++){
//            element = me._recruitCount > 0 ? me._getItemElement(child.length - itemIndex + evt.index + i)
//                : me._getItemElement(evt.index - itemIndex - i - 1);
//            sContainer.style[axis.size] = parseInt(sContainer.style[axis.size])
//                + me[axis.offset] + 'px';
//            //scrollLeft | scrollTop?
//            me._recruitCount > 0 ? sContainer.appendChild(element)
//                : sContainer.insertBefore(element, sContainer.firstChild);
//        }
//        //start}
//        me.getBody()[axis.scrollPos] += me._recruitCount * me[axis.offset];
//        //{end
//        for(i = 0; i < count; i++){
//            baidu.dom.remove(sContainer[me._recruitCount > 0 ? 'firstChild' : 'lastChild'] );
//        }
//        me._moveCenter();
//        //end}
        
        var direction = evt.direction,
            orie = me.orientation == 'horizontal',
            axis = me._axis[me.orientation],
            body = me.getBody(),
            sContainer = me.getScrollContainer(),
            fragment = document.createDocumentFragment(),
            count = me.pageSize * 3,
            i = 0,
            is;
        !direction && (direction = baidu.array.indexOf(//这个循环会随着项的增加而增加循环时间
            me._itemIds,
            baidu.dom.children(sContainer)[me.pageSize].id
        ) > evt.index ? 'prev' : 'next');
        
        
        
        
        is = direction == 'prev';
        for(; i < count; i++){
            fragment.appendChild(me._getItemElement(evt.index
                - me.pageSize
                - evt.scrollOffset + i));
        }
        sContainer.style[axis.size] = parseInt(sContainer.style[axis.size])
            + me.pageSize * 3 * me[axis.offset] + 'px';
        is ? sContainer.insertBefore(fragment, sContainer.firstChild)
            : sContainer.appendChild(fragment);
        body[axis.scrollPos] += is ? me.pageSize * 3 * me[axis.offset] : 0;
//        baidu.fx.scrollTo(me.getBody(),
//            {x: orie ? val : 0, y: orie? 0 : val},
//            {});
        body[axis.scrollPos] = body[axis.scrollPos] + me.pageSize * 3 * me[axis.offset] * (is ? -1 : 1);
        for(i = 0; i < count; i++){
            baidu.dom.remove(sContainer[is ? 'lastChild' : 'firstChild']);
        }
        me._moveCenter();
        evt.returnValue = false;
    });
});
baidu.ui.Carousel.extend({
    enableFx: true,
    scrollFx: baidu.fx.scrollTo,
    scrollFxOptions: {
        duration: 500,
        onbeforestart: function(){
            alert(me._recruitCount)
        },
        onafterfinish: function(){
            
        }
    }
});