/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * code from jsonpath
 */

///import baidu.parser;
///import baidu.parser.Parser;
///import baidu.lang.createClass;

baidu.parser.Json = baidu.parser.Json || (function(){

    function jsonPath(obj, expr, arg) {
        var P = {
            resultType: arg && arg.resultType || "VALUE",
            result: [],
            normalize: function(expr) {
                var subx = [];
                return expr.replace(/[\['](\??\(.*?\))[\]']|\['(.*?)'\]/g, function($0,$1,$2){return "[#"+(subx.push($1||$2)-1)+"]";})  /* http://code.google.com/p/jsonpath/issues/detail?id=4 */
                        .replace(/'?\.'?|\['?/g, ";")
                        .replace(/;;;|;;/g, ";..;")
                        .replace(/;$|'?\]|'$/g, "")
                        .replace(/#([0-9]+)/g, function($0,$1){return subx[$1];});
                },
            
            asPath: function(path) {
                var x = path.split(";"), p = "$";
                for (var i=1,n=x.length; i<n; i++)
                    p += /^[0-9*]+$/.test(x[i]) ? ("["+x[i]+"]") : ("['"+x[i]+"']");
                return p;
            },
            store: function(p, v) {
                   if (p) P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
                   return !!p;
            },
            trace: function(expr, val, path) {
                if (expr !== "") {
                    var x = expr.split(";"), loc = x.shift();
                    x = x.join(";");
                    if (val && val.hasOwnProperty(loc))
                        P.trace(x, val[loc], path + ";" + loc);
                    else if (loc === "*")
                        P.walk(loc, x, val, path, function(m,l,x,v,p) { P.trace(m+";"+x,v,p); });
                    else if (loc === "..") {
                        P.trace(x, val, path);
                        P.walk(loc, x, val, path, function(m,l,x,v,p) { typeof v[m] === "object" && P.trace("..;"+x,v[m],p+";"+m); });
                    }
                    else if (/^\(.*?\)$/.test(loc)) // [(expr)]
                        P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";")+1))+";"+x, val, path);
                    else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
                        P.walk(loc, x, val, path, function(m,l,x,v,p) { if (P.eval(l.replace(/^\?\((.*?)\)$/,"$1"), v instanceof Array ? v[m] : v, m)) P.trace(m+";"+x,v,p); }); // issue 5 resolved
                    else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
                        P.slice(loc, x, val, path);
                    else if (/,/.test(loc)) { // [name1,name2,...]
                        for (var s=loc.split(/'?,'?/),i=0,n=s.length; i<n; i++)
                            P.trace(s[i]+";"+x, val, path);
                    }
                }
                else
                    P.store(path, val);
            },
            walk: function(loc, expr, val, path, f) {
                if (val instanceof Array) {
                    for (var i=0,n=val.length; i<n; i++)
                        if (i in val)
                            f(i,loc,expr,val,path);
                }
                else if (typeof val === "object") {
                    for (var m in val)
                        if (val.hasOwnProperty(m))
                            f(m,loc,expr,val,path);
                }
            },
            slice: function(loc, expr, val, path) {
                if (val instanceof Array) {
                    var len=val.length, start=0, end=len, step=1;
                    loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function($0,$1,$2,$3){start=parseInt($1||start);end=parseInt($2||end);step=parseInt($3||step);});
                    start = (start < 0) ? Math.max(0,start+len) : Math.min(len,start);
                    end   = (end < 0)   ? Math.max(0,end+len)   : Math.min(len,end);
                    for (var i=start; i<end; i+=step)
                        P.trace(i+";"+expr, val, path);
                }
            },
            eval: function(x, _v, _vname) {
                      try { return $ && _v && eval(x.replace(/(^|[^\\])@/g, "$1_v").replace(/\\@/g, "@")); }  // issue 7 : resolved ..
                      catch(e) { throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/(^|[^\\])@/g, "$1_v").replace(/\\@/g, "@")); }  // issue 7 : resolved ..
            }
        };

        var $ = obj;
        if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
            P.trace(P.normalize(expr).replace(/^\$;?/,""), obj, "$");  // issue 6 resolved
            return P.result.length ? P.result : false;
        }
    };

    /**
     * xml操作解析器
     * @public
     * @class
     */
    return baidu.lang.createClass(function(){
     
     },{
        superClass: 'baidu.parser.Parser'
     }).extend({
      
        loadSrc: function(fileSrc){
            var me = this;

            if(!me._XMLHttpRequest){
                me._XMLHttpRequest = _createHttpRequest();
                AXO && (me._DOMParser = me._XMLHttpRequest);

                me._XMLHttpRequest.onreadystatechange = function(){
                    if(this.readyState == 4){
                        me._isLoad = true;
                        me._dom = this.responseXML;

                        this.abort();
                        me.dispatchEvent('onload');

                    }
                };    
            }
            
            _loadXML(me._XMLHttpRequest, fileSrc);
        },

        /**
         * 直接加载xml字符串数据
         * @public
         * @param {String} xmlString
         */
        loadData: function(xmlString){
        },

        /**
         * 使用xpath获取数据
         * @public
         * @param {String} xPath
         * @param {Boolean} cache 是否使用缓存的数据，默认为true
         * @return {Array}
         */
        query: function(xPath, cache){
            var me = this,
                cache = typeof cache != 'undefined' ? cache : true,
                result = [], nod = null, tmpResult;

            if(!me._isLoad)
                return result;
           
            if(cache && me._queryData[xPath]) return me._queryData[xPath];

            if(AXO){
                result = me.getRoot.selectNodes(xPath);
            }else if(IMP){
                tmpResult = me.getRoot.evaluate(xPath, me.getRoot(), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                while((nod = tmpResult.iterateNext()) != null) {   
                    result.push(nod);
                }   
            }
            me._queryData[xPath] = result;

            return result;
        };
     });

})();
