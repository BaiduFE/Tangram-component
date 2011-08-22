/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/ProgressBar.js
 * author: berg
 * version: 1.0.0
 * date: 2010/09/03
 */


///import baidu.ui.createUI;

///import baidu.dom.insertHTML;
///import baidu.dom.setStyle;
///import baidu.dom._styleFilter.px;

///import baidu.string.format;
///import baidu.dom.remove;

/**
 *
 * 进度条控件
 * @class
 * @param {Object} options 参数
 * @config {String} layout 取值horizontal横向或是vertical竖向
 * @config {Number} value 初始值，默认是0
 */
baidu.ui.ProgressBar = baidu.ui.createUI(function(options) {
}).extend(
/**
 * @lends baidu.ui.ProgressBar.prototype
 */
{
    uiType: 'progressBar',
    tplBody: '<div id="#{id}" class="#{class}">#{bar}</div>',
    tplBar: '<div id="#{barId}" class="#{barClass}"></div>',

    //初始化时，进度条所在的值
    value: 0,

    layout: 'horizontal',

    _min: 0,
    _max: 100,
     //位置变换
    axis: {
        horizontal: {offsetSize: 'offsetWidth', size: 'width'},
        vertical: {offsetSize: 'offsetHeight', size: 'height'}
    },
    /**
     * 获得控件字符串
     * @return {string} HTML string.
     */
    getString: function() {
        var me = this;
        return baidu.format(me.tplBody, {
            id: me.getId(),
            'class' : me.getClass(),
            bar: baidu.format(me.tplBar, {
                barId: me.getId('bar'),
                barClass: me.getClass('bar')
            })
        });
    },

    /**
     * 渲染进度条
     * @param {HTMLElement} target
     */
    render: function(target) {
        var me = this,
            main;

        if (!target) {
            return;
        }

        baidu.dom.insertHTML(
            me.renderMain(target),
            'beforeEnd',
            me.getString()
        );
        me.dispatchEvent('onload');

        me.update();
    },


    /**
     * 更新progressBar状态
     * @param {object} options 参数.
     */
    update: function(options) {
        var me = this;

        options = options || {};
        baidu.object.extend(me, options);

        me.value = Math.max(Math.min(me.value, me._max), me._min);
        if (me.value == me._lastValue) {
            return;
        }
        var len = me.axis[me.layout].size;
        baidu.dom.setStyle(me.getBar(), len, me._calcPos(me.value));
        me._lastValue = me.value;

        me.dispatchEvent('update');
    },

    /**
     * 获得当前的value
     * @return {number} value.
     */
    getValue: function() {
        var me = this;
        return me.value;
    },

    /**
     * 将value转换为位置信息
     * @private
     */
    _calcPos: function(value) {
        var me = this;
        var len = me.getBody()[me.axis[me.layout].offsetSize];
        return value * (len) / (me._max - me._min);
    },

    /**
     * 禁用进度条
     */
    disable: function() {
        this.disabled = true;
    },

    /**
     * 启用进度条
     */
    enable: function() {
        this.disabled = false;
    },

    /**
     * 获取target元素
     * @return {HTMLElement} target.
     */
    getTarget: function() {
        return baidu.g(this.targetId);
    },

    /**
     * 获取进度条元素
     * @return {HTMLElement} bar.
     */
    getBar: function() {
        return baidu.g(this.getId('bar'));
    },

    /**
     * 销毁当前实例
     */
    dispose: function() {
        var me = this;
        baidu.dom.remove(me.getId());
    }
});