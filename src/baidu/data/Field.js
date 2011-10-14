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
 * @param {Object} options 参数
 * @config {Object} options.define 定义参数，包含{fieldType,defaultValue}
 * @config {Object} options.validation 条件限制，是否有长度，最大值，最小值等限制，类型见baidu.validator
 */
baidu.data.Field = baidu.data.Field || (function(){
    
    /**
     * Field构造函数
     * @public
     * @param {Object} options 参数
     * @config {Object} options.define 定义参数，包含{fieldType,defaultValue}
     * @config {Object} options.validation 条件限制，是否有长度，最大值，最小值等限制，类型见baidu.validator
     */
    var Field = function(options){
        var me = this,
            define = options.define || {},
            validation = options.validation || [];
       
        me.defaultValue = define.defaultValue || me.defaultValue;
        me.validation = validation || [];
        
        me.data = options.data || {};
        me.name = options.name || '';

    };

    Field.prototype = {

        /**
         * @lends baidu.data.Field.prototype
         */

        defaultValue: '',
        name: '',
        

        /**
         * 根据index值设置数据,当index相同的值存在时，会直接进行覆盖
         * @public
         * @param {Object} data, 可选
         * @return {Boolean}
         */
        set: function(index, data){
            var me = this;
            
            if(typeof data == 'undefined'){
                data = baidu.object.clone(me.defaultValue);
                me._set(index, data);
                return true;
            }
            
            //TODO: 按照validator的设计进行修改
            /*if( baidu.validator.Validator.verifyType(data, me.type) && 
                baidu.Validator.Validator.verify(data, me.validation)){
                
                data = baidu.object.clone(data);
                me._set(index, data); 
                return true;
            }
            
            return false;
            */

            data = baidu.object.clone(data);
            me._set(index, data); 
            return true;

                   },

        _set: function(index, data){
            var me = this;

            me.data[index] = me.data[index] || {};
            me.data[index][me.name] = data;
        }
    };

    return Field;

})();
