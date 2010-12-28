/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/popup/Popup.js
 * author: berg,rocy
 * version: 1.0.0
 * date: 2010-05-18
 */


//依赖包
///import baidu.ui.createUI;
///import baidu.page.getViewWidth;
///import baidu.page.getViewHeight;
///import baidu.page.getScrollLeft;
///import baidu.page.getScrollTop;

///import baidu.event.on;
///import baidu.object.extend;


///import baidu.dom.g;
///import baidu.dom.setStyles;
///import baidu.dom._styleFilter.px;
///import baidu.dom.insertHTML;
///import baidu.dom.remove;

///import baidu.string.format;


//声明包
///import baidu.ui.popup;


/**
 *
 * popup基类，建立一个popup实例，这个类原则上不对外暴露
 * reference: http://docs.jquery.com/UI/Popup (Popup in jquery)
 * 
 * @param  {Object}             options optional        选项参数
 * @config {DOMElement}                 content         放在content区域的元素
 * @config {String}                     contentText     放在content区域的字符串
 * @config {String}                     width           宽度
 * @config {String}                     height          高度
 * @config {String}                     popupClass     CSS前缀
 * @config {Function}                   onopen          当popup展示时触发
 * @config {Function}                   onclose         当popup隐藏时触发
 * @config {Function}                   onupdate        当popup更新位置时触发
 * @return {Popup}                                     Popup类
 */

baidu.ui.popup.Popup = baidu.ui.createUI(function (options){
}).extend({
    //ui控件的类型，传入给UIBase **必须**
    uiType            : "popup",
   //ui控件的class样式前缀 可选
    //classPrefix     : "tangram-popup-",

    width           : '',
    height          : '',

    top             : 'auto',
    left            : 'auto',
    zIndex          : 1200,//没有做层管理
    //content         : null,//dom节点
    contentText     : '',

    //onopen          : function(){},
    onbeforeclose   : function(){ return true},
    //onclose         : function(){},
    //onupdate        : function(){},


    tplBody          : "<div id='#{id}' class='#{class}'></div>",

    /**
     * 查询当前窗口是否处于显示状态
     */
    isShown : function(){
        return baidu.ui.popup.instances[this.guid] == 'show';
    },

    getString : function(){
        var me = this;
        return baidu.format(
                me.tplBody, {
                    id      : me.getId(),
                    "class" : me.getClass()
                }
            );
    },

    /*
     * render popup到DOM树
     */
    render : function(){
        var me = this,
            main;

        //避免重复render
        if(me.getMain()){
            return ;
        }

        main = me.renderMain();
        
        main.innerHTML = me.getString();

		me.update(me);

        baidu.dom.setStyles(me.getMain(), {
            position    : "absolute",
            zIndex      : me.zIndex,
            marginLeft  : "-100000px"
        });
        
        me.dispatchEvent("onload");

        return main;
    },

    /*
     * 显示当前popup
     */
    open : function(options){
        var me = this;

        me.update(options);

        me.getMain().style.marginLeft = "auto";
        
        baidu.ui.popup.instances[me.guid] = "show";

        me.dispatchEvent("onopen");
    },

    /*
     * 隐藏当前popup
     */
    close : function(){
        var me = this;
        if(me.dispatchEvent("onbeforeclose")){
            me.getMain().style.marginLeft = "-100000px";
            baidu.ui.popup.instances[me.guid] = "hide";
            me.dispatchEvent("onclose");
        }
    },
    
    /*
     * 更新popup状态 
     * @param  {Object}             options optional        选项参数
     *
     */
    update : function(options){
        options = options || {};
        var me = this, contentWrapper = me.getBody();

        //扩展options属性
        baidu.object.extend(me, options);

        //更新内容
        if(options.content){
            //content优先
            if(contentWrapper.firstChild != options.content){
                contentWrapper.innerHTML = "";
                contentWrapper.appendChild(options.content);
            }
        }else if(options.contentText){
            //建议popup不要支持text
            contentWrapper.innerHTML = options.contentText;
        }
		me._updateSize();
        me._updatePosition();
        me.dispatchEvent("onupdate");
    },
    
    /**
	 * 更新大小,子类可以通过同名方法覆盖;
	 * 默认实现为使用参数的width和height赋值
	 */
    //[Interface]
    _updateSize : function(){
    	var me = this;
        baidu.dom.setStyles(me.getMain(), { width : me.width, height : me.height});
    },
	/**
	 * 更新位置,子类可以通过同名方法覆盖;
	 * 默认实现为使用参数的top和left赋值
	 */
    //[Interface]
    _updatePosition : function(){
    	var me = this;
        baidu.dom.setStyles(me.getMain(), { top : me.top, left : me.left});
    },
    
    dispose : function(){
    	var me = this;
    	me.dispatchEvent("ondispose");
    	baidu.dom.remove(me.getMain());
    	baidu.lang.Class.prototype.dispose.call(me);
    }
});
