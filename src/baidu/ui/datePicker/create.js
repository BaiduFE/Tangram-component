/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * path: ui/datePicker/DatePicker.js
 * author: meizz
 * version: 1.0.0
 * date: 2010-05-18
 */

///import baidu.ui.datePicker;
///import baidu.ui.datePicker.DatePicker;

/**
 * 日历选择器的对外接口
 *
 * @param   {JSON}      options     配置信息
 */
baidu.ui.datePicker.create = function(element, options) {
    element = baidu.dom.g(element);
    if (!element) return null;

    var dp = new baidu.ui.datePicker.DatePicker(options);
    dp.trigger = element;
    var text = (element.value || element.innerHTML).replace(/[\-_]/g, "/");
    Date.parse(text) && (dp.appointedDate = new Date(Date.parse(text)));
    dp.popup = baidu.ui.datePicker.DatePicker.popup;
    dp.render();
    dp.show();

    return dp;
};
