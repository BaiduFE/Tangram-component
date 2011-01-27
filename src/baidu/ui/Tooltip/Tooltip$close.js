/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/Tooltip/Tooltip$close.js
 * author: walter
 * version: 1.0.0
 * date: 2011-1-26
 */

///import baidu.ui.Tooltip;
///import baidu.string.format;
///import baidu.dom.insertHTML;

/**
 * 创建关闭按钮
 */
baidu.ui.Tooltip.extend({
    /**
     * 标题内容
     * @param {String} [options.headContent]
     */
    headContent: '',
    tplhead:'<div class="#{headClass}">#{headContent}<div class="#{closeClass}" onclick="#{close}"></div></div>'
});

baidu.ui.Tooltip.register(function(me){
    me.addEventListener('onupdate', function(){
        var me = this;
        baidu.dom.insertHTML(me.getBody(), 'afterBegin', baidu.format(me.tplhead,{
            headClass: me.getClass('head'),
            headContent: me.headContent,
            closeClass: me.getClass('close'),
            close: me.getCallString('close')
        }));
    });
});
