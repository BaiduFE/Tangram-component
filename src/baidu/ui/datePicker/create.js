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
 * @function
 * @param   {Object}      options         配置信息
 * @config  {String}      format          日期格式， 默认"yyyy-MM-dd"。
 * @config  {Date}        minDate         日历最小日期，默认史前27万1千821年。
 * @config  {Date}        maxDate         日历最大日期，默认公元27万5千760年。
 * @config  {Number}      duration        效果持续时长，默认365毫秒。
 * @config  {Date}        appointedDate   初始展示日期， 默认为当天。
 * @config  {Array}       dateList        初始高亮的日期们，为Date类型的数组，默认为空。
 * @config  {Object}      lang            语言包
 * @config  {String}      prevHTML        向前翻页按钮的HTML字符串
 * @config  {String}      nextHTML        向后翻页按钮的HTML字符串
 * @config  {Function}    onpick          日期点击的回调函数，传入参数为json对象，其中target属性为选中的Date。
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
