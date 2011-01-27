/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Dialog;
///import baidu.string.format;
///import baidu.browser.ie;

baidu.ui.Dialog.register(function(me){
    if(me.type == "iframe"){
        baidu.extend(me,{
            autoRender : true,
            tplIframe: "<iframe width='100%' height='98%' frameborder='0' scrolling='no' name='#{name}' id='#{id}' class='#{class}'></iframe>",

            /**
             * 获取iframe
             * @public
             * @return {HTMLElement} iframe
             */
            getIframe: function(){
                return baidu.g(this.getId('iframe'));
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
            baidu.on(iframeElement, 'onload', function() {
                //同域则获取被包含页的高度并赋予iframe
                if(contentWindow = iframeElement.contentWindow){
                    iframeElement.height = Math.max(contentWindow.document.documentElement.scrollHeight,contentWindow.document.body.scrollHeight) + "px";   
                }
                me._updatePosition();
                me.dispatchEvent('onupdate');
            });
            iframeElement.src = me.iframeSrc;
        });  
    }
});
