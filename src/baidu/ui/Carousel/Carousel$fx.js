/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */
///import baidu.ui.Carousel;
///import baidu.lang.isFunction;
///import baidu.fx.scrollTo;
///import baidu.fx.current;
///import baidu.object.extend;
/**
 * 为滚动组件增加动画滚动功能
 * @param {Object} options config参数.
 * @config {Boolean} enableFx 是否支持动画插件
 * @config {Function} scrollFx 描述组件的动画执行过程，默认是baidu.fx.scrollTo
 * @config {Object} scrollFxOptions 执行动画过程所需要的参数
 * @config {Function} onbeforestartscroll 当开始执行动画时触发该事件，该事件的event参数中可以得到四个属性：index:当前需要滚动的索引, scrollOffset:滚动到可视区域的位置, direction:滚动方向, scrollUnit:需要滚动过多少个项
 * @author linlingyu
 */
baidu.ui.Carousel.register(function(me) {
    if (!me.enableFx) {return;}
    me.addEventListener('onbeforescroll', function(evt) {
        if (baidu.fx.current(me.getBody())) {return;}
        var is = evt.direction == 'prev',
            axis = me._axis[me.orientation],
            orie = me.orientation == 'horizontal',
            val = me.getBody()[axis.scrollPos] + evt.scrollUnit * me[axis.vector].offset * (is ? -1 : 1);
        me.scrollFxOptions = baidu.object.extend(me.scrollFxOptions, {
            carousel: me,
            index: evt.index,
            scrollOffset: evt.scrollOffset,
            direction: evt.direction,
            scrollUnit: evt.scrollUnit
        });
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
        onbeforestart: function(evt) {
            var timeLine = evt.target;
            evt.target.carousel.dispatchEvent('onbeforestartscroll', {
                index: timeLine.index,
                scrollOffset: timeLine.scrollOffset,
                direction: timeLine.direction,
                scrollUnit: timeLine.scrollUnit
            });
        },
        
        onafterfinish: function(evt) {
            var timeLine = evt.target;
            timeLine.carousel.dispatchEvent('onbeforeendscroll', {
                index: timeLine.index,
                scrollOffset: timeLine.scrollOffset,
                direction: timeLine.direction,
                scrollUnit: timeLine.scrollUnit
            });
            timeLine.carousel.dispatchEvent('onafterscroll', {
                index: timeLine.index,
                scrollOffset: timeLine.scrollOffset,
                direction: timeLine.direction,
                scrollUnit: timeLine.scrollUnit
            });
        }
    }
});
