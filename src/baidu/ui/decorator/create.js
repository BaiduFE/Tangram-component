/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/decorator/create.js
 * author: berg
 * version: 1.0.0
 * date: 2010/08/17 
 */


///import baidu.ui;
///import baidu.ui.decorator;
///import baidu.ui.decorator.Decorator;

/**
 * 装饰器控件，包定义
 */
baidu.ui.decorator.create = function(options){
    var rc = new baidu.ui.decorator.Decorator(options);
    rc.render();
    return rc;
};
