/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Dialog;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.dom.resizable;
///import baidu.ui.behavior.resizable;

/**
 * 为Dialog添加缩放功能
 * 可选参数
 * @param {Number} minWidth 最小宽度.
 * @param {Number} minHeight 最小高度.
 * @param {Boolean} resizable 是否启用resizable.
 * @direction {Array} direction 可已经resize的方向，默认为["s","e","se"]3方向
 */
baidu.extend(baidu.ui.Dialog.prototype, {
    resizable: true,
    minWidth: 100,
    minHeight: 100,
    direction: ['s', 'e', 'se']
});
baidu.ui.Dialog.register(function(me) {
    if (me.resizable) {
        var body,
            content,
            contentWidth, contentHeight,
            bodyWidth, bodyHeight;

        me.addEventListener('onload', function() {
            body = me.getBody();
            content = me.getContent();
            main = me.getMain();
            contentWidth = content.offsetWidth;
            contentHeight = content.offsetHeight;
            bodyWidth = body.offsetWidth;
            bodyHeight = body.offsetHeight;

            me.resizeUpdate({target: main, classPrefix: me.classPrefix});
        });

        me.addEventListener('onresize', function(styles) {
            baidu.dom.setOuterWidth(content, contentWidth + styles.current.width - styles.original.width);
            baidu.dom.setOuterHeight(content, contentHeight + styles.current.height - styles.original.height);

            baidu.dom.setOuterWidth(body, bodyWidth + styles.current.width - styles.original.width);
            baidu.dom.setOuterHeight(body, bodyHeight + styles.current.height - styles.original.height);
        });

        me.addEventListener('onresizeend', function() {
            me.width = contentWidth = content.offsetWidth;
            me.height = contentHeight = content.offsetHeight;

            bodyWidth = body.offsetWidth;
            bodyHeight = body.offsetHeight;
        });
    }
});

