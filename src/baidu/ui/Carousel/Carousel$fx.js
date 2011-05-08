/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Carousel;
///import baidu.lang.isFunction;
///import baidu.fx.scrollTo;
///import baidu.fx.current;

baidu.ui.Carousel.register(function(me){
    if(!me.enableFx){return;}
    me.addEventListener('onbeforescroll', function(evt){
        if(baidu.fx.current(me.getBody())){return;}
        var is = evt.direction == 'prev',
            axis = me._axis[me.orientation],
            orie = me.orientation == 'horizontal',
            val = me.getBody()[axis.scrollPos] + evt.distance * (is ? -1 : 1);
        me.scrollFxOptions = baidu.object.extend(me.scrollFxOptions, {
            carousel: me,
            index: evt.index,
            scrollOffset: evt.scrollOffset,
            direction: evt.direction
        });
        me.scrollFxOptions.carousel = me;
        baidu.lang.isFunction(me.scrollFx) && me.scrollFx(me.getBody(),
            {x: orie ? val : 0, y: orie ? 0 : val}, me.scrollFxOptions);
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
            var timeLine = evt.target;
            evt.target.carousel.dispatchEvent('onbeforestartscroll', {
                index: timeLine.index,
                scrollOffset: timeLine.scrollOffset,
                direction: timeLine.direction
            });
        },
        
        onafterfinish: function(evt){
            var timeLine = evt.target;
            timeLine.carousel.dispatchEvent('onafterscroll', {
                index: timeLine.index,
                scrollOffset: timeLine.scrollOffset,
                direction: timeLine.direction
            });
        }
    }
});