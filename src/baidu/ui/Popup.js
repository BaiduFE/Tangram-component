/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

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

/*
 * popup基类，建立一个popup实例，这个类原则上不对外暴露
 * reference: http://docs.jquery.com/UI/Popup (Popup in jquery)
 */

 /**
 * popup 基类，建立一个popup实例
 * @class
 * @grammar new baidu.ui.Popup(options)
 * @param     {Object}             options               选项
 * @config    {DOMElement}         content               要放到popup中的元素，如果传此参数时同时传contentText，则忽略contentText。
 * @config    {String}             contentText           popup中的内容
 * @config    {String|Number}      width                 内容区域的宽度。注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
 * @config    {String|Number}      height                内容区域的高度
 * @config    {String|Number}      top                   popup距离页面上方的距离
 * @config    {String|Number}      left                  popup距离页面左方的距离
 * @config    {String}             classPrefix           popup样式的前缀
 * @config    {Number}             zIndex                popup的zIndex值
 * @config    {Function}           onopen                popup打开时触发
 * @config    {Function}           onclose               popup关闭时触发
 * @config    {Function}           onbeforeclose         popup关闭前触发，如果此函数返回false，则组织popup关闭。
 * @config    {Function}           onupdate              popup更新内容时触发
 * @config    {Boolean}            closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭popup
 * @config    {String}             closeText             closeButton模块提供支持，关闭按钮上的文字
 * @config    {Boolean}            modal                 modal模块支持，是否显示遮罩
 * @config    {String}             modalColor            modal模块支持，遮罩的颜色
 * @config    {Number}             modalOpacity          modal模块支持，遮罩的透明度
 * @config    {Number}             modalZIndex           modal模块支持，遮罩的zIndex值
 * @config    {Boolean}            draggable             draggable模块支持，是否支持拖拽
 * @config    {Function}           ondragstart           draggable模块支持，当拖拽开始时触发
 * @config    {Function}           ondrag                draggable模块支持，拖拽过程中触发
 * @config    {Function}           ondragend             draggable模块支持，拖拽结束时触发
 * @plugin 	  coverable 		   支持背景遮罩
 * @remark
 * @return {baidu.ui.Popup}                                    Popup类
 */

baidu.ui.Popup = baidu.ui.createUI(function (options){
}).extend(
/**
 *  @lends baidu.ui.Popup.prototype
 */
{
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
    /**
     * @private
     */
    onbeforeclose   : function(){ return true},
    //onclose         : function(){},
    //onupdate        : function(){},


    tplBody          : "<div id='#{id}' class='#{class}' style='position:relative; top:0px; left:0px;'></div>",

    /**
     * 查询当前窗口是否处于显示状态
     * @public
     * @return    {Boolean}       是否处于显示状态
     */
    isShown : function(){
        return baidu.ui.Popup.instances[this.guid] == 'show';
    },

    /**
     * @private
     */
    getString : function(){
        var me = this;
        return baidu.format(
                me.tplBody, {
                    id      : me.getId(),
                    "class" : me.getClass()
                }
            );
    },

    /**
     * render popup到DOM树
     * @private
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

        me._update(me);

        baidu.dom.setStyles(me.getMain(), {
            position    : "absolute",
            zIndex      : me.zIndex,
            marginLeft  : "-100000px"
        });
        
        me.dispatchEvent("onload");

        return main;
    },

    /**
     * 显示当前popup
     * @public
     * @param  {Object}             options               选项参数
     * @config {DOMElement}         content               要放到popup中的元素，如果传此参数时同时传contentText，则忽略contentText。
     * @config {String}             contentText           popup中的内容
     * @config {String|Number}      width                 内容区域的宽度。注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
     * @config {String|Number}      height                内容区域的高度
     * @config {String|Number}      top                   popup距离页面上方的距离
     * @config {String|Number}      left                  popup距离页面左方的距离
     * @config {String}             classPrefix           popup样式的前缀
     * @config {Number}             zIndex                popup的zIndex值
     * @config {Function}           onopen                popup打开时触发
     * @config {Function}           onclose               popup关闭时触发
     * @config {Function}           onbeforeclose         popup关闭前触发，如果此函数返回false，则组织popup关闭。
     * @config {Function}           onupdate              popup更新内容时触发
     * @config {Boolean}            closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭popup
     * @config {String}             closeText             closeButton模块提供支持，关闭按钮上的文字
     * @config {Boolean}            modal                 modal模块支持，是否显示遮罩
     * @config {String}             modalColor            modal模块支持，遮罩的颜色
     * @config {Number}             modalOpacity          modal模块支持，遮罩的透明度
     * @config {Number}             modalZIndex           modal模块支持，遮罩的zIndex值
     * @config {Boolean}            draggable             draggable模块支持，是否支持拖拽
     * @config {Function}           ondragstart           draggable模块支持，当拖拽开始时触发
     * @config {Function}           ondrag                draggable模块支持，拖拽过程中触发
     * @config {Function}           ondragend             draggable模块支持，拖拽结束时触发
     */
    open : function(options){
        var me = this;

        me._update(options);

        me.getMain().style.marginLeft = "auto";
        
        baidu.ui.Popup.instances[me.guid] = "show";

        me.dispatchEvent("onopen");
    },

    /**
     * 隐藏当前popup
     * @public
     */
    close : function(){
        var me = this;
        if(me.dispatchEvent("onbeforeclose")){
            me.getMain().style.marginLeft = "-100000px";
            baidu.ui.Popup.instances[me.guid] = "hide";
            me.dispatchEvent("onclose");
        }
    },
    
    /**
     * 更新popup状态 
     * @public
     * @param  {Object}             options               选项参数
     * @config {DOMElement}         content               要放到popup中的元素，如果传此参数时同时传contentText，则忽略contentText。
     * @config {String}             contentText           popup中的内容
     * @config {String|Number}      width                 内容区域的宽度。注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
     * @config {String|Number}      height                内容区域的高度
     * @config {String|Number}      top                   popup距离页面上方的距离
     * @config {String|Number}      left                  popup距离页面左方的距离
     * @config {String}             classPrefix           popup样式的前缀
     * @config {Number}             zIndex                popup的zIndex值
     * @config {Function}           onopen                popup打开时触发
     * @config {Function}           onclose               popup关闭时触发
     * @config {Function}           onbeforeclose         popup关闭前触发，如果此函数返回false，则组织popup关闭。
     * @config {Function}           onupdate              popup更新内容时触发
     * @config {Boolean}            closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭popup
     * @config {String}             closeText             closeButton模块提供支持，关闭按钮上的文字
     * @config {Boolean}            modal                 modal模块支持，是否显示遮罩
     * @config {String}             modalColor            modal模块支持，遮罩的颜色
     * @config {Number}             modalOpacity          modal模块支持，遮罩的透明度
     * @config {Number}             modalZIndex           modal模块支持，遮罩的zIndex值
     * @config {Boolean}            draggable             draggable模块支持，是否支持拖拽
     * @config {Function}           ondragstart           draggable模块支持，当拖拽开始时触发
     * @config {Function}           ondrag                draggable模块支持，拖拽过程中触发
     * @config {Function}           ondragend             draggable模块支持，拖拽结束时触发
     *
     */
    update : function(options){
        var me = this;
        me._update(options);
        me.dispatchEvent("onupdate");
    },
   
    _update: function(options){
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
    /**
     * 销毁控件
     * @public
     */
    dispose : function(){
        var me = this;
        me.dispatchEvent("ondispose");
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});

baidu.ui.Popup.instances = baidu.ui.Popup.instances || [];

