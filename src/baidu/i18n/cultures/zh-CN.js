/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */
///import baidu.i18n.cultures;
///import baidu.i18n.culture;
///import baidu.object.extend;
/**
 * 一个中文的语言包
 * @param {String} dateFormat 需要显示在日历组件中的格式
 * @param {Array} monthNames 各个月份的中文表示方式
 * @param {Object} dayNames 各个星期的中文表示方式
 */
baidu.i18n.cultures['zh-CN'] = baidu.i18n.cultures['zh-CN'] || {
    calendar: {
        dateFormat: 'yyyy年MM月dd日',
        monthNames: ['一月', '二月'],
        dayNames: {
            monday: '星期一',
            tuesday: '星期二',
            wednesday: '星期三',
            thursday: '星期四',
            fraiday: '星期五',
            saturday: '星期六',
            sunday: '星期日'
        },
        /**
         * 将一个格里高利公历转化为本地日历
         * @param {Date} date
         */
        toLocalDate: function(date){
            var timeZone = date.getTimezoneOffset(),
                zone = 8;//时区
            return new Date(timeZone / 60 != zone ? (date.getTime() + timeZone * 60000 + 3600000 * zone)
                : date.getTime());
        },
        /**
         * 将一个本地化的日历转化为格里高利公历
         * @param {Object} date
         */
        toGregorianDate: function(date){
            
        }
    }
};
baidu.object.extend(baidu.i18n.culture, baidu.i18n.cultures['zh-CN']);