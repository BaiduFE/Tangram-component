/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/dialog/iframe.js
 * author: berg
 * version: 1.0.0
 * date: 2010-05-18
 */

/**
 * 应用实现 iframe
 * 
 * @param  {String}             iframeSrc               iframe的url
 * @param  {Object}             options optional        选项参数
 *
 */

///import baidu.ui.dialog;
///import baidu.ui.dialog.Dialog;

///import baidu.string.format;
///import baidu.browser.ie;

baidu.ui.dialog.iframe = function(iframeSrc, options){
    options = options || {};
    var dialog = new baidu.ui.dialog.Dialog(options),
        iframe = 'iframe',
        iframeElement;
    dialog.contentText =  baidu.format(
        dialog.tplIframe, 
            iframeSrc,
            dialog.getId(iframe),
            dialog.getClass(iframe),
            dialog.iframeName ? dialog.iframeName : dialog.getId(iframe)
    );
    dialog.render();
    
    //让IE强制rerender,否则iframe可能出不来
    iframeElement = dialog.getContent().firstChild;
    if(baidu.browser.ie){
        iframeElement.src = dialog.getContent().firstChild.src;    
    }

    //解决iframe加载后无法准确定位dialog的问题
    baidu.on(iframeElement,"onload",function(){
        dialog.update(dialog);
    });

    dialog.open();
    return dialog;
};

//通过extend方法扩展默认属性

baidu.ui.dialog.Dialog.extend({
    //iframeName : "",
    tplIframe  : "<iframe width='100%' height='100%' frameborder='0' scrolling='no' src='#{0}' name='#{3}' id='#{1}' class='#{2}'></iframe>"
});
