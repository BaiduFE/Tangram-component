/**
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.createUI;
///import baidu.ui.behavior.posable.setPositionByElement;
///import baidu.ui.behavior.posable.setPositionByMouse;

///import baidu.object.extend;
///import baidu.dom.g;
///import baidu.dom.setStyles;
///import baidu.dom.remove;
///import baidu.string.format;
///import baidu.dom.insertHTML;
///import baidu.lang.toArray;
///import baidu.dom.children;
///import baidu.object.each;
///import baidu.array.each;
///import baidu.dom.getAttr;
///import baidu.dom.setAttr;

 /**
 * 弹出tip层,类似鼠标划过含title属性元素的效果
 * @class
 * @grammar new baidu.ui.Tooltip(options)
 * @param       {Object}          options         选项.
 * @config      {String|Array}    target          目标元素或元素id。可直接设置多个目标元素
 * @config      {String}          type            （可选）触发展开的类型，可以为:hover和click。默认为click
 * @config      {Element}         contentElement  （可选）Tooltip元素的内部HTMLElement。
 * @config      {String}          content         （可选）Tooltip元素的内部HTML String。若target存在title，则以title为准
 * @config      {String}          width           （可选）宽度
 * @config      {String}          height          （可选）高度
 * @config      {Array|Object}    offset          （可选）偏移量。若为数组，索引0为x方向，索引1为y方向；若为Object，键x为x方向，键y为y方向。单位：px，默认值：[0,0]。
 * @config      {boolean}         single          （可选）是否全局单例。若该值为true，则全局共用唯一的浮起tooltip元素，默认为true。
 * @config      {Number}          zIndex          （可选）浮起tooltip层的z-index值，默认为3000。
 * @config      {String}          positionBy      （可选）浮起tooltip层的位置参考，取值['mouse','element']，分别对应针对鼠标位置或者element元素计算偏移，默认mouse
 * @config      {Element}         positionElement （可选）定位元素，设置此元素且positionBy为element时，根据改元素计算位置
 * @config      {Boolean}         autoRender       是否自动渲染。
 * @config      {Function}        onopen          （可选）打开tooltip时触发。
 * @config      {Function}        onclose         （可选）关闭tooltip时触发。
 * @config      {Function}        onbeforeopen    （可选）打开tooltip前触发。
 * @config      {Function}        onbeforeclose   （可选）关闭tooltip前触发。
 * @plugin      fx                Tooltip的展现和消失效果支持。
 * @return     {baidu.ui.Tooltip}        Tooltip实例
 */

baidu.ui.Tooltip = baidu.ui.createUI(function(options) {
    
    var me = this;
    me.target = me.getTarget();
    me.offset = options.offset || [0, 0];
    me.positionElement = null;

    baidu.ui.Tooltip.showing[me.guid] = me;

}).extend(
/**
 *  @lends baidu.ui.Tooltip.prototype
 */
{
    uiType: 'tooltip',

    width: '',
    height: '',
    zIndex: 3000,
    currentTarget: null,

    type: 'click',

    posable: true,
    positionBy: 'element',
	offsetPosition: 'bottomright',

    isShowing: false,

    tplBody: '<div id="#{id}" class="#{class}"></div>',

    /**
     * 获取Tooltip的HTML字符串
     * @private
     * @return {String} TooltipHtml
     */
    getString: function() {
		var me = this;
		return baidu.format(me.tplBody, {
			id: me.getId(),
			'class' : me.getClass()
		});
	},

    /**
	 * 开关函数,返回false时不显示
     * @private
     */
	toggle: function() {return true},
    
    /**
     * 渲染Tooltip到HTML
     * @public 
     */
    render: function() {
        var me = this,
            main,title;

        main = me.renderMain();

        baidu.each(me.target, function(t,index){
            if((title = baidu.getAttr(t, 'title')) && title != ''){
                baidu.setAttr(t, 'tangram-tooltip-title', title);
                baidu.setAttr(t, 'title', '');
            }
        });
        baidu.dom.insertHTML(main,"beforeend",me.getString());
        me._update();
        me._close();
        
        me.dispatchEvent('onload');
    },

	/**
	 * 打开tooltip
	 * @public
     * @param {HTMLElement} [target] 显示tooltip所参照的html元素
	 */
	open: function(target) {
		var me = this,
            showTooltip = baidu.ui.Tooltip.showing,
            isSingleton = baidu.ui.Tooltip.isSingleton,
            target = target || me.target[0],
            currentTarget = me.currentTarget,
            body = me.getBody();

         //判断是否为当前打开tooltip的target
         //若是，则直接返回
        if(currentTarget === target) return;
        
        //若target为本组中之一，则关闭当前current
        me.isShowing && me.close(currentTarget);

        //查看当前tooltip全局设置,若为单例，关闭当前打开的tooltip
        if(isSingleton){
            baidu.object.each(showTooltip,function(tooltip,key){
                if(key != me.guid && tooltip.isShowing){
                    tooltip.close(); 
                } 
            });
        }

        //若toggle函数返回false，则直接返回
        if (typeof me.toggle == 'function' && !me.toggle()) return;

        me.currentTarget = target;

        me._updateBodyByTitle();
        me._setPosition();
        me.isShowing = true;
        
        //若onbeforeopen事件返回值为false，则直接返回
        if (me.dispatchEvent('onbeforeopen')){
            me.dispatchEvent('open');
            return;
        }
	},

    _updateBody: function(options){
        var me = this,
            options = options || {},
            body = me.getBody(),
            title;

        if(me.contentElement && me.contentElement !== body.firstChild){
            
            //若存在me.content 并且该content和content里面的firstChild不一样
            body.innerHTML = '';
            body.appendChild(me.contentElement);
            me.contentElement = body.firstChild;
        
        }else if(typeof options.contentElement != 'undefined'){
            
            //若options.content存在，则认为用户向对content进行更新
            body.innerHTML = '';
            options.contentElement != null && body.appendChild(options.contentElement);
        
        }
        
        if(!options.contentElement){
            if(typeof options.content == 'string'){

                //若存在options.contentText，则认为用户相对contentText进行更新
                body.innerHTML = '';
                body.innerHTML = options.content;

            }else if(typeof me.content == 'string' && baidu.dom.children(body).length == 0 ) {
                //第一次new Tooltip时传入contentText，进行渲染
                body.innerHTML = me.content;
            }
        }
    },
	
    _updateBodyByTitle:function(){
        var me = this,
            body = me.getBody();
        
        if(!me.contentElement && !me.content && me.currentTarget){
            if((title = baidu.getAttr(me.currentTarget, 'tangram-tooltip-title')) && title != ''){
                body.innerHTML = title;
            }else{
                body.innerHTML = '';
            }
        }

    },

    /**
     * 更新tooltip属性值
     * @private
     * @param {Object} options 属性集合
     */
    _update: function(options){
        var me = this,
            options = options || {},
            main = me.getMain(),
            body = me.getBody();

        me._updateBody(options);
        baidu.object.extend(me, options);
        me.contentElement = baidu.dom.children(body).length > 0 ? body.firstChild : null;
        me._updateBodyByTitle();

        //更新寛高数据
        baidu.dom.setStyles(main, {
            zIndex: me.zIndex,
            width: me.width,
            height: me.height,
            // 防止插件更改display属性,比如fx.
            display: ''
        });
    },
    
    /**
     * 更新options
     * @public
     * @param       {Object}          options         选项.
     * @config      {String|Array}    target          目标元素或元素id。可直接设置多个目标元素
     * @config      {String}          type            （可选）触发展开的类型，可以为:hover和click。默认为click
     * @config      {Element}         contentElement  （可选）Tooltip元素的内部HTMLElement。
     * @config      {String}          content         （可选）Tooltip元素的内部HTML String。若target存在title，则以title为准
     * @config      {String}          width           （可选）宽度
     * @config      {String}          height          （可选）高度
     * @config      {Array|Object}    offset          （可选）偏移量。若为数组，索引0为x方向，索引1为y方向；若为Object，键x为x方向，键y为y方向。单位：px，默认值：[0,0]。
     * @config      {boolean}         single          （可选）是否全局单例。若该值为true，则全局共用唯一的浮起tooltip元素，默认为true。
     * @config      {Number}          zIndex          （可选）浮起tooltip层的z-index值，默认为3000。
     * @config      {String}          positionBy      （可选）浮起tooltip层的位置参考，取值['mouse','element']，分别对应针对鼠标位置或者element元素计算偏移，默认mouse。
     * @config      {Element}         positionElement （可选）定位元素，设置此元素且positionBy为element时，根据改元素计算位置
     * @config      {Boolean}         autoRender       是否自动渲染。
     * @config      {Function}        onopen          （可选）打开tooltip时触发。
     * @config      {Function}        onclose         （可选）关闭tooltip时触发。
     * @config      {Function}        onbeforeopen    （可选）打开tooltip前触发。
     * @config      {Function}        onbeforeclose   （可选）关闭tooltip前触发。
     */
    update: function(options){
        var me = this;
        me._update(options);
        me._setPosition();
        me.dispatchEvent('onupdate');
    },

    /**
     * 设置position
     * @private
     */
	_setPosition: function() {
		var me = this,
            insideScreen = typeof me.insideScreen == 'string' ? me.insideScreen : 'surround',
			positionOptions = {
				once: true,
				offset: me.offset,
				position: me.offsetPosition,
				insideScreen: insideScreen 
			};
		switch (me.positionBy) {
			case 'element':
				me.setPositionByElement(me.positionElement || me.currentTarget, me.getMain(), positionOptions);
				break;
			case 'mouse':
				me.setPositionByMouse(me.getMain(), positionOptions);
				break;
			default :
				break;
		}
	},

	/**
	 * 关闭tooltip
	 * @public
	 */
	close: function() {
		var me = this;

        if(!me.isShowing) return;
        
        me.isShowing = false;
        if(me.dispatchEvent('onbeforeclose')){
            me._close();
            me.dispatchEvent('onclose');
        }
        me.currentTarget = null;
    },


    _close: function() {
        var me = this;
                
        me.getMain().style.left = '-100000px';
    },
	/**
	 * 销毁控件
	 * @public
	 */
	dispose: function() {
		var me = this;
		me.dispatchEvent('ondispose');
		if (me.getMain()) {
			baidu.dom.remove(me.getMain());
		}
        delete(baidu.ui.Tooltip.showing[me.guid]);
		baidu.lang.Class.prototype.dispose.call(me);
	},
    /**
     * 获取target元素
	 * @private
	 */
    getTarget: function() {
        var me = this,
            target = [];
            
        baidu.each(baidu.lang.toArray(me.target),function(item){
            target.push(baidu.G(item));
        });

        return target;
    }
});

baidu.ui.Tooltip.isSingleton = false;
baidu.ui.Tooltip.showing = {};
