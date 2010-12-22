/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/pager/Pager.js
 * author: wenyuxiang
 * version: 1.0.6
 * date: 2010/08/02
 */
///import baidu.ui.pager;
///import baidu.ui.createUI;
///import baidu.string.format;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.event.get;
///import baidu.object.each;
///import baidu.object.extend;
///import baidu.array.each;
/**
 * 生成分页功能
 * @param {Object} [options] 选项
 * @param {Number} [options.beginPage] 起始页
 * @param {Number} [options.endPage] 结束页
 * @param {Number} [options.currentPage] 当前页
 * @param {Number} [options.itemCount] 显示页数
 * @param {Number} [options.leftItemCount] 当前页左侧显示次数
 */
baidu.ui.pager.Pager = baidu.ui.createUI(function (options){
    this._init.apply(this, arguments);
}).extend({
    uiType: 'pager',
    id: 'pager',
    tplHref: '##{page}',
    tplLabel: '[#{page}]',
    specialLabelMap: {
        'first': '首页',
        'last': '尾页',
        'previous': '上一页',
        'next': '下一页'
    },
    tplCurrentLabel: '#{page}',
    tplItem: '<a class="#{class}" page="#{page}" target="_self" href="#{href}">#{label}</a>',
    //FIXME: 用#{onclick}形式绑定事件
    //#{onclick} {onclick: me.getCallRef() + ""}
    tplBody: '<div onclick="#{onclick}" id="#{id}" class="#{class}">#{items}</div>',
    beginPage: 1,
    endPage: 100,
    //当前页面
    //currentPage: undefined,
    itemCount: 10,
    leftItemCount: 4,
    /**
     * 初始化函数
     * @param options
     * @see baidu.ui.pager.Pager#update
     */
    _init: function (options){
        var me = this;
        me.update();
    },
    // 特殊链接请使用css控制隐藏和样式
    /**
     * 更新设置
     * @param options
     * @config beginPage {Number}
     * @config endPage {Number}
     * @config currentPage {Number} 跳转目标页的索引
     * @config itemCount {Number} 默认列出多少个a标签
     * @config leftItemCount {Function} 当前页的显示位置, 有默认实现
     */
    update: function (options){
        var me = this;
        options = options || {};
        if (me.checkOptions(options)) {
            //如果用户修改currentPage，则触发gotoPage事件. 如果事件处理函数取消了跳转，则不更新currentPage;
            if (options.hasOwnProperty('currentPage') && options.currentPage != me.currentPage) {
                if (!me._notifyGotoPage(options.currentPage, false)) {
                    delete options.currentPage;
                }
            }
            me._updateNoCheck(options);
            return true;
        }
        return false;
    },
    _updateNoCheck: function (options){
        var me = this;
        baidu.object.extend(me, options);
        if (me.getMain()) {
            me._refresh();
        }
    },
    /**
     * 检查参数是否出错
     * @param {Object} options
     */
    checkOptions: function (options){
        var me = this;
        var begin = options.beginPage || me.beginPage;
        var end = options.endPage || me.endPage;
        // TODO: trace信息
        if (end <= begin) {
            return false;
        }
        // TODO: 不应该放在这里
        if (options.hasOwnProperty('beginPage') && me.currentPage < begin) {
            me.currentPage = begin;
        }
        if (options.hasOwnProperty('endPage') && me.currentPage >= end) {
            me.currentPage = end - 1;
        }

        var current = options.currentPage || me.currentPage;
        if (current < begin || current >= end){
            return false;
        }
        return true;
    },
    /**
     * 构造链接的HTML
     * @param page {Number}
     * @param [spec] {String} first|last...
     * @private
     */
    _genItem: function (page, spec){
        var me = this;
        return baidu.string.format(me.tplItem, {
            "class": spec ? me.getClass(spec) : '',
            page: page,
            href: baidu.string.format(me.tplHref, {
                page: page
            }),
            label: function (){
                return ( spec
                  ? (spec == "current"
                       ? baidu.string.format(me.tplCurrentLabel, { page: page })
                       : me.specialLabelMap[spec]
                     )
                  : baidu.string.format(me.tplLabel, { page: page }) );
            }
        });
    },
    _genBody: function (){
        var me = this;
        var begin = me.beginPage;
        var end = me.endPage;
        var current = me.currentPage;
        // 处理范围小于显示数量的情况
        var numlist = Math.min(end - begin, me.itemCount);
        // 处理当前页面在范围的两端的情况
        var leftcnt = Math.min(current - begin, me.leftItemCount);
        leftcnt = Math.max(numlist - (end - current), leftcnt);
        var startPage = current - leftcnt;
        // 生成特殊链接
        var pageMap = {
            first: begin,
            last: end - 1,
            previous: current - 1,
            next: current + 1
        };
        var spec = {};
        baidu.object.each(pageMap, function (s, k){
            spec[k] = me._genItem(s, k);
        });
        spec.previous = pageMap.previous < begin ? '' : spec.previous;
        spec.next = pageMap.next >= end ? '' : spec.next;
        spec.first = startPage == begin ? '' : spec.first;
        spec.last = startPage + numlist >= end - 1 ? '' : spec.last;
        // 生成常规链接
        var buff = [];
        for (var i=0; i<numlist; i++) {
            var page = startPage + i;
            buff[i] = me._genItem(page, page == current ? "current" : null);
        }
        return baidu.string.format(me.tplBody, {
            id: me.getId(),
            "class": me.getClass(),
            items: spec.first + spec.previous + buff.join('') + spec.next + spec.last,
            onclick: me.getCallRef() + "._handleOnClick(event, this);"
        });
    },
    /**
     * 刷新界面
     * @private
     */
    _refresh: function (){
        var me = this;
        me.getMain().innerHTML = me.getString();
    },
    /**
     * 鼠标点击链接事件
     * @param evt
     */
    _handleOnClick: function (evt){
        evt = baidu.event.get(evt);
        var me = this,
            el = evt.target,
            page = Number(el.getAttribute('page'));
        // IE6 doesnot support Element#hasAttribute.
        // 无需checkOptions检查，因为能点到页码的都是正常值
        if (page && me._notifyGotoPage(page, true)) {
            me._updateNoCheck({ currentPage: page });
        } else {
            evt.preventDefault();
        }
    },
    _notifyGotoPage: function (page, fromClick){
        return this.dispatchEvent('ongotopage', { page: page, fromClick: fromClick });
    },
    /**
     * 跳转页面事件
     * 参数evt.page
     * 可以使用evt.returnValue = false来取消跳转
     * @param evt {Object} 将要跳转到的页面的索引
     * @event
     */
    ongotopage: function (evt){
        //evt.returnValue = false;
    },
    /**
     * 获取用于生成控件的HTML
     */
    getString: function (){
        var me = this;
        if (me.currentPage === undefined) {
            me.currentPage = me.beginPage;
        }
        return me._genBody();
    },
    render: function (container){
        var me = this;
        me.renderMain(container);
        me.getMain().innerHTML = me.getString();
        me.update();
        me.dispatchEvent('onload');
    },
    /**
     * 销毁控件
     */
    dispose: function (){
        var me = this;
        me.dispatchEvent('ondispose');
        if (me.getMain()) {
            var main = me.getMain();
            baidu.event.un(main, 'click', me._handleOnClick);
            if (main.parentNode && main.parentNode.nodeType == 1) {
                main.parentNode.removeChild(main);
            }
            me.dispose = null;
            main = null;
            baidu.lang.Class.prototype.dispose.call(me);
        } else {
            me.addEventListener('onload', function callee(){
                me.removeEventListener('onload', callee);
                me.dispose();
            });
        }
    }
});
