/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/Popup/create.js
 * author: berg,rocy
 * version: 1.0.0
 * date: 2010-05-18
 */



/**
 *
 * 获得popup实例
 *
 */

///import baidu.ui.Popup;

/**
 * 获得popup实例
 * @function
 * @param  {Object}             options               选项
 * @config {DOMElement}         content               要放到popup中的元素，如果传此参数时同时传contentText，则忽略contentText。
 * @config {String}             contentText           popup中的内容
 * @config {String|Number}      width                 内容区域的宽度。注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
 * @config {String|Number}      height                内容区域的高度
 * @config {String|Number}      top                   popup距离页面上方的距离
 * @config {String|Number}      left                  popup距离页面左方的距离
 * @config {String}             classPrefix           popup样式的前缀
 * @config {Number}             zIndex                popup的zIndex值
 * @config {Function}           onopen                popup打开时触发
 * @config {Function}           onclose               popup关闭时触发
 * @config {Function}           onbeforeclose         popup关闭前触发，如果此函数返回false，则组织popup关闭。
 * @config {Function}           onupdate              popup更新内容时触发
 * @config {Boolean}            closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭popup
 * @config {String}             closeText             closeButton模块提供支持，关闭按钮上的文字
 * @config {Boolean}            modal                 modal模块支持，是否显示遮罩
 * @config {String}             modalColor            modal模块支持，遮罩的颜色
 * @config {Number}             modalOpacity          modal模块支持，遮罩的透明度
 * @config {Number}             modalZIndex           modal模块支持，遮罩的zIndex值
 * @config {Boolean}            draggable             draggable模块支持，是否支持拖拽
 * @config {Function}           ondragstart           draggable模块支持，当拖拽开始时触发
 * @config {Function}           ondrag                draggable模块支持，拖拽过程中触发
 * @config {Function}           ondragend             draggable模块支持，拖拽结束时触发
 * @remark
 * @return {Popup}                                    Popup类
 */

baidu.ui.Popup.create = function(options){
    var popupInstance = new baidu.ui.Popup(options);
    popupInstance.render();
    return popupInstance;
};
