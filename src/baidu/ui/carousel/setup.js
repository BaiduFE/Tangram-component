/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:ui/carousel/setup.js
 * @author:linlingyu
 * @version:1.0.0
 * @date:2010-09-06
 */

///import baidu.dom.g;
///import baidu.dom.children;
///import baidu.array.each;
///import baidu.ui.carousel.Carousel;

/**
 * 依据页面已有元素建立一个跑马灯
 * @param {Object} element 一个存放数据的容器，例如：<div id="cId"><div>item-1</div><div>item-2</div><div>item-3.</div></div>
 * @param {Object} options 生成carousel的参数，具体参考baidu.ui.carousel.Carousel的options参数.
 * @return {baidu.ui.carousel.Carousel}
 */
baidu.ui.carousel.setup = function(element, options) {
    var element = baidu.g(element),
        options = options || {},
        child = baidu.dom.children(element);
  
    options.contentText = [];
    baidu.array.each(child, function(item, i) {
        options.contentText.push({
            content: item.innerHTML
        });
    });
  
    element.innerHTML = '';
    options.target = element;
    
    var carousel = new baidu.ui.carousel.Carousel(options);
    carousel.render();
    return carousel;
};
