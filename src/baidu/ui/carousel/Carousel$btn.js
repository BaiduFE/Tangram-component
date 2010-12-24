/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:ui/carousel/Carousel$btn.js
 * @author:linlingyu
 * @version:1.0.0
 * @date:2010-09-06
 */

///import baidu.dom.insertHTML;
///import baidu.string.format;
///import baidu.ui.carousel.Carousel;

/** 
 * 是否需要显示翻转按钮
 * @type {boolean}
 */
baidu.ui.carousel.Carousel.prototype.showButton = true; 

/** 
 * 翻转方式 item表示每次以一个项滚动，page表示一次翻动一页
 * @type {string}
 */
baidu.ui.carousel.Carousel.prototype.flip = 'item';

/**
 * FIXME href='javascript:void(0)'IE某些情况下会有问题，改成别的
 * @type {string}
 */
baidu.ui.carousel.Carousel.prototype.tplBtn = 
    "<a class='#{class}' onclick=\"#{handler}\" href='javascript:void(0);'>#{content}</a>";
/**
 * 为跑马灯添加控制按钮插件
 */
baidu.ui.carousel.Carousel.register(function(me) {
    me.btnLabel = me.btnLabel || {prev: '&lt;', next: '&gt;'};
    if (me.showButton) {
        me.addEventListener('onload', function() {
            baidu.dom.insertHTML(me.getMain(), 'afterBegin', baidu.format(me.tplBtn, {
                'class' : me.getClass('btn-base') + ' ' + me.getClass('btn-prev'),
                handler: me.getCallString('page' == me.flip ? 'prevPage' : 'prev'),
                content: me.btnLabel.prev
            }));
      
            baidu.dom.insertHTML(me.getMain(), 'beforeEnd', baidu.format(me.tplBtn, {
                'class' : me.getClass('btn-base') + ' ' + me.getClass('btn-next'),
                handler: me.getCallString('page' == me.flip ? 'nextPage' : 'next'),
                content: me.btnLabel.next
            }));
        });
    }
});
