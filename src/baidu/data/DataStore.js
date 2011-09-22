/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 */

///import baidu.fn.blank;

///import baidu.data;
///import baidu.data.DataModel;
///import baidu.data.DataSource.DataSource;

///import baidu.lang.isFunction;

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
     * @public
     * @param {String|baidu.data.DataModel} dataModel DataModel实例
     * @param {String|baidu.data.dataSource.DataSource} dataSource DataSource实例
     * @param {String|Function} action {'append','replace','merge',Function} 当完成load时，向DataModel中填写数据时使用的策略,默认为append
     * @param {Array[String]} mergeFields 当action 为merge时，合并数据时使用的依据变量
     * @param {Boolean} usingLocal 当merge时出现数据冲突，以local为主还是remote数据为主,默认为本地.action为Function时，该选项不无效
     */
    return baidu.lang.creatClass(function(options){
        var me = this;
            dataModel = options.dataModel,
            dataStore = options.dataStore,
            action = options.action,
           `snyc = options.snyc;

        dataModel && (me._dataModel = dataModel);
        dataSource && (me._dataSource = dataSource);
        typeof snyc != 'undefined' && (me._snyc = snyc);
       
        if(!action){
            me._action = 'APPEND';
        }else{
            
            if(baidu.lang.isFunction(action))
                me._action = action;
            else me._action = actionType[action] ? actionType[action] : 'APPEND';
        }

        me._mergeFields = options.mergeFields || [];
        me._usingLocal = typeof options.usingLocal != 'undefined' ? options.usingLocal : me._usingLocal;
        
    
    }).extend({
        
        /**
         *  @lends baidu.data.dataStore.DataStore.prototype
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
        _snyc: false,

        /**
         * 设DataModel实例
         * @public
         * @param {DataModel} dataModel
         * @return {Boolean}
         */
        setDataModel:function(DataModel){
            
            if(DataModel instanceof baidu.data.DataModel){
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
            if(dataSource instanceof baidu.data.DataSource.DataSource){
                this._dataSource = dataSource;
                return true;
            }
            return false;              
        },

        setSnyc: function(snyc){
            typeof snyc != 'undefined' && (this._snyc = snyc);  
        },

        /**
         * DataSource从其数据源拉取数据
         * @param {Object} options
         * @See baidu.data.dataSource
         * @param {Boolean} snyc
         */
        load: function(options, snyc){

            var me = this,
                dataSource = me._dataSource,
                dataModel = me._dataModel,
                snyc = typeof snyc != 'undefined' ? snyc : me._snyc;
                success = options.onsuccess || baidu.fn.blank(),
                failture = options.onfailture || baidu.fn.blank();
        
            if(!dataSource) return;

            if(snycDataModel){
                options.onsuccess = function(data){
                    switch (me._action){
                        case 'APPEND': 
                            dataModel.add(data);
                            success(data);       
                            break;
                        case 'REPLACE':
                            dataModel.clear();
                            dataModel.add(data);
                            success(data);
                            break;
                        case 'MERGE':
                            baidu.each(data, function(item){
                                dataModel.update(item, function(dataLine){
                                    var result = true;
                                    baidu.each(me._mergeFields, function(name){
                                        result = (dataLine[name] == item[name]);
                                        return result
                                    });

                                    return result;
                                });
                            });
                            success(data);
                            break;
                        default: 
                            me._action.call(me, data);
                            success(data);
                    }     
                };

                options.onfailture = function(){
                    onfailture.apply(arguments);    
                };
            }

            dataSource.get(options);
        },

        //TODO: save数据如何给出？？？？
        /**
         * DataSource commit数据
         * @public
         * @param {Object} options
         * @param {String} data 'ALL|LC' 默认值为'LC'
         * @see baidu.data.dataSource.DataSource.commit
         */
        save: function(options, data){
            var me = this,
                dataModel = me._dataModel,
                dataSource = me._dataSource,
                data = data || 'LC';

            dataSource.commit(
                options, 
                data == 'ALL' ? dataModel.select('*') : dataModel.getLastChange()
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
                data: me._dataModel.getLastChange()
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
                condition = condition || baidu.fn.blank();
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
                condition = condition || baidu.fn.blank(),
                row = me._dataModel.update(data, condition);

            me.dispatchEvent('onupdate',{
                row: row,
                data: me._dataModel.getLastChange()
                
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
                row = me._dataModel.remove(condition || baidu.fn.blank());

            me.dispatchEvent('ondelete', {
                row: row,
                data: me._dataModel.getLastChange()
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
                lastAction: dataAction[result.cancelAction],
                row: result.row,
                data: me._dataModel.getLastChange()
            });

            return result.row;
        }
    }); 
})();
