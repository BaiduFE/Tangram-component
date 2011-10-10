/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.data
///import baidu.data.validatorRules

///import baidu.lang.createClass
///import baidu.lang.isBoolean

///import baidu.array.each
///import baidu.array.contains
///import baidu.string.trim
///import baidu.object.each
///import baidu.object.clone
///import baidu.ajax.request
///import baidu.fn.blank


/**
 * 数据验证组件
 * @name baidu.data.Validator
 * @class
 * @grammar new baidu.data.Validator(validations, onValidate)
 * @param {Object} options 对validator的配置。一个典型的配置包括每个待验证项对应的验证规则（可能是一个，也可能是一组）、所有验证项验证完成后的回调函数
 *  {
 *      validations:{
 *          val1: [
 *                    {rule: "length", conf: {len:20}},
 *                    {rule:"email" }
 *                ],
 *          val2: [
 *                    {rule: "remote", conf: {url:'#', onsuccess: function(){}, onfailure: function(){}}}
 *                ]
 *      },
 *      onValidate: function(result){}
 *  }
 * @config {Object} validations 每个待验证项对应的验证规则
 * @config {Function} onValidate 所有验证项验证完成后的回调函数
 */
baidu.data.Validator = baidu.lang.createClass(function(options){
    var me = this;
    me._validations = options.validations || {};
    me.onvalidate = options.onValidate || baidu.fn.blank();
    me._result = {
        'result': true,
        'detail': []
    };
    me._validatedIndexs = {};//用来保存已验证过的数据的索引值
    me._unValidateAmount = 0;//用来保存尚未验证的数据个数
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
     * @return {Object} 验证结果，例如：
     *  {
     *     result: false;
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
        var me = this, value, validation, result;
        
        if(values.length <= 0)
            return;
        me._unValidateAmount = values.length;
        
        console.log('me._unValidateAmount:' + me._unValidateAmount);
        
        baidu.array.each(values, function(item, index){
            value = item[0];
            validation = item[1];
            result = me._validations[validation] ? me._singleValidate(value, me._validations[validation], index) : {'result': false};
            me.dispatchEvent('onvalidatefield', {
                'value': value, 
                'result': result, 
                'index': index
            });

            if(!result['result']){
                me._result['result'] = false;
                me._result['detail'].push({
                    'index': index,
                    'rule': result.rule || validation
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
     * @param {Array} validation 验证规则名称
     * @param {Number} index 待验证数据项的索引值
     * @return {Boolean} 验证结果
     */
    _singleValidate: function(value, validation, index){
        var me = this, ruleType, rule, result = {'result': true};
        
        baidu.each(validation, function(val){
            ruleType = val.rule;
            if(ruleType == 'remote'){
                me._remote(value, val.conf, index);
                result.result = 'loading';
                result.rule = 'remote';
            }else{
                rule = me._getRule(ruleType);
                if(!rule(value, val.conf)){
                    result.result = false;
                    result.rule = ruleType;
                    
                    return result;//只要有一个验证函数的验证结果为false，就直接返回，不继续验证
                }
            }
        });
        
        return result;
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
     * @param {Number} index 待验证项的索引值
     */
    _remote: function(value, option, index){
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
                var result = option.callback(xhr, resopnseText);//callback方法中需要返回验证的结果（true或者false）
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
                    var result = successCache(xhr, responseText);//onsuccess方法中需要返回验证的结果（true或者false）
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
                    var result = failureCache(xhr);//onfailure方法中需要返回验证的结果（true或者false）
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
        
        me._rules[name] = handler || baidu.fn.blank();
        me.dispatchEvent('onAddRule', {
            'name': name, 
            'handler': handler
        });
    },
    
    /**
     * 计算未完成验证的数据项个数。每完成一个数据的验证，将计数减一，并在所有数据都验证完成时触发自定义事件onvalidate
     * @param {String} index 已完成验证的数据项的索引
     */
    _validated: function(index){
        var me = this;
        
        if(!me._validatedIndexs[index]){
            --me._unValidateAmount;
            me._validatedIndexs[index] = true;
        }
        console.log('current amount:' + me._unValidateAmount);
        if(me._unValidateAmount == 0){
            console.log("over");
            me._validatedIndexs = {};
            me.dispatchEvent('onvalidate', {
                'result': me._result
            });//会同时执行me.onvalidate
            me._result = {
                'result': true,
                'detail': []
            };//将me._result还原
        }
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
