/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.ColorPicker;
///import baidu.ui.get;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.event.getTarget;
///import baidu.dom.getAncestorBy;
///import baidu.object.extend;
///import baidu.fn.bind;

/**
 * 创建一个鼠标点击触发的colorPicker
 * @name baidu.ui.ColorPicker
 * @author walter
 */
baidu.ui.ColorPicker.extend({
    /**
     * 插件触发方式，默认为点击
     * @param {String} [options.type = 'click'].
     */
    type: 'click',

    /**
     * body点击事件，点击body关闭菜单
     * @param {Object} e 事件.
     */
    bodyClick: function(e) {
        var me = this,
            target = baidu.event.getTarget(e || window.event),
            judge = function(el) {
                return el == me.getTarget();
            };

        //判断如果点击的是菜单或者target则返回，否则直接关闭菜单
        if (!target ||
            judge(target) ||
            baidu.dom.getAncestorBy(target, judge) ||
            baidu.ui.get(target) == me) {
            return;
        }
        me.close();
    }
});

baidu.ui.ColorPicker.register(function(me) {
    if (me.type != 'click') {
        return;
    }

    me._targetOpenHandler = baidu.fn.bind('open', me);
    me._bodyClickHandler = baidu.fn.bind('bodyClick', me);

    me.addEventListener('onload', function() {
        var target = me.getTarget();
        if (target) {
            baidu.on(target, 'click', me._targetOpenHandler);
            baidu.on(document, 'click', me._bodyClickHandler);
        }
    });

    me.addEventListener('ondispose', function() {
        var target = me.getTarget();
        if (target) {
            baidu.un(target, 'click', me._targetOpenHandler);
            baidu.un(document, 'click', me._bodyClickHandler);
        }
    });
});
