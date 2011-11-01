/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.ajax.request;

///import baidu.array.each;
///import baidu.array.contains;

///import baidu.data;

///import baidu.fn.blank;
///baidu.lang.isArray

///import baidu.object.each;
///import baidu.object.clone;

///import baidu.string.trim;
///import baidu.lang.createClass;


/**
 * 数据验证组件
 * @class
 * @grammar new baidu.data.Validator(options)
 * @param {Object} validations 每个验证规则的具体配置
 *  {
 *     val1: [
 *               {rule: "length", conf: {len:20}},
 *               {rule:"email" }
 *           ],
 *     val2: [
 *               {rule: "remote", conf: {url:'#', onsuccess: function(){}, onfailure: function(){}}}
 *           ]
 *  }
 * @return {baidu.data.Validator} Validator实例
 */
baidu.data.Validator = baidu.lang.createClass(function(options){

    var me = this;
    me._validations = options || {};
    
    //用来保存用户自定义的验证函数
    me._rules = {}; 

}).extend(

    /**
     * @lends baidu.data.Validator.prototype
     */

{
    /**
     * 对多个数据进行验证
     * @public
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
     *  }，验证结果resultType是一个枚举，他的值分别是success: 表示所有值都验证通过, failure: 表示存在验证不通过的值, successwithoutremote: 表示除了使用remote方式验证的值，其他的都验证通过
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
     * @private
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
     * @private
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
     * @public
     * @param {String | Number} value 待验证项的值
     * @param {String} rule 验证规则
     * @param {Object} conf 配置项
     * @return {Object} 验证结果
     */
    test: function(value, rule, conf){
        var me = this, validation,tmpVal = [];
        
        if(me._validations[rule]){
            validation = me._validations[rule];
        }else if(me._getRule(rule)){
            validation = [{
                'rule': rule, 
                'conf': conf
            }];
        }else if(baidu.lang.isArray(rule)){
        	
        	baidu.each(rule, function(name){
        		if(me._validations[name.rule]){
        			tmpVal = tmpVal.concat(me._validations[name.rule]);
        		}else{
        			tmpVal.push(name);
        		}
        		
        	});
        	return me._singleValidate(value, tmpVal);
        }else{
            return false;
        }
        
        return me._singleValidate(value, validation);
    },
    
    /**
     * 添加一条规则
     * @public
     * @param {String} name 规则名称
     * @param {Array} validation 验证规则
     */
    addValidation: function(name, validation){
        var me = this;
        me._validations[name] = validation || [];
    },
    
    /**
     * 调用远程接口对数据项进行验证
     * @private
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
     * @public
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
     * @private
     * @param {String} name 规则名
     * @return {Function} 验证函数
     */
    _getRule: function(name){
        var me = this,
            rules = baidu.data.Validator.validatorRules || {};
        
        //先从用户自定义的rules中查找，再从内置的rules中查找
        return me._rules[name] || rules[name] || null;
    }
});

/**
 * 用于存储返回值的枚举类
 * @private
 */
baidu.data.Validator.validatorResultTypes = {
    'SUCCESS': 'success',   //表示所有值都验证通过
    'FAILURE': 'failure',   //表示存在验证不通过的值
    'SUCCESSWITHOUTREMOTE': 'successwithoutremote' //表示除了使用remote方式验证的值，其他的都验证通过
};
