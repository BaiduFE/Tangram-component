/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

/**
 * 应用实现 iframe
 * @function
 * @param  {String}             iframeSrc             iframe的url
 * @param  {Object}             options optional      选项参数
 * @config {DOMElement}         content               要放到dialog中的元素，如果传此参数时同时传contentText，则忽略contentText。
 * @config {String}             contentText           dialog中的内容
 * @config {String|Number}      width                 内容区域的宽度，注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
 * @config {String|Number}      height                内容区域的高度
 * @config {String|Number}      top                   dialog距离页面上方的距离
 * @config {String|Number}      left                  dialog距离页面左方的距离
 * @config {String}             titleText             dialog标题文字
 * @config {String}             classPrefix           dialog样式的前缀
 * @config {Number}             zIndex                dialog的zIndex值
 * @config {Function}           onopen                dialog打开时触发
 * @config {Function}           onclose               dialog关闭时触发
 * @config {Function}           onbeforeclose         dialog关闭前触发，如果此函数返回false，则组织dialog关闭。
 * @config {Function}           onupdate              dialog更新内容时触发
 * @config {Boolean}            closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭dialog。
 * @config {String}             closeText             closeButton模块提供支持，关闭按钮上的title。
 * @config {Boolean}            modal                 modal模块支持，是否显示遮罩
 * @config {String}             modalColor            modal模块支持，遮罩的颜色
 * @config {Number}             modalOpacity          modal模块支持，遮罩的透明度
 * @config {Number}             modalZIndex           modal模块支持，遮罩的zIndex值
 * @config {Boolean}            draggable             draggable模块支持，是否支持拖拽
 * @config {Function}           ondragstart           draggable模块支持，当拖拽开始时触发
 * @config {Function}           ondrag                draggable模块支持，拖拽过程中触发
 * @config {Function}           ondragend             draggable模块支持，拖拽结束时触发
 * @config {Boolean}            [autoOpen]            是否一开始就打开，默认为true
 */

///import baidu.ui.Dialog;
///import baidu.string.format;
///import baidu.browser.ie;

baidu.ui.Dialog.iframe = function(iframeSrc, options) {
    options = options || {};
    var dialog = new baidu.ui.Dialog(options),
        iframeId = dialog.getId('iframe'),
        iframeName = options.iframeName || iframeId,
        iframeElement,
        contentWindow,
        contentText = baidu.format(dialog.tplIframe,{
            name: iframeName,
            id: iframeId,
            'class': dialog.getClass('iframe')
        });
    
    dialog._update({contentText:contentText});
    dialog._updatePosition();
    iframeElement = baidu.g(iframeId);
    
    //解决iframe加载后无法准确定位dialog的问题
    baidu.on(iframeElement, 'onload', function() {
        //同域则获取被包含页的高度并赋予iframe
        if(contentWindow = iframeElement.contentWindow){
            iframeElement.height = Math.max(contentWindow.document.documentElement.scrollHeight,contentWindow.document.body.scrollHeight) + "px";   
        }
        dialog._updatePosition();
        dialog.dispatchEvent('onupdate');
    });
    iframeElement.src = iframeSrc;

    dialog.open();
    return dialog;
};

//通过extend方法扩展默认属性
baidu.ui.Dialog.extend({
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
