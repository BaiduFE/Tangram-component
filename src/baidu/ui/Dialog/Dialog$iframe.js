/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Dialog;

///import baidu.string.format;
///import baidu.dom.setStyles;
///import baidu.object.extend;

baidu.ui.Dialog.register(function(me){
    if(me.type == "iframe"){
        baidu.extend(me,{
            autoRender : true,
            tplIframe: "<iframe width='100%' height='97%' frameborder='0' scrolling='no' name='#{name}' id='#{id}' class='#{class}'></iframe>",

            /**
             * 获取iframe
             * @public
             * @return {HTMLElement} iframe
             */
            getIframe: function(){
                return baidu.g(this.getId('iframe'));
            },

            /**
             * 更新iframe的Style，更新dialog
             * @public
             * @param {Object} styles {width:width,height:height}
             * @return {Null}
             */
            updateIframe:function(styles){
                baidu.setStyles(this.getId('iframe'), styles);
                me._updatePosition();
                me.dispatchEvent('onupdate');
            }
        });
        
        var contentText,
            iframeId = me.getId('iframe'),
            iframeName = me.iframeName || iframeId,
            iframeElement,
            contentWindow,
            contentText = baidu.format(me.tplIframe,{
                name: iframeName,
                id: iframeId,
                'class': me.getClass('iframe')
            });

        me.addEventListener("onload",function(){
            me._update({contentText:contentText});
            me._updatePosition();
            iframeElement = baidu.g(iframeId);
    
            //解决iframe加载后无法准确定位dialog的问题
            me.on(iframeElement, 'onload', function() {
                me._updatePosition();
                me.dispatchEvent('onupdate');
            });
            iframeElement.src = me.iframeSrc;
        });  
    }
});
