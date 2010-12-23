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
 * @param {Object}     source                        数据源
 * @param {Object}     [options]                     配置
 * @param {Number}     [options.maxCache = 10]       缓存数据的最大个数
 * @param {Boolean}    [options.cache = true]        是否使用缓存
 * @param {Function}   [optons.transition]           转换数据算法
 * @param {Function}   [options.onbeforeget]         beforeget事件
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
