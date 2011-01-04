/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/suggestion/Suggestion.js
 * author: berg
 * version: 1.1.0
 * date: 2010-06-01 庆祝儿童节，晚上升级suggestion
 */

///import baidu.dom.g;
///import baidu.dom.getPosition;
///import baidu.dom.remove;

///import baidu.string.format;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.object.extend;
///import baidu.browser.ie;
///import baidu.event.preventDefault;

///import baidu.lang.Event;

///import baidu.ui.suggestion;
///import baidu.ui.createUI;
///import baidu.ui.get;

/**
 * Suggestion基类，建立一个Suggestion实例
 * 
 * @param  {Object}             options optional        选项参数
 * @config {DOMElement}                 target          input框
 */

baidu.ui.suggestion.Suggestion = baidu.ui.createUI(function (options){
    var suggestion = this;

    suggestion.addEventListener("onload", function(){
        //监听suggestion外面的鼠标点击
        baidu.on(document, 'mousedown', suggestion.documentMousedownHandler);

        //窗口失去焦点就hide
        baidu.on(window, 'blur', suggestion.windowBlurHandler);
    });

    //初始化dom事件函数
    suggestion.documentMousedownHandler = suggestion.getDocumentMousedownHandler();
    suggestion.windowBlurHandler = suggestion.getWindowBlurHandler();

}).extend({
    event           : new Object,

    uiType          : "suggestion",
    onbeforepick    : new Function,
    onpick          : new Function,
    onconfirm       : new Function,
    onhighlight     : new Function,
    onshow          : new Function,
    onhide          : new Function,


    /*
     * 计算view的函数
     */
    //view            : new Function(),
   
    getData         : function(){return []},
    prependHTML     : "",
    appendHTML      : "",

    currentData     : {},

    tplDOM          : "<div id='#{0}' class='#{1}'></div>",
    tplPrependAppend: "<div id='#{0}' class='#{1}'>#{2}</div>",
    tplBody : "<table cellspacing='0' cellpadding='2'><tbody>#{0}</tbody></table>",
    tplRow : '<tr><td id="#{0}" onmouseover="#{2}" onmouseout="#{3}" onmousedown="#{4}" onclick="#{5}">#{1}</td></tr>',


    /*
     * 获得suggestion的外框HTML string
     * @private
     */
    getString : function(){
        var suggestion = this;
        return baidu.format(
            suggestion.tplDOM, 
                suggestion.getId(),
                suggestion.getClass(),
                suggestion.guid
        );
    },

    /**
     * 将suggestion渲染到dom树中
     */
    render : function(target){
        var suggestion = this,
            main;
        if(suggestion.getMain()){
            return ;
        }
        if(target.id){
            suggestion.targetId = target.id;
        }else{
            suggestion.targetId = target.id = suggestion.getId("input");
        }

        main = suggestion.renderMain();

        main.style.display =  'none';
        main.innerHTML = suggestion.getString();

        this.dispatchEvent("onload");
    },

    /**
     * 当前suggestion是否处于显示状态
     * @private
     */
    isShowing : function(){
        var suggestion = this,
            main = suggestion.getMain();
        return main && main.style.display != 'none';
    },

    /*
     * 把某个词放到input框中
     * @public
     */
    pick : function(index){
        var suggestion = this,
            currentData = suggestion.currentData,
            word = currentData && typeof index == 'number' && typeof currentData[index] != 'undefined' ?  currentData[index].value : index,
            eventData = {
                data : {
                    item    : word == index ? {value: index, content : index} : currentData[index],
                    index   : index
                }
            };
        if(suggestion.dispatchEvent("onbeforepick", eventData)){
            suggestion.dispatchEvent("onpick", eventData);
        }
    },

    /*
     * 绘制suggestion
     * @public
     * @param {string} word 触发sug的字符串
     * @param {object} data sug数据
     * @param {boolean} showEmpty optional 如果sug数据为空是否依然显示 默认为false
     *
     */
    show : function(word, data, showEmpty){
        var i = 0,
            len = data.length,
            suggestion = this;

        if(len == 0 && !showEmpty){
            suggestion.hide();
        } else {
            suggestion.currentData = [];
            for(; i<len; i++){
                if(typeof data[i].value != 'undefined'){
                    suggestion.currentData.push(data[i]);
                }else{
                    suggestion.currentData.push({
                        value        : data[i],
                        content     : data[i]
                    });
                }
            }
            suggestion.getBody().innerHTML = suggestion.getBodyString();
            suggestion.getMain().style.display = 'block';
            suggestion.dispatchEvent("onshow");
        }
    },

    /*
     * 高亮某个条目
     * @public
     */
    highlight : function(index){
        var suggestion = this;
        suggestion.clearHighlight();
        suggestion.getItem(index).className = suggestion.getClass("current");
        this.dispatchEvent("onhighlight", {
            data : this.getDataByIndex(index)
        });
    },

    /*
     * 隐藏suggestion
     * @public
     */
    hide : function(){
        var suggestion = this;
        //如果已经是隐藏状态就不用派发后面的事件了
        if(!suggestion.isShowing())
            return ;
        suggestion.getMain().style.display = 'none';
        suggestion.dispatchEvent("onhide");
    },

    /*
     * confirm指定的条目
     * @param {number|string} index or item
     * @param {string} source 事件来源
     * @public
     */
    confirm : function(index, source){
        var suggestion = this;
        
        suggestion.pick(index);
        suggestion.dispatchEvent("onconfirm", {
            data : suggestion.getDataByIndex(index),
            source : source
        });
        suggestion.hide();
    },

    /**
     * 根据index拿到传给event的data数据
     * @private
     */
    getDataByIndex : function(index){
        return {
                item    : this.currentData[index],
                index   : index
            };
    },

    /*
     * 获得target的值
     * @public
     */
    getTargetValue : function(){
        return this.getTarget().value;
    },

	/*
     * 获得当前处于高亮状态的词索引
     * @private
     */
	getHighlightIndex : function(){
        var suggestion = this,
            len = suggestion.currentData.length,
            i = 0;
		if(len && suggestion.isShowing()){
			for(; i<len; i++){
				if(suggestion.getItem(i).className == suggestion.getClass("current"))
                    return i;
			}
		}
        return -1;
	},

	/*
     * 清除suggestion中全部tr的蓝色背景样式
     * @private
     */
	clearHighlight : function(){
        var suggestion = this,
            i = 0,
            len = suggestion.currentData.length;
		for(; i < len; i++){
			suggestion.getItem(i).className = "";
		}
	},

    /*
     * 获得input框元素
     * @public
     */
    getTarget : function(){
        return baidu.g(this.targetId);
    },

    /*
     * 获得指定的条目
     * @private
     */
    getItem : function(index){
        return baidu.g(this.getId("item"+index));
    },

    /*
     * 渲染body部分的string
     * @private
     */
    getBodyString : function(){
        var suggestion = this,
            html = "",
            itemsHTML = [],
            data = suggestion.currentData,
            len = data.length,
            i = 0;

        function getPrependAppend(name){
            return baidu.format(
                suggestion.tplPrependAppend, 
                suggestion.getId(name),
                suggestion.getClass(name),
                suggestion[name+"HTML"]
            );
        }


        html += getPrependAppend("prepend");

		for(; i<len; i++){
            itemsHTML.push(baidu.format(
                suggestion.tplRow, 
                suggestion.getId('item'+i),
                data[i].content,
                suggestion.getCallString("itemOver", i),
                suggestion.getCallString("itemOut"),
                suggestion.getCallRef() + ".itemDown(event, "+i+")",
                suggestion.getCallString("itemClick", i)
            ));
		}

        html += baidu.format(suggestion.tplBody, itemsHTML.join(""));
        html += getPrependAppend("append");
        return html;
	},

    /*
     * 当每一个项目over、out、down、click时调用的函数
     * 高亮某个条目
     * @private
     */
    itemOver : function(index){
        this.highlight(index);
    },

    /*
     * @private
     */
    itemOut : function(){
        this.clearHighlight();
    },

    /*
     * @private
     */
    itemDown : function(e, index){
        this.dispatchEvent('onmousedownitem', {
            data : this.getDataByIndex(index)
        });
        if(!baidu.ie){
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    },

    /*
     * @private
     */
    itemClick : function(index){
        var suggestion = this;

        suggestion.dispatchEvent("onitemclick", {
            data : this.getDataByIndex(index)
        });
        suggestion.confirm(index, "mouse");
    },


    /*
     * 外部事件绑定
     * @private
     */
    getDocumentMousedownHandler : function (){
        var suggestion = this;
        return function(e){
        	// todo : baidu.event.getTarget();
            e = e || window.event;
            var element = e.target || e.srcElement,
                ui = baidu.ui.get(element);
            //如果在target上面或者suggestion内部
            if(element == suggestion.getTarget() || (ui && ui.uiType == suggestion.uiType)){
                return;
            }
            suggestion.hide();
        };
    },

    /*
     * @private
     */
    getWindowBlurHandler : function(){
        var suggestion = this;
        return function(){
            suggestion.hide();
        };
    },

    /**
     * 销毁suggesiton
     * @public
     */
    dispose : function(){
        var suggestion = this;
        suggestion.dispatchEvent("dispose");

        baidu.un(document, 'mousedown', suggestion.documentMousedownHandler);
        baidu.un(window, 'blur', suggestion.windowBlurHandler);
        baidu.dom.remove(suggestion.mainId);

        baidu.lang.Class.prototype.dispose.call(this);
    }
});
