/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */


//依赖包
///import baidu.ui.createUI;
///import baidu.ui.Base.setParent;
///import baidu.ui.Base.getParent;
///import baidu.object.extend;
///import baidu.string.format;
///import baidu.dom.g;
///import baidu.dom.removeClass;
///import baidu.dom.addClass;
///import baidu.dom.insertHTML;
///import baidu.dom.remove;

//声明包

///import baidu.ui.button;
///import baidu.ui.behavior.statable;


/**
 * button基类，创建一个button实例
 *
 * @author: zhangyao,lixiaopeng, berg
 *
 * @config {String} content 按钮文本信息
 * @config {Boolean} disabled 按钮是否有效，默认为false
 * @config {Function} onmouseover 鼠标悬停在按钮上时触发
 * @config {Function} onmousedown 鼠标按下按钮时触发
 * @config {Function} onmouseup 按钮弹起时触发
 * @config {Function} onclick 按钮点击时调用
 * @config {Function} onmouseout 鼠标移出按钮时触发
 * @config {Function} ondisable 按钮失效时触发
 * @config {Function} onenable 按钮有效时触发
 * @return {baidu.ui.Button} Button类.
 */

baidu.ui.button.Button = baidu.ui.createUI(new Function).extend({
    //ui控件的类型，传入给UIBase **必须**
    uiType: 'button',
    //ui控件的class样式前缀 可选
    //classPrefix     : "tangram-button-",
    tplBody: '<div id="#{id}" #{statable} class="#{class}">#{content}</div>',
    disabled: false,
    statable: true,

    /**
     *  获得button的HTML字符串
     *  @private
     *  @return {String} string.
     */
    _getString: function() {
        var me = this;
        return baidu.format(me.tplBody, {
            id: me.getId(),
            statable: me._getStateHandlerString(),
            'class' : me.getClass(),
            content: me.content
        });
    },

    /**
     *  将button绘制到DOM树中。
     *  @public
     *  @param {HTMLElement} target
     *  @return void.
     */
    render: function(target) {
        var me = this,
        body;
        me.addState('click', 'click');
        baidu.dom.insertHTML(me.renderMain(target), 'beforeEnd', me._getString());

        body = baidu.g(target).lastChild;
        if (me.title) {
            body.title = me.title;
        }

        me.disabled && me.setState('disabled');
        me.dispatchEvent('onload');
    },

    /**
     *  判断按钮是否处于失效状态。
     *  @pubic
     *  @return {Boolean} state.
     */
    isDisabled: function() {
        var me = this,
        id = me.getId();
        return me.getState()['disabled'];
    },

   /**
    *  销毁实例。
    *  @pubic
    *  @return void.
    */
   dispose: function() {
       var me = this,
       body = me.getBody();

       //删除当前实例上的方法
       baidu.each(me._allEventsName, function(item,index) {
           body['on' + item] = null;
       });

       baidu.dom.remove(body);
        baidu.lang.Class.prototype.dispose.call(me);
   },

    /**
     * 设置disabled属性
     * @pubic
     * @return void.
     * */
    disable: function() {
        var me = this,
        body = me.getBody();
        me.dispatchEvent('ondisable', {element: body});
    },

    /**
     * 删除disabled属性
     * @pubic
     * @return void.
     * */
    enable: function() {
        var me = this;
        body = me.getBody();
        me.dispatchEvent('onenable', {element: body});
    },

    /**
     * 触发button事件
     * @pubic
     * @param {String} eventName
     * @param {Object} e
     * */
    fire: function(eventType,e) {
        var me = this, eventType = eventType.toLowerCase();
        if (me.getState()['disabled']) {
            return;
        }
        me._fireEvent(eventType, null, null, e);
    },

    /**
     * 更新button的属性
     * @param {Object} options  更新button的属性.
     * */
    update: function(options) {
        var me = this;
        baidu.extend(me, options);
        options.content && (me.getBody().innerHTML = options.content);

        me.dispatchEvent('onupdate');
    }
});
