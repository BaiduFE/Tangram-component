/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 */

///import baidu.fn.bind;

///import baidu.data;
///import baidu.data.dataStore;

///import baidu.data.dataModel.DataModel;
///import baidu.data.ModelManager;

///import baidu.data.dataParser.DataParser;

/**
 * @namespace 定义命名空间
 * */
baidu.data.dataStore.DataStore = baidu.data.dataStore.DataStore || (function(){
   
    /**
     * 数据仓库类
     * @class
     * @public
     * @param {String|baidu.data.dataModel.DataModel} dataModel DataModel实例或者类型唯一标识符
     * @param {Object} DMOptions 如果dataModel参数为字符串,则该参数必选
     * @see {baidu.data.ModelManager.creatDM}
     * @param {String|baidu.data.dataSource.DataSource} dataSource DataSource实例或者类型[ajax,sio,local],若DataModel已经指定DataSource，则可以不传如此参数
     * @param {Object} DSOptions 如果dataSource传入为字符串，则该参数必选
     * @see {baidu.data.dataSource.DataSource}
     */
     
    /* @config {Object} DSOptions.getSource 数据源(获取数据使用)
     * @config {Function} DSOptions.getTransition 获取数据后的自定义数据转换函数,可选
     * @config {Object} DSOptions.setSource 数据源（存储数据时使用）,可选，默认与getSource相同
     * @config {Function} DSOptions.setTransition 存储数据时的自定义数据转换函数，可选
     * @config  {String} DataParser类型
     *
     */
    return baidu.lang.creatClass(function(options){
        var me = this,
            dataSource = options.dataSource || null,
            DSOptions = options.DSOptions || {},
            dataModel = options.dataModel || null,
            DMOptions = options.DMOptions || {};
    
        typeof dataModel == 'string' ? (me.dataModel = baidu.data.ModelManager.creatDM(dataModel, DMOptions)) : dataModel;
        if(!(me.dataSource = me.dataModel.getDS())){
            typeof dataSource == 'string' ? (me.dataSource = new baidu.data.dataSource[dataSource](DSOptions)) : dataSource;
            me.dataModel.setDS(me.dataSource);
        } 
    
    }).extend({
        
        /**
         *  @lends baidu.data.dataStore.DataStore.prototype
         */ 

        dataModel: null,
        dataStore: null,

        /**
         * 获取当前使用的DataModel
         * @public
         * @return {Null|baidu.data.dataModel.DataModel} dataModel
         */
        getDataModel: function(){
            return this.dataModel;              
        },

        /**
         * 设置当前使用的DataModel，并更具DataModel中的DataSource更新this.dataSource
         * @public
         * @param {baidu.data.dataModel.DataModel} dataModel
         */
        setDataModel: function(dataModel){
            
            var me = this;

            if(dataModel){
                me.dataModel = dataModel;
                !me.dataModel.getDS() ? me.dataModel.setDS(me.dataSource) : (me.dataSource = me.dataModel.getDS());
            }
        },

        /**
         * 获取当前使用的dataSource
         * @public
         * @return {Null|baidu.data.dataSource.DataSource} dataSource
         */
        getDataSource: function(){
            return this.dataSource;
        },

        /**
         * 设置当前使用打DataSource,平同步更新me.dataModel
         * @public
         * @param {baidu.data.dataStore.DataSource} dataSource
         */
        setDataModel: function(dataSource){
            var me = this;

            if(dataSource){
                me.dataSource = dataSource;
                me.dataModel.setDS(me.dataSource);
            }
        }

        /**
         * 从dataModel的数据源中读取数据
         * @public
         * @param {Function} callBack 获取数据后的毁掉函数
         * @param {Object} options 读取数据条件，可选
         * @see {baidu.data.dataModel.DataModel.get}
         * @return {object}
         */
        read: function(callBack, options){
            var me = this,
                options = options || {};
            
            me.dataModel.get(baidu.fn.bind(callBack, me), options);
        },

        /**
         * 将数据写入dataModel中
         */
        write: function(){},

        commit: function(){},

        cancel: function(){},

        cancelCommit: function(){}
    }); 
})();
