/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.parser;
///import baidu.parser.type;

///import baidu.lang.createClass;

///import baidu.fn.blank;
///import baidu.ajax.get;
///import baidu.ajax.post;

baidu.parser.Parser = baidu.parser.Parser || (function(){

    /**
     * 提供数据处理的基类方法
     * @class
     * @public
     * @param {Object} options
     * @config {String} method ‘GET’，'POST' 默认为GET
     * @config {Function} onload
     */
    return baidu.lang.createClass(function(options){
   
        var me = this,
            options = options || {};

        me._method = options.method || me._method;
        me.onload = options.onload || baidu.fn.blank;

    },{
        className: 'baidu.parser.Parser'
    }).extend({
        /**
         *  @lends baidu.parser.Parser.prototype
         */

        _dom: null,

        _isLoad: false,

        _method: 'GET',

        /**
         * 将通过xpath query的数据缓存起来
         * @private
        */
        _queryData: {},

        _type: '',
   
        /**
         * 加载数据，支持xml，json，html
         * @public
         * @param {String} dataString
        */
        load: function(dataString){
            var me = this;
           
            if(typeof dataString == 'undefined'){
                return;
            }

            me._isLoad = false;
            if(me._parser(dataString)){
                me._queryData = {};
                me._isLoad = true;
                me.dispatchEvent('onload');
            }
        },
   
        /**
         * 加载数据片段
         * @public
         * @param {String} fileSrc
         * @param {String} method 'GET','POST'
         * @param {String} data
         */
        loadUrl: function(fileSrc, method, data){
            var me = this,
                fileSrc = fileSrc || '',
                method = method || me._method,
                data = data || '',
                onsuccess = function(xhr, responseText){
                    if(me._parser(responseText)){
                        me._isLoad = true;
                        me._queryData = {};
                        me.dispatchEvent('onload');
                    }
                };
            
            me._isLoad = false;
            method == 'GET' ? baidu.ajax.get(fileSrc, onsuccess) : baidu.ajax.post(fileSrc, data, onsuccess);
        },

        /**
         * 通过xpath获取所需要的数据，支持html,json,xml
         * @public
         * @param {String} path
         * @param {Boolean} 是否使用之前的缓存
         * @return {Object}
        */
        query: function(path, cache){
            var me = this,
                path = path || '/',
                cache = !(cache === false),
                result = [];
    
            if(!me._isLoad)
                return result;

            if(cache && me._queryData[path]) return me._queryData[path];

            result = me._query(path);
            me._queryData[path] = result;

            return result;
        },
  
        /**
         * @private
         * @param {String} path
         * @return {Array}
         */
        _query: function(path){
            return [];
        },
        
        /**
         * 转换数据
         * @private
         * @param {String|Object} str
         * @return {Boolean}
         */
        _parser: function(){
            return false;         
        },

        /**
         * 获取数据跟节点
         * @public
         * @return {HTMLElement}
        */
        getRoot: function(){
            return this._dom;        
        }, 

        /**
         * 获取parser的类型
         * @return {baidu.parser.type}
         */
        getType: function(){
            return this._type;         
        }
    });
})();
