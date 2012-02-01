/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 */

///import baidu.data;
///import baidu.data.DataModel;
///import baidu.data.dataSource.DataSource;

///import baidu.fn.blank;
///import baidu.lang.isFunction;
///import baidu.parser.create;

/**
 * 数据仓库类
 * @class
 * @public
 * @grammar new baidu.data.DataStore(options)
 * @param {String|baidu.data.DataModel} dataModel DataModel实例
 * @param {String|baidu.data.dataSource.DataSource} dataSource DataSource实例
 * @param {String|Function} action {'append','replace','merge',Function} 当完成load时，向DataModel中填写数据时使用的策略,默认为append
 * @param {Array[String]} mergeFields 当action 为merge时，合并数据时使用的依据变量
 * @param {Boolean} usingLocal 当merge时出现数据冲突，以local为主还是remote数据为主,默认为本地.action为Function时，该选项不无效
 * @return {baidu.data.DataStore} DataStore 实例
 *  */
baidu.data.DataStore = (function(){
   
    var actionType = {
        'APPEND': 'APPEND',
        'REPLACE': 'REPLACE',
        'MERGE': 'MERGE'
    };

    var dataAction = {
        'ADD': 'ADD',
        'REMOVE': 'REMOVE',
        'UPDATE': 'UPDATE'
    };
    
    /**
     * 数据仓库类
     * @class
     * @private
     * @param {baidu.data.DataModel} dataModel DataModel实例
     * @param {baidu.data.dataSource.DataSource} dataSource DataSource实例
     * @param {String|Function} action {'APPEND','REPLACE','MERGE',Function} 当完成load时，向DataModel中填写数据时使用的策略,默认为append
     * @param {Array[String]} mergeFields 当action 为merge时，合并数据时使用的依据变量
     * @param {Boolean} usingLocal 当merge时出现数据冲突，以local为主还是remote数据为主,默认为本地.action为Function时，该选项不无效
     */
    return baidu.lang.createClass(function(options){
        var me = this;
            dataModel = options.dataModel,
            dataSource = options.dataSource,
            action = options.action,
            sync = options.sync;

        dataModel && (me._dataModel = dataModel);
        dataSource && (me._dataSource = dataSource);
        typeof sync != 'undefined' && (me._sync = sync);
       
        if(!action){
            me._action = 'APPEND';
        }else{
            
            if(baidu.lang.isFunction(action))
                me._action = action;
            else{
                me._action = actionType[action] ? actionType[action] : 'APPEND';
            }
        }

        me._mergeFields = options.mergeFields || [];
        me._usingLocal = typeof options.usingLocal != 'undefined' ? options.usingLocal : me._usingLocal;
        
    
    }).extend({
        
        /**
         *  @lends baidu.data.DataStore.prototype
         */ 

        /**
         * DataModel实例
         * @private
         * @property
         */
        _dataModel: null,
        
        /**
         * DataSource 实例
         * @private
         * @property
         */
        _dataSource: null,

       /**
        * @private
        * @property
        */
        _action: 'APPEND',
       
        /**
         * @private
         * @property
         */
        _usingLocal: true,
       
        /**
         * 是否在操作DataSource时同步更新DataModel
         * @private
         * @property
         */
        _sync: false,

        /**
         * 设DataModel实例
         * @public
         * @param {DataModel} dataModel
         * @return {Boolean}
         */
        setDataModel:function(dataModel){
            
            if(dataModel instanceof baidu.data.DataModel){
                this._dataModel = dataModel;
                return true;
            }
            return false;
        },

        /**
         * 获取DataModel
         * @public
         * @return {DataModel|Null}
         */
        getDataModel: function(){
            return this._dataModel;      
        },

        /**
         * 获取当前使用的DataSource
         * @public
         * @return {Null|DataSource} dataSource
         */
        getDataSource: function(){
            return this._dataSource;
        },

        /**
         * 设置DataSource
         * @public
         * @param {DataSource} dataSource
         * @return {Boolean}
         */
        setDataSource: function(dataSource){
            if(dataSource instanceof baidu.data.dataSource.DataSource){
                this._dataSource = dataSource;
                return true;
            }
            return false;              
        },

        /**
         * 设置是DataSource数据保持同步
         * @pubic
         * @param {Boolean} sync 是否同步
         */
        setSnyc: function(sync){
            this._sync = sync;  
        },

        //TODO: 如何处理数据冲突
        /**
         * DataSource从其数据源拉取数据
         * @param {Object} options
         * @See baidu.data.dataSource
         * @param {Boolean} sync
         * @param {baidu.parser.type} 请求的数据类型，如不提供此参数，则不会向自定义函数传入经过parser包装对象，传入原始数据
         */
        load: function(options, sync, type){

            var me = this,
                dataSource = me._dataSource,
                dataModel = me._dataModel,
                sync = typeof sync != 'undefined' ? sync : me._sync,
                success = options.onsuccess || baidu.fn.blank,
                failture = options.onfailture || baidu.fn.blank,
                tmpData = [];
        
            if(!dataSource) return;

            if(sync){
                options.onsuccess = function(data){
                    switch (me._action){
                        case 'APPEND':
                            success.call(me, dataModel.add(data));
                            break;
                        case 'REPLACE':
                            dataModel.remove('*');
                            success.call(me, dataModel.add(data));
                            break;
                        case 'MERGE':
                       
                            //TODO: 看日后需求，如果需要将无冲突项进行append到dm中，在此处添加部分逻辑
                            (me._mergeFields.length != 0) && baidu.each(data, function(item){
                                dataModel.update(item, function(dataLine){
                                    var result = true;
                                    baidu.each(me._mergeFields, function(name){
                                        result = (dataLine[name] == item[name]);
                                        return result;
                                    });

                                    return result;
                                });
                            });
                            success.call(me, data);
                            break;
                        default: 
                            success.call(me, me._action.call(me, data));
                    }     
                };

                options.onfailture = function(){
                    failture.apply(me, arguments);    
                };
            }

            dataSource.get(options);
        },

        //TODO: save数据如何给出？？？？
        /**
         * DataSource commit数据
         * @public
         * @param {Object} options
         * @param {String} dataType 'ALL|LC' 默认值为'LC'
         * @see baidu.data.dataSource.DataSource.commit
         */
        save: function(options, dataType){
            var me = this,
                dataModel = me._dataModel,
                dataSource = me._dataSource,
                dataType= dataType || 'LC';

            dataSource.set(
                options, 
                dataType == 'ALL' ? dataModel.select('*') : dataModel.getLastChange()
            );
        },

        /**
         * 向DataModel中写入新的数据
         * @public
         * @param {Object} data
         * @see baidu.data.DataModel.add
         * @return {fail:Number[], success:Number[]} fail数据为添加失败的数据的index,success数组为成功插入的数据的索引值 
         */
        add: function(data){
            var me = this,
                result = me._dataModel.add(data);
           
            me.dispatchEvent('onadd', {
                row: result.success.length,
                data: (result.success.length > 0 ? me._dataModel.getLastChange() : {})
            })

            return result;
        },

        /**
         * 从DataModel中取出数据
         * @public
         * @param {String} where
         * @param {Function|Number[]|Number} condition 查找条件方法或者包含index的数组或者index
         * @see baidu.data.DataModel.select
         * @return {Object}
         */
        select: function(where, condition){
            var where = where || '*',
                condition = (typeof condition != 'undefined' ? condition : '*'); 
            
            return this._dataModel.select(where, condition);
        },

        /**
         * 更新数据
         * @public
         * @param {Object} data
         * @param {Function|Number[]|Number} condition 查找条件方法或者包含index的数组或者index
         * @see baidu.data.DataModel.select
         * @return {Number} 受到影响的数据行数
         */
        update: function(data, condition){
            var me = this,
                data = data || {},
                condition = (typeof condition != 'undefined' ? condition : '*'),
                row = me._dataModel.update(data, condition);

            me.dispatchEvent('onupdate',{
                row: row,
                data: (row ? me._dataModel.getLastChange() : {})
                
            });

            return row;
        },

        
        /**
         * 删除DataModel中的数据
         * @public
         * @param {Function|Number[]|Number} condition 查找条件方法或者包含index的数组或者index
         * @See baidu.data.dataModel.remove
         * @return {Number} 被删除的数据
         */
        remove: function(condition){
            var me = this,
                condition = (typeof condition != 'undefined' ? condition : '*'),
                row = me._dataModel.remove(condition);

            me.dispatchEvent('ondelete', {
                row: row,
                data: (row ? me._dataModel.getLastChange() : {})
            });

            return row;
        },

        /**
         * 撤销上一次所做的修改
         * @public
         * @return {Number} 受影响的行数
         */
        cancel: function(){
            var me = this,
                result = me._dataModel.cancel();

            me.dispatchEvent('oncancel',{
                cancelAction: result.cancelAction,
                row: result.row,
                lastChange: result.lastChange
            });

            return result.row;
        }
    }); 
})();
