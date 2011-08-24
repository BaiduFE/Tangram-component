/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */
///import baidu.ui.ScrollBar;
///import baidu.ui.ScrollBar.ScrollBar$container;
///import baidu.dom.g;
///import baidu.dom.insertHTML;
///import baidu.string.format;
///import baidu.dom._styleFixer.float;
///import baidu.dom.remove;

/**
 * 创建一个panel来作为滚动条的容器
 * @class ScrollPanel基类
 * @grammar new baidu.ui.ScrollPanel(options)
 * @param   {Object}                options config参数.
 * @config  {String}                overflow 取值'overflow-y':创建竖向滚动, 'overflow-x':创建横向滚动条, 'auto':创建滚动条(默认)
 * @config  {String|HTMLElement}    container 需要被滚动条管理的容器对象
 * @author linlingyu
 */
baidu.ui.ScrollPanel = baidu.ui.createUI(function(options) {

}).extend(
/**
 *  @lends baidu.ui.ScrollPanel.prototype
 */
{
    uiType: 'scrollpanel',
    tplDOM: '<div id="#{id}" class="#{class}">#{body}</div>',
    overflow: 'auto',
    _scrollBarSize: 0,//滚动条尺寸
    _yVisible: false,//用来标示竖向滚动条的隐藏显示状态
    _xVisible: false,//用来标示横向滚动条的隐藏显示状态
    _axis: {
        y: {
            size: 'height',
            unSize: 'width',
            unScrollSize: 'scrollWidth',
            unClientSize: 'clientWidth',
            offsetSize: 'offsetHeight'
        },
        x: {
            size: 'width',
            unSize: 'height',
            unScrollSize: 'scrollHeight',
            unClientSize: 'clientHeight',
            offsetSize: 'offsetWidth'
        }
    },

    /**
     * 取得panel所需要body字符串
     * @private
     */
    getString: function() {
        var me = this,
            str = baidu.string.format(me.tplDOM, {
                id: me.getId('panel'),
                'class': me.getClass('panel')
            });
        str = baidu.string.format(me.tplDOM, {
            id: me.getId(),
            'class': me.getClass(),
            body: str
        });
        return baidu.string.format(me.tplDOM, {
            id: me.getId('main'),
            'class': me.getClass('main'),
            body: str
        });
    },

    /**
     * 渲染ScrollPanel到页面中
     * @param {String|HTMLElement} target ScrollPanel依附于target来渲染.
     */
    render: function(target) {
        var me = this;
        me.target = target;
        if (!target || me.getMain()) {return;}
        baidu.dom.insertHTML(me.getTarget(), 'afterEnd', me.getString());
        me.renderMain(me.getId('main'));
        me._renderUI();
    },

    /**
     * 根据参数渲染ScrollBar到容器中
     * @private
     */
    _renderUI: function() {
        var me = this,
            main = me.getMain(),
            panel = me.getPanel(),
            target = me.getTarget(),
            skin = me.skin || '';
        main.style.width = target.offsetWidth + 'px';
        main.style.height = target.offsetHeight + 'px';
        panel.appendChild(target);
        function getScrollbar(pos) {
            var track = me.getId('overflow-' + pos),
                axis = me._axis[pos],
                panel = me.getPanel(),
                bar;
            baidu.dom.insertHTML(panel,
                (pos == 'y' ? 'afterEnd' : 'beforeEnd'),
                baidu.string.format(me.tplDOM, {
                    id: track,
                    'class': me.getClass('overflow-' + pos)
                }));
            track = baidu.dom.g(track);
            if ('y' == pos) {

                baidu.dom.setStyle(panel, 'float', 'left');
                baidu.dom.setStyle(track, 'float', 'left');
            }
            //
            me['_' + pos + 'Visible'] = true;
            bar = me['_' + pos + 'Scrollbar'] = new baidu.ui.ScrollBar({
                skin: skin + 'scrollbar' + '-' + pos,
                orientation: pos == 'y' ? 'vertical' : 'horizontal',
                container: me.container,
                element: track,
                autoRender: true
            });
            track.style[axis.unSize] = bar.getSize()[axis.unSize] + 'px';
            me._scrollBarSize = bar.getSize()[axis.unSize];
            bar.setVisible(false);
        }
        if (me.overflow == 'overflow-y'
            || me.overflow == 'auto') {
            getScrollbar('y');
        }
        if (me.overflow == 'overflow-x'
            || me.overflow == 'auto') {
            getScrollbar('x');
        }
        me._smartVisible();
    },

    /**
     * 根据内容智能运算容器是需要显示滚动条还是隐藏滚动条
     * @private
     */
    _smartVisible: function() {
        var me = this,
            size = {yshow: false, xshow: false};
        if (!me.getContainer()) {return}
        function getSize(orie) {//取得邦定容器的最小尺寸和内容尺寸
            var axis = me._axis[orie],
                bar = me['_' + orie + 'Scrollbar'],
                container = me.getContainer(),
                size = {};
            if (!bar || !bar.isVisible()) {
                container.style[axis.unSize] = container[axis.unClientSize]
                    - me._scrollBarSize + 'px';
            }
            size[axis.unSize] = container[axis.unClientSize];
            size['scroll' + axis.unSize] = container[axis.unScrollSize];
            return size;
        }
        function setContainerSize(orie, size) {//根据是否显示滚动条设置邦定容器的尺寸
            var axis = me._axis[orie],
                container = me.getContainer();
            if (!me['_' + orie + 'Visible']
                || !size[orie + 'show']
                || !me['_' + orie + 'Scrollbar']) {
                container.style[axis.unSize] = container[axis.unClientSize]
                    + me._scrollBarSize + 'px';
            }
        }
        function setScrollBarVisible(orie, size) {//设置滚动条的显示或隐藏
            var axis = me._axis[orie],
                container = me.getContainer(),
                scrollbar = me['_' + orie + 'Scrollbar'],
                isShow = size[orie + 'show'];
            if (scrollbar) {
                scrollbar.getMain().style[axis.size] = container[axis.offsetSize] + 'px';
                scrollbar.setVisible(me['_' + orie + 'Visible'] ? isShow : false);
                scrollbar.update();
            }
        }
        baidu.object.extend(size, getSize('y'));
        baidu.object.extend(size, getSize('x'));
        if (size.scrollwidth <= size.width + me._scrollBarSize
            && size.scrollheight <= size.height + me._scrollBarSize) {//两个都不显示
            size.yshow = size.xshow = false;
        }else if (size.scrollwidth <= size.width
            && size.scrollheight > size.height + me._scrollBarSize) {//只显示竖
            size.yshow = true;
            size.xshow = false;
        }else if (size.scrollwidth > size.width + me._scrollBarSize
            && size.scrollheight <= size.height) {//只显示横
            size.yshow = false;
            size.xshow = true;
        }else {//两个都显示
            size.yshow = size.xshow = true;
        }
        setContainerSize('y', size);
        setContainerSize('x', size);
        setScrollBarVisible('y', size);
        setScrollBarVisible('x', size);
    },

    /**
     * 设置滚动条的隐藏或是显示状态
     * @param {Boolean} val 必选，true:显示, false:隐藏.
     * @param {String} pos 可选，当有两个滚动条时可以指定只隐藏其中之一，取值'x'或'y'，不传该参数隐藏或显示全部.
     */
    setVisible: function(val, pos) {
        var me = this;
        if (pos) {
            me['_' + pos + 'Visible'] = val;
        }else {
            me._yVisible = me._xVisible = val;
        }
        me._smartVisible();
    },

    /**
     * 取得滚动条的隐藏或显示状态
     * @param {String} pos 取值'x'或是'y'来选择要取得哪个滚动条的隐藏或是显示状态.
     * @return {Boolean} 返回布尔值来标示当前的隐藏或是显示状态.
     */
    isVisible: function(pos) {
        var me = this;
        return me['_' + pos + 'Visible'];
    },

    /**
     * 取得滚动条对象
     * @param {String} pos 取值'x'或是'y'来标示需取得哪个滚动条，当不传该参数则返回所有滚动条.
     * @return {ScrollBar|Array} 返回滚动条对象或数组.
     */
    getScrollBar: function(pos) {
        var me = this,
            instance = pos ? me['_' + pos + 'Scrollbar'] : null;
        if(!instance){
            instance = (me._yScrollbar && me._xScrollbar) ? [me._yScrollbar, me._xScrollbar]
                : (me._yScrollbar || me._xScrollbar)
        }
        return instance;
    },

    /**
     * 更新所有滚动条的外观
     * @param {Object} options 参数请参考构造函数参数.
     */
    update: function(options) {
        var me = this;
        baidu.object.extend(me, options);
        me._smartVisible();
    },

    /**
     * 取得panel的dom节点
     * @return {HTMLElement}
     */
    getPanel: function() {
        return baidu.dom.g(this.getId('panel'));
    },

    /**
     * 取得用户传入的目标对象
     * @return {HTMLElement}
     */
    getTarget: function() {
        return baidu.dom.g(this.target);
    },

    /**
     * 取得用户传入的container对象
     * @return {HTMLElement}
     */
    getContainer: function() {
        return baidu.dom.g(this.container);
    },

    /**
     * 销毁对象
     */
    dispose: function() {
        var me = this,
            ybar = me._yScrollbar,
            xbar = me._xScrollbar;
        me.dispatchEvent('dispose');
        me.getMain().parentNode.appendChild(me.getTarget());
        if (ybar) {ybar.dispose();}
        if (xbar) {xbar.dispose();}
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});
