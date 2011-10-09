/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.data
///import baidu.lang.createClass
///import baidu.lang.isArray
///import baidu.lang.isBoolean
///import baidu.lang.isDate
///import baidu.lang.isFunction
///import baidu.lang.isNumber
///import baidu.lang.isObject
///import baidu.lang.isString
///import baidu.array.each
///import baidu.array.contains
///import baidu.string.trim
///import baidu.object.each
///import baidu.object.clone
///import baidu.ajax.request

/**
 * 数据验证组件
 * @name baidu.data.Validator
 * @class
 * @grammar new baidu.data.Validator(validations, onValidate)
 * @param {Object} options 对validator的配置。一个典型的配置包括每个待验证项对应的验证规则（可能是一个，也可能是一组）、所有验证项验证完成后的回调函数
 *                           {
 *                               validations:{
 *                                   val1: [
 *                                             {rule: “length”, conf: {len:20}},
 *                                             {rule:”email” }
 *                                         ],
 *                                   val2: [
 *                                             {rule: ”remote”, conf: {url:’#’, onsuccess: function(){}, onfailure: function(){}}}
 *                                         ]
 *                               },
 *                               onValidate: function(result){}
 *                           }
 * @config {Object} validations 每个待验证项对应的验证规则
 * @config {Function} onValidate 所有验证项验证完成后的回调函数
 */
baidu.data.Validator = baidu.lang.createClass(function(options){
    var me = this;
    me._validations = options.validations;
    me._onValidate = options.onValidate;
    me._result = {
        'result': true,
        'detail': []
    };
    me._validatedIndexs = [];//用来保存已验证过的数据的索引值
    me._unValidateAmount = 0;//用来保存尚未验证的数据个数
    me._rules = {
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
        
    };
    
    //将baidu.lang中的is***部分添加到_rules中
    var ruleNames = ['array', 'boolean', 'date', 'function', 'number', 'object', 'string'];
    baidu.array.each(ruleNames, function(item){
        me.addRule(item, baidu.lang['is' + item.replace(/(\w)/, function(){
            return RegExp['\x241'].toUpperCase();
        })]);
    });
}).extend(
/**
 * @lends baidu.data.Validator
 */
{
    /**
     * 对多个数据进行验证
     * @param {Array} values 需要验证的数据项，例如：[
     *                                                  [28, "isAge"], 
     *                                                  ["chengyang", "isNick"], 
     *                                                  ["chengyang", "isName"]
     *                                              ]
     * @return {Object} 验证结果，例如：
     *                                  {
     *                                     result: false;
     *                                     detail: [{
     *                                          index: 0;
     *                                          type: "numberRange"
     *                                      }, {
     *                                          index: 2;
     *                                          type: "length"
     *                                      }]
     *                                  }
     */
    validate: function(values){
        var me = this;
        if(values.length <= 0)
            return;
        me._unValidateAmount = values.length;
        baidu.array.each(values, function(item, index){
            //TODO 如果直接传rule
            var value = item[0],
                validation = item[1],
                result;
            result = me._validations[validation] ? me._singleValidate(value, me._validations[validation], index) : {'result': false};
            if(!result['result']){
                me._result['result'] = false;
                me._result['detail'].push({
                    'index': index,
                    'rule': result.rule
                });
            }
            if(baidu.lang.isBoolean(result.result)){
                me._validated(index);
            }
        });
        return me._result;
    },
    
    /**
     * 对单个数据项进行验证
     * @param {String | Number} value 待验证项的值
     * @param {Array} validation 验证规则
     * @param {Number} index 待验证数据项的索引值
     * @return {Boolean} 验证结果
     */
    _singleValidate: function(value, validation, index){
        var me = this;
        for(var i = 0, len = validation.length; i < len; i++){
            var item = validation[i],
                ruleType = item.rule;
            if(ruleType == 'remote'){
                me._remote(value, item.conf, index);
                return {
                    'result': 'loading',
                    'rule': 'remote'
                };
            }else{
                var rule = me._getRule(ruleType),
                    result = rule(value, item.conf);
                if(result == false){
                    return {
                        'result': false,
                        'rule': item.rule
                    }
                }
            }
        }
        return {
            'result': true
        };
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
            validation = [
                {'rule': rule, 'conf': conf}
            ];
        }else{
            return false;
        }
        return me._singleValidate(value, validation);
    },
    
    /**
     * 添加一条规则
     * @param {String} name 规则名称
     * @param {Object} validation 验证规则
     */
    addValidation: function(name, validation){
        var me = this;
        me._validations[name] = validation;
    },
    
    /**
     * 调用远程接口对数据项进行验证
     * @param {String | Number} value 待验证项的值
     * @param {Object} option 参数
     * @param {Number} index 待验证项的索引值
     */
    _remote: function(value, option, index){
        var url = option.url,
            key = option.key,
            option = baidu.object.clone(option),
            me = this;
        if(option.method.toUpperCase() == 'GET'){
            var junctor = url.indexOf('?') < 0 ? '?' : '&';
            url = url + junctor + key + '=' + encodeURIComponent(value);
        }else{
            option.data = key + '=' + encodeURIComponent(value);
        }
        if(option.callback){
            option['onsuccess'] = option['onfailure'] = function(xhr, responseText){
                var result = option.callback(xhr, resopnseText);
                me._result['result'] = me._result['result'] && result;
                    if(!result){
                        me._result['detail'].push({
                            'index': index,
                            'rule': 'remote'
                        });
                    }
                me._validated(index);
            };
        }else{
            if(option.onsuccess){
                var successCache = option.onsuccess;
                option['onsuccess'] = function(xhr, responseText){
                    var result = successCache(xhr, responseText);
                    me._result['result'] = me._result['result'] && result;
                    if(!result){
                        me._result['detail'].push({
                            'index': index,
                            'rule': 'remote'
                        });
                    }
                    me._validated(index);
                };
            }
            if(option.onfailure){
                var failureCache = option.onfailure;
                option['onfailure'] = function(xhr){
                    var result = failureCache(xhr);
                    me._result['result'] = me._result['result'] && result;
                    if(!result){
                        me._result['detail'].push({
                            'index': index,
                            'rule': 'remote'
                        });
                    }
                    me._validated(index);
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
        me._rules[name] = handler;
        me.dispatchEvent('onAddRule', {name: name, handler: handler});
    },
    
    /**
     * 计算未完成验证的数据项个数。每完成一个数据的验证，将计数减一，并在所有数据都验证完成时触发onValidate和自定义事件onvalidate
     * @param {String} index 已完成验证的数据项的索引
     */
    _validated: function(index){
        var me = this;
        if(!baidu.array.contains(me._validatedIndexs, index)){
            me._unValidateAmount = --me._unValidateAmount;
            me._validatedIndexs.push(index);
        }
        if(me._unValidateAmount == 0){
            me._onValidate(me._result);
            me.dispatchEvent('onvalidate', {result: me._result});
        }
    },
  
    /**
     * 根据规则名取得对应的规则函数
     * @param {String} name 规则名
     * @return {Function} 验证函数
     */
    _getRule: function(name){
        var me = this;
        return me._rules[name] || false;
    }
});
