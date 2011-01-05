/**
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/toolBar/Spacer.js
 * @author lixiaopeng
 * @version 1.0.0
 * date: 2010/11/28
 * */

///import baidu.dom.insertHTML;
///import baidu.string.format;
///import baidu.object.extend;
///import baidu.ui.createUI;

/**
 * @public
 * @param {Object}              options config参数.
 * @param {String|HTMLElement}  [options.container=document.body]   实例容器.
 * @param {String}              [options.items.name="ToolBar_item_xxx"] ui控件的唯一标识符.
 * @param {Object}              [options.items.options]         创建ui控件所需要的config参数.
 * @return void
 * */
baidu.ui.toolbar.Spacer = baidu.ui.createUI(function(options) {
}).extend({

    /**
     * uiType
     * */
    uiType: 'toolbar-spacer',

    /**
     * 默认宽度
     * */
    width: '10px',

    /**
     * hrml 模板
     * */
    tplBody: '<div #{style} id="#{id}" class="#{class}"></div>',

    /**
     * 获取html字符串
     * @public
     * @return {String} str HTML字符串.
     * */
    getString: function() {
        var me = this;
        return baidu.format(me.tplBody, {
            'style' : 'style="' + (me.height ? 'height:' + me.height : 'width:' + me.width) + '"',
            'id' : me.getId(),
            'class' : me.getClass()
        });
    },

    /**
     * 绘制item
     * @public
     * @param {String|HTMLDom} [container=this.container] Item容器.
     * */
    render: function(container) {
        var me = this;
        baidu.dom.insertHTML(me.renderMain(container), 'beforeEnd', me.getString());
    }
});
