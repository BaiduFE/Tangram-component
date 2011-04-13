/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */
///import baidu.i18n.cultures;
///import baidu.i18n.culture;
///import baidu.object.extend;
/**
 * 一个美语的语言包
 */
baidu.i18n.cultures['en-US'] = baidu.object.extend(baidu.i18n.cultures['en-US'] || {}, {
    calendar: {
        dateFormat: 'yyyy-MM-dd',
        titleNames: '#{MM}&nbsp;#{yyyy}',
        monthNames: ['January','February','March','April','May','June', 'July','August','September','October','November','December'],
        dayNames: {mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun'},
        
        /**
         * 本地日历和格里高历相互转化的基础函数
         * @param {Date} date 一个Date对象日期
         * @param {String} type 取值local: 将参数日期转为本地日历, gregorian: 将参数日期转为格里高利公历
         * @return {Date}
         * @private
         */
        _basicDate: function(date, type){
            var timeZone = ('local' == type ? 1 : -1) * date.getTimezoneOffset(),
                zone = -5,//时区
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
baidu.object.extend(baidu.i18n.culture, baidu.i18n.cultures['en-US']);