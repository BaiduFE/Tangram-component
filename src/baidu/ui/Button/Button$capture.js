/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Button;
///import baidu.fn.bind;
///import baidu.dom.contains;
///import baidu.event.getTarget;

/**
 * 使按钮支持capture，实现在按钮上点击并保持鼠标按着状态拖离鼠标，请在构造函数的options中定义capture参数为true来激活该状态
 * @class
 * @param {Object} options options参数.
 * @config {Boolean} capture 当为true时表示需要使按钮是一个capture的按钮.
 * @author linlingyu
 */
baidu.ui.Button.register(function(me) {
    if (!me.capture) {return;}
    me.addEventListener('load', function() {
        var body = me.getBody(),
            //onMouseOut = body.onmouseout,
            mouseUpHandler = baidu.fn.bind(function(evt) {
                var target = baidu.event.getTarget(evt);
                if (target != body
                        && !baidu.dom.contains(body, target)
                        && me.getState()['press']) {
                    me.fire('mouseout', evt);
                }
            }),
            mouseOutHandler = function(evt) {
                if (!me.getState()['press']) {
                    me.fire('mouseout', evt);
                }
            };
        body.onmouseout = null;
        me.on(body, 'mouseout', mouseOutHandler);
        me.on(document, 'mouseup', mouseUpHandler);
    });
});
