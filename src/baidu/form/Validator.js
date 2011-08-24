/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.lang.createClass;
///import baidu.form.ValidRule;
///import baidu.dom.g;
///import baidu.array.each;
///import baidu.object.keys;
///import baidu.object.each;
///import baidu.object.extend;
///import baidu.array.filter;
///import baidu.fn.bind;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.event.preventDefault;

/**
 * 表单验证组件
 * @name baidu.form.Validator
 * @class
 * @grammar new baidu.form.Validator(form, fieldRule, options)
 * @param {HTMLElement|String} form 一个表单对象的引用或是该id的字符串标识
 * @param {Object} fieldRule 对验证规则的配置，一个验证域需要的配置包括验证域名称，验证规则，提示信息(可选，需要Validator$message支持)，提示信息存放容器(可选，需要Validator$message支持)，验证触发事件(可选)，一个完整的配置大致如：fieldName: {rule: {required: {param: true, message: {success: 'success msg', failure: 'failure msg'}}, maxlength: {param: 50, message: 'failure msg'}, email: true}, messageContainer: 'myMsgElement', eventName: 'keyup,blur'}
 * @param {Object} options 参数描述
 * @config {String} validateEvent 描述全局的各个验证域的触发验证事件，如'blur,click'，默认是blur
 * @config {Boolean} validateOnSubmit 描述是否当提交表单时做验证，默认是true.
 * @config {Function} onvalidatefield 验证单个验证域结束时的触发事件，function(event){}，event.field返回当次验证域的名称，event.resultList返回验证失败的项目数组(当验证成功时该数组长度为0)，各个项是json数据，格式如：{type: 类型, field: 被验证域名称}.
 * @config {Function} onvalidate 验证全部验证域结束时的触发事件，function(event){}，event.resultList返回验证失败的项目数组(当验证成功时该数组长度为0)，各个项是json数据，格式如：{type: 类型, field: 被验证域名称}.
 * @return {baidu.form.Validator} validator对象
 */
baidu.form.Validator = baidu.lang.createClass(function(form, fieldRule, options){
    var me = this,
        fn = baidu.form.Validator,
        count = fn._addons.length,
        i = 0,
        eventNameList;
    me._form = baidu.dom.g(form);
    me._fieldRule = fieldRule;
    me._validRule = new baidu.form.ValidRule();
    baidu.object.extend(me, options);
    eventNameList = me.validateEvent.split(',');
    //添加事件
    function addEvent(eventName, key){
        var entry = {
            element: key ? me._form.elements[key] : me._form,
            eventName: eventName,
            handler: baidu.fn.bind('_onEventHandler', me, key)
        };
        baidu.event.on(entry.element, entry.eventName, entry.handler);
        me.addEventListener('ondispose', function(){
            baidu.event.un(entry.element, entry.eventName, entry.handler);
        });
    }
    baidu.object.each(me._fieldRule, function(value, key){
        baidu.array.each(baidu.lang.isString(value.eventName) ? value.eventName.split(',')
            : eventNameList,
            function(item){
                addEvent(item, key);
            });
    });
    me.validateOnSubmit && addEvent('onsubmit');
    //插件机制
    for(; i < count; i++){
        fn._addons[i](me);
    }
}).extend(
/**
 *  @lends baidu.form.Validator.prototype
 */
{
    validateEvent: 'blur',
    validateOnSubmit: true,
    /**
     * 所有注册验证事件的侦听器
     * @param {String} key 单个验证域的名称
     * @param {Event} evt 浏览器事件对象
     * @private
     */
    _onEventHandler: function(key, evt){
        var me = this;
        if(!key){//如果是submit
            baidu.event.preventDefault(evt);
            me.validate(function(val, list){
                val && me._form.submit();
            });
            return;
        }
        me.validateField(key);
    },
    
    /**
     * 添加一条规则到当前的验证器中
     * @param {String} name 规则名称
     * @param {Functioin|RegExp} handler 验证函数或是验证正则表达式，当是函数时需要在实现在显示返回一个boolean值
     * @param {Object|String} message 验证结果的提示信息，如：{success: 'success msg', failure: 'failure msg'}，当只有传入字符串时表示只有failure的提示
     */
    addRule: function(name, handler, message){
        var me = this;
        me._validRule.addRule(name, handler);
        me.dispatchEvent('onaddrule', {name: name, handler: handler, message: message});
    },
    
    /**
     * 对所有表单进行验证，并把验证结果返回在callback函数中
     * @param {Function} callback 验证结束后的回调函数，第一参数表示验证结果，第二参数表示验证的失败项数组，各个项的json格式如：{type: 类型, field: 被验证域名称}
     */
    validate: function(callback){
        var me = this,
            keyList = baidu.object.keys(me._fieldRule),
            resultList = [],
            count = 0;
        baidu.array.each(keyList, function(item){
            me.validateField(item, function(val, list){
                resultList = resultList.concat(list);
                if(count++ >= keyList.length - 1){
                    baidu.lang.isFunction(callback)
                        && callback(resultList.length <= 0, resultList);
                    me.dispatchEvent('onvalidate', {resultList: resultList});
                }
            });
       });
    },
    
    /**
     * 对单个验证域进行验证，结果返回在callback回调函数中
     * @param {String} name 单个验证域的名称
     * @param {Function} callback 验证结束后的回调函数，第一参数表示验证结果，第二参数表示验证的失败项数组，各个项的json格式如：{type: 类型, field: 被验证域名称}
     */
    validateField: function(name, callback){
        var me = this, entry,
            rules = me._fieldRule[name].rule,//一定需要有rule
            value = me._form.elements[name].value,
            keyList = baidu.array.filter(baidu.object.keys(rules),
                function(item){//过滤一些不需要的验证
                    entry = rules[item];
                    return (value || item == 'required')
                        && (entry.hasOwnProperty('param') ? entry.param : entry) !== false;
               }),
            resultList = [],
            count = 0;
        function finish(){//当所有都验证完了以后
            if(count++ >= keyList.length - 1){
                me.dispatchEvent('validatefield', {field: name, resultList: resultList});
                baidu.lang.isFunction(callback)
                    && callback(resultList.length <= 0, resultList);
            }
        }
        keyList.length == 0 && finish();//当keyList是空数组的时候表示没有需要验证的，则先提交
        baidu.array.each(keyList, function(item){
            entry = rules[item];
            me._validRule.match(item, value,
                function(val){
                    !val && resultList.push({type: item, field: name, result: val});
                    finish();
                },
                {param: entry.hasOwnProperty('param') ? entry.param : entry});
        });
    },
    
    /**
     * 析构函数
     */
    dispose: function(){
        var me = this;
        me.dispatchEvent('ondispose');
        baidu.lang.Class.prototype.dispose.call(me);
    }
});
//构造函数插件器
baidu.form.Validator._addons = [];
/**
 * @private
 */
baidu.form.Validator.register = function(fn){
    typeof fn == 'function'
        && baidu.form.Validator._addons.push(fn);
}