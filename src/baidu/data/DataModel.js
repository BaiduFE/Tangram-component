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

///import baidu.lang.isArray;
///import baidu.lang.isNumber;
///import baidu.lang.isFunction;
///import baidu.lang.createClass;

///import baidu.data;
///import baidu.data.Field;

/**
 * DataModel实体类
 * @class
 * @grammar new baidu.data.DataModel(options);
 * @public
 * @param {Object} options 设置项
 * @config {Object} options.fields 通过ModalManager.defineDM定义的数据结构
 * @config {Number} options.recodeLength cancel操作的记录数
 * @config {baidu.data.Validator} validator
 * @return {baidu.data.DataModel} DataModel 实例
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
                name: fieldName
            });
            dataModel._fields[fieldName] = new baidu.data.Field(config, dataModel);
        });
    };

    /**
     * DataModel实体类
     * @private
     * @param {Object} options 设置项
     * @config {Object} options.fields 通过ModalManager.defineDM定义的数据结构
     * @config {Number} options.recodeLength cancel操作的记录数
     * @config {baidu.data.Validator} validator
     */
    var dataModel = function(options){
       
        var me = this,
            options = options || {};
            
        /**
         * 存储Field实例的名值对
         * @private
         * @attribute
         */
        me._fields = {};
        
        /**
         * 数据值
         * @private
         * @attribute
         */
        me._data = {};

        me._actionQueue = [];
        me._recodeLength = options.recodeLength || me.recodeLength;
        
        me._validator = options.validator;
        _createField(options.fields || {}, me);
    };
        
    
    dataModel.prototype = 
    /**
     *  @lends baidu.data.DataModel.prototype
     */
    {
      
        /**
         * 数据存储索引
         * @private
         * @attribute
         */
        _index: 0,

        /**
         * 记录长度，默认值为5
         * @public
         * @attribute
         */
        _recodeLength: 5,

        /**
         * lastAction 压如队列
         * @private
         * @param {String} action
         * @return {Null}
         */
        _setLastAction:function(action, lastData, lastChange){
            var me = this;

            me._actionQueue.push({
                'action': action,
                'lastData': lastData,
                'lastChange': lastChange
            });

            me._actionQueue.length > me._recodeLength && me._actionQueue.shift();
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
         * 回滚id
         * @private
         * @attribute
         */
        _revertId: function(){
        	this._index--;
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

            if(condition == '*')
                return baidu.object.keys(me._data);

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

            return result;
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
                tmpResult, tmpNames,
                dataIndex,length,
                lastData = {}, lastChange = {};

            if(baidu.object.isEmpty(data)) return result; 

            if(!baidu.lang.isArray(data)) data = [data];
            
            baidu.each(data, function(eachData, index){

                tmpResult = true;
                tmpNames = [];
                dataIndex = me._getNewId();
            
                OBJECTEACH(me._fields, function(field, name){
                    tmpResult = field.set(dataIndex, eachData[name]);
                    tmpResult.result ? tmpNames.push(name) : result.fail.push(index); 
                    return tmpResult.result;
                });

                if(!tmpResult.result){
                    delete(me._data[dataIndex]);
                    me._revertId();
                }else{

                    lastData[dataIndex] = 'undefined';
                    lastChange[dataIndex] = CLONE(me._data[dataIndex]);

                    result.success.push(dataIndex);
                }
            });

            result.success.length > 0 && me._setLastAction(dataAction.ADD, lastData, lastChange);

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
                result = [],
                index;

            if(me._data.length == 0){
                return result;
            }

            index = me._getConditionId(condition);
            result = me._getDataByIndex(where, index);

            return result;
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
                resultId = [],
                tmpResult,
                tmpNames = [],
                result = 0,
                dataIndex,
                lastData = {}, lastChange = {};
           
            if(baidu.object.isEmpty(data)){
                return result;
            } 

            data = CLONE(data);
            resultId = me._getConditionId(condition);
            //第一次更新时做数据验证
            if(resultId.length > 0){
               dataIndex = resultId.shift();
               lastData[dataIndex] = CLONE(me._data[dataIndex]);
               
               OBJECTEACH(data, function(item, name){
                   tmpResult = me._fields[name].set(dataIndex, item);
                   tmpResult && tmpNames.push(name);
                   return tmpResult;
               });
               if(!tmpResult){
                   me._data[dataIndex] = lastData;
                   return result;
               }

               lastChange[dataIndex] = me._data[dataIndex];

               result++;
            }
            
            ARRAYEACH(resultId, function(dataIndex){
                
                lastData[dataIndex] = CLONE(me._data[dataIndex]);
                
                OBJECTEACH(data, function(item, name){
                    me._data[dataIndex][name] = item;
                });
                
                lastChange[dataIndex] = me._data[dataIndex];
                result++;
            });

            result > 0 && me._setLastAction(dataAction.UPDATE, lastData, lastChange);
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
                resultId = me._getConditionId(condition),
                result = 0,data,
                lastData = {}, lastChange = {};

            if(resultId.length == 0){
                return result;
            }
            
            baidu.each(resultId, function(dataIndex){
               
                lastChange[dataIndex] = lastData[dataIndex] = CLONE(me._data[dataIndex]);
                
                result++;
                delete(me._data[dataIndex]);
            });
           
            result > 0 && me._setLastAction(dataAction.REMOVE, lastData, lastChange);
            return result;
        },

        /**
         * 回复上次操作之前的结果
         * @public
         */
        cancel: function(){
            var me = this,
                lastAction,
                result = {
                    row: 0,
                    cancelAction: dataAction.NULL,
                    lastChange: {}
                };
            
            if(me._actionQueue.length == 0)
               return result;

            lastAction = me._actionQueue.pop();
            result.lastChange = lastAction.lastChange;
            switch (lastAction.action){
                case dataAction.ADD:
                    OBJECTEACH(lastAction.lastData, function(data, dataIndex){
                        delete(me._data[dataIndex]);
                        result.row ++;
                    });
                    result.cancelAction = dataAction.ADD;
                    break;
                case dataAction.REMOVE:
                    OBJECTEACH(lastAction.lastData, function(data, dataIndex){
                        me._data[dataIndex] = data;
                        result.row ++;
                    });
                    result.cancelAction = dataAction.REMOVE;
                    break;
                case dataAction.UPDATE:
                    OBJECTEACH(lastAction.lastData, function(data, dataIndex){
                        me._data[dataIndex] = data;
                        result.row ++;
                    });
                    result.cancelAction = dataAction.UPDATE;
                    break;
                default:
                    return result;
            };

            return result;
        },

        /**
         * 返回最后一次修改时所涉及的数据
         * @public
         * @return {Object}
         */
        getLastChange: function(){
            var me = this;
                data = me._actionQueue.length > 0 ? CLONE(me._actionQueue[me._actionQueue.length - 1].lastChange) : [];
            
            return data; 
        }
    };

    return dataModel;
})();
