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

(function(){
    var Coverable = baidu.ui.behavior.coverable = function() {};
    
    Coverable.Coverable_isShowing = false;
    Coverable.Coverable_iframe;
    Coverable.Coverable_container;
    Coverable.Coverable_iframeContainer;

    Coverable.Coverable_show = function(){
        
        var me = this,
            opt = me.coverableOptions || {},
            container = me.Coverable_container = opt.container || me.getMain(),
            color = opt.color || 'white',
            iframe = me.Coverable_iframe = document.createElement('iframe'),
            iframeContainer = me.Coverable_iframeContainer = document.createElement('div');

        if(me.Coverable_isShowing){
            me.Coverable_update();
            return;
        }

        //append iframe container
        baidu.dom.children(container).length > 0 ?
            baidu.dom.insertBefore(iframeContainer, container.firstChild):
            container.appendChild(iframeContainer);
       
        //setup iframeContainer styles
        baidu.setStyles(iframeContainer, {
            position: 'absolute',
            width: container.offsetWidth,
            height: container.offsetHeight,
            top: '0px',
            left: '0px'
        });

        iframeContainer.appendChild(iframe);
        iframe.src = "javascript:void(0)";
        baidu.dom.setStyles(iframe, baidu.extend({
            zIndex  : -1,
            display  : "block",
            border  : "none",
            width : container.offsetWidth,
            height : container.offsetHeight,
            backgroundColor: color,
            filter : 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'
        },options));

        me.Coverable_isShowing = true;
    };

    Coverable.Coverable_hide = function(){
        var me = this,
            iframe = me.Coverable_iframe;
        
        if(!me.Coverable_isShowing){
            return;
        }
        
        baidu.setStyle(iframe, 'display', 'none');
    };

    Coverable.Coverable_update = function(){
        var me = this,
            container = me.Coverable_container,
            iframe = me.Coverable_iframe;
    
        baidu.setStyles(iframe, {
            width : container.offsetWidth,
            height : container.offsetHeight
        });
    };
})();
