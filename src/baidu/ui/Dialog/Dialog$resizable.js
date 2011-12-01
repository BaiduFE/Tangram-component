/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Dialog;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.ui.behavior.resizable;

/**
 * 为Dialog添加缩放功能
 * @name baidu.ui.Dialog.Dialog$resizable
 * @addon baidu.ui.Dialog
 * @param {Number} minWidth 可选，最小宽度.
 * @param {Number} minHeight 可选，最小高度.
 * @param {Boolean} resizable 可选，是否启用resizable.
 * @param {Array} direction 可选，允许resize的方向，默认为["s","e","se"]3方向
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
            main,
            contentWidth, contentHeight,
            bodyWidth,bodyHeight;

        function getValue(){
            bodyWidth = body.offsetWidth;
            bodyHeight = body.offsetHeight;

            contentWidth = content.offsetWidth;
            contentHeight = content.offsetHeight;
        }

        /**
         * 注册onload事件
         * 创建resizeable handle
         */
        me.addEventListener('onload', function() {
            body = me.getBody();
            main = me.getMain();
            content = me.getContent();
            getValue();

            me.resizeCreate({target: main, classPrefix: me.classPrefix});
        });

        /**
         * 注册onresize事件
         * 当事件触发时设置content和body的OuterSize
         */
        me.addEventListener('onresize', function(styles) {
            baidu.dom.setOuterWidth(content, contentWidth + styles.current.width - styles.original.width);
            baidu.dom.setOuterHeight(content, contentHeight + styles.current.height - styles.original.height);
            
            baidu.dom.setOuterWidth(body, bodyWidth + styles.current.width - styles.original.width);
            baidu.dom.setOuterHeight(body, bodyHeight + styles.current.height - styles.original.height);
            
            me.coverable && me.Coverable_update();
        });

        /**
         * 注册onresizeend事件
         * 当事件触发时设置变量值
         */
        me.addEventListener('onresizeend', function() {
            getValue();
            me.width = contentWidth;
            me.height = contentHeight;

            baidu.setStyles(main,{height:"",width:""});
        });

        /**
         * 注册onupdate事件
         * 当事件触发时更新resizeHandle
         */
        me.addEventListener('onupdate',function() {
            getValue();
            me.resizeUpdate();
        });

        /**
         * 注册onopen事件
         * 当事件触发时更新resizeHandle
         */
        me.addEventListener('onopen',function() {
            getValue();
            me.resizeUpdate();
        });
    }
});

