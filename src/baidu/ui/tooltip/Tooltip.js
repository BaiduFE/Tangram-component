/**
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/tooltip/Tooltip.js
 * author: rocy
 * version: 1.0.0
 * date: 2010-05-18
 */


///import baidu.ui.tooltip;
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
 * @param {Object} options 选项
 * @param {Object} [options.width] 宽度
 * @param {Object} [options.height] 高度
 */
baidu.ui.tooltip.Tooltip = baidu.ui.createUI(new Function).extend({
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
	//开关函数,返回false时不显示
	toggle			: function(){return true},

	getString : function(){
		var me = this;
		return baidu.format(me.tplBody,{
			id: me.getId(),
			"class" : me.getClass()
		});
	},
    
	/**
	 * 打开tooltip
	 */
	open : function(){
		var me = this,
            showing;
        if(typeof me.toggle == "function" && !me.toggle()){
        	return;
        }
		if(!me.dispatchEvent("onbeforeopen")) return;
        if(showing = baidu.ui.tooltip.showing){
            showing.close();
        }
        
        //show element
		//me.contentElement && (me.contentElement.style.display = "");
		me.update(me);

		baidu.ui.tooltip.showing = me;

		me.dispatchEvent("onopen");
	},
	
	/**
	 * 渲染Tooltip
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
        if(baidu.ui.tooltip.mainId){
            me.mainId = baidu.ui.tooltip.mainId;
            
		    me.dispatchEvent("onload");
            return ;
        }
        main = me.renderMain(me.container);
        baidu.ui.tooltip.mainId = me.mainId;
		me.dispatchEvent("onload");
	},
	
	/**
	 * 更新options
	 * @param {} options
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
        baidu.ui.tooltip.showing = null;
    },
	
	dispose : function(){
		var me = this;
		me.dispatchEvent('ondispose');
		if(me.getBody()){
			baidu.dom.remove(me.getBody());
		}
		baidu.lang.Class.prototype.dispose.call(me);
	},

    getTarget : function(){
        return baidu.g(this.targetId);
    }
});
