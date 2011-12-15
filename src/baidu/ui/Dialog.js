/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

//依赖包
///import baidu.ui.createUI;
///import baidu.page.getViewWidth;
///import baidu.page.getViewHeight;
///import baidu.page.getScrollLeft;
///import baidu.page.getScrollTop;

///import baidu.event.on;
///import baidu.event.un;
///import baidu.object.extend;
///import baidu.dom.children;

///import baidu.dom.g;
///import baidu.dom.remove;
///import baidu.dom.setStyles;
///import baidu.dom.getStyle;
///import baidu.dom._styleFilter.px;

///import baidu.array.each;
///import baidu.string.format;
///import baidu.browser;

///import baidu.lang.isNumber;
///import baidu.dom.setBorderBoxHeight;
///import baidu.dom.setBorderBoxWidth;

/**
 * Dialog基类，建立一个dialog实例
 * @class Dialog类
 * @grammar new baidu.ui.Dialog(options)
 * @param     {Object}        options               选项
 * @config    {DOMElement}    content               要放到dialog中的元素，如果传此参数时同时传contentText，则忽略contentText。
 * @config    {String}        contentText           dialog中的内容
 * @config    {String|Number} width                 内容区域的宽度，默认值为400，注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
 * @config    {String|Number} height                内容区域的高度，默认值为300
 * @config    {String|Number} top                   dialog距离页面上方的距离
 * @config    {String|Number} left                  dialog距离页面左方的距离
 * @config    {String}        titleText             dialog标题文字
 * @config    {String}        classPrefix           dialog样式的前缀
 * @config    {Number}        zIndex                dialog的zIndex值，默认值为1000
 * @config    {Function}      onopen                dialog打开时触发
 * @config    {Function}      onclose               dialog关闭时触发
 * @config    {Function}      onbeforeclose         dialog关闭前触发，如果此函数返回false，则组织dialog关闭。
 * @config    {Function}      onupdate              dialog更新内容时触发
 * @config    {Boolean}       closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭dialog。
 * @config    {String}        closeText             closeButton模块提供支持，关闭按钮上的title。
 * @config    {Boolean}       modal                 modal模块支持，是否显示遮罩
 * @config    {String}        modalColor            modal模块支持，遮罩的颜色
 * @config    {Number}        modalOpacity          modal模块支持，遮罩的透明度
 * @config    {Number}        modalZIndex           modal模块支持，遮罩的zIndex值
 * @config    {Boolean}       draggable             draggable模块支持，是否支持拖拽
 * @config    {Function}      ondragstart           draggable模块支持，当拖拽开始时触发
 * @config    {Function}      ondrag                draggable模块支持，拖拽过程中触发
 * @config    {Function}      ondragend             draggable模块支持，拖拽结束时触发
 * @plugin    autoDispose		支持关闭后自动销毁组建
 * @plugin    button			Dialog底部按钮
 * @plugin    closeButton		支持关闭按钮
 * @plugin    coverable			支持遮盖页面的任意元素
 * @plugin    draggable       	支持被拖拽
 * @plugin    iframe	      	支持创建的content是一个iframe
 * @plugin    keyboard	      	键盘支持插件
 * @plugin    modal		      	背景遮罩插件
 * @plugin    resizable		    缩放功能插件
 */

baidu.ui.Dialog = baidu.ui.createUI(function (options){

    var me = this;
    me._content = 'initElement';
    me.content = me.content || null;
    
    me._contentText = 'initText';
    me.contentText = me.contentText || '';
    
    me._titleText = 'initText';
    me.titleText = me.titleText || '';

}).extend(
/**
 *  @lends baidu.ui.Dialog.prototype
 */
{
    //ui控件的类型，传入给UIBase **必须**
    uiType: 'dialog',
    //ui控件的class样式前缀 可选
    //classPrefix     : "tangram-dialog-",

    width: '',
    height: '',

    top: 'auto',
    left: 'auto',
    zIndex: 1000,//没有做层管理
    //用style来保证其初始状态，不会占据屏幕的位置
    tplDOM: "<div id='#{id}' class='#{class}' style='position:relative'>#{title}#{content}#{footer}</div>",
    tplTitle: "<div id='#{id}' class='#{class}'><span id='#{inner-id}' class='#{inner-class}'>#{content}</span></div>",
    tplContent: "<div id='#{id}' class='#{class}' style='overflow:hidden; position:relative'>#{content}</div>",
    tplFooter: "<div id='#{id}' class='#{class}'></div>",

    /**
     * 查询当前窗口是否处于显示状态
     * @public
     * @return {Boolean}  是否处于显示状态
     */
    isShown: function() {
        return baidu.ui.Dialog.instances[this.guid] == 'show';
    },
    
    /**
     * 获取dialog的HTML字符串
     * @private
     * @return {String} DialogHtml
     */
    getString: function() {
        var me = this,
            html,
            title = 'title',
            titleInner = 'title-inner',
            content = 'content',
            footer = 'footer';

        return baidu.format(me.tplDOM, {
            id: me.getId(),
            'class' : me.getClass(),
            title: baidu.format(
                me.tplTitle, {
                    id: me.getId(title),
                    'class' : me.getClass(title),
                    'inner-id' : me.getId(titleInner),
                    'inner-class' : me.getClass(titleInner),
                    content: me.titleText || ''
                }),
            content: baidu.format(
                me.tplContent, {
                    id: me.getId(content),
                    'class' : me.getClass(content),
                    content: me.contentText || ''
                }),
            footer: baidu.format(
                me.tplFooter, {
                    id: me.getId(footer),
                    'class' : me.getClass(footer)
            })
        });
    },

    /**
     * 绘制dialog到页面
	 * @public
     * @return {HTMLElement} mainDiv
     */
    render: function() {
        var me = this,
            main;

        //避免重复render
        if (me.getMain()) {
            return;
        }

        main = me.renderMain();

        //main.style.left =  '-10000em';
        main.innerHTML = me.getString();
        me._update();
        me._updatePosition();

        baidu.dom.setStyles(me.getMain(), {
            position: 'absolute',
            zIndex: me.zIndex,
            marginLeft: '-100000px'
        });
        //当居中时，窗口改变大小时候要重新计算位置
        me.windowResizeHandler = me.getWindowResizeHandler();
        me.on(window, 'resize', me.windowResizeHandler);

        me.dispatchEvent('onload');

        return main;
    },
    
    /**
     * 更新title，和content内容函数
     * @private
     * @param {Object} options 传入参数
     * @return null
     */
    _update:function(options){
        var me = this,
            content = me.getContent(),
            options = options || {},
            title = me.getTitleInner(),
            setText = false;
      
        if(typeof options.titleText != 'undefined'){
            //当options中存在titleText时,认为用户需要更新titleText，直接更新
            title.innerHTML = options.titleText;
            me.titleText = me._titleText = options.titleText;
        }else if (me.titleText != me._titleText){
            //当第一次创建dialog时，无论是否传入titleText，都会走入该分支
            //之后若采用dialog.titleText = '***'；dialog.update();方式更新，也会进入该分支
            title.innerHTML = me.titleText;
            me._titleText = me.titleText;
        } 

        //content优先级大于contentText
        if(typeof options.content != 'undefined'){
            //当options中存在content，认为用户需要更新content,直接更新
            content.innerHTML = '';
            me.content = options.content;
            //若content为null。则代表删除content属性
            if(options.content !== null){
                content.appendChild(options.content);
                me.content = me._content = content.firstChild;
                me.contentText = me._contentText = content.innerHTML;
                return;
            }
            setText = true;
        }else if(me.content !== me._content){
            //第一次new dialog时，进入该分支
            //若采用dialog.content = HTMLElement;dialog.update();的方式进行更新，进去该分支
            content.innerHTML = '';
            if(me.content !== null){
                content.appendChild(me.content);
                me.content = me._content = content.firstChild;
                me.contentText = me._contentText = content.innerHTML;
                return;
            }
            setText = true;
        }

        if(typeof options.contentText != 'undefined'){
            //当options中存在contentText，则认为用户要更新contentText，直接更新
            content.innerHTML = options.contentText;
            me.contentText = me._contentText = options.contentText;
            me.content = me._content = content.firstChild;
        }else if((me.contentText != me._contentText) || setText){
            //当new dialog时，无论是否传入contentText,都会进入该分支
            //若才用dialog.contentText = '***';dialog.update()进行更新，也会进入该分支
            content.innerHTML = me.contentText;
            me._contentText = me.contentText;
            me.content = me._content = content.firstChild;
        }
        
        delete(options.content);
        delete(options.contentText);
        delete(options.titleText);
        baidu.extend(me,options);
    },

    /**
     * 获得resize事件绑定的函数
     * @private
     * @return {Function}
     */
    getWindowResizeHandler: function() {
        var me = this;
        return function() {
            me._updatePosition();
        };
    },

    /**
     * 显示当前dialog
	 * @public
     */
    open: function() {
        var me = this;
        me._updatePosition();    
        me.getMain().style.marginLeft = 'auto';
        baidu.ui.Dialog.instances[me.guid] = 'show';
        me.dispatchEvent('onopen');
    },

    /**
     * 隐藏当前dialog
	 * @public
     */
    close: function() {
        var me = this;
        if (me.dispatchEvent('onbeforeclose')) {
            me.getMain().style.marginLeft = '-100000px';
            baidu.ui.Dialog.instances[me.guid] = 'hide';

            me.dispatchEvent('onclose');
        }
    },

	/**
     * 更新dialog状态 
	 * @public
     * @param     {Object}        options               选项参数
     * @config    {DOMElement}    content               要放到dialog中的元素，如果传此参数时同时传contentText，则忽略contentText。
     * @config    {String}        contentText           dialog中的内容
     * @config    {String|Number} width                 内容区域的宽度，默认值为400，注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
     * @config    {String|Number} height                内容区域的高度，默认值为300
     * @config    {String|Number} top                   dialog距离页面上方的距离
     * @config    {String|Number} left                  dialog距离页面左方的距离
     * @config    {String}        titleText             dialog标题文字
     * @config    {String}        classPrefix           dialog样式的前缀
     * @config    {Number}        zIndex                dialog的zIndex值，默认值为1000
     * @config    {Function}      onopen                dialog打开时触发
     * @config    {Function}      onclose               dialog关闭时触发
     * @config    {Function}      onbeforeclose         dialog关闭前触发，如果此函数返回false，则组织dialog关闭。
     * @config    {Function}      onupdate              dialog更新内容时触发
     * @config    {Boolean}       closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭dialog。
     * @config    {String}        closeText             closeButton模块提供支持，关闭按钮上的title。
     * @config    {Boolean}       modal                 modal模块支持，是否显示遮罩
     * @config    {String}        modalColor            modal模块支持，遮罩的颜色
     * @config    {Number}        modalOpacity          modal模块支持，遮罩的透明度
     * @config    {Number}        modalZIndex           modal模块支持，遮罩的zIndex值
     * @config    {Boolean}       draggable             draggable模块支持，是否支持拖拽
     * @config    {Function}      ondragstart           draggable模块支持，当拖拽开始时触发
     * @config    {Function}      ondrag                draggable模块支持，拖拽过程中触发
     * @config    {Function}      ondragend             draggable模块支持，拖拽结束时触发
     */
    update: function(options) {
        var me = this;
        me._update(options);
        me._updatePosition();
        me.dispatchEvent('onupdate');
    },

    /**
     * 获取body的寛高
     * @private
     * @return {Object} {width,height}，名值对
     */
    _getBodyOffset: function() {
        var me = this,
            bodyOffset,
            body = me.getBody(),
            content = me.getContent(),
            title = me.getTitle(),
            footer = me.getFooter();

        bodyOffset = {
            'width' : 0,
            'height' : 0
        };

        //确定取值为数字
        function getStyleNum(d,style) {
            var result = parseFloat(baidu.getStyle(d, style));
            result = isNaN(result) ? 0 : result;
            result = baidu.lang.isNumber(result) ? result : 0;
            return result;
        }
        //fix margin
        baidu.each(['marginLeft', 'marginRight'], function(item,index) {
            bodyOffset['width'] += getStyleNum(content, item);
        });

        bodyOffset['height'] += title.offsetHeight + getStyleNum(title, 'marginTop');
        bodyOffset['height'] += footer.offsetHeight + getStyleNum(footer, 'marginBottom');

        //fix margin
        var mt = getStyleNum(content, 'marginTop'), md = getStyleNum(title, 'marginBottom');
        bodyOffset['height'] += mt >= md ? mt : md;
        mt = getStyleNum(footer, 'marginTop'), md = getStyleNum(content, 'marginBottom');
        bodyOffset['height'] += mt >= md ? mt : md;

        return bodyOffset;
    },

    /**
     * 更新dialog位置及内部元素styles
     * @private
     * @return void
     * */
    _updatePosition: function() {
        var me = this,
        	bodyOffset,
            top = '',
            right = '',
            bottom = '',
            left = '',
            content = me.getContent(),
            body = me.getBody(),
            width,height;

        /*
         * 添加默认值支持
         * 当me.width或者me.height没有设置有效值时，不对其进行计算
         *
         * 暂不支持百分比形式的寛高计算
         * 在render或者window resize时保证content上的寛高必有值
         * TODO resizable如何适应dialog有默认值时的计算方法
         * 
         * 在webkit中，为保持dom的完整性，浏览器会自己计算一下css值
         * 例如：
         * content的属性为: 
         *  width:100px
         *  marginLeft:5px
         *  marginRight:5px
         *
         * body的属性为：
         *  width:110px
         *
         * 此时更改content的width值为90px
         * 在webkit中，取content的marginLeft和marginRight值分别是5px，15px
         * 而不是原有的5px，5px
         *
         * 针对这个问题，调成程序执行顺序，先取得所有相关的css属性值
         * 之后更改content的寛高，再根据content当前的offset值与之前取得的属性值进行计算，获取body的寛高值
         */

        width = parseFloat(me.width);
        height = parseFloat(me.height);
        
        bodyOffset = me._getBodyOffset();
        
        baidu.lang.isNumber(width) && baidu.dom.setOuterWidth(content,width);
        baidu.lang.isNumber(height) && baidu.dom.setOuterHeight(content,height);

        bodyOffset.width += content.offsetWidth;
        bodyOffset.height += content.offsetHeight;

        me.width && baidu.setStyle(body, 'width', bodyOffset.width);
        me.height && baidu.setStyle(body, 'height', bodyOffset.height);

        if ((me.left && me.left != 'auto') || (me.right && me.right != 'auto')) {
            //按照用户的值来设置
            left = me.left || '';
            right = me.right || '';
        } else {
            //自动居中
            left = Math.max((baidu.page.getViewWidth() - parseFloat(me.getMain().offsetWidth)) / 2 + baidu.page.getScrollLeft(), 0);
        }
        //下面的代码是上面代码的重复
        if ((me.top && me.top != 'auto') || (me.bottom && me.bottom != 'auto')) {
            top = me.top || '';
            bottom = me.bottom || '';
        } else {
            top = Math.max((baidu.page.getViewHeight() - parseFloat(me.getMain().offsetHeight)) / 2 + baidu.page.getScrollTop(), 0);
        }

        baidu.dom.setStyles(me.getMain(), {
            top: top,
            right: right,
            bottom: bottom,
            left: left
        });
    },

    /**
     * 获得title对应的dom元素
     * @public
     * @return {HTMLElement} title
     */
    getTitle: function() {
        return baidu.g(this.getId('title'));
    },

    /**
     * 获得title文字对应的dom元素
     * @public
     * @return {HTMLElement} titleInner
     */
    getTitleInner: function() {
        return baidu.g(this.getId('title-inner'));
    },

    /**
     * 获得content对应的dom元素
     * @public
     * @return {HTMLElement} content
     */
    getContent: function() {
        return baidu.g(this.getId('content'));
    },

    /**
     * 获得footer对应的dom元素
     * @public
     * @return {HTMLElement} footer
     */
    getFooter: function() {
        return baidu.g(this.getId('footer'));
    },

    /**
     * 销毁dialog实例
	 * @public
     */
    dispose: function() {
        var me = this;

        //删除实例引用
        delete baidu.ui.Dialog.instances[me.guid];
        me.dispatchEvent('dispose');
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});

baidu.ui.Dialog.instances = baidu.ui.Dialog.instances || {};
