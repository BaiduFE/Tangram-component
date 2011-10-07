/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * code from jpath
 */

///import baidu.parser;
///import baidu.parser.Parser;

///import baidu.json.parse;
///import baidu.ajax.get;
///import baidu.ajax.post;

baidu.parser.Json = baidu.parser.Json || (function(){

    var jpath = (function() {
        function _u(arr) { for (var a=arr.slice(0), i=1, l=arguments.length; i<l; i++) { a.unshift(arguments[i]); } return a; }
        function merge(a,b) { return a.push.apply(a, b); }
        function jp(obj, path, parents) {
            if (!path.length)           { return [ obj ]; }
            var id = path[0];
            if (id == "..")             { return jp(parents.shift(), path.slice(1), parents); }
            if (typeof obj != "object") { return path.length == 1 && id == "*" ? [ obj ] : []; }
            if (id == "last()")         { return obj.length ? jp(obj[obj.length-1], path.slice(1), _u(parents, obj)) : []; }
            var out = [];
            if (id !== "") { // Find children
                    if (obj.hasOwnProperty(id))     { merge(out, jp(obj[id], path.slice(1), _u(parents, obj))); }
                    else if (id == "*")             { for (var i in obj) { if (obj.hasOwnProperty(i)) { merge(out, jp(obj[i], path.slice(1), _u(parents, obj))); } } }
            }
            else { // Find desendants
                id = path[1];
                for (var i in obj) { if (obj.hasOwnProperty(i)) {
                    if (obj[i].hasOwnProperty(id))  { merge(out, jp(obj[i][id], path.slice(2), _u(parents, obj, obj[i]))); }
                    else if (id == "*" || i === id) { merge(out, jp(obj[i],     path.slice(2), _u(parents, obj        ))); }
                    else                            { merge(out, jp(obj[i],     path,          _u(parents, obj        ))); }
                } }
            }
            // TODO: Remove duplicates in out
            return out;
        }
    
        function jpstr(obj, str) {
            if (str.charAt(0) != "/") { str = "/" + str; }  // Add leading slash if required
            var arr = str.replace(/\/+$/, "")               // Remove trailing slashes
                        .replace(/\/\/+/, "//")            // Convert /// -> //
                        .replace(/\[(\d+)\]/, "/$1")       // Convert chapter[0]/para to chapter/0/para
                        .replace(/\/(\.\/)+/g, "/").replace(/^\.\//, "/").replace(/\/\.$/, "")    // Ignore "."
                        .split("/").slice(1);
    
            var arr2 = [];
            for (var i=0,l=arr.length,depth=0; i<l; i++) {
                if (depth <= 0) { arr2.push(arr[i]); } else { arr2[arr2.length-1] += "/" + arr[i]; }
                var open  = arr[i].match(/\[/g);
                var close = arr[i].match(/\]/g);
                depth += (open ? open.length : 0) - (close ? close.length : 0);
            }
    
            return jp(obj, arr2, []);
        }
    
        return jpstr;
    })();

    /**
     * JSON操作解析器
     * @public
     * @class
     */
    return function(options){
        
        var parser = new baidu.parser.Parser(options);

        baidu.extend(parser, {
       
            _jPath: null,

            /**
             * 加在JSON文件
             * @public
             * @param {String} fileSrc
             * @param {String} method 'GET','POST'
             * @param {String} data
             */
            _loadSrc: function(fileSrc, method, data){
                var me = this,
                    onsuccess = function(xhr, responseText){
                        me._paser(responseText) && me.dispatchEvent('onload');
                    };

                me._method == 'GET' ? baidu.ajax.get(fileSrc, onsuccess) : baidu.ajax.post(fileSrc, data, onsuccess);
            },

            /**
             * 将传入的String转换成JSON
             * @public
             * @param {String} JSONString
             * @return {Object}
             */
           loadData: function(JSONString){
                var me = this,
                    JSONString = JSONString || '',
                    result = {};

                me._isLoad = false;
                me._paser(JSONString) && me.dispatchEvent('onload');
            },

           /**
            * 转换数据
            * @private
            * @param {String} JSONString
            * @return {Boolean}
            */
            _paser: function(JSONString){
                var me = this;

                try{
                    result = baidu.json.parse(JSONString);
                    me._jPath = new jpath(result);

                    me._dom = me._jPath.root();
                    me._isLoad = true;

                    return true;
                }catch(e){
                    return false;
                }   
            },

            /**
             * 使用JPath获取数据并返回
             * @public
             * @param {String} Path
             * @return {Array}
             */
            _query: function(JPath){
                var me = this;
                return me._jPath ? me._jPath.query(JPath) ? [];
            }

        });
        return parser;
    };
})();
