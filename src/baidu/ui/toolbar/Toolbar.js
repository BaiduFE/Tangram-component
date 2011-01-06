/**
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/toolBar/ToolBar.js
 * @author lixiaopeng
 * @version 1.0.0
 * date: 2010/11/28
 * */

///import baidu.ui.toolbar._Item;

///import baidu.object.extend;
///import baidu.string.format;
///import baidu.dom.getStyle;
///import baidu.dom._styleFilter.px;
///import baidu.dom.insertHTML;
///import baidu.dom.g;
///import baidu.array.each;
///import baidu.ui.createUI;

/**
 * toolBar基类，建立toolBar实例
 * @constructor
 * @param {Object}              config config参数.
 * @param {String}              [config.title=""]                   toolbar的title参数，默认为空.
 * @param {String}              [config.name="ToolBar_item_xxx"]    name参数，每个toolbar对象都有一个name参数.
 * @param {String}              [config.direction="horizontal"]     {"vertical"|"horizontal"} toolbar只能在横向和纵向之间进行选择，默认为横向，及"horizontal".
 * @param {String}              [config.position="left" | "top"]     当direction为horizontal时，默认值为left;当direction为vertical时,默认值为top.
 * @param {String|Number}       [config.width]                      宽度.
 * @param {String|Number}       [config.height]                     高度.
 * @param {String|HTMLElement}  [config.container=document.body]    实例容器.
 * @param {Object[]}            [config.items]                      创建ui的JSON.
 * @param {String}              [config.items.type="button"]ui控件类型
 *                                                                  目前支持的type值为:button,combox,menu,toolbar,separator,spacer.
 * @param {Object}              [options.items.XXX]                 创建ui控件所需要的config参数.
 * */
baidu.ui.toolbar.Toolbar = baidu.ui.createUI(function(options) {
    var me = this,
        positionArray,
        align = ['left', 'right', 'center', 'justify', 'inherit'],
        valign = ['top', 'middle', 'bottom', 'baseline'],
        positionCheck = false,
        positionPrefix = "align='";

    positionArray = align;


    /**
     * 自身Item的集合
     * @private
     * @example
     * {"cutButton":uiInstance}
     * */
    me._itemObject = {};

    me.items = me.items || {};

    /**position默认值设定及参数检查*/
    if (me.direction != 'horizontal') {
        me.direction = 'vertical';
        positionArray = valign;
    }
    baidu.each(positionArray, function(item,key) {
        if (item == me.position) {
            positionCheck = true;
            return false;
        }
    });
    !positionCheck && (me.position = positionArray[0]);
    me._positionStr = positionPrefix + me.position + "'";

}).extend({

    /**
     * item容器,默认为document.body
     * @public
     * */
    container: document.body,

    /**
     * title
     * @property
     * */
    title: '',

    /**
     * direction
     * @property
     * */
    direction: 'horizontal',

    /**
     * position
     * @property
     * */
    position: 'left',

    /**
     * tplMain
     * @property
     * */
    tplMain: '<div id="#{mainId}" class="#{mainClass}" onmousedown="javascript:return false;">' +
            '#{title}' +
            '<div id="#{mainInner}" class="#{mainInnerClass}">' +
                '<table cellpadding="0" cellspacing="0" style="width:100%; height:100%" id="#{tableId}">' +
                    '<tr><td style="width:100%; height:100%" #{position}>' +
                        '<table cellpadding="0" cellspacing="0" id="#{tableInnerId}">#{content}</table>' +
                    '</td></tr>' +
                '</table>' +
            '</div>' +
            '</div>',

    /**
     * tplTitle
     * @property
     * */
    tplTitle: '<div id="#{titleId}" class="#{titleClass}"><div id="#{titleInnerId}" class="#{titleInnerClass}">#{title}</div></div>',

    /**
     * uiType
     * @property
     * */
    uiType: 'toolbar-toolbar',

    /**
     * 返回toolbar的html字符串
     * @private
     * @return {String} HTMLString.
     * */
    getString: function() {
        var me = this;

        return baidu.format(me.tplMain, {
            'mainId' : me.getId('main'),
            'mainClass' : me.getClass('main'),
            'mainInner' : me.getClass('mianInner'),
            'mainInnerClass' : me.getClass('main-inner'),
            'title' : me.title === '' ? '' : baidu.format(me.tplTitle, {
                                                    'titleId' : me.getId('title'),
                                                    'titleClass' : me.getClass('title'),
                                                    'titleInnerId' : me.getId('titleInner'),
                                                    'titleInnerClass' : me.getClass('title-inner'),
                                                    'title' : me.title
                                                }),
            'tableId' : me.getId('table'),
            'position' : me._positionStr,
            'tableInnerId' : me.getId('tableInner'),
            'content' : me.direction == 'horizontal' 
                            ? '<tr>' + me._createCell(me.items.length, 'str') + '</tr>' 
                            : me._createCell(me.items.length, 'str')
        });
    },

    /**
     * 绘制toolbar
     * @private
     * @param {String|HTMLElement}  [container=this.container] toolBar容器.
     * @return void.
     * */
    render: function(container) {
        var me = this, main;
        me.container = container = baidu.g(container || me.container);

        baidu.insertHTML(me.renderMain(container), 'beforeEnd', me.getString());

        main = baidu.g(me.getId('main'));
        me.width && baidu.setStyle(main, 'width', me.width);
        me.height && baidu.setStyle(main, 'height', me.height);

        //创建item
        me._createItems();
    },

    /**
     * 创建item
     * @private
     * @return void.
     * */
    _createItems: function() {
        var me = this,
            container = baidu.g(me.getId('tableInner')),
            tdCollection = [];

        baidu.each(container.rows, function(tr,tr_index) {
            baidu.each(tr.cells, function(td,td_index) {
                tdCollection.push(td);
            });
        });

        baidu.each(me.items, function(item,i) {
            me.add(item, tdCollection[i]);
        });
    },

    /**
     * 使用传入config的方式添加ui组件到toolBar
     * @param {Object} options ui控件的config参数，格式参照构造函数options.items.
     * @param {HTMLElement} [container] ui控件的container,若没有container参数，则会自动根据当前toolbar的显示规则在最后创建container.
     * @return {ui} uiInstance 创建好的ui对象.
     * */
    add: function(options,container) {
        var me = this,
            uiInstance = null,
            defaultOptions = {
                type: 'button',
                config: {}
            },
            uiNS = null, ns;

        if (!options)
            return;

        /**检查默认参数*/
        options = baidu.extend(defaultOptions, options);
        options.config.statable = true;
        options.type = options.type.toLowerCase();

        //TODO:等baidu.ui.create修改完毕后替换掉
        ns = options.type.split('-');
        if (ns.length == 1) {
            ns = ns.shift();
            uiNS = baidu.ui[ns][ns.charAt(0).toUpperCase() + ns.slice(1)];
        }else {
            uiNS = baidu.ui[ns.shift()];
            baidu.each(ns, function(item) {
                ns.length == 1 && (item = item.charAt(0).toUpperCase() + item.slice(1));
                uiNS = uiNS[item];
            });
        }
        uiNS && (uiInstance = baidu.ui.create(uiNS, options.config));
        me.addRaw(uiInstance, container);

        return uiInstance;
    },

    /**
     * 直接向toolbar中添加已经创建好的uiInstance
     * @public
     * @param {Object} uiInstance
     * @param {HTMLElement} container
     * @return void.
     * */
    addRaw: function(uiInstance,container) {
        var me = this;

        if (!uiInstance)
            return;

        baidu.extend(uiInstance, baidu.ui.toolbar._itemBehavior);
        uiInstance.setName(uiInstance.name);

        if (!container) {
            container = me._createCell(1, 'html')[0];
        }

        uiInstance.render(container);
        me._itemObject[uiInstance.getName()] = uiInstance;
    },

    /**
     * 根据当前toolbar规则，创建tableCell
     * @private
     * @param {Number} num 创建cell的数量.
     * @param {String} [type="str"] str|html.
     * @return {String|HTMLElement} cell.
     * */
    _createCell: function(num,type) {
        var me = this,
            td,
            cells = [],
            container,
            i;
        type == 'str' || (type = 'html');

        if (type == 'str') {
            if (me.direction == 'horizontal') {
                for (i = 0; i < num; i++) {
                    cells.push("<td id='" + me.getId('cell-' + i) + "' valign='middle'></td>");
                }
            }else {
                for (i = 0; i < num; i++) {
                    cells.push("<tr><td id='" + me.getId('cell-' + i) + "' valign='middle'></td></tr>");
                }
            }
            cells = cells.join('');
        }else {
            container = baidu.g(me.getId('tableInner'));
            containerTR = container.row[0];
            if (me.direction == 'horizontal') {
                for (i = 0; i < num; i++) {
                    td = container.insertCell(containerTR.cells.length);
                    td.id = me.getId('cell-' + i);
                    td.valign = 'middle';
                    cells.push(td);
                }
            }else {
                for (i = 0; i < num; i++) {
                    td = container.insertRow(container.rows.length);
                    td = td.insertCell(0);
                    td.id = me.getId('cell-' + i);
                    td.valign = 'middle';
                }
            }
        }

        return cells;
    },

    /**
     * 删除控件
     * @param   {String} name 需要删除的控件的标识符.
     * @return void.
     * */
    remove: function(name) {
        var me = this, item;
        if (!name) return;
        if (item = me._itemObject[name]) {
            item.dispose();
        }
    },

    /**
     * 删除所有ui控件
     * @return void.
     * */
    removeAll: function() {
        var me = this;
        baidu.object.each(me._itemObject, function(item,key) {
           item.dispose();
        });
    },

    /**
     * enable ui组件，当不传入name时，enable所有ui组件到
     * @private
     * @param {String} [name] ui组件唯一标识符.
     * */
    _enable: function(name) {
        var me = this, item;

        if (!name) {
            me.enableAll();
        }else if (item = me._itemObject[name]) {
            item.enable();
        }
    },

    /**
     * disable ui组件，当不传入name时，disable所有ui组建
     * @private
     * @param {String} [name] ui组件唯一标识符.
     * */
    _disable: function(name) {
        var me = this, item;

        if (!name) {
            me.disableAll();
        }else if (item = me._itemObject[name]) {
            item.disable();
        }
    },

    /**
     * 激活toolbar中所有的item
     * @return void.
     * */
    enableAll: function() {
        var me = this;
        baidu.object.each(me._itemObject, function(item,key) {
            item.enable();
        });
    },

    /**
     * 禁用toolbar中所有的item
     * @return void.
     * */
    disableAll: function() {
        var me = this;
        baidu.object.each(me._itemObject, function(item,key) {
            item.disable();
        });
    },

    /**
     * 通过name获取ui组件
     * @param {String} name ui组件唯一标识符.
     * @return {UI} 返回查找到的item.
     * */
    getItemByName: function(name) {
        var me = this, item = me._itemObject[name];
        if (!item) {
            baidu.object.each(me._itemObject, function(i,k) {
                i.getItemByName && (item = i.getItemByName(name));
                if (item) {
                    return false;
                }
            });
        }

        return item;
    }
});
