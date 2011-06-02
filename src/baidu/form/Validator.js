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
///import baidu.fn.bind;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.event.preventDefault;

/**
 * 表单验证组件
 * @name baidu.form.Validate
 * @class
 * @param {HTMLElement|String} form 一个表单对象的引用或是该id的字符串标识
 * @param {Object} fieldRule 一条或多条baidu.from.Validator.FieldRule对象，或是按如下格式配置fieldName: {rule: {required :{message: {success: 'success message', failure: 'failure message'}}, maxlength: {param: 10, message: 'failure message'}}, event: 'blur,click'}.<br/>说明：当是remote验证时，支持可以直接配置url，如：remote: 'http://localhost?fieldName=value'，也可以是json，如：remote: {url: 'http://localhost', data: function(val){return 'fieldName=' + val}}，有关更详细的json格式配置请参考baidu.ajax.request
 * @param {Object} options参数描述
 * @config {String} validateEvent：描述全局的各个验证域的触发验证事件，如'blur,click'，默认是blur
 * @config {Boolean} validateOnSubmit：描述是否当提交表单时做验证，默认是true.
 */
baidu.form.Validator = baidu.form.Validator || baidu.lang.createClass(function(form, fieldRule, options){
    var me = this,
        fn = baidu.form.Validator,
        count = fn._addons.length,
        i = 0,
        eventNameList;
    me._form = baidu.dom.g(form);
    me._fieldRule = fieldRule;
    me._validRule = new baidu.form.ValidRule();
    me._options = baidu.object.extend({validateEvent: 'blur', validateOnSubmit: true}, options);//默认全局设置失去焦点时验证，提交时验证
    eventNameList = me._options.validateEvent.split(',');
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
        baidu.array.each(baidu.lang.isString(value.event) ? value.event.split(',')
            : eventNameList,
            function(item){
                addEvent(item, key);
            });
    });
    me._options.validateOnSubmit && addEvent('onsubmit');
    //插件机制
    for(; i < count; i++){
        fn._addons[i](me);
    }
}).extend({
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
     * @param {Function} callback 验证结束后的回调函数，第一参数表示验证结果，第二参数表示验证的失败项数组，各个项的json格式如：{type: 类型, field: 被验证域名称, result: 验证结果}
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
//                    me.dispatchEvent('onvalidate', {resultList: resultList});
                }
            });
       });
    },
    
    /**
     * 对单个验证域进行验证，结果返回在callback回调函数中
     * @param {String} name 单个验证域的名称
     * @param {Function} callback 验证结束后的回调函数，第一参数表示验证结果，第二参数表示验证的失败项数组，各个项的json格式如：{type: 类型, field: 被验证域名称, result: 验证结果}
     */
    validateField: function(name, callback){
        var me = this,
            rules = me._fieldRule[name].rule,//一定需要有rule
            keyList = baidu.object.keys(rules),
            resultList = [],
            count = 0,
            entry,
            value;
        baidu.array.each(keyList, function(item){
            entry = rules[item];
            value = me._form.elements[name].value;
            me._validRule.match(item, value,
                function(val){
                    if(!val && (item == 'required' || value)){
                        //处理当是必填时加入，非必填时当有值才加入验证结果
                        resultList.push({type: item, field: name, result: val});
                    }
                    if(count++ >= keyList.length - 1){//当所有都验证完了以后
                        baidu.lang.isFunction(callback)
                            && callback(resultList.length <= 0, resultList);
                        me.dispatchEvent('validatefield', {field: name, resultList: resultList});
                    }
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
baidu.form.Validator.register = function(fn){
    typeof fn == 'function'
        && baidu.form.Validator._addons.push(fn);
}