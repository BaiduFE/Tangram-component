/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.behavior;
///import baidu.dom.resizable;

/**
 * 为ui控件提供resize的行为
 */
(function() {
    var Resizable = baidu.ui.behavior.resizable = function() {};

    /**
     * 更新reiszable设置
     * 创建resize handle
     * @param {Object} options
     * @see baidu.dom.resizable
     * @return void.
     */
    Resizable.resizeUpdate = function(options) {
        var me = this, target;
        options = options || {};
        if (!me.resizable) {
            return;
        }

        baidu.object.extend(me, options);
        me._resizeOption = {
            onresizestart: function() {
                me.dispatchEvent('onresizestart');
            },
            onresize: function(styles) {
                me.dispatchEvent('onresize', styles);
            },
            onresizeend: function() {
                me.dispatchEvent('onresizeend');
            }
        };
        baidu.each(['minWidth', 'minHeight', 'maxWidth', 'maxHeight'], function(item,index) {
            me[item] && (me._resizeOption[item] = me[item]);
        });

        me._resizeOption.classPrefix = options.classPrefix || me.classPrefix;
        target = options.target || me.getBody();
        me.direction && (me._resizeOption.direction = me.direction);
        baidu.dom.resizable(target, me._resizeOption);
    };
})();
