/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:data/dataSource/DataSource.js
 * @author:Walter
 * @version:1.0.0
 * @date:2010-11-30
 */
///import baidu.data.dataSource;
///import baidu.lang.createClass;
///import baidu.lang.Event;
///import baidu.object.extend;
///import baidu.object.keys;

///import baidu.parser.create;

/**
 * 数据源类
 * @class
 * @grammar new baidu.data.dataSource.DataSource(options)
 * @param {Object}      [options]              config参数
 * @config {Number}     [maxCache = 10]       缓存数据的最大个数
 * @config {Boolean}    [cache = true]        是否使用缓存
 * @config {baidu.parser.type} [dataType = '']    传入的数据为何种类型，当该值传入时会试图创建对应的parser
 * @config {Function}   [transition]          转换数据算法
 * @return {baidu.data.dataSource.DataSource} 数据源类
 * @private
 */
baidu.data.dataSource.DataSource = baidu.lang.createClass(function(options){
    this._cacheData = {};
    baidu.object.extend(this, options);
    
    this.addEventListener("onbeforeget", function(evt){
        var me = this, 
			data;
        if (me.cache && (data = me._cacheData[evt.key]) && evt.onsuccess) {
            evt.onsuccess.call(me, data);
        }
        
        evt.returnValue = !!data;
    });
}, {
    className: "baidu.data.dataSource.DataSource"
}).extend(
    /**
     *  @lends baidu.data.dataSource.DataSource.prototype
     */
    {
    
	maxCache: 100,
    
	cache: true,

    dataType: '',

    /**
     * 更新配置
     * @param {Object} options
     */
    update: function(options){
        var me = this;
        baidu.object.extend(me, options);
    },
    
    /**
     * 
     * 获取数据
     * @interface 
     * @param {Object} options 配置信息
     */
    get: function(options){
    
    },

    /**
     * 存储数据接口,由具体的dataSource实现
     */
    set: function(){},
    
    /**
     * 转换数据格式并调用回调函数
     * @private 
     * @param {Object} options
     * @return {Object} 返回数据
     */
    _get: function(options){
        var me = this, 
			data;
       
        //创建parser
        function createParser(type, data){
            var parser = null;

            if(type){
                parser = baidu.parser.create(type);
                parser && parser.load(data);
                return parser ? parser : data;
            }

            return  data;
        };

        data = createParser(me.dataType, me.source);
        data = me.transition.call(me, data);
        
        me.cache && options.key && data && me._addCacheData(options.key, data);
        options.onsuccess && options.onsuccess.call(me, data);
        return data;
    },
    
    /**
	 * 转换数据格式
     * @function 
     * @param  {Object} source 数据源
     * @return {Object} source 转换格式后的数据源
     */
    transition: function(source){
        return source;
    },
    
    /**
     * 增加缓存数据
     * @privite 
     * @param {Object} key    数据键值对Key值
     * @param {Object} value  数据键值对value值
     */
    _addCacheData: function(key, value){
        var me = this, 
			keySet = baidu.object.keys(me._cacheData);
        while (me.maxCache > 0 && keySet.length >= me.maxCache) {
            delete me._cacheData[keySet.shift()];
        }
        if (me.maxCache > 0) {
            me._cacheData[key] = value;
        }
    }
});
