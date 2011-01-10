/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/dialog/Dialog.js
 * author: berg
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
///import baidu.event.un;
///import baidu.object.extend;


///import baidu.dom.g;
///import baidu.dom.remove;
///import baidu.dom.setStyles;
///import baidu.dom.getStyle;
///import baidu.dom._styleFilter.px;

///import baidu.ui.smartPosition.setBorderBoxStyles;

///import baidu.array.each;
///import baidu.string.format;
///import baidu.browser;

///import baidu.lang.isNumber;

//声明包
///import baidu.ui.dialog;


/**
 * dialog基类，建立一个dialog实例，这个类原则上不对外暴露
 * reference: http://docs.jquery.com/UI/Dialog (Dialog in jquery)
 *
 * @param  {Object}             options optional        选项参数.
 * @config {DOMElement}                 content         放在content区域的元素
 * @config {String}                     contentText     放在content区域的字符串
 * @config {String}                     width           宽度
 * @config {String}                     height          高度
 * @config {String}                     dialogClass     CSS前缀
 * @config {Function}                   onopen          当dialog展示时触发
 * @config {Function}                   onclose         当dialog隐藏时触发
 * @config {Function}                   onupdate        当dialog更新位置时触发
 * @return {Dialog}                                     Dialog类.
 */

baidu.ui.dialog.Dialog = baidu.ui.createUI(function(options) {
}).extend({
    //ui控件的类型，传入给UIBase **必须**
    uiType: 'dialog',
    //ui控件的class样式前缀 可选
    //classPrefix     : "tangram-dialog-",

    width           : '',
    height          : '',

    top: 'auto',
    left: 'auto',
    zIndex: 1000,//没有做层管理
    titleText: '',
    //content         : false,
    contentText: '',

    //onopen          : function(){},
    onbeforeclose: function() { return true;},
    //onclose         : function(){},
    //onupdate        : function(){},


    //用style来保证其初始状态，不会占据屏幕的位置
    tplDOM: "<div id='#{id}' class='#{class}' style='position:relative'>#{title}#{content}#{footer}</div>",
    tplTitle: "<div id='#{id}' class='#{class}'><span id='#{inner-id}' class='#{inner-class}'>#{content}</span></div>",
    tplContent: "<div id='#{id}' class='#{class}' style='overflow:auto; position:relative'>#{content}</div>",
    tplFooter: "<div id='#{id}' class='#{class}'></div>",

    /**
     * 查询当前窗口是否处于显示状态
     */
    isShown: function() {
        return baidu.ui.dialog.instances[this.guid] == 'show';
    },

    getString: function() {
        var me = this,
            html,
            title = 'title',
            titleInner = 'title-inner',
            content = 'content',
            footer = 'footer';

        return baidu.format(
                me.tplDOM, {
                    id: me.getId(),
                    'class' : me.getClass(),
                    title: baidu.format(
                        me.tplTitle, {
                            id: me.getId(title),
                            'class' : me.getClass(title),
                            'inner-id' : me.getId(titleInner),
                            'inner-class' : me.getClass(titleInner),
                            content: me.titleText
                        }),
                    content: baidu.format(
                        me.tplContent, {
                            id: me.getId(content),
                            'class' : me.getClass(content),
                            content: me.contentText
                        }),
                    footer: baidu.format(
                        me.tplFooter, {
                            id: me.getId(footer),
                            'class' : me.getClass(footer)
                        })
                }
            );
    },

    /*
     * render dialog到DOM树
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

		me._update(me);

        baidu.dom.setStyles(me.getMain(), {
            position: 'absolute',
            zIndex: this.zIndex,
            marginLeft: '-100000px'
        });
        //当居中时，窗口改变大小时候要重新计算位置
        me.windowResizeHandler = me.getWindowResizeHandler();
        baidu.on(window, 'resize', me.windowResizeHandler);

        me.dispatchEvent('onload');

        return main;
    },

    /**
     * 获得resize事件绑定的函数
     */
    getWindowResizeHandler: function() {
        var me = this;
        return function() {
            me.update();
        };
    },


    /*
     * 显示当前dialog
     */
    open: function(options) {
        var me = this;
        me._update(options);
        me.getMain().style.marginLeft = 'auto';
        baidu.ui.dialog.instances[me.guid] = 'show';
        me.dispatchEvent('onopen');
    },

    /*
     * 隐藏当前dialog
     */
    close: function() {
        var me = this;
        if (me.dispatchEvent('onbeforeclose')) {
            me.getMain().style.marginLeft = '-100000px';
            baidu.ui.dialog.instances[me.guid] = 'hide';

            me.dispatchEvent('onclose');
        }
    },

    /*
     * 更新dialog状态
     * @param  {Object}             options optional        选项参数
     *
     */
   _update: function(options) {
        options = options || {};
        var me = this, contentWrapper = me.getContent();

        //扩展options属性
        baidu.object.extend(me, options);

        //更新内容
        if (options.content) {
            //content优先
            if (contentWrapper.firstChild != options.content) {
                contentWrapper.innerHTML = '';
                contentWrapper.appendChild(options.content);
            }
        }else if (options.contentText) {
            contentWrapper.innerHTML = options.contentText;
        }

        //更新标题
        if (options.titleText)
            me.getTitleInner('title-inner').innerHTML = options.titleText;

        me._updatePosition();
    },

    update: function(options) {
        var me = this;
        options = options || {};
        me._update(options);
        me.dispatchEvent('onupdate');
    },

    /**
     * 获取body的寛高
     * */
    _getBodyOffset: function() {
        var me = this,
            bodyOffset,
            body = me.getBody(),
            content = me.getContent(),
            title = me.getTitle(),
            footer = me.getFooter();

        bodyOffset = {
            'width' : content.offsetWidth,
            'height' : content.offsetHeight
        };

        //确定取值为数字
        function getStyleNum(d,style) {
            var result = parseInt(baidu.getStyle(d, style));
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

    _updatePosition: function() {
        var me = this,
        	bodyOffset,
            top = '',
            right = '',
            bottom = '',
            left = '',
            content = me.getContent(),
            body = me.getBody();


       baidu.setStyles(content, {
           'width' : me.width,
           'height' : me.height
       });
       bodyOffset = me._getBodyOffset();
       baidu.setStyles(body, bodyOffset);

        if ((me.left && me.left != 'auto') || (me.right && me.right != 'auto')) {
            //按照用户的值来设置
            left = me.left || '';
            right = me.right || '';
        } else {
            //自动居中
            left = Math.max((baidu.page.getViewWidth() - parseInt(me.getMain().offsetWidth)) / 2 + baidu.page.getScrollLeft(), 0);
        }
        //下面的代码是上面代码的重复
        if ((me.top && me.top != 'auto') || (me.bottom && me.bottom != 'auto')) {
            top = me.top || '';
            bottom = me.bottom || '';
        } else {
            top = Math.max((baidu.page.getViewHeight() - parseInt(me.getMain().offsetHeight)) / 2 + baidu.page.getScrollTop(), 0);
        }

        baidu.dom.setStyles(
            me.getMain(), {
                top: top,
                right: right,
                bottom: bottom,
                left: left
            }
        );
    },

    /**
     * 获得title对应的dom元素
     * @private
     */
    getTitle: function() {
        return baidu.g(this.getId('title'));
    },

    /**
     * 获得title文字对应的dom元素
     * @private
     */
    getTitleInner: function() {
        return baidu.g(this.getId('title-inner'));
    },

    /**
     * 获得content对应的dom元素
     * @private
     */
    getContent: function() {
        return baidu.g(this.getId('content'));
    },

    /**
     * 获得footer对应的dom元素
     * @private
     */
    getFooter: function() {
        return baidu.g(this.getId('footer'));
    },

    /**
     * 销毁dialog实例
     */
    dispose: function() {
        var me = this;

        //删除实例引用
        delete baidu.ui.dialog.instances[me.guid];
        me.dispatchEvent('dispose');
        baidu.un(window, 'resize', me.windowResizeHandler);
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});
