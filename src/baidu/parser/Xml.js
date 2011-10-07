/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.parser;
///import baidu.parser.Parser;
///import baidu.lang.createClass;

baidu.parser.Xml = baidu.parser.xml || (function(){

    var AXO = window.ActiveXObject;
    var IMP = document.implementation && document.implementation.createDocument;

    /**
     * 创建XMLHttpRequest对象
     * @private
     * @return XMLHttpRequest
     */
    function _createHttpRequest(){
        if (AXO){
            return new ActiveXObject('Msxml2.DOMDocument');
        }else if(IMP){
            return new window.XMLHttpRequest();
        } 
         
        return {};   
    };

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
    return baidu.lang.createClass(function(){
     
     },{
        superClass: 'baidu.parser.Parser'
     }).extend({
      
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
            var me = this;

            me._isLoad = false;
            if(!me._DOMParser){
                IMP && (me._DOMParser = new DOMParser());
                AXO && (me._DOMParser = me._XMLHttpRequest = me._XMLHttpRequest || _createHttpRequest());
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
