/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */
///import baidu.ui.Carousel;
///import baidu.dom.insertHTML;
///import baidu.string.format;
/**
 * 为滚动组件添加控制按钮插件
 * @name baidu.ui.Carousel.Carousel$btn
 * @addon baidu.ui.Carousel
 * @param {Object} options config参数.
 * @config {Boolean} showButton 是否显示按钮，默认显示
 * @config {Object} btnLabel 设置按钮的文字描述，参考值：{prev: 'left', next: 'right'}
 * @author linlingyu
 */
baidu.ui.Carousel.register(function(me) {
    if (!me.showButton) {return;}
    me.btnLabel = baidu.object.extend({prev: '&lt;', next: '&gt;'},
        me.btnLabel);
    me.addEventListener('onload', function() {
        baidu.dom.insertHTML(me.getMain(), 'afterBegin', baidu.string.format(me.tplBtn, {
            'class' : me.getClass('btn-base') + ' ' + me.getClass('btn-prev'),
            handler: me.getCallString('prev'),
            content: me.btnLabel.prev
        }));
        baidu.dom.insertHTML(me.getMain(), 'beforeEnd', baidu.string.format(me.tplBtn, {
            'class' : me.getClass('btn-base') + ' ' + me.getClass('btn-next'),
            handler: me.getCallString('next'),
            content: me.btnLabel.next
        }));
    });
});
//
baidu.object.extend(baidu.ui.Carousel.prototype, {
    showButton: true,//是否需要显示翻转按钮
    tplBtn: '<a class="#{class}" onclick="#{handler}" href="javascript:void(0);">#{content}</a>'
});
