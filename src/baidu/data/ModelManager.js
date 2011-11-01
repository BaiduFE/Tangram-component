/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 */

///import baidu.array.each;
///import baidu.data;
///import baidu.data.DataModel;

/**
 * DataModel管理类
 * @class
 * @public
 * @grammar new baidu.data.ModelManager([options])
 * @return {baidu.data.ModelManager} ModelManager 实例
 */
baidu.data.ModelManager = baidu.data.ModelManager || (function(){
 
    var _DMDefine = {},
        _DMInstanceByType = {},
        _DMInstanceByIndex = {},
        _index = 0,
        _default = {
            'string': '',
            'number': 0,
            'boolean': true
        };
    	_validator = null;

    /**
     * 返回该类型的default值
     * @private
     * @param {String} type
     * @return {Object}
     */
    function _getDefualtValue(type){
        return (_default[type] || '');
    };

    /**
     * DataModel管理类
     */
    var modelManager = function(options){};
    
    modelManager.prototype = 
    
        /**
         *  @lends baidu.data.ModelManager.prototype
         */

    {
    	
    	
    	/**
    	 * 设置validator
    	 * @param {baidu.data.Validator} validator
    	 * */	
    	setValidator: function(validator){
    		_validator = validator;
    	},	
    	
        /**
         * 对DataModel数据结构进行定义
         * @public
         * @param {String} type DataModel类型的唯一标识符
         * @param {Object} options 设置项
         * @config {Array} options.fields 数据字段设置，{name[String],type[String],defaultValue{Object}}
         * @config {Array} options.validations 验证方式,{type{String},field{String},config}
         */
        defineDM: function(type, options){
            var options = options || [],
                fields = options.fields = options.fields || [],
                validations = options.validations = options.validations || [],
                result = {},
                fieldName = '',
                fieldType = '',
                defaultValue = null;
           
            baidu.each(fields, function(field){
                fieldName = field['name'];
                fieldType = field['type'] || 'string';
                defaultValue = typeof field.defaultValue != 'undefined' ? field.defaultValue : _getDefualtValue(fieldType);
                
                result[fieldName] = {
                    'define': {
                        'type': fieldType,
                        'defaultValue': defaultValue
                    },
                    'validation': []
                };
            });

            baidu.each(validations, function(validation){
                fieldName = validation['field'];
                delete(validation['field']);
                result[fieldName]['validation'] = validation.val || [];
            });

            _DMDefine[type] = result;
        },

        /**
         * 创建DataModel实例
         * @public
         * @param {String} type DataModel类型唯一标识
         * @param {Object} options 创建DataModel使用的参数
         * @see baidu.data.DataModel
         * @return {Array} [index,DataModel]
         */
        createDM: function(type, options){
            options = baidu.extend({
                fields: _DMDefine[type] || {},
                validator: _validator
            }, options);

            var DM = new baidu.data.DataModel(options);
            
            _DMInstanceByType[type] || (_DMInstanceByType[type] = {});
            _DMInstanceByType[type][_index] = DM;
            _DMInstanceByIndex[_index] = DM;

            return [_index++, DM];
        },

        /**
         * 通过标识获取DataModel
         * @public
         * @param {Number} index DataModel的index
         * @return {baidu.data.DataModel}
         */
        getDMByIndex: function(index){
           return _DMInstanceByIndex[index] || null; 
        },

        /**
         * 通过DataModel类型唯一标识符获取DataModel实例
         * @public
         * @param {String} type 类型唯一标识
         * @return {Object}
         */
        getDMByType: function(type){
            return _DMInstanceByType[type] || [];
        }
    };

    return new modelManager();
})();
