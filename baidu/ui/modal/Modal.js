/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/modal/Modal.js
 * author: berg,lixiaopeng
 * version: 1.0.0
 * date: 2010/07/23 
 */

/**
 *
 * 遮罩层，遮罩层为单例
 */

///import baidu.ui.createUI;
///import baidu.ui.modal;
///import baidu.ui.smartCover;

///import baidu.dom.setAttr;
///import baidu.dom.setStyles;
///import baidu.dom._styleFilter.px;
///import baidu.dom._styleFixer.opacity;

///import baidu.string.format;

///import baidu.browser.ie;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.page.getViewWidth;
///import baidu.page.getViewHeight;
///import baidu.page.getScrollLeft;
///import baidu.page.getScrollTop;
///import baidu.lang.isNumber;
///import baidu.object.each;
///import baidu.object.extend;


//存储所有的modal参数
baidu.ui.modal.collection = {};
baidu.ui.modal.Modal = baidu.ui.createUI(function (options){
    var me = this,container = (options && options.container) ? baidu.g(options.container) : null;
    !container && (container = document.body);
    if(!container.id){
        container.id = me.getId("container");
    }
    me.containerId = container.id;
    me.styles = {
        color:"#000000",
        opacity:0.6,
        zIndex:1000
    };
}).extend({
    uiType    : "MODAL",
    _showing  : false,

    /**
     * 获取modal的Container
     * @return {HTMLDom} container
     * */
    getContainer : function(){
        var me = this;
        return baidu.g(me.containerId);
    },
    
    /**
     * 渲染遮罩层
     * @return void
     * */
    render : function(){
        var me = this,
            modalInstance,
            style,
            main,
            id=me.containerId,
            container = baidu.g(me.containerId);
        
        //当该container中已经存在modal时
        //将所需参数付给当前的modalInstance
        if(modalInstance = baidu.ui.modal.collection[id]){
            me.mainId = modalInstance.mainId;
            main = me.getMain();
        }else{
            //如果不存在modal,则创建新的modal
            main = me.renderMain();
            if(container !== document.body){
                container.appendChild(main);
            }
            //将参数写入
            baidu.ui.modal.collection[id] = {
                mainId:me.mainId,
                instance:[]
            };   
        }
    },
   
    /**
     *
     * 显示遮罩层
     * @param  {Object} options     显示选项,任何合法的style属性
     * @return void
     * */
    show : function(options){
        var me = this,
            container = me.getContainer(),
            main = me.getMain(),
            smartCoverOptions = {},
            containerId = me.containerId,
            modalInstanceOptions = baidu.ui.modal.collection[containerId],
            length = modalInstanceOptions.instance.length,
            lastTop;
        
        if(me._showing)
            return;
        
        if(length > 0){
            lastTop = baidu.lang.instance(modalInstanceOptions.instance[length - 1]);
            lastTop && lastTop._hide();
        }
        options = options || {};
        me._show(options.styles || {});
        
        //将自己的guid加在guid最后
        modalInstanceOptions.instance.push(me.guid);
        main.style.display = "block";
        me._showing = true;

        //smartCover
        if(me.targetUI){
            smartCoverOptions = {container : container};
            //如果是ie，隐藏所有的select，因为select遮不住
            baidu.ie < 8 && (smartCoverOptions.hideSelect = true);
            baidu.ui.smartCover.show(me.targetUI, smartCoverOptions);
        }

        me.dispatchEvent("onshow");
    },

    /**
     * 内部方法
     * @param {Object} styles
     * @return void
     * */
    _show:function(styles){
        var me = this;

        me._getModalStyles(styles || {});
        me._update();
      
        me.windowHandler = me.getWindowHandle();
        baidu.on(window,"resize",me.windowHandler);
        baidu.on(window,"scroll",me.windowHandler);
    },

    /**
     * 隐藏遮罩层
     * @return void
     */
    hide : function(){
        var me = this,
            containerId = me.containerId,
            modalInstanceOptions = baidu.ui.modal.collection[containerId],
            main = me.getMain(),
            length = modalInstanceOptions.instance.length,
            lastTop;

        if(!me._showing)
            return;

        for(var i=0;i<length;i++){
            if(modalInstanceOptions.instance[i] == me.guid){
                modalInstanceOptions.instance.splice(i,1);
                break;
            }   
        }
        length = modalInstanceOptions.instance.length;
        if(i == length){
            me._hide();
            if(length > 0){
                lastTop = baidu.lang.instance(modalInstanceOptions.instance[length - 1]);
                lastTop && lastTop._show();
            }else{
                main.style.display = "none";
            }
        }
        me._showing = false;

        if(me.targetUI){
            baidu.ui.smartCover.hide(me.targetUI);
        }

        me.dispatchEvent("onhide");
    },

    /**
     * 内部方法
     * @return void
     * */
    _hide:function(){
        var me = this;
              
        baidu.un(window,"resize",me.windowHandler);
        baidu.un(window,"scroll",me.windowHandler);
    },
    
    /**
     * window.resize & window.scroll 事件调用的function
     * @return void
     * */
    getWindowHandle:function(){
        var me = this;

        return function(){
            var main = me;
            me._getModalStyles({});
            me._update();         
         };
    },
    
    /**
     * 更新遮罩层
     * @param  {Object} options 显示选项，同show
     * */
    update : function(options){
        options = options || {};
        var me = this,
            main = me.getMain(),
            modalInstanceOptions = baidu.ui.modal.collection[me.containerId];
        
        options = options || {};
        baidu.extend(me, options);

        me._getModalStyles(options.styles || {});
        me._update(); 
        delete(options.styles);
        baidu.extend(me, options);
        
        me.dispatchEvent("onupdate");
    },

    /**
     * 内部方法，更新样式
     * @return void
     * */
    _update:function(){
        var me = this,main = me.getMain();
        baidu.dom.setStyles(main,me.styles);
    },

    /**
     * 获取遮罩层相对container左上角的top和left
     * @options {object} show传入的styles
     * */
    _getModalStyles:function(styles){
        var me = this,
            main = me.getMain(),
            container = me.getContainer(),
            offsetParentPosition,
            parentPosition,offsetParent;
     
        
        function getStyleNum(d,style){
            var result = parseInt(baidu.getStyle(d,style));
            result = isNaN(result) ? 0 : result;
            result = baidu.lang.isNumber(result) ? result : 0;
            return result;
        }

        if(container !== document.body){
            styles["width"] = container.offsetWidth;
            styles["height"] = container.offsetHeight;

            if(baidu.getStyle(container,"position") == "static"){
                offsetParent = main.offsetParent || document.body; 
                offsetParentPosition = baidu.dom.getPosition(offsetParent);   
                parentPosition = baidu.dom.getPosition(container);
                styles["top"] = parentPosition.top - offsetParentPosition.top + getStyleNum(offsetParent,"marginTop");
                styles["left"] = parentPosition.left - offsetParentPosition.left + getStyleNum(offsetParent,"marginLeft");   
            }
        }else{
            styles["width"] = baidu.page.getViewWidth();
            styles["height"] = baidu.page.getViewHeight();
            
            //如果不是ie6,并且不是quirk模式，设置为fixed
            if ((!baidu.browser.ie || baidu.browser.ie >= 7) && document.compatMode != "BackCompat") {
                styles["position"]= "fixed";
                styles["top"] = 0;
                styles["left"] = 0;
            }else{
                styles["top"] = baidu.page.getScrollTop();
                styles["left"] = baidu.page.getScrollLeft();
            }
        }

        //更新styles
        baidu.extend(me.styles,styles);
        me.styles["backgroundColor"] = me.styles["color"] || me.styles["backgroundColor"];
        delete(me.styles["color"]);
    }
});
