/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.createUI;

///import baidu.dom.setAttr;
///import baidu.dom.setStyles;
///import baidu.dom._styleFilter.px;
///import baidu.dom._styleFixer.opacity;

///import baidu.string.format;

///import baidu.browser.ie;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.page.getScrollLeft;
///import baidu.page.getScrollTop;
///import baidu.lang.isNumber;
///import baidu.object.each;
///import baidu.object.extend;
///import baidu.array.each;

///import baidu.dom.getAttr;
///import baidu.dom.getAncestorBy;
///import baidu.dom.getStyle;
///import baidu.dom.getPosition;
///import baidu.dom.children;
///import baidu.dom.fixable;
///import baidu.browser.ie;

///import baidu.lang.instance;

///import baidu.page.getViewWidth;
///import baidu.page.getViewHeight;

//添加对flash的隐藏和显示
//在webkit中，使用iframe加div的方式遮罩wmode为window的flash会时性能下降到无法忍受的地步
//在Gecko中，使用透明的iframe无法遮住wmode为window的flash
//在其余浏览器引擎中wmode为window的flash会被遮罩，处于不可见状态
//因此，直接将wmode为window的flash隐藏，保证页面最小限度的修改


/**
 * 为控件增加遮罩.
 * @class Modal类
 * @grammar new baidu.ui.Modal()
 * @plugin coverable 支持背景遮罩
 */
baidu.ui.Modal = baidu.ui.createUI(function(options) {
    var me = this,
        container = (options && options.container) ? baidu.g(options.container) : null;

    !container && (container = document.body);
    if (!container.id) {
        container.id = me.getId('container');
    }

    me.containerId = container.id;
    me.styles = {
        color: '#000000',
        opacity: 0.6,
        zIndex: 1000
    };
    
}).extend(
/**
 *  @lends baidu.ui.Modal.prototype
 */
{
    uiType: 'modal',
    _showing: false,

    /**
     * 获取modal的Container
     * @public
     * @return {HTMLElement} container.
     */
    getContainer: function() {
        var me = this;
        return baidu.g(me.containerId);
    },

    /**
     * 渲染遮罩层
     * @public
     * @return {NULL}
     * */
    render: function() {
        var me = this,
            modalInstance,
            fixableInstance,
            style,
            main,
            id = me.containerId,
            container = baidu.g(me.containerId);

        //当该container中已经存在modal时
        //将所需参数付给当前的modalInstance
        if (modalInstance = baidu.ui.Modal.collection[id]) {
            me.mainId = modalInstance.mainId;
            main = me.getMain();
        }else {
            //如果不存在modal,则创建新的modal
            main = me.renderMain();
            if (container !== document.body) {
                container.appendChild(main);
            }else{
                fixableInstance = baidu.dom.fixable(main, {
                    autofix: false,
                    vertival: 'top',
                    horizontal: 'left',
                    offset: {x:0, y:0}
                });
            }
            //将参数写入
            baidu.ui.Modal.collection[id] = {
                mainId: me.mainId,
                instance: [],
                flash:{},
                fixableInstance: fixableInstance
            };
        }

        me.dispatchEvent('onload');
    },

    /**
     * 显示遮罩层
     * @public
     * @param  {Object} options     显示选项,任何合法的style属性.
     * @return {NULL}
     */
    show: function(options) {
        var me = this,
            container = me.getContainer(),
            main = me.getMain(),
            containerId = me.containerId,
            modalInstanceOptions = baidu.ui.Modal.collection[containerId],
            fixableInstance = modalInstanceOptions.fixableInstance,
            length = modalInstanceOptions.instance.length,
            lastTop;

        if (me._showing)
            return;

        if (length > 0) {
            lastTop = baidu.lang.instance(modalInstanceOptions.instance[length - 1]);
            lastTop && lastTop._removeHandler();
        }
        options = options || {};
        me._show(options.styles || {});
        if(fixableInstance)
            fixableInstance.render();
        main.style.display = 'block';
      
        //将在此层中隐藏flash入库
        modalInstanceOptions.flash[me.guid] = me._hideFlash();
    
        //将自己的guid加在guid最后
        modalInstanceOptions.instance.push(me.guid);
        me._showing = true;

        me.dispatchEvent('onshow');
    },

    /**
     * 更新遮罩层，绑定window.resize & window.scroll
     * @private
     * @param {Object} styles
     * @return {NULL}
     */
    _show: function(styles) {
        var me = this;

        me._getModalStyles(styles || {});
        me._update();

        if(me.getContainer() === document.body && baidu.browser.ie && baidu.browser.ie <= 7){
            me.windowHandler = me.getWindowHandle();
            baidu.on(window, 'resize', me.windowHandler);
        }
    },

    /**
     * 隐藏遮罩层
     * @public
     * @return {NULL}
     */
    hide: function() {
        var me = this;
        me._hide(); 
        me.dispatchEvent('onhide');
    },

    _hide: function(){
        var me = this,
            containerId = me.containerId,
            modalInstanceOptions = baidu.ui.Modal.collection[containerId],
            flash = modalInstanceOptions.flash[me.guid],
            main = me.getMain(),
            length = modalInstanceOptions.instance.length,
            lastTop;

         if (!me._showing)
             return;

         for (var i = 0; i < length; i++) {
             if (modalInstanceOptions.instance[i] == me.guid) {
                 modalInstanceOptions.instance.splice(i, 1);
                 break;
             }
         }
         length = modalInstanceOptions.instance.length;
         if (i == length) {
             me._removeHandler();
             if (length > 0) {
                 lastTop = baidu.lang.instance(modalInstanceOptions.instance[length - 1]);
                 lastTop && lastTop._show();
             }else {
                 main.style.display = 'none';
             }

             me._restoreFlash(flash);
         }else{
             //如果不是最后一个，就将该层对应的flash移动到下一层的数组中
             lastTop = baidu.lang.instance(modalInstanceOptions.instance[length - 1]);
             modalInstanceOptions.flash[lastTop.guid] = modalInstanceOptions.flash[lastTop.guid].concat(flash);
         }

         modalInstanceOptions.flash[me.guid] = []; 
         me._showing = false;
    },


    /**
     * 接触window.resize和window.scroll上的事件绑定
     * @private
     * @return {NULL}
     */
    _removeHandler: function() {
        var me = this;
        if(me.getContainer() === document.body && baidu.browser.ie && baidu.browser.ie <= 7){
            baidu.un(window, 'resize', me.windowHandler);
        }
    },

    /**
     * window.resize & window.scroll 事件调用的function
     * @public
     * @return {NULL}
     */
    getWindowHandle: function() {
        var me = this,
            main = me.getMain();

        return function() {
            baidu.setStyles(main, {
                width: baidu.page.getViewWidth(),
                height: baidu.page.getViewHeight()
            });
            
            if(me.getContainer() === document.body && baidu.browser.ie && baidu.browser.ie <= 7){
                //iframe 补丁
                window.top !== window.self && setTimeout(function(){
                    me._getModalStyles({});
                    me._update();
                },16);
            }
         };
    },

    /**
     * 更新遮罩层
     * @public
     * @param  {Object} options 显示选项，同show.
     * @return {NULL}
     */
    update: function(options) {
        options = options || {};
        var me = this,
            main = me.getMain(),
            modalInstanceOptions = baidu.ui.Modal.collection[me.containerId];

        options = options || {};
        baidu.extend(me, options);

        me._getModalStyles(options.styles || {});
        me._update();
        delete(options.styles);
        baidu.extend(me, options);

        me.dispatchEvent('onupdate');
    },

    /**
     * 更新样式
     * @private
     * @return {NULL}
     */
    _update: function() {
        var me = this, main = me.getMain();
        baidu.dom.setStyles(main, me.styles);
    },

    /**
     * 获取遮罩层相对container左上角的top和left
     * @private
     * @options {object} show传入的styles
     * @return {NULL}
     */
    _getModalStyles: function(styles) {
        var me = this,
            main = me.getMain(),
            container = me.getContainer(),
            offsetParentPosition,
            parentPosition, offsetParent;

        function getStyleNum(d,style) {
            var result = parseInt(baidu.getStyle(d, style));
            result = isNaN(result) ? 0 : result;
            result = baidu.lang.isNumber(result) ? result : 0;
            return result;
        }

        if (container !== document.body) {
            styles['width'] = container.offsetWidth;
            styles['height'] = container.offsetHeight;

            if (baidu.getStyle(container, 'position') == 'static') {
                offsetParent = main.offsetParent || document.body;
                offsetParentPosition = baidu.dom.getPosition(offsetParent);
                parentPosition = baidu.dom.getPosition(container);
                styles['top'] = parentPosition.top - offsetParentPosition.top + getStyleNum(offsetParent, 'marginTop');
                styles['left'] = parentPosition.left - offsetParentPosition.left + getStyleNum(offsetParent, 'marginLeft');
            }
        }else {
     
            if ( baidu.browser.ie > 7 || !baidu.browser.ie) {
                styles['width'] = '100%';
                styles['height'] = '100%';
            }else {
                styles['width'] = baidu.page.getViewWidth();
                styles['height'] = baidu.page.getViewHeight();
            }
        }

        //更新styles
        baidu.extend(me.styles, styles);
        me.styles['backgroundColor'] = me.styles['color'] || me.styles['backgroundColor'];
        delete(me.styles['color']);
    },

    /**
     * 隐藏flash
     * @private
     * @return {Null}
     */
    _hideFlash: function(){
        var me = this,
            container = me.getContainer(),
            elements = container.getElementsByTagName('object'),
            result = [];

        //只隐藏wmode = window的flash
        baidu.each(elements, function(item){
            var isWinMode = true;
            
            if(baidu.dom.getAncestorBy(item,function(element){
                if(baidu.getStyle(element, 'zIndex') > me.styles.zIndex){
                    return true;
                }
                
                return false;
            })){
                return;
            }

            baidu.each(baidu.dom.children(item), function(param){
                if(baidu.getAttr(param, 'name') == 'wmode' && baidu.getAttr(param, 'value') != 'window'){
                    isWinMode = false;
                }
            });

            if(isWinMode){
                result.push([item,baidu.getStyle(item, 'visibility')]);
                item.style.visibility = 'hidden';
            }
        });

        return result;
    },

    /**
     * 还原flash
     * @private
     * @return {Null}
     */
    _restoreFlash: function(flash){
        baidu.each(flash, function(item){
            if(item[0] != null){
                item[0].style.visibility = item[1];
            }
        });  
    },

    /**
     * 销毁
     * @public
     * @return {Null}
     */
    dispose: function(){
        var me = this;
        
        me._hide();
        me.dispatchEvent('ondispose');
        baidu.lang.Class.prototype.dispose.call(me);
    }
});

//存储所有的modal参数
baidu.ui.Modal.collection = {};
