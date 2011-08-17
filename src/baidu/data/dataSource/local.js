/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:data/dataSource/local.js
 * @author:Walter
 * @version:1.0.0
 * @date:2010-11-30
 */
///import baidu.data.dataSource.DataSource;
///import baidu.object.extend;

/**
 * 本地数据源类
 * @function
 * @grammar baidu.data.dataSource.local(source, options)
 * @param {Object}     source                        数据源
 * @param {Object}     [options]                     配置
 * @config {Number} maxCache 缓存数据的最大个数，默认10
 * @config {Boolean} cache 是否使用缓存，默认开启
 * @config {Function} transition 转换数据算法  
 * @config {Function} onbeforeget beforeget事件
 */
baidu.data.dataSource.local = function(source, options){
    options = baidu.object.extend({
        source: source
    }, options || {});
    
    var dataSource = new baidu.data.dataSource.DataSource(options);
    
    /**
     * 获取数据
     * @param {Object}    options                 配置
     * @param {String}    [options.key = 'local']     用于存取缓存
     * @param {Function}  [options.onsuccess]             加载成功回调函数
     */
    dataSource.get = function(options){
        var me = this, 
			data;
        options = baidu.object.extend({
            'key': 'local'
        }, options || {});
        
        if (!me.dispatchEvent("onbeforeget", options)) {
            data = me._get(options);
        }
        return data;
    };
    return dataSource;
};
