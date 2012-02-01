/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 */

///import baidu.object.clone;

///import baidu.data;

/**
 * Field构造函数
 * @class
 * @public
 * @grammar new baidu.data.Field(options)
 * @param {Object} options 参数
 * @config {Object} options.define 定义参数，包含{fieldType,defaultValue}
 * @config {Object} options.validation 条件限制，是否有长度，最大值，最小值等限制，类型见baidu.validator
 * @return {baidu.data.Field} Field 实例
 */
baidu.data.Field = baidu.data.Field || (function(){
    
    /**
     * Field构造函数
     * @private
     * @param {Object} options 参数
     * @config {Object} options.define 定义参数，包含{fieldType,defaultValue},
     * @config {String} options.name
     * @config {Object} options.validation 条件限制，是否有长度，最大值，最小值等限制，类型见baidu.validator
     */
    var Field = function(options, dataModel){
        var me = this,
            define = options.define || {};
       
        me._defaultValue = typeof define.defaultValue != 'undefined' ? define.defaultValue : me._defaultValue;
        me._type = define.type || ''; 
        
        me._validation = options.validation || [];
        me._validation.push({
        	'rule': me._type
        });
        
        me._dataModel = dataModel;
        me._name = options.name;
        me._validator = me._dataModel._validator;
    };

    Field.prototype = {

        /**
         * @lends baidu.data.Field.prototype
         */

        _defaultValue: '',
        _name: '',
        

        /**
         * 根据index值设置数据,当index相同的值存在时，会直接进行覆盖
         * @public
         * @param {Object} data, 可选
         * @return {Boolean}
         */
        set: function(index, data){
            var me = this,
                result = {
                    'result': true
                };
            
            if(typeof data == 'undefined'){
                
                me._set(index, me._defaultValue);
            
            }else if(me._validator){
               
                result = me._validator.test(data, me._validation);
                result.result && me._set(index, data);   
            
            }else{   
                me._set(index, data); 
            }
            
            return result;
        },

        _set: function(index, data){
            var me = this;

            data = baidu.object.clone(data);
            me._dataModel._data[index] = me._dataModel._data[index] || {};
            me._dataModel._data[index][me._name] = data;
        }
    };

    return Field;

})();
