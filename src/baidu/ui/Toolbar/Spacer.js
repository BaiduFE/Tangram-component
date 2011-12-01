/**
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.dom.insertHTML;
///import baidu.string.format;
///import baidu.object.extend;
///import baidu.ui.createUI;
///import baidu.ui.Toolbar;

/**
 * @private
 * @class Spacer类
 * @param   {Object}    options config参数.
 * @config  {String}    [name="ToolBar_item_xxx"]   ui控件的唯一标识符.
 * @config  {Object}    [options]   创建ui控件所需要的config参数.
 * @author  lixiaopeng
 */
baidu.ui.Toolbar.Spacer = baidu.ui.createUI(function(options) {
}).extend(
    
    /*
     * @lends baidu.ui.Toolbar.Spacer.prototype
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
    uiType: 'toolbar-spacer',

    /**
     * 默认宽度
     * @private
     */
    width: '10px',

    /**
     * html 模板
     * @private
     */
    tplBody: '<div #{style} id="#{id}" class="#{class}"></div>',

    /**
     * 获取html字符串
     * @private
     * @return {String} str HTML字符串.
     */
    getString: function() {
        var me = this;
        return baidu.format(me.tplBody, {
            style : 'style="' + (me.height ? 'height:' + me.height : 'width:' + me.width) + '"',
            id : me.getId(),
            'class' : me.getClass()
        });
    },

    /**
     * 绘制item
     * @param {String|HTMLDom} [container=this.container] Item容器.
     * @private
     */
    render: function(container) {
        var me = this;
        baidu.dom.insertHTML(me.renderMain(container), 'beforeEnd', me.getString());
    }
});
