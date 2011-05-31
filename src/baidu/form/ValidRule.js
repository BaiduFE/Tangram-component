/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.form;
///import baidu.lang.createClass;
///import baidu.lang.isString;
///import baidu.lang.isFunction;
///import baidu.ajax.request;

/**
 * 验证规则组件，提供各种基础验证，默认的验证方式有以下几种：required(必填)，remote(Ajax验证)，email(电子邮件验证)，number(数字验证)，maxlength(最大长度验证)，minlength(最小长度验证)，rangelength(长度范围验证)，equal(等于验证)，telephone(电话号码)
 * @name baidu.form.ValidRule
 */
baidu.form.ValidRule = baidu.form.ValidRule || baidu.lang.createClass(function(){
    var me = this;
        me._rules = {
            required: function(val){//必填 true:表示有值, false:表示空或无值
                return !!(val && !/^(?:\s|\u3000)+$/.test(val));
            },
            remote: function(xhr, val){
                return !!(val && val.toLowerCase() == 'true');
            },
            //email正则出处jquery.validate v1.8.0
            email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
            number: /^(?:[1-9]\d+|\d)(?:\.\d+)?$/,
            maxlength: function(val, opt){
                return val.length <= opt;
            },
            minlength: function(val, opt){
                return val.length >= opt;
            },
            rangelength: function(val, opt){
                return val.length >= opt[0] && val.length <= opt[1];
            },
            equal: function(val, opt){
                return val === baidu.lang.isFunction(opt) ? opt() : opt;
            },
            telephone: /^(?:\d{3,4}\-)?\d{5,8}$/
        };
}).extend(
/**
 *  @lends baidu.form.ValidRule.prototype
 */
{
    /**
     * 根据规则名称取得对应的规则，参数可选，没有参数则返回所有规则的对象
     * @param {String} name 已知的规则名称
     * @private
     */
    _getRule: function(name){
        var me = this;
        return baidu.lang.isString(name) ? me._rules[name] : me._rules;
    },
    
    /**
     * 用一个验证方法对一个已经存在的值进行验证，并将结果返回到回调中。说明：如果是一个remote验证，则是一个ajax验证，请让服务器返回true或是false来表示验证结果
     * @param {String} name 验证方法的名称，如：required,email等
     * @param {Object} val 需要被验证的字符串值，如果是remote该参数可以忽视
     * @param {Object} callback 验证结束的回调，第一参数为验证结果
     * @param {Object} options 表示验证需要的参数，如当验证类型是maxlength时，需要options是{param:10}
     */
    match: function(name, val, callback, options){
        var me = this,
            rule = me._getRule(name),
            param = options && options.param;
        if('remote' == name.toLowerCase()){
            baidu.lang.isString(param) && (param = {url: param});
            param.onsuccess = param.onfailure = function(xhr, responseText){
                callback(rule(xhr, responseText));
            }
            baidu.ajax.request(param.url, param);
        }else{
            callback(baidu.lang.isFunction(rule) ? rule(val, param)
                : rule.test(val));
        }
    },
    
    /**
     * 增加一条验证规则
     * @param {Object} name 验证规则的名称
     * @param {Object} handler 执行验证的函数或是正则表达式，如果是函数，需要返回一个boolean
     */
    addRule: function(name, handler){
        this._rules[name] = handler;
    }
});