/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.parser;
///import baidu.parser.Parser;

///import baidu.object.extend;

baidu.parser.Xml = baidu.parser.Xml || (function(){

    var AXO = window.ActiveXObject;
    var IMP = document.implementation && document.implementation.createDocument;

    function _createXMLDOM(){
       return new ActiveXObject('Microsoft.XMLDOM');
    };

    /**
     * 加载xmlString
     * @private
     * @param {XMLHttpRequest|DOMParser} DOMParser
     * @param {String} xmlString xml字符串数据
     * @return {XMLRoot}
     */
    function _loadXMLString(DOMParser, xmlString){
        if(AXO){
            DOMParser.async = false;
            DOMParser.loadXML(xmlString);
            DOMParser.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
            DOMParser.setProperty("SelectionLanguage", "XPath");
            return DOMParser.documentElement;
        }else if(IMP){
            return DOMParser.parseFromString(xmlString, 'text/xml');
        }
    };

    /**
     * xml操作解析器
     * @public
     * @class
     */
    return function(options){
        
        var parser = new baidu.parser.Parser(options);
        parser._type = baidu.parser.type.XML;

        baidu.extend(parser, {
    
            _DOMParser: null,
         
            /**
             * 将字符串转换为XMLDOM
             * @private
             * @param {String} XMLString
             * @return {Boolean}
             */
            _parser: function(XMLString){
                var me = this;

                if(!me._DOMParser){
                    IMP && (me._DOMParser = new DOMParser());
                    AXO && (me._DOMParser = _createXMLDOM());
                }

                me._dom = _loadXMLString(me._DOMParser, XMLString);
                
                return me._dom ? true : false; 
            },

            /**
            * 使用xpath获取数据
            * @public
            * @param {String} XPath
            * @return {Array}
            */
            _query: function(XPath){
                var me = this,
                    result = [],
                    nod = null,
                    tmpResult;

                if(AXO){
                    result = me.getRoot().selectNodes(XPath);
                }else if(IMP){
                    tmpResult = me.getRoot().evaluate(XPath, me.getRoot(), null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                    while((nod = tmpResult.iterateNext()) != null) {   
                        result.push(nod);
                    }
                }
    
                return result;
            }
        });

        return parser;
    };

})();
