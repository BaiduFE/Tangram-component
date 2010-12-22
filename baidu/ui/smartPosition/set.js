/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/smartPosition/set.js
 * author: berg
 * version: 1.0.0
 * date: 2010-07-14*
 */

/**
 *
 * 让已有的元素支持smartPosition
 *
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {Array|Object}       coordinate 定位坐标,相对文档左上角的坐标，可以是{x:200,y:300}格式，也可以是[200, 300]格式
 * @param {Object}       options 选项
 *
 * @return {baidu.ui.smartPosition.SmartPosition} SmartPosition对象
 */


///import baidu.ui.smartPosition.SmartPosition;
///import baidu.dom.g;

baidu.ui.smartPosition.set = function(element, coordinate, options){
    options = options || {};

    options.source = baidu.g(element);
    options.coordinate = coordinate || [0,0];

    var sp = new baidu.ui.smartPosition.SmartPosition(options);
    sp.update();

    return sp;
};
