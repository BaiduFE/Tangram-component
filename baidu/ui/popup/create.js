/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/popup/create.js
 * author: berg,rocy
 * version: 1.0.0
 * date: 2010-05-18
 */



/**
 *
 * 获得popup实例
 *
 */


///import baidu.ui.popup;
///import baidu.ui.popup.Popup;

baidu.ui.popup.create = function(options){
    var popupInstance = new baidu.ui.popup.Popup(options);
    popupInstance.render();
    return popupInstance;
};
