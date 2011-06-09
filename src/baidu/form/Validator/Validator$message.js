/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.form.Validator;
///import baidu.object.extend;
///import baidu.lang.guid;
///import baidu.lang.isArray;
///import baidu.dom.g;
///import baidu.dom.insertHTML;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.string.format;

/**
 * 为表单验证提供信息提示功能，有关信息提示的配置请参考Validator的构造函数参数说明.
 * @param {Object} optioins 参数
 * @config {Boolean} showMessage 是否需要显示提示信息，默认是true
 */
baidu.form.Validator.register(function(me){
    if(!me.showMessage){return;}
    me._defaultId = baidu.lang.guid();
    me._defaultMessage = {
        required: 'This field is required.',
        remote: 'Please fix this field.',
        email: 'Please enter a valid email address.',
        number: 'Please enter a valid number.',
        maxlength: 'Please enter no more than #{param} characters.',
        minlength: 'Please enter at least #{param} characters.',
        rangelength: 'Please enter a value between #{param[0]} and #{param[1]} characters long.',
        equal: 'Please enter the same value again.',
        telephone: 'Please enter a valid telephone number.'
    };
    me.addEventListener('onaddrule', function(evt){
        me._defaultMessage[evt.name] = evt.message;
    });
    me.addEventListener('onvalidatefield', function(evt){
        var element = me._getContentElement(evt.field),
            val = evt.resultList.length <= 0,
            key = val ? baidu.object.keys(me._fieldRule[evt.field].rule).pop()
                : evt.resultList[0].type,
            fieldRule = me._fieldRule[evt.field].rule[key],
            msg = fieldRule.message;
        !msg && (msg = me._defaultMessage[key]);
        msg = val ? (msg.success || '') : (msg.failure || msg);
        baidu.dom.addClass(element, 'tangram-' + me.uiType + '-' + (val ? 'success' : 'failure'));
        baidu.dom.addClass(element, 'tangram-' + me.uiType + '-' + evt.field + '-' + (val ? 'success' : 'failure'));
        baidu.dom.removeClass(element, 'tangram-' + me.uiType + '-' + (val ? 'failure' : 'success'));
        baidu.dom.removeClass(element, 'tangram-' + me.uiType + '-' + evt.field + '-' + (val ? 'failure' : 'success'));
        element.innerHTML = baidu.string.format(msg, {//这里扩展性不是很好啊
            param: fieldRule.param,
            'param[0]': baidu.lang.isArray(fieldRule.param) ? fieldRule.param[0] : '',
            'param[1]': baidu.lang.isArray(fieldRule.param) ? fieldRule.param[1] : ''
        });
    });
});
baidu.object.extend(baidu.form.Validator.prototype, 
/**
 *  @lends baidu.form.Validator.prototype
 */
{
    showMessage: true,
    uiType: 'validator',
    tplDOM: '<label id="#{id}" class="#{class}"></label>',
    
    /**
     * 取得一个存放信息提示的容器，如果该容器不存在则创建一个容器
     * @param {String} field 验证域的名称
     * @return {HTMLElement} 返回一个DOM容器对象
     * @private
     */
    _getContentElement: function(field){
        var me = this,
            rsid = me._defaultId + '_' + field,
            element = baidu.dom.g(rsid),
            container = baidu.dom.g(me._fieldRule[field].messageContainer);
        if(!element){
            baidu.dom.insertHTML(container || me._form.elements[field],
                container ? 'beforeEnd' : 'afterEnd',
                baidu.string.format(me.tplDOM, {
                    id: rsid,
                    'class': 'tangram-' + me.uiType
                }));
            element = baidu.dom.g(rsid);
        }
        return element;
    },
    
    /**
     * 取得一个验证域对应的信息提示容器，如果该容器不存在返回空值
     * @param {String} field 验证域的name
     * @return {HTMLElement} 存放信息提示的容器
     */
    getMessageContainer: function(field){
        return baidu.dom.g(this._defaultId + '_' + field);
    }
})