/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.parser;
///import baidu.lang.createClass;

baidu.parser.Parser = baidu.parser.Parser || (function(){

    /**
     * 提供数据处理的基类方法
     * @class
     * @public
     * @param {Object} options
     */
    return baidu.lang.createClass(function(){
    
    },{
        className: 'baidu.parser.Parser'
    }).extend({
        /**
         *  @lends baidu.parser.Parser.prototype
         */

        _dom: null,

        _isLoad: false,

        /**
         * 将通过xpath query的数据缓存起来
         * @private
        */
        _queryData: {},
    
        /**
         * 加载数据，支持xml，json，html
         * @public
         * @param {Object} data
        */
        loadData: function(data){},
    
        /**
         * 通过xpath获取所需要的数据，支持html,json,xml
         * @public
         * @param {String} xPath 
         * @return {Object}
        */
        query: function(xPath){
            return null;
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
