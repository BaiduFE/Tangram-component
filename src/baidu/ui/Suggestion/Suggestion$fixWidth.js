/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Suggestion;

///import baidu.object.extend;
///import baidu.browser.ie;
///import baidu.dom.getPosition;
///import baidu.dom.getStyle;
///import baidu.dom.setStyle;
///import baidu.dom.setBorderBoxWidth;
///import baidu.dom._styleFilter.px;

///import baidu.ui.behavior.posable;


/**
 * 为Suggestion提供位置校准功能
 * @author berg
 */
baidu.ui.Suggestion.extend({
    posable: true,
    fixWidth: true,
    getWindowResizeHandler: function() {
        var me = this;
        return function() {
            me.adjustPosition(true);
        };
    },

	/*
     * 重新放置suggestion
     * @private
     */
    adjustPosition: function(onlyAdjustShown) {
       var me = this,
            target = me.getTarget(),
            targetPosition,
            main = me.getMain(),
            pos;

        if (!me._isShowing() && onlyAdjustShown) {
            return;
        }
        targetPosition = baidu.dom.getPosition(target),
        pos = {
                top: (targetPosition.top + target.offsetHeight - 1),
                left: targetPosition.left,
                width: target.offsetWidth
            };
        //交给用户的view函数计算
        pos = typeof me.view == 'function' ? me.view(pos) : pos;

        me.setPosition([pos.left, pos.top], null, {once: true});
        baidu.dom.setOuterWidth(main, pos.width);
    }
});
baidu.ui.Suggestion.register(function(me) {

    me.windowResizeHandler = me.getWindowResizeHandler();

    me.addEventListener('onload', function() {
        me.adjustPosition();
        //监听搜索框与suggestion弹出层的宽度是否一致。
        if (me.fixWidth) {
            me.fixWidthTimer = setInterval(function() {
                var main = me.getMain(),
                    target = me.getTarget();
                if (main.offsetWidth != 0 && target && target.offsetWidth != main.offsetWidth) {
                    me.adjustPosition();
                    main.style.display = 'block';
                }
            }, 100);
        }
        //当窗口变化的时候重新放置
        me.on(window, 'resize', me.windowResizeHandler);
    });

    //每次出现的时候都重新定位，保证用户在初始化之后修改了input的位置，也不会出现混乱
    me.addEventListener('onshow', function() {
        me.adjustPosition();
    });

    me.addEventListener('ondispose', function() {
        clearInterval(me.fixWidthTimer);
    });

});
