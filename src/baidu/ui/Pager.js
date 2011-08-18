/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/Pager.js
 * author: wenyuxiang
 * version: 1.0.6
 * date: 2010/08/02
 */
///import baidu.ui.createUI;
///import baidu.string.format;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.event.get;
///import baidu.object.each;
///import baidu.object.extend;
///import baidu.array.each;

 /**
 * 生成分页功能，默认会有一个横向的页面跳转链接列表，其两端有首页，尾页，上一页，下一页。若要自定义样式（如隐藏某些部件），请使用css（注：控件中各部件的css类名都有控件的tangram类名前缀）首页：first，尾页：last，上一页：previous，下一页：next，当前页：current。若要自定义控件生成的HTML，请参考源代码中以tpl开头的模板属性，类中的属性和方法都可以通过options动态覆盖。
 * @class
 * @grammar new baidu.ui.Pager(option)
 * @param     {Object}            [options]         更新选项，若选项值不符合规则，则此次更新不予更新任何选项
 * @config    {Number}            beginPage         页码范围：起始页码，默认值1。
 * @config    {Number}            endPage           页码范围：最后页码+1，必须大于起始页码，默认值100。
 * @config    {Number}            currentPage       必须在页码范围内，若未指定currentPage且当前页码已超出页码范围，则会自动将currentPage更新到beginPage。
 * @config    {Number}            itemCount         默认显示多少个页面的链接（不包括“首页”等特殊链接），默认值10。
 * @config    {Number}            leftItemCount     当前页面链接在页面链接列表中的默认位置，必须小于itemCount，默认值4。
 * @config    {Object}            specialLabelMap   设置首页，上一页，下一页链接显示的内容。默认为{first:'首页',next:'下一页',previous:'上一页'}
 * @config    {String}            tplHref           链接显示样式，默认为"##{page}"
 * @config    {String}            tplLabel          页码显示样式，默认为"[#{page}]"
 * @config    {String}            tplCurrentLabel   选中页码的显示样式
 */
baidu.ui.Pager = baidu.ui.createUI(function (options){
    this._init.apply(this, arguments);
}).extend(
    /**
     *  @lends baidu.ui.Pager.prototype
     */
{
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
	 * @public 
     * @param      {Object}     options          更新设置
     * @config     {Number}     beginPage        开始页
     * @config     {Number}     endPage          结束页
     * @config     {Number}     currentPage      跳转目标页的索引
     * @config     {Number}     itemCount        默认列出多少个a标签
     * @config     {Function}   leftItemCount    当前页的显示位置, 有默认实现
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
     * @private
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
     * @private
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
    /**
     * @private
     */
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
     * @private
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
     * 跳转页面事件  参数evt.page 可以使用evt.returnValue = false来取消跳转
     * @private
     * @param evt {Object} 将要跳转到的页面的索引
     * @event
     */
    ongotopage: function (evt){
        //evt.returnValue = false;
    },
    /**
     * 获取用于生成控件的HTML
     * @private
     */
    getString: function (){
        var me = this;
        if (me.currentPage === undefined) {
            me.currentPage = me.beginPage;
        }
        return me._genBody();
    },
    /**
     * 将控件渲染到目标元素
     * @public
     * @param    {String|HTMLElement}    container     目标元素或元素id
     */
    render: function (container){
        var me = this;
        me.renderMain(container);
        me.getMain().innerHTML = me.getString();
        me.update();
        me.dispatchEvent('onload');
    },
    /**
     * 销毁控件
	 * @public
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
