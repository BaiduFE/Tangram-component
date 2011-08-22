/**
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/Combox.js
 * author: rocy
 * version: 1.0.0
 * date: 2010-12-17
 */

///import baidu.ui.createUI;
///import baidu.ui.Menubar;
///import baidu.ui.create;
///import baidu.ui.Menubar.Menubar$click;
///import baidu.ui.behavior.statable;
///import baidu.ui.behavior.posable;
///import baidu.dom.insertHTML;
///import baidu.dom.g;
///import baidu.dom.remove;
///import baidu.array.each;
///import baidu.fn.bind;
///import baidu.string.format;

 /**
 * combox类
 * @class
 * @grammar new baidu.ui.Combox(options)
 * @param  {Object}               [options]        选项，用于创建combox。
 * @config {Element}              target           combox的触发元素
 * @config {Number|String}        width            宽度值。当指定element时，默认为element宽度；否则不设置（可以通过css指定）。
 * @config {Number|String}        height           高度值。当指定element时，默认为element宽度；否则不设置（可以通过css指定）。
 * @config {String}               skin             自定义样式前缀
 * @config {Boolean}              editable         是否可以输入
 * @config {Array}                data             储存combox每个条目的数据。每个条目数据格式: { content: 'some html string', value : ''}。
 * @config {Array|Object}         offset           偏移量，若为数组，索引0为x方向，索引1为y方向; 若为Object，键x为x方向，键y为y方向。单位：px，默认值：[0,0]。
 * @config {Number}               zIndex           浮起combox层的z-index值，默认为1200。
 * @config {Function}             onitemclick      combox中单个条目鼠标点击的回调函数，参数:{data : {value: Item对应的数据, index : Item索引值}}
 * @config {Function}             onitemclick      combox中单个条目鼠标点击的回调函数，function(evt){}，evt.index返回item的索引，evt.value返回一个json，{content: '', value: ''}
 * @config {Function}             onbeforeclose    关闭之前触发
 * @config {Function}             onclose          关闭时触发
 * @config {Function}             onbeforeopen     打开之前触发
 * @config {Function}             onopen           打开时触发
 * @config {Function}             onmouseover      悬停时触发
 * @config {Function}             onmouseout       离开时触发
 * @config {Function}             onmousedown      鼠标按下时触发
 * @config {Function}             onmouseup        鼠标抬起时触发
 * @plugin statable 状态插件
 * @plugin select   通过select控件的数据创建combox     
 */
baidu.ui.Combox = baidu.ui.createUI(function (options){
  var me = this;
  me.data = me.data || [];
  me.menu = me.menu || false; //下拉menu,用于判断menu是否已存在
}).extend(
/**
 *  @lends baidu.ui.Combox.prototype
 */
{
    uiType: "combox",
    editable: true,
    width: '',
    height: '',
    zIndex: 1200,
    statable: true,
    posable: true,

    /**
     * 过滤方法
	 * @public
     * @param {String} filterStr 需检索的字符串值
     * @param {Array} data 目标数据
     */
    filter: function(filterStr,data){
        var ret = [];
        baidu.array.each(data || this.data, function(dataItem){
            var strIndex = String(dataItem.value || dataItem.content).indexOf(filterStr);
            if (strIndex >= 0) {
                ret.push(dataItem);
            } 
        });
        return ret;
    },

    tplBody : ['<div id="#{id}" class="#{class}" #{stateHandler}>',
                    '<input id="#{inputid}" class="#{inputClass}" autocomplete="off" readOnly="readOnly"/>',
                    '<span id="#{arrowid}" class="#{arrowClass}"></span>',
               '</div>'].join(''),

    /**
     * 生成combox的html字符串代码
     * @private
     * @return {String} 生成html字符串
     */
    getString: function(){
        var me = this;
        return baidu.format(me.tplBody, {
            id: me.getId(),
            "class": me.getClass(),
            inputClass: me.getClass('input'),
            arrowClass: me.getClass('arrow'),
            inputid: me.getId("input"),
            arrowid: me.getId("arrow"),
            stateHandler: me._getStateHandlerString()
        });
    },

    /**
     * 渲染控件
     * @public
     * @param {Object} target 目标渲染对象
     */
    render: function(target){
        var me = this;
        if(me.getMain()){
            return ;
        }
        
        me.dispatchEvent("onbeforerender");
        baidu.dom.insertHTML(me.renderMain(target || me.target), "beforeEnd", me.getString());
        me._createMenu(); //创建下拉menu
        me._enterTipMode();
        me.position && me.setPosition(me.position, target);
        me.dispatchEvent("onload");
    },

    /**
     * 给input添加keyup、focus事件，当触发事件，下拉框弹出相关项
     * @private
     */
    _enterTipMode : function(){
        var me = this, 
            input = me.getInput();
        me._showMenuHandler = baidu.fn.bind(function(){
            var me = this;
            var input = me.getInput();
            me.menu.open();
            me.menu.update({//如果开启input可编辑模式，则智能筛选数据
                data: me.editable ? me.filter(input.value, me.data) : me.data
            });
        }, me);
        
        me.on(input, "focus", me._showMenuHandler);
        if(me.editable){
            input.readOnly = '';
            me.on(input, "keyup", me._showMenuHandler);
        }
    },

    /**
     * 创建下拉菜单
     * @private
     * @return {baidu.ui.Menubar} Menubar对象
     */
    _createMenu : function(){
        var me = this,
            body = me.getBody(),
            arrow = me.getArrow(),
            menuOptions = {
                width: me.width || body.offsetWidth,
                onitemclick: function(data){
                    me.chooseItem(data);
                },
                element: body,
                autoRender: true,
                data: me.data,
                onbeforeclose: me.onbeforeclose,
                onclose: me.onclose,
                onbeforeopen: me.onbeforeopen,
                onopen: me.onopen
            };
                 
        me.menu = baidu.ui.create(baidu.ui.Menubar, menuOptions);
        me.menu.close(true);
        
        me._showAllMenuHandler = baidu.fn.bind(function(){
            var me = this;
            me.menu.open();
            me.menu.update({
                data: me.data
            });
        }, me);
        me.on(arrow, 'click', me._showAllMenuHandler);
        return me.menu;
    },

    /**
     * 获取input元素
     * @return {HTMLElement} input元素
     */
    getInput : function(){
        return baidu.g(this.getId("input"));
    },

    /**
     * 获取下拉箭头元素
     * @return {HTMLElement} arrow元素
     */
    getArrow : function(){
        return baidu.g(this.getId("arrow"));
    },

    /**
     * 响应条目被选择,并发出 onitemclick 事件
     * @param {Object} data 选中的数据
     */
    chooseItem : function(data){
        var me = this;
        me.getInput().value = data.value.content;
        me.dispatchEvent('onitemclick', data);
    },

    /**
     * 设置input的值
     * @param {String} value 值
     */
    setValue:function(value){
        this.getInput().value = value;
    },

    /**
     * 销毁Combox
     * @public
     */
    dispose: function(){
        var me = this;
        me.menu && me.menu.dispose();
        me.getMain() && baidu.dom.remove(me.getMain());
        me.dispatchEvent('ondispose');
        baidu.lang.Class.prototype.dispose.call(me);
    }
});
