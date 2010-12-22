/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * @author: meizz
 * @namespace: baidu.fx.puff
 * @create: 2010-07-14
 * @version: 2010-07-14
 */

///import baidu.fx.zoomOut;
///import baidu.object.extend;

/**
 * 将DOM元素放大，关逐渐透明消失
 * 
 * @param   {HTMLElement}   element     DOM元素或者ID
 * @param   {JSON}          options     类实例化时的参数配置
 *          {transformOrigin, from,     to}
 *          {"0px 0px"        number    number}
 * @return  {fx}     效果类的实例
 */
baidu.fx.puff = function(element, options) {
    return baidu.fx.zoomOut(element,
        baidu.object.extend({
            to:1.8
            ,duration:800
            ,transformOrigin:"50% 50%"
        }, options||{})
    );
};
