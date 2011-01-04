/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/slider/Slider.js
 * author: berg
 * version: 1.0.0
 * date: 2010/09/02
 */


///import baidu.ui.slider;
///import baidu.ui.createUI;

///import baidu.object.extend;

///import baidu.dom.g;
///import baidu.dom.remove;
///import baidu.dom.setStyle;
///import baidu.dom._styleFilter.px;
///import baidu.dom.getStyle;
///import baidu.dom.insertHTML;
///import baidu.dom.draggable;
///import baidu.dom.getPosition;

///import baidu.string.toCamelCase;

///import baidu.event.getTarget;

///import baidu.page.getMousePosition;

///import baidu.string.format;


/**
 *
 * 拖动条控件，可用作音乐播放进度
 *
 * @param options
 */
baidu.ui.slider.Slider = baidu.ui.createUI(function(options){
    var me = this;
    options = options || {};
    me.layout = options.layout || "horizontal";
    //初始化range
    if(!options.range){
        me.range = [me.min, me.max];
    }
    
}).extend({
	//滑块的布局方式 horizontal :水平  vertical:垂直
	layout          : "horizontal",
    uiType          : "slider",
	tplBody			: '<div id="#{id}" class="#{class}" onmousedown="#{mousedown}">#{thumb}</div>',
    tplThumb        : '<div id="#{thumbId}" class="#{thumbClass}" style="position:absolute;"></div>',
    //位置换算
	axis:{
		horizontal : {mousePos : "x", mainPos : "left", thumbSize : "offsetWidth", thumbPos : "left", _getSize : "_getWidth", _getThumbSize : "_getThumbWidth"},
		vertical : {mousePos : "y", mainPos : "top", thumbSize : "offsetHeight", thumbPos : "top", _getSize : "_getHeight", _getThumbSize : "_getThumbHeight"}
	},
    //初始化时，进度条所在的值
    value           : 0,
    //进度条最左边代表的值
    min             : 0,
    //进度条最右边代表的值
    max             : 100,

    disabled        : false,

    //拖拽的范围
    //range         : [min, max]

    _dragOpt        : {},

    /**[回复]
     * 获得slider控件字符串
     * @return {string} HTML string
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
     */
    _mouseDown : function(e){
        var me = this,
            mousePos = baidu.page.getMousePosition(),
            mainPos = baidu.dom.getPosition(me.getMain()),
			len=0;
        
        //如果点在了滑块上面，就不移动
        if(baidu.event.getTarget(e) == me.getThumb()){
            return ;
        }
		len = mousePos[me.axis[me.layout].mousePos] - mainPos[me.axis[me.layout].mainPos] - me.getThumb()[me.axis[me.layout].thumbSize]/ 2;
        me._calcValue(len);
        //如果点击的地方在range之外，不发送stop事件
        if(me.update()){
            me.dispatchEvent("slidestop");
        }
        me.dispatchEvent("slideclick");
    },
    
	/**
	 * 渲染slider
	 * @param {HTMLElement} target
	 */
	render : function(target){
		var me = this,
            main,
            thumbWidth;

        if(!target){
            return ;
        }
        
        baidu.dom.insertHTML(me.renderMain(target), "beforeEnd", me.getString());
        me.getMain().style.position = "relative";
        me._createThumb();
        me.update();
		me.dispatchEvent("onload");
	},

    /**
     * 创建滑块
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
								var len = me.getThumb().style[me.axis[me.layout].thumbPos];
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
     */
    _updateDragRange : function(){
        var me = this,
            range = me.range,
			ratio = 0;
        me._dragOpt.range[2] = me._getHeight();
		ratio =(me[me.axis[me.layout]._getSize]() - me[me.axis[me.layout]._getThumbSize]()) / ( me.max - me.min );

		if(me.layout == "horizontal"){
			if(typeof range != 'undefined'){
				me._dragOpt.range[1] = range[1] * ratio + me._getThumbWidth();
				me._dragOpt.range[3] = range[0] * ratio;
			}else{
				me._dragOpt.range[1] = me._getWidth();
				me._dragOpt.range[3] = 0;
			}
		} else {
			if(typeof range != 'undefined'){
				me._dragOpt.range[2] = range[1] * ratio + me._getThumbHeight();
				me._dragOpt.range[1] = me._getThumbWidth();
			}else{
				me._dragOpt.range[1] = me._getWidth();
				me._dragOpt.range[3] = 0;
			}
		}
    },

    /**
     * 更新slider状态
     */
    update : function(options){
        var me = this,len=0;
        options = options || {};
        baidu.object.extend(me, options);
        me._updateDragRange();
        me._adjustValue(); 
        if(me.value == me._lastValue){
            return ;
        }
        me._lastValue = me.value;
		len = me[me.axis[me.layout]._getSize]()- me[me.axis[me.layout]._getThumbSize]();
        baidu.dom.setStyle(me.getThumb(), me.axis[me.layout].thumbPos, me.value * (len) / ( me.max - me.min ) );
		me.dispatchEvent("update");
    },

    /**
     * 校准value值，保证它在range范围内
     */

    _adjustValue : function(){
        var me = this;
        me.value = Math.max(Math.min(me.value, me.range[1]), me.range[0]);
    },

    /**
     * 将位置值转换为value，记录在当前实例中
     * @param {number} position
     */
    _calcValue : function(pos){
        var me = this, len = me[me.axis[me.layout]._getSize]()-me[me.axis[me.layout]._getThumbSize]();
        me.value = pos * (me.max - me.min) / (len);
        me._adjustValue(); 
    },

    /**
     * 获得body元素的width
     * todo: 考虑把两个函数放入基类
     */
    _getWidth : function(){
        return parseInt(baidu.dom.getStyle(this.getBody(), "width"));
    },

    /**
     * 获得body元素的height
     */
    _getHeight : function(){
        return parseInt(baidu.dom.getStyle(this.getBody(), "height"));
    },


    /**
     * 获得thumb元素的width
     */
    _getThumbWidth : function(){
        return parseInt(baidu.dom.getStyle(this.getThumb(), "width"));
    },
	/**
     * 获得thumb元素的height
     */
    _getThumbHeight : function(){
        return parseInt(baidu.dom.getStyle(this.getThumb(), "height"));
    },

    /**
     * 获得当前的value
     * @return {number} value
     */
    getValue : function(){
        return this.value;
    },

    /**
     * 禁用滑块
     */
    disable : function(){
        this.disabled = true;
    },

    /**
     * 启用滑块
     */
    enable : function(){
        this.disabled = false;
    },
    
    /**
     * 获取target元素
     * @return {HTMLElement} target
     */
    getTarget : function(){
        return baidu.g(this.targetId);
    },
	
    /**
     * 获取滑块元素
     * @return {HTMLElement} thumb
     */
    getThumb : function(){
        return baidu.g(this.getId("thumb"));
    },

    /**
     * 销毁当前实例
     */
    dispose : function(){
        var me = this;
        baidu.dom.remove(me.getId());
    }
});
