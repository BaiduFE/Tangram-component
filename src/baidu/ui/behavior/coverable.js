/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui;
///import baidu.ui.behavior;
///import baidu.dom.children;
///import baidu.dom.insertBefore;
///import baidu.dom.setStyle;
///import baidu.dom.setStyles;
///import baidu.object.extend;
///import baidu.dom.setBorderBoxSize;

(function(){
    var Coverable = baidu.ui.behavior.coverable = function() {};
    
    Coverable.Coverable_isShowing = false;
    Coverable.Coverable_iframe;
    Coverable.Coverable_container;
    Coverable.Coverable_iframeContainer;

    /**
     * 显示遮罩，当遮罩不存在时创建遮罩
     * @public
     * @return {NULL}
     */
    Coverable.Coverable_show = function(){
        var me = this;
        if(me.Coverable_iframe){
            me.Coverable_update();
            baidu.setStyle(me.Coverable_iframe, 'display', 'block'); 
            return;
        }
        
        var opt = me.coverableOptions || {},
            container = me.Coverable_container = opt.container || me.getMain(),
            opacity = opt.opacity || '0',
            color = opt.color || '',
            iframe = me.Coverable_iframe = document.createElement('iframe'),
            iframeContainer = me.Coverable_iframeContainer = document.createElement('div');

        //append iframe container
        baidu.dom.children(container).length > 0 ?
            baidu.dom.insertBefore(iframeContainer, container.firstChild):
            container.appendChild(iframeContainer);
       
        //setup iframeContainer styles
        baidu.setStyles(iframeContainer, {
            position: 'absolute',
            top: '0px',
            left: '0px'
        });
        baidu.dom.setBorderBoxSize(iframeContainer,{
            width: container.offsetWidth,
            height: container.offsetHeight
        });

        baidu.dom.setBorderBoxSize(iframe,{
            width: iframeContainer.offsetWidth
        });

        baidu.dom.setStyles(iframe,{
            zIndex  : -1,
            display  : "block",
            border: 0,
            backgroundColor: color,
            filter : 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=' + opacity + ')'
        });
        iframeContainer.appendChild(iframe);
        
        iframe.src = "javascript:void(0)";
        iframe.frameBorder = '0';
        iframe.scrolling = 'no';
        iframe.height = '97%';
        me.Coverable_isShowing = true;
    };

    /**
     * 隐藏遮罩
     * @public
     * @return {NULL}
     */
    Coverable.Coverable_hide = function(){
        var me = this,
            iframe = me.Coverable_iframe;
        
        if(!me.Coverable_isShowing){
            return;
        }
        
        baidu.setStyle(iframe, 'display', 'none');
        me.Coverable_isShowing = false;
    };

    /**
     * 更新遮罩
     * @public
     * @param {Object} options
     * @config {Number|String} opacity 透明度
     * @config {String} backgroundColor 背景色
     */
    Coverable.Coverable_update = function(options){
        var me = this,
            options = options || {},
            container = me.Coverable_container,
            iframeContainer = me.Coverable_iframeContainer,
            iframe = me.Coverable_iframe;
  
        baidu.dom.setBorderBoxSize(iframeContainer,{
            width: container.offsetWidth,
            height: container.offsetHeight
        });

        baidu.dom.setBorderBoxSize(iframe,baidu.extend({
            width: baidu.getStyle(iframeContainer, 'width')
        },options));
    };
})();
