/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.Object.extend;

///import baidu;
///import baidu.validator;

///import baidu.lang.isArray;
///import baidu.lang.isBoolean;
///import baidu.lang.isDate;
///import baidu.lang.isNumber;
///import baidu.lang.isObject;
///import baidu.lang.isString;

///import baidu.array.each;

(function(){
    var typeName = ['array', 'boolean', 'date', 'number', 'object', 'string'];

    baidu.each(typeName, function(item){
        baidu.validator.Rule[item] = baidu.lang.['is' + item.replace(/(\w)/,function(){
            return RegExp['\x241'].toUpperCase();
        })];
    });
})();
