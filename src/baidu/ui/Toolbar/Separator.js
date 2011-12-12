/**
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.createUI;
///import baidu.ui.Toolbar;

/**
 * @private
 * @class Toolbar类
 * @param   {Object}    options config参数.
 * @config  {String}    [name="ToolBar_item_xxx"]   ui控件的唯一标识符.
 * @config  {Object}    [options]   创建ui控件所需要的config参数.
 * @author  lixiaopeng
 */
baidu.ui.Toolbar.Separator = baidu.ui.createUI(function(options) {
}).extend(
    /*
     * @lends baidu.ui.Toolbar.Separator.prototype
     */   
{
    /**
     * statable
     * @private
     */
    statable: false,

    /**
     * uiType
     * @private
     */
    uiType: 'toolbar-separator',

    /**
     * 模板
	 * @private
     */
    tplMain: '<span id="#{id}" class="#{class}" style="display:block"></span>',

    /**
     * 获取HTML字符串
     * @private
     * @return {String} HTMLString.
     */
    getString: function() {
        var me = this;

        return baidu.format(me.tplMain, {
            id : me.getId(),
            'class' : me.getClass()
        });
    },

    /**
     * 绘制控件
     * @private
     * @return void.
     */
    render: function(container) {
        var me = this;
        baidu.dom.insertHTML(me.renderMain(container), 'beforeEnd', me.getString());
    }
});
