/**
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/toolBar/Separator.js
 * @author lixiaopeng
 * @version 1.0.0
 * date: 2010/11/28
 * */

///import baidu.ui.createUI;

/**
 * @constructor
 * @param {Object}              options config参数.
 * @param {String|HTMLElemnt}   [options.container=document.body]   实例容器.
 * @param {String}              [options.items.name="ToolBar_item_xxx"] ui控件的唯一标识符.
 * @param {Object}              [options.items.options]         创建ui控件所需要的config参数.
 * */
baidu.ui.toolbar.Separator = baidu.ui.createUI(function(options) {
}).extend({

    /**
     * uiType
     * */
    uiType: 'toolbar-sepatator',

    /**
     * 模板
     * */
    tplMain: '<span id="#{id}" class="#{class}" style="display:block"></span>',

    /**
     * @private
     * 获取HTML字符串
     * @return {String} HTMLString.
     * */
    getString: function() {
        var me = this;

        return baidu.format(me.tplMain, {
            'id' : me.getId(),
            'class' : me.getClass()
        });
    },

    /**
     * 绘制控件
     * @private
     * @return void.
     * */
    render: function(container) {
        var me = this;
        baidu.dom.insertHTML(me.renderMain(container), 'beforeEnd', me.getString());
    }
});
