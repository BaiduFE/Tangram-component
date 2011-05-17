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
        dayNames: {mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun'}
    },
    timeZone: -5
});
