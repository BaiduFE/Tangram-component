/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/smartPosition/mouse.js
 * author: berg
 * version: 1.0.0
 * date: 2010-07-14
 */

/**
 *
 * 按照鼠标位置定位
 *
 */


///import baidu.ui.smartPosition.SmartPosition;
///import baidu.page.getMousePosition;
///import baidu.event.on;

baidu.ui.smartPosition.mouse = function(element, options){
    options = options || {};

    options.source = element;
    options.coordinate = baidu.page.getMousePosition();
    options['once'] = true;

    var sp = new baidu.ui.smartPosition.SmartPosition(options);
    sp.update();
    return sp;
};
