/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Tooltip;
///import baidu.string.format;
///import baidu.dom.insertHTML;
///import baidu.ui.Button;

/**
 * 创建关闭按钮
 * @param {String} headContent  内容
 * @name  baidu.ui.Tooltip.Tooltip$close
 * @addon baidu.ui.Tooltip
 */
baidu.ui.Tooltip.extend({
    headContent: '',
    tplhead: '<div class="#{headClass}" id="#{id}">#{headContent}</div>'
});

baidu.ui.Tooltip.register(function(me) {
    me.addEventListener('onload', function() {
        var me = this,
            button;
        
        baidu.dom.insertHTML(me.getBody(), 'afterBegin', baidu.format(me.tplhead, {
            headClass: me.getClass('head'),
            id: me.getId('head')
        }));

        button = new baidu.ui.Button({
            content: me.headContent,
            onclick: function(){
                me.close();
            }
        });
        button.render(me.getId('head'));
    });
});
