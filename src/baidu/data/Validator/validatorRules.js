/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * Code from EXT
 */

///import baidu.data.Validator;

///import baidu.lang.createClass;
///import baidu.lang.isArray;
///import baidu.lang.isBoolean;
///import baidu.lang.isDate;
///import baidu.lang.isFunction;
///import baidu.lang.isNumber;
///import baidu.lang.isObject;
///import baidu.lang.isString;

///import baidu.array.each;

/**
 * 默认提供以下常用验证：require, length, equalTo, lengthRange, numberRange, email, url
 * @Object
 * @name baidu.data.Validator.validatorRules
 * @grammar baidu.data.Validator.validatorRules
 * @return {baidu.data.Validator.validatorRules} validatorRules 实例
 */
baidu.data.Validator.validatorRules = (function(){
    var rules = {
        
        /**
         * Returns true if the given value is empty.
         * @param {String} value The value to validate
         * @return {Boolean} True if the validation passed
         */
        require: function(value){
            return baidu.string.trim(value) !== '';
        },
        
        /**
         * Returns true if the given value`s length is equal to the given length.
         * @param {String} value The value to validate
         * @param {Object} conf Config object 
         * @return {Boolean} True if the validation passed
         */
        length: function(value, conf){
            return value.length == conf.len;
        },
        
        /**
         * Returns true if the given value is equal to the reference value.
         * @param {String || Number} value The value to validate
         * @param {Object} conf Config object 
         * @return {Boolean} True if the validation passed
         */
        equalTo: function(value, conf){
            return value === conf.refer;
        },
        
        /**
         * Returns true if the given value`s length is between the configured min and max length.
         * @param {String || Number} value The value to validate
         * @param {Object} conf Config object 
         * @return {Boolean} True if the validation passed
         */
        lengthRange: function(value, conf){
            var len = value.length,
                min = conf.min,
                max = conf.max;
            if((min && len<min) || (max && len>max)){
                return false;
            }else{
                return true;
            }
        },
        
        /**
         * Returns true if the given value is between the configured min and max values.
         * @param {String || Number} value The value to validate
         * @param {Object} conf Config object 
         * @return {Boolean} True if the validation passed
         */
        numberRange: function(value, conf){
            var min = conf.min,
                max = conf.max;
            if((min && value<min) || (max && value>max)){
                return false;
            }else{
                return true;
            }
        },
        
        /**
         * Returns true if the given value is in the correct email format.
         * @param {String || Number} value The value to validate
         * @return {Boolean} True if the validation passed
         */
        email: function(value){
            return /^[\w!#\$%'\*\+\-\/=\?\^`{}\|~]+([.][\w!#\$%'\*\+\-\/=\?\^`{}\|~]+)*@[-a-z0-9]{1,20}[.][a-z0-9]{1,10}([.][a-z]{2})?$/i.test(value);
        },
        
        /**
         * Returns true if the given value is in the correct url format.
         * @param {String || Number} value The value to validate
         * @return {Boolean} True if the validation passed
         */
        url: function(value){
            return /^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test(value);
        }
    },
    
    //将baidu.lang中的is***部分添加到_rules中
    ruleNames = ['array', 'boolean', 'date', 'function', 'number', 'object', 'string'];
    baidu.each(ruleNames, function(item){
        rules[item] = baidu.lang['is' + item.substr(0,1).toUpperCase() + item.substr(1)];
    });

    return rules;
})();
