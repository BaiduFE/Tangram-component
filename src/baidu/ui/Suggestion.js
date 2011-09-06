/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * update 2011.08.23 by zhaochengyang 'add holdHighLight option'
 */

///import baidu.dom.g;
///import baidu.dom.getPosition;
///import baidu.dom.remove;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.hasClass;

///import baidu.event.stop;
///import baidu.event.preventDefault;

///import baidu.array.each;
///import baidu.array.contains;
///import baidu.array.indexOf;

///import baidu.string.format;
///import baidu.object.extend;
///import baidu.browser.ie;

///import baidu.lang.Event;

///import baidu.ui.createUI;
///import baidu.ui.get;

/**
 * Suggestion基类，建立一个Suggestion实例
 * @class
 * @grammar new baidu.ui.Suggestion(options)
 * @param  {Object}   [options]        选项.
 * @config {Function} onshow           当显示时触发。
 * @config {Function} onhide           当隐藏时触发，input或者整个window失去焦点，或者confirm以后会自动隐藏。
 * @config {Function} onconfirm        当确认条目时触发，回车后，或者在条目上按鼠标会触发确认操作。参数是event对象，其中有data属性，包括item和index值。item为当前确认的条目，index是条目索引。。
 * @config {Function} onbeforepick     使用方向键选中某一行，鼠标点击前触发。
 * @config {Function} onpick           使用方向键选中某一行，鼠标点击时触发。参数是event对象，其中有data属性，包括item和index值。item为当前确认的条目，index是条目索引。
 * @config {Function} onhighlight      当高亮时触发，使用方向键移过某一行，使用鼠标滑过某一行时会触发高亮。参数是event对象，其中有data属性，包括item和index值。item为当前确认的条目，index是条目索引。
 * @config {Function} onload
 * @config {Function} onmouseoveritem
 * @config {Function} onmouseoutitem
 * @config {Function} onmousedownitem
 * @config {Function} onitemclick
 * @config {Function} view             重新定位时，会调用这个方法来获取新的位置，传入的参数中会包括top、 left、width三个值。
 * @config {Function} getData          在需要获取数据的时候会调用此函数来获取数据，传入的参数word是用户在input中输入的数据。
 * @config {String}   prependHTML      写在下拉框列表前面的html
 * @config {String}   appendHTML       写在下拉框列表后面的html
 * @config {Boolean}  holdHighLight    鼠标移出待选项区域后，是否保持高亮元素的状态
 */
baidu.ui.Suggestion = baidu.ui.createUI(function(options) {
    var me = this;

    me.addEventListener('onload', function() {
        //监听suggestion外面的鼠标点击
        me.on(document, 'mousedown', me.documentMousedownHandler);

        //窗口失去焦点就hide
        me.on(window, 'blur', me.windowBlurHandler);
    });

    //初始化dom事件函数
    me.documentMousedownHandler = me._getDocumentMousedownHandler();
    me.windowBlurHandler = me._getWindowBlurHandler();

    //value为在data中的value
    me.enableIndex = [];
    //这个index指的是当前高亮条目在enableIndex中的index而非真正在data中的index
    me.currentIndex = -1;

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

    /**
     * @private
     */
    getData: function() {return []},
    prependHTML: '',
    appendHTML: '',

    currentData: {},

    tplDOM: "<div id='#{0}' class='#{1}' style='position:relative; top:0px; left:0px'></div>",
    tplPrependAppend: "<div id='#{0}' class='#{1}'>#{2}</div>",
    tplBody: '<table cellspacing="0" cellpadding="2"><tbody>#{0}</tbody></table>',
    tplRow: '<tr><td id="#{0}" onmouseover="#{2}" onmouseout="#{3}" onmousedown="#{4}" onclick="#{5}" class="#{6}">#{1}</td></tr>',

    /**
     * 获得suggestion的外框HTML string
     * @private
     * @return {String}
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
     * @param {HTMLElement} target
     * @return {Null}
     */
    render: function(target) {
        var me = this,
            main,
            target = baidu.g(target);

        if (me.getMain() || !target) {
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
     * @return {Boolean}
     */
    _isShowing: function() {
        var me = this,
            main = me.getMain();
        return main && main.style.display != 'none';
    },

    /**
     * 把某个词放到input框中
     * @public
     * @param {String} index 条目索引.
     * @return {Null}
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
     * @param {String}  word 触发sug的字符串.
     * @param {Object}  data suggestion数据.
     * @param {Boolean} [showEmpty] 如果sug数据为空是否依然显示 默认为false.
     * @return {Null}
     */
    show: function(word, data, showEmpty) {
        var i = 0,
            len = data.length,
            me = this;

        me.enableIndex = [];
        me.currentIndex = -1;

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
                if (typeof data[i]['disable'] == 'undefined' || data[i]['disable'] == false) {
                    me.enableIndex.push(i);
                }
            }

            me.getBody().innerHTML = me._getBodyString();
            me.getMain().style.display = 'block';
            me.dispatchEvent('onshow');
        }
    },

    /**
     * 隐藏suggestion
     * @public
     * @return {Null}
     */
    hide: function() {
        var me = this;

        //如果已经是隐藏状态就不用派发后面的事件了
        if (!me._isShowing())
            return;
        
        //如果当前有选中的条目，将其放到input中
        if(me.currentIndex >= 0 && me.holdHighLight){
            console.log(me.currentIndex);
            console.log(me.currentData);
            var currentData = me.currentData,
                j = -1;
            for(var i=0, len=currentData.length; i<len; i++){
                if(typeof currentData[i].disable == 'undefined' || currentData[i].disable == false){
                    j++;
                    console.log(j +  "    " + i);
                    if(j == me.currentIndex)
                        me.pick(i);
                }
            }
        }
        
        me.getMain().style.display = 'none';
        me.dispatchEvent('onhide');
    },

    /**
     * 高亮某个条目
     * @public
     * @param {String} index 条目索引.
     * @return {Null}
     */
    highLight: function(index) {
        var me = this,
            enableIndex = me.enableIndex,
            item = null;

        //若需要高亮的item被设置了disable，则直接返回
        if (!me._isEnable(index)) return;

        me.currentIndex >= 0 && me._clearHighLight();
        item = me._getItem(index);
        baidu.addClass(item, me.getClass('current'));
        me.currentIndex = baidu.array.indexOf(enableIndex, index);

        me.dispatchEvent('onhighlight', {
            index: index,
            data: me.getDataByIndex(index)
        });
    },

    /**
     * 清除item高亮状态
     * @public
     * @return {Null}
     */
    clearHighLight: function() {
        var me = this,
            currentIndex = me.currentIndex,
            index = me.enableIndex[currentIndex];

        //若当前没有元素处于高亮状态，则不发出事件
        me._clearHighLight() && me.dispatchEvent('onclearhighlight', {
            index: index,
            data: me.getDataByIndex(index)
        });
    },

    /**
     * 清除suggestion中tr的背景样式
     * @private
     * @return {Boolean} bool 当前有item处于高亮状态并成功进行clear highlight,返回true，否则返回false.
     */
    _clearHighLight: function() {
        var me = this,
            currentIndex = me.currentIndex,
            enableIndex = me.enableIndex,
            item = null;

        if (currentIndex >= 0) {
            item = me._getItem(enableIndex[currentIndex]);
            baidu.removeClass(item, me.getClass('current'));
            me.currentIndex = -1;
            return true;
        }
        return false;
    },

    /**
     * confirm指定的条目
     * @public
     * @param {Number|String} index or item.
     * @param {String} source 事件来源.
     * @return {Null}
     */
    confirm: function(index, source) {
        var me = this;

        if (source != 'keyboard') {
            if (!me._isEnable(index)) return;
        }

        me.pick(index);
        me.dispatchEvent('onconfirm', {
            data: me.getDataByIndex(index) || index,
            source: source
        });
        me.currentIndex = -1;
        me.hide();
    },

    /**
     * 根据index拿到传给event的data数据
     * @private
     * @return {Object}
     * @config {HTMLElement} item
     * @config {Number} index
     */
    getDataByIndex: function(index) {

        return {
            item: this.currentData[index],
            index: index
        };
    },

    /**
     * 获得target的值
     * @public
     * @return {String}
     */
    getTargetValue: function() {
        return this.getTarget().value;
    },

    /**
     * 获得input框元素
     * @public
     * @return {HTMLElement}
     */
    getTarget: function() {
        return baidu.g(this.targetId);
    },

    /**
     * 获得指定的条目
     * @private
     * @return {HTMLElement}
     */
    _getItem: function(index) {
        return baidu.g(this.getId('item' + index));
    },

    /**
     * 渲染body部分的string
     * @private
     * @return {String}
     */
    _getBodyString: function() {

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
                me.getCallRef() + '._itemOver(event, ' + i + ')',
                me.getCallRef() + '._itemOut(event, ' + i + ')',
                me.getCallRef() + '._itemDown(event, ' + i + ')',
                me.getCallRef() + '._itemClick(event, ' + i + ')',
                (typeof data[i]['disable'] == 'undefined' || data[i]['disable'] == false) ? '' : me.getClass('disable')
            ));
        }

        html += baidu.format(
            me.tplBody, 
            itemsHTML.join('')
        );
        html += getPrependAppend('append');
        return html;
    },

    /**
     * 当焦点通过鼠标或键盘移动到某个条目
     * @private
     * @param {Event} e
     * @param {Number} index
     * @return {Null}
     */
    _itemOver: function(e, index) {
        var me = this;
        baidu.event.stop(e || window.event);
        me._isEnable(index) && me.highLight(index);

        me.dispatchEvent('onmouseoveritem', {
            index: index,
            data: me.getDataByIndex(index)
        });
    },

    /**
     * 当焦点通过鼠标或键盘移出某个条目
     * @private
     * @param {Event} e
     * @param {Number} index
     * @return {Null}
     */
    _itemOut: function(e, index) {
        var me = this;
        baidu.event.stop(e || window.event);
        if(!me.holdHighLight)
            me._isEnable(index) && me.clearHighLight();

        me.dispatchEvent('onmouseoutitem', {
            index: index,
            data: me.getDataByIndex(index)
        });
    },

    /**
     * 当通过鼠标选中某个条目
     * @private
     * @param {Event} e
     * @param {Number} index
     * @return {Null}
     */
    _itemDown: function(e, index) {
        var me = this;
        baidu.event.stop(e || window.event);

        me.dispatchEvent('onmousedownitem', {
            index: index,
            data: me.getDataByIndex(index)
        });
    },

    /**
     * 当鼠标点击某个条目
     * @private
     * @param {Event} e
     * @param {Number} index
     * @return {Null}
     */
    _itemClick: function(e, index) {
        var me = this;
        baidu.event.stop(e || window.event);

        me.dispatchEvent('onitemclick', {
            index: index,
            data: me.getDataByIndex(index)
        });

        me._isEnable(index) && me.confirm(index, 'mouse');
    },

    /**
     * 判断item是否处于enable状态
     * @param {Number} index 索引，和传入的data中相同.
     * @return {Boolean}
     */
    _isEnable: function(index) {
        var me = this;
        return baidu.array.contains(me.enableIndex, index);
    },

    /**
     * 外部事件绑定
     * @private
     * @return {Function}
     */
    _getDocumentMousedownHandler: function() {
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

    /**
     * 外部事件绑定
     * @private
     * @return {Function}
     */
    _getWindowBlurHandler: function() {
        var me = this;
        return function() {
            me.hide();
        };
    },

    /**
     * 销毁suggesiton
     * @public
     * @return {Null}
     */
    dispose: function() {
        var me = this;
        me.dispatchEvent('dispose');

        baidu.dom.remove(me.mainId);

        baidu.lang.Class.prototype.dispose.call(this);
    }
});
