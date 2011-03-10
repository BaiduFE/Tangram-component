/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/slider/Slider.js
 * author: berg,linlingyu
 * version: 1.0.0
 * date: 2010/09/02
 */
///import baidu.ui.createUI;
///import baidu.string.format;
///import baidu.page.getMousePosition;
///import baidu.dom.getPosition;
///import baidu.event.getTarget;
///import baidu.dom.contains;
///import baidu.dom.insertHTML;
///import baidu.dom.draggable;
///import baidu.object.extend;
///import baidu.dom.g;
///import baidu.dom.remove;
///import baidu.lang.Class;
 /**
 * 拖动条控件，可用作音乐播放进度。
 * @class
 * @param      {String|HTMLElement}     target       存放滑块控件的元素，按钮会渲染到该元素内。
 * @param      {Object}                 [options]    选项layout
 * @config     {Number}                 value        记录滑块的当前进度值
 * @config     {Number}                 layout       滑块的布局[水平：horizontal,垂直：vertical]
 * @config     {Number}                 min          进度条最左边代表的值
 * @config     {Number}                 max          进度条最右边代表的值
 * @config     {Boolean}                disabled     是否禁用
 * @config     {String}                 skin         自定义样式名称前缀
 * @plugin     progressBar              进度条跟随滑块的滑动
 */
baidu.ui.Slider = baidu.ui.createUI(function(options){
    var me = this;
    if(!options.range){//初始化range
        me.range = [me.min, me.max];//拖拽的范围
    }
}).extend({
    layout: 'horizontal',//滑块的布局方式 horizontal :水平  vertical:垂直
    uiType: 'slider',
    tplBody: '<div id="#{id}" class="#{class}" onmousedown="#{mousedown}">#{thumb}</div>',
    tplThumb: '<div id="#{thumbId}" class="#{thumbClass}" style="position:absolute;"></div>',
    value: 0,//初始化时，进度条所在的值
    min: 0,//进度条最左边代表的值
    max: 100,//进度条最右边代表的值
    _dragOpt: {},
    _axis: {//位置换算
        horizontal: {
            mousePos: 'x',
            pos: 'left',
            size: 'width',
            clientSize: 'clientWidth',
            offsetSize: 'offsetWidth'
        },
        vertical: {
            mousePos: 'y',
            pos: 'top',
            size: 'height',
            clientSize: 'clientHeight',
            offsetSize: 'offsetHeight'
        }
    },

    /**
     * 获得slider控件字符串
     * @private
     * @return {String}  string     控件的html字符串
     */
    getString : function(){
        var me = this;
        return baidu.format(me.tplBody,{
            id          : me.getId(),
            "class"     : me.getClass(),
            mousedown   : me.getCallRef() + "._mouseDown(event)",
            thumb       : baidu.format(me.tplThumb, {
                thumbId   : me.getId("thumb"),
                thumbClass: me.getClass("thumb")
            })
        });
    },

    /**
     * 处理鼠标在滚动条上的按下事件
     * @private
     */
    _mouseDown : function(e){
        var me = this,
            axis = me._axis[me.layout],
            mousePos = baidu.page.getMousePosition(),
            mainPos = baidu.dom.getPosition(me.getMain()),
            thumb = me.getThumb(),
            target = baidu.event.getTarget(e);
        //如果点在了滑块上面，就不移动
        if(target == thumb
            || baidu.dom.contains(thumb, target)){
            return ;
        }
        me._calcValue(mousePos[axis.mousePos]
            - mainPos[axis.pos]
            - thumb[axis.offsetSize] / 2);
        me.update()
        me.dispatchEvent("slideclick");
    },
    
    /**
     * 渲染slider
     * @public
     * @param     {String|HTMLElement}   target     将渲染到的元素或元素id
     */
    render : function(target){
        var me = this;
        if(!target){return;}
        baidu.dom.insertHTML(me.renderMain(target), "beforeEnd", me.getString());
        me.getMain().style.position = "relative";
        me._createThumb();
        me.update();
        me.dispatchEvent("onload");
    },

    /**
     * 创建滑块
     * @private
     */
    _createThumb : function(){
        var me = this;
        me._dragOpt = {
            "ondragend"     : function(){
                                me.dispatchEvent("slidestop");
                            },
            "ondragstart"   : function(){
                                me.dispatchEvent("slidestart");
                            },
            "ondrag"        : function(){
                                var axis = me._axis[me.layout],
                                    len = me.getThumb().style[axis.pos];
                                me._calcValue(parseInt(len));
                                me.dispatchEvent("slide");
                            },
            range           : [0, 0, 0, 0]
        };
        me._updateDragRange();
        baidu.dom.draggable(me.getThumb(), me._dragOpt);
    },

    /**
     * 更新拖拽范围，使用户可以动态修改滑块的拖拽范围
     * @private
     */
    _updateDragRange : function(){
        var me = this,
            body = me.getBody();
        me._dragOpt.range[2] = body.clientHeight;
        me._dragOpt.range[1] = body.clientWidth;
        me._dragOpt.range[3] = 0;
    },

    /**
     * 更新slider状态
     * @public
     * @param   {Object}                 [options]    选项layout
     * @config  {Number}                 value        记录滑块的当前进度值
     * @config  {Number}                 layout       滑块的布局[水平：horizontal,垂直：vertical]
     * @config  {Number}                 min          进度条最左边代表的值
     * @config  {Number}                 max          进度条最右边代表的值
     * @config  {Boolean}                disabled     是否禁用
     * @config  {String}                 skin         自定义样式名称前缀
     */
    update : function(options){
        var me = this,
            axis = me._axis[me.layout],
            body = me.getBody();
        options = options || {};
        baidu.object.extend(me, options);
        me._updateDragRange();
        me._adjustValue();
        if (me.dispatchEvent("beforesliderto", {drop: options.drop})) {
            me.getThumb().style[axis.pos] = me._parseValue(me.value, 'pix') + 'px';
            me.dispatchEvent("update");
        }
    },

    /**
     * 校准value值，保证它在range范围内
     * @private
     */
    _adjustValue : function(){
        var me = this;
        me.value = Math.max(Math.min(me.value, me.range[1]), me.range[0]);
    },

    /**
     * 将位置值转换为value，记录在当前实例中
     * @private
     * @param {number} position
     */
    _calcValue : function(pos){
        var me = this;
        me.value = me._parseValue(pos, 'value');
        me._adjustValue();
    },
    
    /**
     * 将刻度转换为像素或是将像素转换为刻度
     * @param {Number} val 刻度值或是像素
     * @param {Object} type 'pix':value to pix, 'value': pix to value
     */
    _parseValue: function(val, type){
        var me = this,
            axis = me._axis[me.layout];
            len = me.getBody()[axis.clientSize] - me.getThumb()[axis.offsetSize];
        if(type == 'value'){
            val = (me.max - me.min) / len * val + me.min;
        }else{//to pix
            val = Math.round(len /(me.max - me.min) * (val - me.min));
        }
        return val;
    },

    /**
     * 获得当前的value
     * @public
     * @return {Number} value     当前滑块位置的值
     */
    getValue : function(){
        return this.value;
    },
    
    /**
     * 获取target元素
     * @private
     * @return {HTMLElement} target
     */
    getTarget : function(){
        return baidu.g(this.targetId);
    },
    
    /**
     * 获取滑块元素
     * @public
     * @return {HTMLElement} thumb     滑块元素
     */
    getThumb : function(){
        return baidu.g(this.getId("thumb"));
    },

    /**
     * 销毁当前实例
     * @public
     */
    dispose : function(){
        var me = this;
        baidu.dom.remove(me.getId());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});