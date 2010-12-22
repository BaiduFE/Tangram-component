/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:data/dataSource/sio.js
 * @author:Walter
 * @version:1.0.0
 * @date:2010-11-30
 */
///import baidu.data.dataSource.DataSource;
///import baidu.sio.callByBrowser;
///import baidu.sio.callByServer;
///import baidu.json.stringify;

/**
 * 跨域数据源类
 * @param {String}     url                           数据源地址
 * @param {Object}     [options]                     配置
 * @param {Number}     [options.maxCache = 10]       缓存数据的最大个数
 * @param {Boolean}    [options.cache = true]        是否使用缓存
 * @param {Function}   [optons.transition]           转换数据算法  
 * @param {Function}   [options.onbeforeget]         beforeget事件
 */
baidu.data.dataSource.sio = function(url, options){
    options = baidu.object.extend({
        url: url
    }, options || {});
	
    var dataSource = new baidu.data.dataSource.DataSource(options);
	
	/**
	 * 获取数据
	 * @param {Object}    options                 配置
	 * @param {String}    [options.key = url + param]            用于存取缓存
	 * @param {String}    [options.callByType = 'server']        请求的类型
	 * @param {Object}    [options.param]                        需要发送的数据
	 * @param {Function}  [options.onsuccess]                    加载成功回调函数
	 */
    dataSource.get = function(options){
        var me = this;
        options = options || {};
        options.key = options.key || (me.url + (options.param ? "?" + baidu.json.stringify(options.param) : ""));
        if (options.callByType && options.callByType.toLowerCase() == "browser") {
            options.callByType = "callByBrowser";
        }
        else {
            options.callByType = "callByServer";
        }
        if (!me.dispatchEvent("onbeforeget", options)) {
            baidu.sio[options.callByType](options.key, function(){
                me._get(options);
            });
        }
    };
    return dataSource;
};
