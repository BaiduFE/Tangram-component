/**
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/combox/Combox.js
 * author: rocy
 * version: 1.0.0
 * date: 2010-12-17
 */


///import baidu.ui.combox;
///import baidu.ui.createUI;
///import baidu.ui.menubar.Menubar;
///import baidu.ui.create;
///import baidu.ui.menubar.Menubar$click;
///import baidu.ui.smartPosition.set;

///import baidu.dom.insertHTML;
///import baidu.dom.g;
///import baidu.dom.remove;

///import baidu.array.each;

///import baidu.fn.bind;

///import baidu.event.on;
///import baidu.event.un;

///import baidu.string.format;

/**
 * Combox 下拉列表框
 * @param {Object} [options]                   配置选项
 * @param {String} [options.width]             宽度
 * @param {String} [options.height]            高度
 * @param {Number} [options.zIndex = 1200]     z-index
 * @param {Boolean} [options.editable = true] 输入框是否可编辑
 * @param {Function} [options.filter]          数据过滤方法
 * @param {Object} [options.data]              combox数据，格式见example
 * @param {Object} [options.menu]              可由用户传入创建好的menu对象
 * @param {Function} [options.onitemclick]     menu条目点击响应事件
 * @param {Function} [options.onbeforeclose]   下拉框beforeclose 事件
 * @param {Function} [options.onclose]         下拉框close事件
 * @param {Function} [options.onbeforeopen]    下拉框beforeopen事件
 * @param {Function} [options.onopen]          下拉框open事件
 * 
 * @example
 * <div id='combox'></div>
 * var options = {
 *   width: 168,
 *   data: [{
 *       content: "复制",
 *       title: "复制当前单元格"
 *   }, {
 *       content: '粘贴',
 *       title: "粘贴当前单元格"
 *   }],
 *   element: 'combox',
 *   autoRender: true
 * };
 * var combox = baidu.ui.create(baidu.ui.combox.Combox, options);
 */
baidu.ui.combox.Combox = baidu.ui.createUI(function (options){
  var me = this;
  me.data = me.data || [];
  me.menu = me.menu || false; //下拉menu,用于判断menu是否已存在
}).extend({
    uiType: "combox",
    editable: true,
    width: '',
    height: '',
    zIndex: 1200,

    /**
     * 过滤方法
     * @param {String} filterStr 需检索的字符串值
     * @param {Array} data 目标数据
     */
    filter: function(filterStr,data){
        var ret = [];
        baidu.array.each(data || this.data, function(dataItem){
            var strIndex = (dataItem.value || dataItem.content).indexOf(filterStr);            
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
            stateHandler: me.statable ? me._getStateHandlerString() : '' // 是否会有更好的方式来使用ui.statable
        });
    },

    /**
     * 渲染控件
     * @param {Object} target 目标渲染对象
     */
    render: function(target){
        var me = this;
        if(me.getMain()){
            return ;
        }
        baidu.dom.insertHTML(me.renderMain(target || me.target), "beforeEnd", me.getString());
        me._createMenu(); //创建下拉menu
        me._enterTipMode();
        me.position && baidu.ui.smartPosition.set(target, me.position);
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
        
        baidu.on(input, "focus", me._showMenuHandler);
		
        if(me.editable){
            input.readOnly = '';
            baidu.on(input, "keyup", me._showMenuHandler);
		}
    },

    /**
     * 创建下拉菜单
     * @private
     * @return {baidu.ui.menubar.Menubar} Menubar对象
     */
    _createMenu : function(){
        var me = this,
            body = me.getBody(),
            arrow = me.getArrow(),
            menuOptions = {
                width: me.width || body.offsetWidth,
                onitemclick: me.onitemclick,
                element: body,
                autoRender: true,
                data: me.data,
                onbeforeclose: me.onbeforeclose,
                onclose: me.onclose,
                onbeforeopen: me.onbeforeopen,
                onopen: me.onopen
            };
                 
        if (!me.menu) {
            me.menu = baidu.ui.create(baidu.ui.menubar.Menubar, menuOptions);
            baidu.un(body, 'click', me.targetOpenHandler);
            me.menu.addEventListener("onitemclick", function(data){
                me.chooseItem(data)
            });
        }
        me.menu.close(true);

        me._showAllMenuHandler = baidu.fn.bind(function(){
            var me = this;
            me.menu.open();
            me.menu.update({
                data: me.data
            });
        }, me);
        baidu.on(arrow, 'click', me._showAllMenuHandler);
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
     * 响应条目被选择,并发出 onitemchosen 事件
     * @param {Object} data 选中的数据
     */
    chooseItem : function(data){
        var me = this;
        me.getInput().value = data.value.content;
    },

    /**
     * 设置input的值
     * @param {Object} value 值
     */
    setValue:function(value){
        this.getInput().value = value;
    },

    /**
     * 销毁Combox
     */
    dispose: function(){
        var me = this;
        baidu.un(me.getInput(), "keyup", me._showMenuHandler);
        baidu.un(me.getInput(), "focus", me._showMenuHandler);
        baidu.un(me.getArrow(), 'click', me._showAllMenuHandler);

        if (me.getMain()) {
            baidu.dom.remove(me.getMain());
        }
        baidu.lang.Class.prototype.dispose.call(me);
    }
});