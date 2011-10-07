/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.parser;
///import baidu.lang.createClass;

baidu.parser.Parser = baidu.parser.Parser || (function(){

    /**
     * 创建XMLHttpRequest对象
     * @private
     * @return XMLHttpRequest
     */
    function _createHttpRequest(){
        if (window.ActiveXObject) {
            try {
                return new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {}
            }
        }
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
    };

    /**
     * 提供数据处理的基类方法
     * @class
     * @public
     * @param {Object} options
     */
    return baidu.lang.createClass(function(options){
   
        var me = this,
            options = options || {};

        me._method = options.method || me._method;

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
   
        _createXHR: function(){
            return _createHttpRequest();
        },

        /**
         * 加载数据，支持xml，json，html
         * @public
         * @param {String} dataString
        */
        loadData: function(dataString){},
   
        /**
         * 加载数据片段
         * @public
         * @param {String} fileSrc
         * @param {String} method 'GET','POST'
         * @param {String} data
         */
        loadSrc: function(fileSrc, method, data){
            var me = this,
                fileSrc = fileSrc || '',
                method = method || me._method,
                data = data || '';

            me._loadSrc(fileSrc, method, data);
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
         * 获取数据跟节点
         * @public
         * @return {HTMLElement}
        */
        getRoot: function(){
            return this._dom;        
        }
    });
})();
