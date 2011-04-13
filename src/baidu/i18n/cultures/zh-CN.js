/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */
///import baidu.i18n.cultures;
///import baidu.i18n.culture;
///import baidu.object.extend;
/**
 * 一个中文的语言包
 */
baidu.i18n.cultures['zh-CN'] = baidu.object.extend(baidu.i18n.cultures['zh-CN'] || {}, {
    calendar: {
        dateFormat: 'yyyy-MM-dd',
        titleNames: '#{yyyy}年&nbsp;#{MM}月',
        monthNames: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        dayNames: {mon: '一', tue: '二', wed: '三', thu: '四', fri: '五', sat: '六', sun: '日'},
        
        /**
         * 本地日历和格里高历相互转化的基础函数
         * @param {Date} date 一个Date对象日期
         * @param {String} type 取值local: 将参数日期转为本地日历, gregorian: 将参数日期转为格里高利公历
         * @return {Date}
         * @private
         */
        _basicDate: function(date, type){
            var timeZone = ('local' == type ? 1 : -1) * date.getTimezoneOffset(),
                zone = 8,//时区
                millisec = date.getTime();
            return new Date(timeZone / 60 != zone ? (millisec + timeZone * 60000 + 3600000 * zone)
                : millisec);
        },
        
        /**
         * 取得某年某个月份有几天
         */
        getMonthCount: function(year, month){
            var monthArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            return 1 == month && !(year % 4)
            && (year % 100 != 0 || year % 400 == 0) ? 29 : monthArr[month];
        },
        /**
         * 将一个格里高利公历转化为本地日历
         * @param {Date} date
         * @return {Date}
         */
        toLocalDate: function(date){
            return this._basicDate(date, 'local');
        },
        
        /**
         * 将一个本地化的日历转化为格里高利公历
         * @param {Date} date
         * @return {Date}
         */
        toGregorianDate: function(date){
            return this._basicDate(date, 'gregorian');
        }
    }
});
baidu.object.extend(baidu.i18n.culture, baidu.i18n.cultures['zh-CN']);