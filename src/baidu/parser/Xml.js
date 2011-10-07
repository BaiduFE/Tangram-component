/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.parser;
///import baidu.parser.Parser;
///import baidu.lang.createClass;

///TODO: 能否使用baidu.ajax.*来实现这个类？
baidu.parser.Xml = baidu.parser.xml || (function(){

    var AXO = window.ActiveXObject;
    var IMP = document.implementation && document.implementation.createDocument;

    /**
     * 加在xml文件
     * @private
     * @param {XMLHttpRequest} XMLHttpRequest
     * @param {String} fileSrc 文件路径
     */
    function _loadXML(XMLHttpRequest, fileSrc){
        
        if (AXO){
            XMLHttpRequest.load(fileSrc);
            XMLHttpRequest.setProperty('SelectionLanguage', 'XPath')
        }else if(IMP){
            XMLHttpRequest.open("GET",fileSrc,true);
            XMLHttpRequest.send(null);
        }
    };

    /**
     * 加载xmlString
     * @private
     * @param {XMLHttpRequest|DOMParser} DOMParser
     * @param {String} xmlString xml字符串数据
     * @return {XMLRoot}
     */
    function _loadXMLString(DOMParser, xmlString){
        if(AXO)
            DOMParser.async = false;
            DOMParser.loadXml(xmlString);
            DOMParser.setProperty('SelectionLanguage', 'XPath');
            return DOMParser.responseXML; 
        else if(IMP){
            return DOMParser.parseFromString(xmlString, 'text/xml');
        }
    };

    /**
     * xml操作解析器
     * @public
     * @class
     */
    return function(){
        
        var parser = new baidu.parser.Parser();

        baidu.extend(parser, {
    
            _XMLHttpRequest: null;
            _DOMParser: null;

            /**
            * 加载xml文件
            * @public
            * @param {String} 文件路径
            */
           loadSrc: function(fileSrc){
                var me = this;
    
                if(!me._XMLHttpRequest){
                    me._XMLHttpRequest = me._createXHR;
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
                var me = this;
    
                me._isLoad = false;
                if(!me._DOMParser){
                    IMP && (me._DOMParser = new DOMParser());
                    AXO && (me._DOMParser = me._XMLHttpRequest = me._XMLHttpRequest || me._createXHR());
                }
    
                me._dom = _loadXMLString(me._DOMParser, xmlString);
             
                if(me._dom){
                    me._isLoad = true; 
                    me.dispatchEvent('onload');
                }
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
                    result = me.getRoot.selectNodes(XPath);
                }else if(IMP){
                    tmpResult = me.getRoot.evaluate(XPath, me.getRoot(), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                    while((nod = tmpResult.iterateNext()) != null) {   
                        result.push(nod);
                    }   
                }
    
                return result;
            };
        });

        return parser;
    };

})();
