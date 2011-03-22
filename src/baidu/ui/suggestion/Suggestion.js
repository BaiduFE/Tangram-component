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

///import baidu.ui.suggestion;
///import baidu.ui.createUI;
///import baidu.ui.get;

 /**
 * suggestion，提供输入推荐功能。
 * @class
 * @param      {Object}                 [options]          选项.
 * @config     {Function}               onshow             当显示时触发。
 * @config     {Function}               onhide             当隐藏时触发，input或者整个window失去焦点，或者confirm以后会自动隐藏。
 * @config     {Function}               onconfirm          当确认条目时触发，回车后，或者在条目上按鼠标会触发确认操作。参数是event对象，其中有data属性，包括item和index值。item为当前确认的条目，index是条目索引。。
 * @config     {Function}               onbeforepick       使用方向键选中某一行，鼠标点击前触发。
 * @config     {Function}               onpick             使用方向键选中某一行，鼠标点击时触发。参数是event对象，其中有data属性，包括item和index值。item为当前确认的条目，index是条目索引。
 * @config     {Function}               onhighlight        当高亮时触发，使用方向键移过某一行，使用鼠标滑过某一行时会触发高亮。参数是event对象，其中有data属性，包括item和index值。item为当前确认的条目，index是条目索引。
 * @config     {Function}               view               重新定位时，会调用这个方法来获取新的位置，传入的参数中会包括top、 left、width三个值。
 * @config     {Function}               getData            在需要获取数据的时候会调用此函数来获取数据，传入的参数word是用户在input中输入的数据。
 * @config     {String}                 prependHTML        写在下拉框列表前面的html
 * @config     {String}                 appendHTML         写在下拉框列表后面的html
 */

baidu.ui.suggestion.Suggestion = baidu.ui.createUI(function(options) {
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

}).extend({
    event: new Object,

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
    /**
     * @private
     */
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
     * @public
     * @param     {String|HTMLElement}   target     将渲染到的元素或元素id.
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

    /**
     * 把某个词放到input框中
     * @public
     * @param     {String}    index    条目索引.
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

    /**
     * 绘制suggestion
     * @public
     * @param {String}  word               触发sug的字符串.
     * @param {Object}  data               suggestion数据.
     * @param {Boolean} showEmpty optional 如果sug数据为空是否依然显示 默认为false.
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

    /**
     * 高亮某个条目
     * @public
     * @param    {String}   index    条目索引.
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

    /**
     * confirm指定的条目
     * @public
     * @param {number|string} index or item.
     * @param {string} source 事件来源.
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

    /**
     * 获得input框元素
     * @public
     * @return {HTMLElement}   input    输入框元素.
     */
    getTarget: function() {
        return baidu.g(this.targetId);
    },

    /*
     * 获得指定的条目
     * @private
     */
    getItem: function(index) {
        return baidu.g(this.getId('item'+ index));
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
                me.getCallRef() + '.itemDown(event, '+ i + ')',
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
            //如果在target上面或者suggestion内部
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
