/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/dialog/create.js
 * author: berg
 * version: 1.0.0
 * date: 2010-05-18
 */


///import baidu.ui.dialog;
///import baidu.ui.dialog.Dialog;

/**
 * 创建一个Dialog的实例
 * @return {baidu.ui.dialog.Dialog}
 */
baidu.ui.dialog.create = function(options) {
    var dialogInstance = new baidu.ui.dialog.Dialog(options);
    dialogInstance.render();
    return dialogInstance;
};
