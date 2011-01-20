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
 * @param  {String}             iframeSrc               iframe的url.
 * @param  {Object}             options optional        选项参数.
 *
 */

///import baidu.ui.dialog;
///import baidu.ui.dialog.Dialog;

///import baidu.string.format;
///import baidu.browser.ie;

baidu.ui.dialog.iframe = function(iframeSrc, options) {
    options = options || {};
    var dialog = new baidu.ui.dialog.Dialog(options),
        iframeId = dialog.getId('iframe'),
        iframeName = options.iframeName || iframeId,
        iframeElement;

    dialog.contentText = baidu.format(dialog.tplIframe,{
        name: iframeName,
        id: iframeId,
        'class': dialog.getClass('iframe')
    });
    dialog.render();
    iframeElement = baidu.g(iframeId);
    
    //解决iframe加载后无法准确定位dialog的问题
    baidu.on(iframeElement, 'onload', function() {
        iframeElement.height = Math.max(iframeElement.contentWindow.document.documentElement.scrollHeight,iframeElement.contentWindow.document.body.scrollHeight) + "px";
        dialog._updatePosition();
        dialog.dispatchEvent('onupdate');
    });
    iframeElement.src = iframeSrc;

    dialog.open();
    return dialog;
};

//通过extend方法扩展默认属性
baidu.ui.dialog.Dialog.extend({
    tplIframe: "<iframe width='100%' frameborder='0' scrolling='no' name='#{name}' id='#{id}' class='#{class}'></iframe>"
});
