/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/modal/create.js
 * author: berg
 * version: 1.0.0
 * date:2010/07/23 
 */



/**
 * 基础封装
 * 获取modal实例
 */

///import baidu.ui.modal.Modal;

baidu.ui.modal.create = function(options){
    options = options || {};
    var modal = new baidu.ui.modal.Modal(options);
    modal.render();
    return modal;
};
