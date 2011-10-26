/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.ajax.request;

///import baidu.array.each;
///import baidu.array.contains;

///import baidu.data;

///import baidu.fn.blank;

///import baidu.lang.createClass;
///import baidu.lang.isArray;
///import baidu.lang.isBoolean;
///import baidu.lang.isDate;
///import baidu.lang.isFunction;
///import baidu.lang.isNumber;
///import baidu.lang.isObject;
///import baidu.lang.isString;

///import baidu.object.each;
///import baidu.object.clone;

///import baidu.string.trim;


/**
 * 数据验证组件
 * @name baidu.data.Validator
 * @class
 * @grammar new baidu.data.Validator(validations)
 * @param {Object} validations 每个验证规则的具体配置
 *  {
 *          val1: [
 *                    {rule: "length", conf: {len:20}},
 *                    {rule:"email" }
 *                ],
 *          val2: [
 *                    {rule: "remote", conf: {url:'#', onsuccess: function(){}, onfailure: function(){}}}
 *                ]
 *  }
 */
baidu.data.Validator = baidu.lang.createClass(function(validations){
    var me = this;
    me._validations = validations || {};
    me._rules = {};//用来保存用户自定义的验证函数
}).extend(
/**
 * @lends baidu.data.Validator
 */
{
    /**
     * 对多个数据进行验证
     * @param {Array} values 需要验证的数据项，例如：
     *  [
     *      [28, "isAge"], 
     *      ["chengyang", "isNick"], 
     *      ["chengyang", "isName"]
     *  ]
     * @return {Object} 验证反馈（包括该组数据的验证结果和验证失败的具体情况），例如：
     *  {
     *     result: resultType;
     *     detail: [{
     *          index: 0;
     *          type: "numberRange"
     *      }, {
     *          index: 2;
     *          type: "length"
     *      }]
     *  }
     */
    validate: function(values){
        var me = this, value, validation, 
            feedback = {
                'result': [],
                'detail': []
            },
            itemResult,
            resultType = baidu.data.Validator.validatorResultTypes;
        
        if(values.length <= 0){
            return;
        }
       
       //逐个验证
        baidu.array.each(values, function(item, index){
            value = item[0];
            validation = item[1];
            itemResult = me._validations[validation] ? me._singleValidate(value, me._validations[validation]) : {'result': false};
            if(itemResult['result'] != true){
                feedback['detail'].push({
                    'index': index,
                    'rule': itemResult.rule || validation
                });
            }
            feedback['result'].push(itemResult['result']);
        });
        
        feedback['result'] = me._wrapResult(feedback['result']);
        
        return feedback;
    },
    
    /**
     * 将数组形式的验证结果包装成validatorResultTypes中的枚举类型
     * @param {Object} result 验证结果
     */
    _wrapResult: function(result){
        var me = this,
            resultTypes = baidu.data.Validator.validatorResultTypes;
        if(baidu.array.contains(result, false)){
            result = resultTypes['FAILURE'];
        }else if(!baidu.array.contains(result, false) && baidu.array.contains(result, 'loading')){
            result = resultTypes['SUCCESSWITHOUTREMOTE'];
        }else{
            result = resultTypes['SUCCESS'];
        }
        return result;
    },
    
    /**
     * 对单个数据项进行验证（内部使用）
     * @param {String | Number} value 待验证项的值
     * @param {Array} validation 验证规则名称
     * @return {Boolean} 验证结果
     */
    _singleValidate: function(value, validation){
        var me = this, ruleType, rule, itemResult = {'result': true}, remoteConf;//TODO 如果一个值同时使用多个remote方式验证，会出错
        
        baidu.each(validation, function(val){
            ruleType = val.rule;
            if(ruleType == 'remote'){
                remoteConf = val.conf;
            }else{
                rule = me._getRule(ruleType);
                if(!rule(value, val.conf)){
                    itemResult['result'] = false;
                    itemResult['rule'] = ruleType;
                }
            }
        });
        
        //如果除remote以外的验证都返回true，则调用remote验证；如果有一项为false，则无须进行remote验证
        if(!itemResult['result']){
            return itemResult;
        }
        
        if(remoteConf){
            me._remote(value, remoteConf);
            itemResult['result'] = 'loading';
            itemResult['rule'] = 'remote';
        }
        return itemResult;
    },

    /**
     * 对单个数据项进行验证
     * @param {String | Number} value 待验证项的值
     * @param {String} rule 验证规则
     * @param {Object} conf 配置项
     * @return {Object} 验证结果
     */
    test: function(value, rule, conf){
        var me = this, validation;
        
        if(me._validations[rule]){
            validation = me._validations[rule];
        }else if(me._getRule(rule)){
            validation = [{
                'rule': rule, 
                'conf': conf
            }];
        }else{
            return false;
        }
        
        return me._singleValidate(value, validation);
    },
    
    /**
     * 添加一条规则
     * @param {String} name 规则名称
     * @param {Array} validation 验证规则
     */
    addValidation: function(name, validation){
        var me = this;
        me._validations[name] = validation || [];
    },
    
    /**
     * 调用远程接口对数据项进行验证
     * @param {String | Number} value 待验证项的值
     * @param {Object} option 参数
     */
    _remote: function(value, option){
        var url = option.url,
            key = option.key,//需要在配置项中指定待验证项对应的key
            option = baidu.object.clone(option),
            me = this;
            
        if(option.method.toUpperCase() == 'GET'){//如果是get方式，直接在URL后面加上参数
            var junctor = url.indexOf('?') < 0 ? '?' : '&';
            url = url + junctor + key + '=' + encodeURIComponent(value);
        }else{
            option.data = key + '=' + encodeURIComponent(value);
        }
        
        if(option.callback){//如果只提供了callback方法，则将其作为onsuccess和onfailure的回调方法
            option['onsuccess'] = option['onfailure'] = function(xhr, responseText){
                option.callback(value, xhr, responseText);//callback方法中需要返回验证的结果（true或者false）
            };
        }else{
            if(option.onsuccess){
                var successCache = option.onsuccess;
                option['onsuccess'] = function(xhr, responseText){
                    successCache(value, xhr, responseText);//onsuccess方法中需要返回验证的结果（true或者false）
                };
            }
            if(option.onfailure){
                var failureCache = option.onfailure;
                option['onfailure'] = function(xhr){
                    failureCache(value, xhr);//onfailure方法中需要返回验证的结果（true或者false）
                };
            }
        }
        baidu.ajax.request(url, option);
    },
    
    /**
     * 添加一条规则
     * @param {String} name 规则名
     * @param {Function} handler 执行规则的函数
     */
    addRule: function(name, handler){
        var me = this;
        
        me._rules[name] = handler || baidu.fn.blank;
        me.dispatchEvent('onAddRule', {
            'name': name, 
            'handler': handler
        });
    },
    
    /**
     * 根据规则名取得对应的规则函数
     * @param {String} name 规则名
     * @return {Function} 验证函数
     */
    _getRule: function(name){
        var me = this;
        
        return me._rules[name] || baidu.data.Validator.validatorRules[name];//先从用户自定义的rules中查找，再从内置的rules中查找
    }
});

/**
 * 用于存储返回值的枚举类
 */
baidu.data.Validator.validatorResultTypes = {
    'SUCCESS': 'success',   //表示所有值都验证通过
    'FAILURE': 'failure',   //表示存在验证不通过的值
    'SUCCESSWITHOUTREMOTE': 'successwithoutremote' //表示除了使用remote方式验证的值，其他的都验证通过
};

/**
 * 内置的rules
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
    baidu.array.each(ruleNames, function(item){
        rules[item] = baidu.lang['is' + item.substr(0,1).toUpperCase() + item.substr(1)];
    });
    return rules;
})();