/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.dom.show;
///import baidu.dom.hide;
///import baidu.browser.ie;
///import baidu.browser.firefox;
///import baidu.lang.Event;
///import baidu.lang.createSingle;
///import baidu.event.on;
///import baidu.dom.insertHTML;
///import baidu.dom.getPosition;
///import baidu.page.createStyleSheet;
///import baidu.ui;

/**
 * 创建一个 Popup 层
 * 
 * @author: meizz
 * @namespace: baidu.ui.createPopup
 * @version: 2010-06-08
 * @param   {JSON}      options     配置信息
 * @private
 */
baidu.ui.createPopup = function(options) {
    var popup = baidu.lang.createSingle({isOpen : false});
    popup.eid = "baidupopup_"+ popup.guid;

    // IE 浏览器使用系统的 window.createPopup()
    var POPUP, IFRAME,
        bodyStyle = "font-size:12px; margin:0;";
    try {baidu.browser.ie && (POPUP = window.createPopup());}catch(ex){}

    // 非 IE 浏览器使用 <iframe> 作为 popup 的载体
    if (!POPUP) {
        var str = "<iframe id='"+ popup.eid +"' scrolling='no'"+
            " frameborder='0' style='position:absolute; z-index:1001; "+
            " width:0px; height:0px; background-color:#0FFFFF'></iframe>";
        if (!document.body) {document.write(str);} else {
            baidu.dom.insertHTML(document.body, "afterbegin", str);
        }
    }

    /**
     * 启动 popup 的初始化程序
     */
    popup.render = function() {
        var me = this;
        if (POPUP) {   // window.createPopup()
            me.window = POPUP;
            me.document = POPUP.document;
            var s = me.styleSheet = me.createStyleSheet();
            s.addRule("body", bodyStyle);
            me.dispatchEvent("onready");
        } else {
            // 初始化 iframe
            initIframe();
        }
        baidu.event.on(window, "onblur", function(){
            me.focusme = false;
            if (!me.isOpen) return;
            setTimeout(function(){if(!me.focusme) me.hide()}, 100);
        });
        baidu.event.on(window, "onresize", function(){me.hide()});
        baidu.event.on(document, "onmousedown", function(){me.hide()});
    };

    function initIframe(delay) {
        IFRAME = baidu.dom.g(popup.eid);

        // 修正Firefox的一个BUG
        // Firefox 对于刚刚动态创建的 <iframe> 写入的时候无法渲染内容
        if ((!delay && baidu.browser.firefox) || !IFRAME) {
            setTimeout(function(){initIframe(true)}, 10);
            return;
        }
        popup.window = IFRAME.contentWindow;
        var d = popup.document = popup.window.document;
        var s = "<html><head><style type='text/css'>"+
            "body{"+ bodyStyle +" background-color:#FFFFFF;}\n"+
            "</style></head><body onfocus='parent[\""+ baidu.guid +"\"]._instances[\""+
            popup.guid +"\"].focusme=true'></body></html>";
        d.open(); d.write(s); d.close();
        popup.styleSheet = popup.createStyleSheet();
        popup.dispatchEvent("onready");
    }

    /**
     * 创建 popup 层里的 style sheet 对象
     */
    popup.createStyleSheet = function(op) {
        op = op || {};
        op.document = this.document;
        return baidu.page.createStyleSheet(op);
    };

    /**
     * 显示 popup 层
     */
    popup.show = function(left, top, width, height, trigger, position) {
        if (POPUP) {
            if (position == "top") top = -height;
            else top = trigger.offsetHeight;

            POPUP.show(0, top, width, height, trigger || document.body);

            this.isOpen = POPUP.isOpen;
        } else if (IFRAME) {
            baidu.dom.show(this.eid);

            if (position == "top") top -= height;
            else top = top + trigger.offsetHeight;

            this.isOpen = true;
            var s = IFRAME.style;
            s.width = width +"px";
            s.height = height +"px";
            s.top = top +"px";
            s.left = left +"px";
        }
        this.dispatchEvent("onshow");
    };

    /**
     * 显示 popup 层
     */
    popup.bind = function(trigger, width, height, position) {
        var pos = baidu.dom.getPosition(trigger);
        this.show(pos.left, pos.top, width, height, trigger, position);
    };

    /**
     * 隐藏 popup 层
     */
    popup.hide = function() {
        if (this.isOpen) {
            if (POPUP) {
                POPUP.hide();
                this.isOpen = POPUP.isOpen;
            } else if (IFRAME) {    // iframe mode
                this.isOpen = false;

                var s = IFRAME.style;
                s.width = "0px";
                s.height = "0px";
                baidu.dom.hide(this.eid);
            }
            this.dispatchEvent("onhide");
        }
    };

    /**
     * 向 popup 层写入内容
     */
    popup.write = function(str) {
        var me = this;
        this.document.body.innerHTML = str;
        //this.document.close();
    };

    return popup;
};
