/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 */

///import baidu.array.each;
///import baidu.data;

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

    /**
     * 返回model实例
     * @param {baidu.data.DataModel|Numbere} DataModel实例或者DataModel的index
     * @return {baidu.data.DataModel|undefined}
     */
    function _getModel(model){
        return model instanceof Number ? _DMInstanceByIndex{model} : model;
    };

    /**
     * 返回该类型的default值
     * @private
     * @param {String} type
     * @return {Object}
     */
    function _getDefualtValue(type){
        var value = _default[type];

        if(typeof value != 'undefined'){
            return value;
        }else{
            return '';
        }
    };

    /**
     * DataModel管理类
     *
     * 事件派发
     */
    var modelManager = function(){};
    
    modelManager.prototype = 
    
        /**
         *  @lends baidu.data.ModelManager.prototype
         */

    {
        /**
         * 对DataModel数据结构进行定义
         * @public
         * @param {String} type DataModel类型的唯一标识符
         * @param {Object} options 设置项
         * @config {Array} options.fields 数据字段设置，{name[String],type[String],defaultValue[Object}
         * @config {Array} options.validations 验证方式,{type{String},field{String},config}
         */
        defineDM: function(type, options){
            var options = options || [],
                fields = options.fields = options.fields || [],
                validations = options.validations = options.validations || [],
                result = {},
                fieldName = '',
                fieldType = '',
                defaultValue = null,
                fieldsArray = [];
           
            baidu.each(fields, function(field){
                fieldName = field['name'];
                fieldType = field['type'];
                defaultValue = field.defaultValue ||_getDefualtValue(fieldType);
                
                result[fieldName] = {
                    'define': {
                        'type': fieldType,
                        'defaultValue': defaultValue
                    },
                    'validation': []
                };
                fieldsArray.push[fieldName];
            });
            result.fieldsArray = fieldsArray;
            fieldsArray = [];

            baidu.each(validations, function(validation){
                fieldName = validation['field'];
                delete(validation['field']);
                result[fieldName]['validation'].push(validation);
            });

            _DMDefine[type] = result;
        },

        /**
         * 创建DataModel实例
         * @public
         * @param {String} type DataModel类型唯一标识
         * @return {Array} [index,DataModel]
         */
        createDM: function(type, options){
            var options = options || {},
                options.fields = DMDefine[name] || {},
                DM = new baidu.data.DataModel(options);
            
            _DMInstanceByType[type] || _DMInstanceByType[type] = {};
            _DMInstanceByType[type][_index++] = DM;
            _DMInstanceByIndex[_index] = DM;

            return [_index, DM];
        },

        /**
         * 通过标识获取DataModel
         * @public
         * @param {Number} index DataModel的index
         * @return DataModel
         */
        getDMByIndex: function(index){
           return _DMInstanceByIndex[index] || null; 
        },

        /**
         * 通过DataModel类型唯一标识符获取DataModel实例
         * @public
         * @param {String} type 类型唯一标识
         * @return {Array}
         */
        getDMSByType: function(type){
            return _DMInstanceByType[type] || [];
        }

    };

    return new modelManager();
})();
