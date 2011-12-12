/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Dialog;

///import baidu.string.format;
///import baidu.dom.setStyles;
///import baidu.object.extend;


/**
 * 创建一个content是iframe的dialog
 * @name baidu.ui.Dialog.Dialog$iframe
 * @addon baidu.ui.Dialog
 */
baidu.ui.Dialog.register(function(me){
    if(me.type == "iframe"){
        baidu.extend(me,{
            autoRender : true,
            tplIframe: "<iframe width='100%' height='97%' frameborder='0' scrolling='no' name='#{name}' id='#{id}' class='#{class}'></iframe>",

            /**
             * 获取iframe
			 * @name baidu.ui.Dialog.Dialog$iframe.getIframe
			 * @addon baidu.ui.Dialog.Dialog$iframe
			 * @function 
             * @return {HTMLElement} iframe
             */
            getIframe: function(){
                return baidu.g(this.getId('iframe'));
            },

            /**
             * 更新iframe的Style，更新dialog
			 * @name baidu.ui.Dialog.Dialog$iframe.updateIframe
			 * @addon baidu.ui.Dialog.Dialog$iframe
			 * @function 
             * @param {Object} styles 样式名称和值组成的对象，例如{width:"500px",height:"300px"}
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
