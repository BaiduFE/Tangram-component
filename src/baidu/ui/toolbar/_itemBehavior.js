/**
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.toolbar;
///import baidu.browser;
///import baidu.lang.isString;

/**
 * 全局唯一的toolbar_item id 索引
 * 此对象不对外暴露
 * @private
 */
baidu.ui.toolbar._itemIndex = 0;

/**
 * @event onhighlight
 * 当item被设置为高亮时触发
 */

/**
 * @event oncancelhighlight
 * 当item被取消高亮时触发
 */

baidu.ui.toolbar._itemBehavior = {

    /**
     * item唯一标识符
     * @private
     */
    _toolbar_item_name: '',

    /**
     * 为ui组创建自己的唯一的标识
     * @param {String} [name] 若传入了name，则使用传入的name为标识符.
     */
    setName: function(name) {
        var me = this;
        if (baidu.lang.isString(name)) {
            me._toolbar_item_name = name;
        }else {
            me._toolbar_item_name = 'tangram_toolbar_item_' + baidu.ui.toolbar._itemIndex++;
        }

        //TODO:在更新name之后如自身已经被渲染到toolbar中
        //则更新toolbar中自己的名值对
    },

    /**
     * 返回toolbar item的唯一标识
     * @return {String} name.
     */
    getName: function() {
        var me = this;
        return me._toolbar_item_name;
    },

    /**
     * 设置高亮状态
     * @return void.
     */
    setHighLight: function() {
        var me = this;
        me.setState('highlight');
        me.dispatchEvent('onhighlight');
    },

    /**
     * 取消高亮状态
     * @return void.
     */
    cancelHighLight: function() {
        var me = this;
        me.removeState('highlight');
        me.dispatchEvent('oncancelhighlight');
    }
};
