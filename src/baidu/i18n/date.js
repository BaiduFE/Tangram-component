/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.i18n;
baidu.i18n.date = baidu.i18n.calendar || {

    /**
     * 获取某年某个月的天数
     * @public
     * @param {Number} year 年份.
     * @param {Number} month 月份.
     * @return {Number}
     */
    getDaysInMonth: function(year, month) {
        var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (month == 1 && baidu.i18n.date.isLeapYear(year)) {
            return 29;
        }
        return days[month];
    },

    /**
     * 判断传入年份是否时润年
     * @param {Number} year 年份.
     * @return {Boolean}
     */
    isLeapYear: function(year) {
        return !(year % 400) || (!(year % 4) && !!(year % 100));
    },

    /**
     * 将传入的date对象转换成指定地区的date对象
     * @public
     * @param {String} locale 地区名称简写字符.
     * @param {Date} dateObject
     * @return {Date}
     */
    toLocalDate: function(locale, dateObject) {
        return this._basicDate(locale, dateObject, 'locale');
    },

    /**
     * 将传入的date转换成格力高利公历
     * @public
     * @param {String} locale 传入date的地区名称简写字符，不传入则从date中计算得出.
     * @param {Date} dateObject
     * @return {Date}
     */
    toGregorianDate: function(locale, dateObject) {
        return this._basicDate(dateObject, locale, 'gregorian');
    },

    /**
     * 本地日历和格力高利公历相互转换的基础函数
     * @private
     * @param {Date} dateObject 需要转换的日期函数.
     * @param {string} locale 传入date的地区名称简写字符，不传入则从date中计算得出.
     * @param {String} type ['local' , 'gregorian'].
     */
    _basicDate: function(dateObject, locale, type) {
        var timeOffset = (type == 'local' ? 1 : -1) * dateObject.getTimezoneOffset(),
            timeZone = baidu.i18n.cultures[locale].calendar.timeZone,
            millisecond = dateObject.getTime();

        return new Date(timeOffset / 60 != timeZone ? (millisecond + timeOffset * 60000 + 3600000 * timeZone) : millisecond);
    }
};
