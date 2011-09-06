/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu;
///import baidu.validator;

baidu.validator.Validator = baidu.validator.Validator || (function(){

    var validator = function(){

        /**
         * 对传入的值进行类型判断
         * @public
         * @param {String} type 验证类型
         * @param {Object} value 需要验证的值
         * @param {Object} options 验证时需要的辅助属性
         * @return {Boolean} result
         */
        verify: function(type, value, options){},

        /**
         * 添自定义验证规则
         * @public
         * @param {String} name 规则名称
         * @param {Function|RegExp} hander 验证该规则的方法或者正则表达式,Function需要返回true,false
         */
        addRule: function(name, handler){},

    };

    return new validator();
})();

baidu.validator.Rule = {};
