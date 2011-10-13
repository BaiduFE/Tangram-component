/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 */

///import baidu.array.each;

///import baidu.object.extend;
///import baidu.object.each;
///import baidu.object.keys;
///import baidu.object.clone;
///import baidu.object.isEmpty;

///import baidu.fn.blank;

///import baidu.lang.isArray;
///import baidu.lang.isNumber;
///import baidu.lang.isFunction;
///import baidu.lang.createClass;

///import baidu.data;
///import baidu.data.Field;

/**
 * DataModel实体类
 * @class
 * @public
 * @param {Object} options 设置项
 * @config {Object} options.fields 通过ModalManager.defineDM定义的数据结构
 * @config {Array} options.data 传入的数据，可选
 */
baidu.data.DataModel = baidu.data.DataModel || (function(){

    var CLONE = baidu.object.clone,
        ARRAYEACH = baidu.array.each,
        OBJECTEACH = baidu.object.each;

    var dataAction = {
        'ADD':'ADD',
        'REMOVE': 'REMOVE',
        'UPDATE': 'UPDATE',
        'NULL': 'NULL'
    };

    /**
     * 创建Field实例
     * @private
     * @param {Object} fields config
     * @param {baidu.data.DataModel} dataModel
     */
    function _createField(fields, dataModel){
        var fields = fields || {};

        OBJECTEACH(fields, function(config, fieldName){
            baidu.extend(config,{
                data: dataModel._data,
                name: fieldName
            });
            dataModel._fields[fieldName] = new baidu.data.Field(config, dataModel);
        });
    };

    /**
     * DataModel实体类
     * @public
     * @param {Object} options 设置项
     * @config {Object} options.fields 通过ModalManager.defineDM定义的数据结构
     * @config {Array} options.data 传入的数据，可选
     */
    var dataModel = function(options){
       
        var me = this,
            options = options || {};

        _createField(options.fields || {}, me);
    };
        
    /**
     *  @lends baidu.data.DataModel.prototype
     */
    dataModel.prototype = {
      
        /**
         * 数据存储索引
         * @private
         * @attribute
         */
        _index: 0,

        /**
         * 存储Field实例的名值对
         * @private
         * @attribute
         */
        _fields: {},

        /**
         * 数据值
         * @private
         * @attribute
         */
        _data: {},

        /**
         * 最后一次操作时所涉及的数据
         * @private
         * @attribute
         */
        _lastChangeObject: {},

        _lastChangeArray: [],

        /**
         * 最后一次操作时所涉及的数据在修改之前的值
         * @private
         * @attribute
         * */
        _lastData:{},

        /**
         * 最后一次操作名称
         * @private
         * @attribute
         */
        _lastAction: dataAction.NULL,
        
        /**
         * 清空相关数组及object对象，并设置lastAction状态
         * @private
         * @param {String} action
         * @return {Null}
         */
        _setLastAction:function(action){
            var me = this;
            
            me._lastChangeObject = {};
            me._lastChangeArray = [];
            me._lastData = {};
            me._lastAction = action;
        },

        /**
         * 获取新的id
         * @private
         * @attribute
         * @return {Number}
         */
        _getNewId: function(){
            return this._index++;           
        },

        /**
         * 根据传入的index数组返回数据
         * @private
         * @param {String|String[]} where
         * @param {Number|Number[]} indexArr
         * @return {Object}
         */
        _getDataByIndex: function(where, indexArr){
            var result = {},
                me = this;

            ARRAYEACH(indexArr, function(index){
                result[index] = me._getDataByName(where, me._data[index]);
            });

            return result;
        },
        
        /**
         * 根据传入的function返回数据
         * @private
         * @param {String|String[]} where
         * @param {Function} fun
         * @return {Object}
         */
        _getDataByFunction: function(where, fun){
            var me = this,
                result = {};
            
            OBJECTEACH(me._data, function(eachData, dataIndex){
                if(fun(eachData)){
                    result[dataIndex] = me._getDataByName(where, eachData);
                }
            });

            return result;

        },

        /**
         * 根据where从单行数据中取出所致定的数据
         * @private
         * @param {Array|String} where
         * @param {Object} data
         * @return {Object}
         */
        _getDataByName: function(where, data){
            var me = this,
                result = {};

            if(where == '*'){
                return CLONE(data); 
            }

            baidu.lang.isString(where) && (where = where.split(','));
            ARRAYEACH(where, function(name){
                result[name] = data[name];
            });
            return CLONE(result);
        },

        /**
         * 根据条件判断函数获取数据中符合要求的id
         * @private
         * @param {Function|Number[]|Number} condition
         * @return {Number[]}
         */
        _getConditionId: function(condition){
            var me = this,
                result = [];

            if(baidu.lang.isNumber(condition)){
                return [condition];
            }

            if(baidu.lang.isArray(condition)){
                return condition;
            }

            if(baidu.lang.isFunction(condition)){
                OBJECTEACH(me._data, function(eachData, dataIndex){
                    condition(eachData) && result.push(dataIndex);
                });    
                return result;
            }
        },
        
        /**
         * 添加新数据
         * @public
         * @param {Object} 数据值，可以名值对
         * @return {fail:[], success[]} fail数据为添加失败的数据的index,success数组为成功插入的数据的索引值 
         */
        add: function(data){
            var me = this,
                data = data || {},
                result = {
                    fail: [],
                    success: []
                }, 
                tmpResult, tmpNames, tmpData,
                dataIndex,length;

            if(baidu.object.isEmpty(data)) return result; 

            if(!baidu.lang.isArray(data)) data = [data];
            me._setLastAction(dataAction.ADD);
            
            baidu.each(data, function(eachData, index){

                tmpResult = true;
                tmpNames = [];
                dataIndex = me._getNewId();
                
                OBJECTEACH(eachData, function(item, name){
                    tmpResult = me._fields[name].set(dataIndex, item);
                    tmpResult ? tmpNames.push(name) : result.fail.push(index); 
                    return tmpResult;
                });

                if(!tmpResult){
                    delete(me._data[dataIndex]);
                }else{
                    me._lastChangeObject[dataIndex] = me._data[dataIndex];
                    me._lastChangeArray.push(me._data[dataIndex]);
                    result.success.push(dataIndex);
                }
            });

            return result;
        },
      
        
        /**
         * 按条件查找并返回数据
         * @public
         * @param {String} where 查找那些field的数值,以','分割，支持'*'
         * @param {Function|Number|Number[]} condition 查找条件方法,或者包含index的数组或者index
         * @return {Object}
         */
        select: function(where, condition){
            var me = this,
                where = where || '*',
                condition = condition || baidu.object.keys(me._data),
                result = [];

            if(me._data.length == 0){
                return result;
            }

            //整理数组
            baidu.lang.isNumber(condition) && (condition = [condition]);
            
            if(baidu.lang.isArray(condition)){
                result = me._getDataByIndex(where, condition);
                return result;
            }

            if(baidu.lang.isFunction(condition)){
               result = me._getDataByFunction(where, condition);
               return result;
            }
        },
        
        

        /**
         * 根据条件设置field的值
         * @public
         * @param {Object} data
         * @param {Function|Number[]|Number} condition 查找条件方法,或者包含index的数组或者index
         * @return {Number} 跟新的行数
        */
        update: function(data, condition){
            var me = this,
                condition = condition || baidu.fn.blank(),
                data = data || {},
                resultId = [],
                isFirst = true,
                lastData,
                tmpResult,
                tmpData,
                result = 0;
           
            if(baidu.object.isEmpty(data)){
                return result;
            } 

            data = CLONE(data);
            resultId = me._getConditionId(condition);
            ARRAYEACH(resultId, function(dataIndex){
                if(isFirst){
                    lastData = CLONE(me._data[dataIndex]);
                
                    OBJECTEACH(data, function(item, name){
                        tmpResult = me._fields[name].set(dataIndex, item);
                        tmpResult && tmpNames.push(name);
                        return tmpResult;
                    });
                    if(!tmpResult){
                        me._data[dataIndex] = lastData;
                        result = false;
                        return false;
                    }
                    
                    isFirst = false;
                    me._setLastAction(dataAction.UPDATE);
                   
                    me._lastChange[dataIndex] = me._data[dataIndex];
                    me._lastChangeArray.push(me._data[dataIndex]);
                    me._lastData[dataIndex] = lastData;
                    
                    result++;
                }else{
                    
                    me._lastData[dataIndex] = CLONE(me._data[dataIndex]);
                    me._lastDataObject[dataIndex] = me._data[dataIndex];
                    me._lastChangeArray.push(me._data[dataIndex]);
                    result++;

                    OBJECTEACH(data, function(item, name){
                        me._data[dataIndex][name] = item;
                    });
                }
            });

            return result;
         },

        /**
         * 删除数据
         * @public
         * @param {Function|Number[]|Number} condition 查找条件方法,或者包含index的数组或者index
         * @return {Number} 被删除行数
         */
        remove: function(condition){
            var me = this,
                resultId = me._getConditionId(condition || baidu.fn.blank()),
                result = 0,data;

            if(resultId.length == 0){
                return result;
            }
            
            me._setLastAction(dataAction.REMOVE);
            baidu.each(resultId, function(dataIndex){
                
                data = CLONE(me._data[dataIndex]);
                me._lastData[dataIndex] = data;
                me._lastChangeObject[dataIndex] = data;
                me._lastChangeArray.push(data);
                
                result++;
                delete(me._data[dataIndex]);
            });
            
            return result;
        },

        /**
         * 回复上次操作之前的结果
         * @public
         * @return {Object[]}
         */
        cancel: function(){
            var me = this,
                result = {
                    lastAction: dataAction.NULL,
                    row: 0
                },
                data;

            switch (me._lastAction){
                case dataAction.ADD:
                    OBJECTEACH(me._lastData, function(data, dataIndex){
                        delete(me._data[dataIndex]);
                    });
                    result = {
                        row: me._lastChangeArray.length,
                        lastAction: dataAction.ADD
                    };
                    break;
                case dataAction.REMOVE:
                    OBJECTEACH(me._lastData, function(data, dataIndex){
                        me._data[dataIndex] = data;
                    });
                    result = {
                        row: me._lastChangeArray.length,
                        lastAction: dataAction.REMOVE
                    };
                    break;
                case 'UPDATE':
                    OBJECTEACH(me._lastData, function(data, dataIndex){
                        me._data[dataIndex] = data;
                    });
                    result = {
                        row: me._lastChangeArray.length,
                        lastAction: dataAction.UPDATE
                    };
                    break;
                default:
                    return result;
            };
           
            me._lastChangeObject = me._lastData;
            me._lastChangeArray = [];
            OBJECTEACH(me._lastData, function(data){
                me._lastChangeArray.push(data);
            });
            me._lastData = {};
            me._lastAction = dataAction.NULL;

            return result;
        },

        /**
         * 返回最后一次修改时所涉及的数据
         * @public
         * @return {Object}
         */
        getLastChange: function(){
            return CLONE(me._lastChangeObject); 
        }
    };

    return dataModel;
})();
