/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * @author: meizz
 * @create: 2010-07-14
 * @namespace: baidu.fx.scrollTo
 * @version: 2010-07-14
 */

///import baidu.dom.g;
///import baidu.fx.scrollBy;

/**
 * 滚动条滚动到指定位置
 * 
 * @author: meizz
 * @create: 2010-07-14
 * @version: 2010-07-14
 *
 * @param   {HTMLElement}   element     DOM元素或者ID
 * @param   {Array|JSON}    point       移动的距离 [,] | {x,y}
 * @param   {JSON}          options     类实例化时的参数配置
 * @return  {fx}     效果类的实例
 */
baidu.fx.scrollTo = function(element, point, options) {
    if (!(element = baidu.dom.g(element)) || typeof point != "object") return null;
    
    var d = {};
    d.x = (point[0] || point.x || 0) - element.scrollLeft;
    d.y = (point[1] || point.y || 0) - element.scrollTop;

    return baidu.fx.scrollBy(element, d, options);
};
