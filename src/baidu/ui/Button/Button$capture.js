/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Button;
///import baidu.fn.bind;
///import baidu.dom.contains;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.event.getTarget;

/**
 * 使按钮支持capture，实现在按钮上点击并保持鼠标按着状态拖离鼠标，请在构造函数的options中定义capture参数为true来激活该状态
 * @name baidu.ui.button.Button$capture
 * @function
 * @grammar baidu.ui.button.create(options)
 * @param {Object} options 创建scrollBar的自定义参数.
 * @param {Boolean} options.capture 当为true时表示需要使按钮是一个capture的按钮.
 * @author linlingyu
 */
baidu.ui.Button.register(function(me) {
    if (!me.capture) {return;}
    me.addEventListener('load', function() {
        var body = me.getBody(),
            onMouseOut = body.onmouseout,
            mouseUpHandler = baidu.fn.bind(function(evt) {
                var target = baidu.event.getTarget(evt);
                if (target != body
                        && !baidu.dom.contains(body, target)
                        && me.getState()['press']) {
                    onMouseOut();
                }
            }),
            mouseOutHandler = function() {
                if (!me.getState()['press']) {
                    onMouseOut();
                }
            };
        body.onmouseout = null;
        baidu.event.on(body, 'mouseout', mouseOutHandler);
        baidu.event.on(document, 'mouseup', mouseUpHandler);
        me.addEventListener('dispose', function() {
            baidu.event.un(body, 'mouseout', mouseOutHandler);
            baidu.event.un(document, 'mouseup', mouseUpHandler);
        });
    });
});
