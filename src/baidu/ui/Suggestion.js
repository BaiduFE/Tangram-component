/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
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

///import baidu.ui.createUI;
///import baidu.ui.get;

/**
 * @class  Suggestion基类，建立一个Suggestion实例
 *
 * @author berg
 * @param  {Object}             options optional        选项参数.
 * @config {DOMElement}                 target          input框
 */

baidu.ui.Suggestion = baidu.ui.createUI(function(options) {
    var me = this;

    me.addEventListener('onload', function() {
        //监听suggestion外面的鼠标点击
        baidu.on(document, 'mousedown', me.documentMousedownHandler);

        //窗口失去焦点就hide
        baidu.on(window, 'blur', me.windowBlurHandler);
    });

    //初始化dom事件函数
    me.documentMousedownHandler = me.getDocumentMousedownHandler();
    me.windowBlurHandler = me.getWindowBlurHandler();

}).extend(
    /**
     *  @lends baidu.ui.Suggestion.prototype
     */    
{
    uiType: 'suggestion',
    onbeforepick: new Function,
    onpick: new Function,
    onconfirm: new Function,
    onhighlight: new Function,
    onshow: new Function,
    onhide: new Function,


    /*
     * 计算view的函数
     */
    //view            : new Function(),

    getData: function() {return []},
    prependHTML: '',
    appendHTML: '',

    currentData: {},

    tplDOM: "<div id='#{0}' class='#{1}'></div>",
    tplPrependAppend: "<div id='#{0}' class='#{1}'>#{2}</div>",
    tplBody: "<table cellspacing='0' cellpadding='2'><tbody>#{0}</tbody></table>",
    tplRow: '<tr><td id="#{0}" onmouseover="#{2}" onmouseout="#{3}" onmousedown="#{4}" onclick="#{5}">#{1}</td></tr>',

    /*
     * 获得suggestion的外框HTML string
     * @private
     */
    getString: function() {
        var me = this;
        return baidu.format(
            me.tplDOM,
            me.getId(),
            me.getClass(),
            me.guid
        );
    },

    /**
     * 将suggestion渲染到dom树中
     */
    render: function(target) {
        var me = this,
            main;
        if (me.getMain()) {
            return;
        }
        if (target.id) {
            me.targetId = target.id;
        }else {
            me.targetId = target.id = me.getId('input');
        }

        main = me.renderMain();

        main.style.display = 'none';
        main.innerHTML = me.getString();

        this.dispatchEvent('onload');
    },

    /**
     * 当前suggestion是否处于显示状态
     * @private
     */
    isShowing: function() {
        var me = this,
            main = me.getMain();
        return main && main.style.display != 'none';
    },

    /*
     * 把某个词放到input框中
     * @public
     */
    pick: function(index) {
        var me = this,
            currentData = me.currentData,
            word = currentData && typeof index == 'number' && typeof currentData[index] != 'undefined' ? currentData[index].value : index,
            eventData = {
                data: {
                    item: word == index ? {value: index, content: index} : currentData[index],
                    index: index
                }
            };
        
        if (me.dispatchEvent('onbeforepick', eventData)) {
            me.dispatchEvent('onpick', eventData);
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
    show: function(word, data, showEmpty) {
        
        var i = 0,
            len = data.length,
            me = this;

        if (len == 0 && !showEmpty) {
            me.hide();
        } else {
            me.currentData = [];
            for (; i < len; i++) {
                if (typeof data[i].value != 'undefined') {
                    me.currentData.push(data[i]);
                }else {
                    me.currentData.push({
                        value: data[i],
                        content: data[i]
                    });
                }
            }
            
            me.getBody().innerHTML = me.getBodyString();
            me.getMain().style.display = 'block';
            me.dispatchEvent('onshow');
        }
    },

    /*
     * 高亮某个条目
     * @public
     */
    highlight: function(index) {
        var me = this;
        
        me.clearHighlight();
        me.getItem(index).className = me.getClass('current');
        
        this.dispatchEvent('onhighlight', {
            data: this.getDataByIndex(index)
        });
    },

    /*
     * 隐藏suggestion
     * @public
     */
    hide: function() {
        
        var me = this;
        
        //如果已经是隐藏状态就不用派发后面的事件了
        if (!me.isShowing())
            return;
        
        me.getMain().style.display = 'none';
        me.dispatchEvent('onhide');
    },

    /*
     * confirm指定的条目
     * @param {number|string} index or item
     * @param {string} source 事件来源
     * @public
     */
    confirm: function(index, source) {
        
        var me = this;

        me.pick(index);
        me.dispatchEvent('onconfirm', {
            data: me.getDataByIndex(index) || index,
            source: source
        });
        me.hide();
    },

    /**
     * 根据index拿到传给event的data数据
     * @private
     */
    getDataByIndex: function(index) {
        
        return {
            item: this.currentData[index],
            index: index
        };
    },

    /*
     * 获得target的值
     * @public
     */
    getTargetValue: function() {
        return this.getTarget().value;
    },

    /*
     * 获得当前处于高亮状态的词索引
     * @private
     */
    getHighlightIndex: function() {
        
        var me = this,
            len = me.currentData.length,
            i = 0;
        
        if (len && me.isShowing()) {
            for (; i < len; i++) {
                if (me.getItem(i).className == me.getClass('current'))
                    return i;
            }
        }
        
        return -1;
    },

    /*
     * 清除suggestion中全部tr的蓝色背景样式
     * @private
     */
    clearHighlight: function() {
        
        var me = this,
            i = 0,
            len = me.currentData.length;
        
        for (; i < len; i++) {
            me.getItem(i).className = '';
        }
    },

    /*
     * 获得input框元素
     * @public
     */
    getTarget: function() {
        return baidu.g(this.targetId);
    },

    /*
     * 获得指定的条目
     * @private
     */
    getItem: function(index) {
        return baidu.g(this.getId('item' + index));
    },

    /*
     * 渲染body部分的string
     * @private
     */
    getBodyString: function() {
        
        var me = this,
            html = '',
            itemsHTML = [],
            data = me.currentData,
            len = data.length,
            i = 0;

        function getPrependAppend(name) {
            return baidu.format(
                me.tplPrependAppend,
                me.getId(name),
                me.getClass(name),
                me[name + 'HTML']
            );
        }


        html += getPrependAppend('prepend');

        for (; i < len; i++) {
            itemsHTML.push(baidu.format(
                me.tplRow,
                me.getId('item' + i),
                data[i].content,
                me.getCallString('itemOver', i),
                me.getCallString('itemOut'),
                me.getCallRef() + '.itemDown(event, ' + i + ')',
                me.getCallString('itemClick', i)
            ));
        }

        html += baidu.format(me.tplBody, itemsHTML.join(''));
        html += getPrependAppend('append');
        return html;
    },

    /*
     * 当每一个项目over、out、down、click时调用的函数
     * 高亮某个条目
     * @private
     */
    itemOver: function(index) {
        this.highlight(index);
    },

    /*
     * @private
     */
    itemOut: function() {
        this.clearHighlight();
    },

    /*
     * @private
     */
    itemDown: function(e, index) {
        this.dispatchEvent('onmousedownitem', {
            data: this.getDataByIndex(index)
        });
        if (!baidu.ie) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    },

    /*
     * @private
     */
    itemClick: function(index) {
        var me = this;

        me.dispatchEvent('onitemclick', {
            data: me.getDataByIndex(index)
        });
        me.confirm(index, 'mouse');
    },


    /*
     * 外部事件绑定
     * @private
     */
    getDocumentMousedownHandler: function() {
        var me = this;
        return function(e) {
            // todo : baidu.event.getTarget();
            e = e || window.event;
            var element = e.target || e.srcElement,
                ui = baidu.ui.get(element);
            //如果在target上面或者me内部
            if (element == me.getTarget() || (ui && ui.uiType == me.uiType)) {
                return;
            }
            me.hide();
        };
    },

    /*
     * @private
     */
    getWindowBlurHandler: function() {
        var me = this;
        return function() {
            me.hide();
        };
    },

    /**
     * 销毁suggesiton
     * @public
     */
    dispose: function() {
        var me = this;
        me.dispatchEvent('dispose');

        baidu.un(document, 'mousedown', me.documentMousedownHandler);
        baidu.un(window, 'blur', me.windowBlurHandler);
        baidu.dom.remove(me.mainId);

        baidu.lang.Class.prototype.dispose.call(this);
    }
});
