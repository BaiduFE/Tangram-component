/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.createUI;
///import baidu.object.merge;

///import baidu.ui.Popup.Popup$coverable;
///import baidu.ui.Popup;

///import baidu.ui.Calendar;
///import baidu.event.getTarget;
///import baidu.dom.contains;
///import baidu.date.format;
///import baidu.fn.bind;
///import baidu.dom.g;
///import baidu.dom.getPosition;
///import baidu.browser.isStrict;

///import baidu.i18n;
///import baidu.i18n.cultures.zh-CN;

/**
 * 创建一个日历对象绑定于一个input输入域
 * @name baidu.ui.DatePicker
 * @class
 * @grammar new baidu.ui.DatePicker(options)
 * @param {Object} options config参数
 * @config {Number} width 日历组件的宽度
 * @config {Number} height 日历组件的高度
 * @config {String} format 日历组件格式化日历的格式，默认：yyyy-MM-dd
 * @config {Object} popupOptions Picker组件的浮动层由Popup组件渲染，该参数用来设置Popup的属性，具体参考Popup
 * @config {Object} calendarOptions Picker组件的日历由Calendar组件渲染，该参数来用设置Calendar的属性，具体参考Calendar
 * @config {Function} onpick 当选中某个日期时的触发事件
 * @config {String} language 当前语言，默认为中文
 */
baidu.ui.DatePicker = baidu.ui.createUI(function(options){
    var me = this;
    me.format = me.format || baidu.i18n.cultures[me.language].calendar.dateFormat || 'yyyy-MM-dd';
    me.popupOptions = baidu.object.merge(me.popupOptions || {},
        options,
        {overwrite: true, whiteList: ['width', 'height']});
    me.calendarOptions = baidu.object.merge(me.calendarOptions || {},
        options,
        {overwrite: true, whiteList: ['weekStart']});
    me._popup = new baidu.ui.Popup(me.popupOptions);
    me._calendar = new baidu.ui.Calendar(me.calendarOptions);
    me._calendar.addEventListener('clickdate', function(evt){
        me.pick(evt.date);
    });
}).extend(
/**
 *  @lends baidu.ui.DatePicker.prototype
 */
{
    uiType: 'datePicker',

    language: 'zh-CN',
    
    /**
     * 取得从input到得字符按format分析得到的日期对象
     * @private
     */
    _getInputDate: function(){
        var me = this,
            patrn = [/yyyy|yy/, /M{1,2}/, /d{1,2}/],//只支持到年月日的格式化，需要时分秒的请扩展此数组
            key = [],
            val = {},
            count = patrn.length,
            i = 0,
            regExp;
        for(; i < count; i++){
            regExp = patrn[i].exec(me.format);
            key[i] = regExp ? regExp.index : null;
        }
        me.input.value.replace(/\d{1,4}/g, function(mc, index){
            val[index] = mc;
        });
        for(i = 0; i < key.length; i++){
            key[i] = val[key[i]];
            if(!key[i]){return;}
        }
        return new Date(key[0], key[1] - 1, key[2]);//需要时分秒的则扩展参数
    },
    
    /**
     * 鼠标点击的事件侦听器，主要用来隐藏日历
     * @private
     */
    _onMouseDown: function(evt){
        var me = this,
            popup = me._popup,
            target = baidu.event.getTarget(evt);
        if(target.id != me.input.id
            && !baidu.dom.contains(popup.getBody(), target)){
            me.hide();
        }
    },
    
    /**
     * 渲染日期组件到body中并绑定input
     * @param {HTMLElement} target 一个input对象，该input和组件绑定
     */
    render: function(target){
        var me = this,
            focusHandler = baidu.fn.bind('show', me),
            mouseHandler = baidu.fn.bind('_onMouseDown', me),
            keyHandler = baidu.fn.bind('hide', me),
            input = me.input = baidu.dom.g(target),
            popup = me._popup;
        if(me.getMain() || !input){
            return;
        }
        popup.render();
        me._calendar.render(popup.getBody());
        me.on(input, 'focus', focusHandler);
        me.on(input, 'keyup', keyHandler);
        me.on(document, 'click', mouseHandler);
    },
    
    /**
     * 当点击某个日期时执行pick方法来向input写入日期
     * @param {Date} date 将日期写到input中
     */
    pick: function(date){
        var me = this;
        me.input.value = baidu.date.format(date, me.format);
        me.hide();
        me.dispatchEvent('pick');
    },
    
    /**
     * 显示日历
     */
    show: function(){
        var me = this,
            pos = me.input && baidu.dom.getPosition(me.input),
            popup = me._popup,
            calendar = me._calendar,
            doc = document[baidu.browser.isStrict ? 'documentElement' : 'body'],
            inputHeight = me.input.offsetHeight,
            popupHeight = me._popup.getBody().offsetHeight;
        me._calendar.setDate(me._getInputDate() || calendar._toLocalDate(new Date()));
        me._calendar.renderTitle();
        me._calendar._renderDate();
//        me._calendar.update({initDate: me._getInputDate() || calendar._toLocalDate(new Date())});
        pos.top += (pos.top + inputHeight + popupHeight - doc.scrollTop > doc.clientHeight) ? -popupHeight
            : inputHeight;
        me._popup.open(pos);
    },
    
    /**
     * 隐藏日历
     */
    hide: function(){
        this._popup.close();
    },
    
    /**
     * 析构函数
     */
    dispose: function(){
        var me = this;
        me.dispatchEvent('dispose');
        me._calendar.dispose();
        me._popup.dispose();
        baidu.lang.Class.prototype.dispose.call(me);
    }
});
