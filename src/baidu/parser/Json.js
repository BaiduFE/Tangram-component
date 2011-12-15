/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.parser;
///import baidu.parser.Parser;

///import baidu.object.extend;
///import baidu.json.parse;
///import baidu.parser._jpath;
///import baidu.lang.isString;

baidu.parser.Json = baidu.parser.Json || (function(){

    /**
     * JSON操作解析器
     * @public
     * @class
     */
    return function(options){
        
        var parser = new baidu.parser.Parser(options);
        parser._type = baidu.parser.type.JSON;

        baidu.extend(parser, {
       
            _jPath: null,

           /**
            * 转换数据
            * @private
            * @param {String|Object} JSON
            * @return {Boolean}
            */
            _parser: function(JSON){
                var me = this;

                if(baidu.lang.isString(JSON)){

                    try{
                        JSON = baidu.json.parse(JSON);
                    }catch(e){
                        return false;
                    }   
                }

                me._jPath = new JPath(JSON);
                me._dom = me._jPath.root();
                return true;
            },

            /**
             * 使用JPath获取数据并返回
             * @public
             * @param {String} Path
             * @return {Array}
             */
            _query: function(JPath){
                var me = this;
                return me._jPath ? me._jPath.query(JPath) : [];
            }

        });
        return parser;
    };
})();
