/**
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/Tooltip.js
 * author: rocy
 * version: 1.0.0
 * date: 2010-05-18
 */

///import baidu.ui.createUI;

///import baidu.object.extend;

///import baidu.dom.g;
///import baidu.dom.setStyles;
///import baidu.dom.remove;

///import baidu.string.format;

///import baidu.ui.smartPosition.mouse;
///import baidu.ui.smartPosition.element;

 /**
 * 弹出tip层,类似鼠标划过含title属性元素的效果
 * @class
 * @param       {Object}          options         选项
 * @config      {Element}         content         Tooltip元素的内部html。当指定target时，默认为target的title属性，否则默认为空。
 * @config      {String}          width           宽度
 * @config      {String}          height          高度
 * @config      {Array|Object}    offset          偏移量。若为数组，索引0为x方向，索引1为y方向；若为Object，键x为x方向，键y为y方向。单位：px，默认值：[0,0]。
 * @config      {boolean}         single          是否全局单例。若该值为true，则全局共用唯一的浮起tooltip元素，默认为true。
 * @config      {Number}          zIndex          浮起tooltip层的z-index值，默认为3000。
 * @config      {String}          positionBy      浮起tooltip层的位置参考，取值['mouse','element']，分别对应针对鼠标位置或者element元素计算偏移，默认mouse。
 * @config      {Function}        onopen          打开tooltip时触发。
 * @config      {Function}        onclose         关闭tooltip时触发。
 * @config      {Function}        onbeforeopen    打开tooltip前触发。
 * @config      {Function}        onbeforeclose   关闭tooltip前触发。
 * @config      {Number}          showDelay       触发显示的延迟，默认为100毫秒。
 * @config      {Number}          hideDelay       触发隐藏的延迟，默认为500毫秒。
 * @plugin      fx                Tooltip的展现和消失效果支持。
 * @returns     {baidu.ui.Tooltip}        Tooltip实例
 */
 
baidu.ui.Tooltip = baidu.ui.createUI(new Function).extend(
    /**
     *  @lends baidu.ui.Tooltip.prototype
     */
{
	//ui控件的类型 **必须**
    uiType            : "tooltip",
    //ui控件的class样式前缀 可选
    //classPrefix     : "tangram_tooltip_",
    width			: '',
    height			: '',
	//contentElement: 内容dom节点
    //container		: tooltip容器
	content			: '',
	zIndex			: 3000,
	positionBy		: 'element',
	offsetPosition	: 'bottomRight',
	offset			: [0,0],
	tplBody			: '<div id="#{id}" class="#{class}"></div>',
	/**
	 * 开关函数,返回false时不显示
     * @private
     */
	toggle			: function(){return true},
    /**
     * @private
     */
	getString : function(){
		var me = this;
		return baidu.format(me.tplBody,{
			id: me.getId(),
			"class" : me.getClass()
		});
	},
    
	/**
	 * 打开tooltip
	 * @public
	 */
	open : function(){
		var me = this,
            showing;
        if(typeof me.toggle == "function" && !me.toggle()){
        	return;
        }
		if(!me.dispatchEvent("onbeforeopen")) return;
        if(showing = baidu.ui.Tooltip.showing){
            showing.close();
        }
        
        //show element
		//me.contentElement && (me.contentElement.style.display = "");
		me.update(me);

		baidu.ui.Tooltip.showing = me;

		me.dispatchEvent("onopen");
	},
	
	/**
	 * 渲染Tooltip
	 * @param  {String|HTMLElement}    target      需要渲染到的元素或者id    
	 * @public
	 */
	render : function(target){
		var me = this,
            main;
        //FIXME: 这段targetId的设置是否移至ui.create中?    
        if(target.id){
            me.targetId = target.id;
        }else{
            me.targetId = target.id = me.getId("target");
        }
        me.content = me.content || target.title || '';
        target.title = '';

        //保证DOM单例 
        if(baidu.ui.Tooltip.mainId){
            me.mainId = baidu.ui.Tooltip.mainId;
            
		    me.dispatchEvent("onload");
            return ;
        }
        main = me.renderMain(me.container);
        baidu.ui.Tooltip.mainId = me.mainId;
		me.dispatchEvent("onload");
	},
	
	/**
	 * 更新options
	 * @public
	 * @param       {object}          options         选项
     * @config      {Element}         content         Tooltip元素的内部html。当指定target时，默认为target的title属性，否则默认为空。
     * @config      {String}          width           宽度
     * @config      {String}          height          高度
     * @config      {Array|Object}    offset          偏移量。若为数组，索引0为x方向，索引1为y方向；若为Object，键x为x方向，键y为y方向。单位：px，默认值：[0,0]。
     * @config      {boolean}         single          是否全局单例。若该值为true，则全局共用唯一的浮起tooltip元素，默认为true。
     * @config      {Number}          zIndex          浮起tooltip层的z-index值，默认为3000。
     * @config      {String}          positionBy      浮起tooltip层的位置参考，取值['mouse','element']，分别对应针对鼠标位置或者element元素计算偏移，默认mouse。
     * @config      {Function}        onopen          打开tooltip时触发。
     * @config      {Function}        onclose         关闭tooltip时触发。
     * @config      {Function}        onbeforeopen    打开tooltip前触发。
     * @config      {Function}        onbeforeclose   关闭tooltip前触发。
     * @config      {Number}          showDelay       触发显示的延迟，默认为100毫秒。
     * @config      {Number}          hideDelay       触发隐藏的延迟，默认为500毫秒。
	 */
	update : function(options){
		var me = this,
			main = me.getMain(), 
            body;

        //因为所有tooltip用的是同一套壳子，每次update的时候更新innerHTML和guid
        main.innerHTML = me.getString();
        body = me.getBody();


		options = options || {};
		baidu.object.extend(this,options);

        baidu.dom.setStyles(main,{
            zIndex   : me.zIndex,
            width    : me.width,
            height   : me.height,
            // 防止插件更改display属性,比如fx.
            display  : ""
        });
        
        if(options.contentElement){
        	//XXX: 这句代码乍一看太吓人了...
            body.innerHTML = "";
            body.appendChild(options.contentElement);
        } else if(options.content) {
            body.innerHTML = me.content;
        }
		
        me._setPosition();
	},
	
	_setPosition : function(){
		var me = this,
			smartPosition = baidu.ui.smartPosition,
			positionOptions = {
				once : true,
				offset : me.offset,
				position: me.offsetPosition,
				insideScreen: 'surround'
			};
		switch(me.positionBy){
			case "element":
				smartPosition.element(me.getMain(), me.getTarget(),positionOptions);
				break;
			case "mouse":
				smartPosition.mouse(me.getMain(), positionOptions);
				//smartPosition.set(me.getMain(), me.pos, {once : true});
				break;
			default :
				break;
		}
	},
	
	/**
	 * 关闭tooltip
	 * @public
	 */
	close : function(){
		var me = this;
        
		
        //只能关闭自己创建的tooltip
        if(!me.getBody()){
            return ;
        }

        if(me.dispatchEvent("onbeforeclose")){
        	me._close();
            me.dispatchEvent("onclose");
        }
    },

    _close:function(){
        this.getMain().style.left = "-100000px";
        baidu.ui.Tooltip.showing = null;
    },
	/**
	 * 销毁控件
	 * @public
	 */
	dispose : function(){
		var me = this;
		me.dispatchEvent('ondispose');
		if(me.getBody()){
			baidu.dom.remove(me.getBody());
		}
		baidu.lang.Class.prototype.dispose.call(me);
	},
    /**
     * 获取target元素
	 * @private
	 */
    getTarget : function(){
        return baidu.g(this.targetId);
    }
});
