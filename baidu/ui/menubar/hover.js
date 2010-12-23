/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/menubar/hover.js
 * author: rocy
 * version: 1.0.0
 * date: 2010-12-09
 */
/**
 * 基础方法
 *
 * 获得menubar实例
 */
///import baidu.ui.menubar.Menubar;
///import baidu.ui.create;
///import baidu.ui.menubar.Menubar$hover;
///import baidu.dom.g;

/**
 * 创建一个鼠标hover触发的menubar
 * @param {HTMLElement} element
 * @param {Array} data
 * @param {Object} options
 * @return {baidu.ui.menubar.Menubar}
 */
baidu.ui.menubar.hover = function(element, data, options){
    options = baidu.object.extend({
        data: data,
        type: 'hover',
        autoRender: true,
        element: baidu.g(element)
    }, options || {});
    return baidu.ui.create(baidu.ui.menubar.Menubar, options);
};
