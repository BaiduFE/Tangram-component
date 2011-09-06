/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 */

///import baidu.object.extend;
///import baidu.object.clone;

///import baidu.data;
///import baidu.validator.Validator;

baidu.data.Field = baidu.data.Field || (function(){
    
    /**
     * Field构造函数
     * @public
     * @param {Object} options 参数
     * @config {Object} options.define 定义参数，包含{fieldType,defaultValue}
     * @config {Object} options.validation 条件限制，是否有长度，最大值，最小值等限制，类型见baidu.validator
     */
    var Eield = function(options){
        var me = this,
            options = baidu.extend({
                'define': {},
                'validation'[]
            },options);
        
        me.type = options.define.type || me.type;
        me.defaultValue = options.define.defaultValue || me.defaultValue;
        me.validation = options.validation || me.validation;
    };

    Field.prototype = {

        /**
         * @lends baidu.data.Field.prototype
         */

        type: 'string',
        defaultValue: '',
        validation: [],
        data: {},
        

        /**
         * 根据index值设置数据,当index相同的值存在时，会直接进行覆盖
         * @public
         * @param {Number} index
         * @param {Object} data, 可选
         * @return {Boolean}
         */
        set: function(index, data){
            var me = this;
            
            if(typeof data == 'undefined'){
                data = baidu.object.clone(me.defaultValue);
                me.data[index] = data;
                return true;
            }
                
            if( baidu.validator.Validator.verifyType(data, me.type) && 
                baidu.Validator.Validator.verify(data, me.validation)){
                
                me.data[index] = baidu.object.clone(data);
                return true;
            }

            return false;
        },

        /**
         * 获取index所指定的值
         * @public
         * @param {Number|Function} condition 选择条件，index或者条件函数，函数参数为data,返回值为Boolean
         * @return {Object} {index,value}
         */
        get: function(condition){
            var me = this,
                result = [];

            if(index instanceof Number){
                return {
                    condition:typeof me.data[condition] != 'undefined' ? baidu.object.clone(me.data[condition]) : 'undefined';
                };
            }else{
                baidu.object.each(me.data, function(item, key){
                    condition(item) && result[key] = baidu.object.clone(item); 
                });

                return result;
            }
        },

        /**
         * 删除数据
         * @public
         * @param {Number} index
         * @return {Object} data
         */
        remove: function(index){
            var me = this,
                data;
            
            typeof me.data[index] != 'undefined' && data = baidu.object.clone(me.data[index]);
            delete(me.data[index])
            
            return data;
        }
    };

    return Field;

})();
