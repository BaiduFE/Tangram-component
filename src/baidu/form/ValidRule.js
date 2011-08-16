/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.form;
///import baidu.lang.createClass;
///import baidu.lang.isString;
///import baidu.lang.isFunction;
///import baidu.object.extend;
///import baidu.ajax.request;

/**
 * 验证规则组件，提供各种基础验证，默认的验证方式有以下几种：required(必填)，remote(Ajax验证)，email(电子邮件验证)，number(数字验证)，maxlength(最大长度验证)，minlength(最小长度验证)，rangelength(长度范围验证)，equal(等于验证)，telephone(电话号码)
 * @name baidu.form.ValidRule
 * @class
 * @grammar new baidu.form.ValidRule()
 * @return {baidu.form.ValidRule} validator对象
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
            email: /^[\w!#\$%'\*\+\-\/=\?\^`{}\|~]+([.][\w!#\$%'\*\+\-\/=\?\^`{}\|~]+)*@[-a-z0-9]{1,20}[.][a-z0-9]{1,10}([.][a-z]{2})?$/i,
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
                return val === (baidu.lang.isFunction(opt) ? opt() : opt);
            },
            telephone: /^(((?:[\+0]\d{1,3}-[1-9]\d{1,2})|\d{3,4})-)?\d{5,8}$/
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
     * @param {String} val 需要被验证的字符串值，如果是remote该参数可以忽视
     * @param {Function} callback 验证结束的回调，第一参数为验证结果
     * @param {Object} options 表示验证需要的参数，如当验证类型是maxlength时，需要options是{param:10}
     */
    match: function(name, val, callback, options){
        var me = this,
            rule = me._getRule(name),
            param = options && options.param;
        if('remote' == name.toLowerCase()){
            baidu.lang.isString(param) && (param = {url: param});
            param = baidu.object.extend({}, param);
            param.data && baidu.lang.isFunction(param.data)
                && (param.data = param.data(val));
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
     * @param {String} name 验证规则的名称
     * @param {Function|RegExp} handler 执行验证的函数或是正则表达式，如果是函数，需要返回一个boolean
     */
    addRule: function(name, handler){
        this._rules[name] = handler;
    }
});