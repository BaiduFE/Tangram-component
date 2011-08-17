/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.createUI;
///import baidu.ui.behavior.statable;
///import baidu.ui.behavior.posable.setPositionByElement;

///import baidu.string.format;

///import baidu.dom.g;
///import baidu.dom.insertHTML;
///import baidu.dom.show;
///import baidu.dom.hide;
///import baidu.dom.remove;

///import baidu.object.extend;

/**
 * 颜色拾取器
 * @name baidu.ui.ColorPicker
 * @class
 * @grammar new baidu.ui.ColorPicker(options)
 * @param {Object} options 配置.
 * @config {Number} gridSize 一行显示的颜色块个数，默认8.
 * @config {Function} onchosen 颜色选择事件.
 * @plugin click 创建一个鼠标点击触发colorPicker的插件
 * @plugin more 弹出调色板插件
 * @author walter
 */
baidu.ui.ColorPicker = baidu.ui.createUI(function(options) {
    var me = this;
    me._initialized = false; //判断是否已经初始化
}).extend(
/**
 * @lends baidu.ui.ColorPicker.prototype
 */
{
    uiType: 'colorpicker',

    /**
     * colorPicker 提供选择的颜色值
     */
    colors: ('000,800000,8B4513,2F4F4F,008080,000080,4B0082,696969,' +
             'B22222,A52A2A,DAA520,006400,40E0D0,0000CD,800080,808080,' +
             'F00,FF8C00,FFD700,008000,0FF,00F,EE82EE,A9A9A9,' +
             'FFA07A,FFA500,FFFF00,00FF00,AFEEEE,ADD8E6,DDA0DD,D3D3D3,' +
             'FFF0F5,FAEBD7,FFFFE0,F0FFF0,F0FFFF,F0F8FF,E6E6FA,FFF').split(','),

    tplBody: '<div id="#{id}" class="#{class}">#{content}</div>',

    tplColor: '<a href="javascript:;" id="#{colorId}" style="#{colorStyle}" class="#{colorClass}" onclick="javascript:#{choose};return false;" #{stateHandler}></a>',

    gridSize: 8,

    position: 'bottomCenter',

    statable: true,

    posable: true,

    /**
     * 生成colorPicker的html字符串代码
     *  @return {String} 生成html字符串.
     */
    getString: function() {
        var me = this,
            strArray = ['<table>'],
            count = 0,
            length = me.colors.length;

        while (count < length) {
            strArray.push('<tr>');
            for (var i = 0; i < me.gridSize; i++) {
                strArray.push('<td>',
                              me._getColorString(me.colors[count]),
                              '</td>');
                count++;
            }
            strArray.push('</tr>');
        }
        strArray.push('</table>');

        return baidu.string.format(me.tplBody, {
            id: me.getId(),
            'class': me.getClass(),
            content: strArray.join('')
        });
    },

    /**
     * 生成颜色块的html字符串代码
     * @private
     * @param {String} color 颜色值.
     * @return {String} 生成html字符串.
     */
    _getColorString: function(color) {
        var me = this;
        return baidu.string.format(me.tplColor, {
            colorId: me.getId(color),
            colorStyle: 'background-color:#' + color,
            colorClass: me.getClass('color'),
            choose: me.getCallString('_choose', color),
            stateHandler: me._getStateHandlerString('', color)
        });
    },

    /**
     * 渲染控件
     * @param {Object} target 目标渲染对象.
     */
    render: function(target) {
        var me = this;
        target = baidu.g(target);
        if (me.getMain() || !target) {
            return;
        }
        me.targetId = target.id || me.getId('target');
        me.renderMain();
        me.dispatchEvent('onload');
    },

    /**
     * 更新colorPicker
     * @param {Object} options 需要更新的配置.
     */
    update: function(options) {
        var me = this,
            main = me.getMain(),
            target = me.getTarget();
        
        options = options || {};
        baidu.object.extend(me, options);
        main.innerHTML = me.getString();
        me.setPositionByElement(target, main, {
            position: me.position,
            once: true
        });

        me.dispatchEvent('onupdate');
    },

    /**
     * 响应颜色被选择,并发出 oncolorchosen 事件
     * @param {Object} color 颜色值.
     */
    _choose: function(color) {
        var me = this;
        me.close();
        me.dispatchEvent('onchosen', {
            color: '#' + color
        });
    },

    /**
     * 打开 colorPicker
     */
    open: function() {
        var me = this;
        if (!me._initialized) {
            me.update();
            me._initialized = true;
        }
        baidu.dom.show(me.getMain());
        baidu.ui.ColorPicker.showing = me;
        me.dispatchEvent('onopen');
    },

    /**
     * 关闭 colorPicker
     */
    close: function() {
        var me = this;
        baidu.dom.hide(me.getMain());
        me.dispatchEvent('onclose');
    },

    /**
     * 获取target元素
     * @return {HTMLElement} HTML元素.
     */
    getTarget: function() {
        return baidu.g(this.targetId);
    },

    /**
     * 销毁 colorPicker
     */
    dispose: function() {
        var me = this;
        me.dispatchEvent('ondispose');
        if (me.getMain()) {
            baidu.dom.remove(me.getMain());
        }
        baidu.lang.Class.prototype.dispose.call(me);
    }
});
