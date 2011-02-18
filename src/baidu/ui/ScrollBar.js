/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.string.format;
///import baidu.dom.g;
///import baidu.dom.insertHTML;
///import baidu.fn.bind;
///import baidu.dom.setStyles;
///import baidu.dom._styleFilter.px;
///import baidu.ui.Button;
///import baidu.ui.Button$capture;
///import baidu.ui.Slider;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.object.extend;
///import baidu.event.preventDefault;
///import baidu.dom.remove;

/**
 * 为容器创建一个自定义的滚动条
 * @name baidu.ui.scrollBar.ScrollBar
 * @grammar baidu.ui.scrollBar.create(options)
 * @param {Object} options 创建scrollBar的自定义参数.
 * @param {String} options.orientation 设置横向或是竖向滚动条，默认值：vertical,可取值：horizontal.
 * @param {Number} options.dimension 用户自定义滚动容积的大小.
 * @param {Number} options.step 用户自定义当点击滚动按钮时每次滚动距离.
 * @return {baidu.ui.scrollBar.ScrollBar} ScrollBar类.
 * @author linlingyu
 */

baidu.ui.ScrollBar = baidu.ui.createUI(function(options) {
    var me = this;
    me._oriValues = {};//用来保存target的初始值，在dispose时再还原给target
}).extend({
    tplDOM: '<div id="#{id}" class="#{class}">#{content}</div>',

    uiType: 'scrollBar',
    orientation: 'vertical',//横竖向的排列方式，取值horizontal,vertical,auto
    step: 20,//单步移动20象素
    _axis: {
        horizontal: {
            tarSize: 'height',
            tarClientSize: 'clientHeight',
            pos: 'bottom',
            size: 'width',
            offsetSize: 'offsetWidth',
            clientSize: 'clientWidth',
            scrollPos: 'scrollLeft',
            scrollSize: 'scrollWidth'
        },
        vertical: {
            tarSize: 'width',
            tarClientSize: 'clientWidth',
            pos: 'right',
            size: 'height',
            offsetSize: 'offsetHeight',
            clientSize: 'clientHeight',
            scrollPos: 'scrollTop',
            scrollSize: 'scrollHeight'
        }
    },

    /**
     * 依据tplDOM的内容生成滚动条布局
     * @param
     * @return
     */
    getString: function() {
        var me = this,
            str = [],
            track;
        str.push(baidu.string.format(me.tplDOM, {
            id: me.getId('prev'),
            'class' : me.getClass('prev')
        }));
        str.push(baidu.string.format(me.tplDOM, {
            id: me.getId('track'),
            'class' : me.getClass('track')
        }));
        str.push(baidu.string.format(me.tplDOM, {
            id: me.getId('next'),
            'class' : me.getClass('next')
        }));
        track = baidu.string.format(me.tplDOM, {
            id: me.getId(),
            'class' : me.getClass(),
            content: str.join('')
        });
        return baidu.string.format(me.tplDOM, {
            id: me.getId('panel'),
            'class' : me.getClass('panel'),
            content: track
        });
    },
    
    /**
     * 
     */
    _renderUI : function(){
        var me = this,
            target = me.target,
            axis = me._axis[me.orientation],
            panel = me.getPanel(),
            body = me.getBody(),
            trackSize = me._trackSize = body[axis.tarClientSize],
            skin = me.skin || '',
            options,
            entry;
        //设置panel和target一样的大小
        baidu.dom.setStyles(panel, {
            position: 'relative',
            width: target.offsetWidth,
            height: target.offsetHeight
        });
        //初始化target位置
        me._oriValues = {
            position: target.style.position,
            left: target.style.left,
            top: target.style.top
        };
        options = {
            position: 'absolute',
            left: 0,
            top: 0
        };
        options[axis.tarSize] = target[axis.tarClientSize] - trackSize;
        baidu.dom.setStyles(target, options);
        //设置track的宽度
        options = {position: 'absolute'};
        options[axis.size] = target[axis.offsetSize];
        options[axis.pos] = '0px';
        baidu.dom.setStyles(body, options);
        
        
        //生成其它UI
        function createOpt(pos) {
            function stopHandler(){
                me._mouseIdent = -1;
            };
            return {
                skin: skin + pos,
                onmousedown: function() {me._onMouseHandler(pos);},
                onmouseup: stopHandler,
                onmouseout: stopHandler
            };
        };
        me._prev = new baidu.ui.Button(createOpt('prev'));
        me._next = new baidu.ui.Button(createOpt('next'));
        me._prev.render(me.getId('prev'));
        me._next.render(me.getId('next'));
        function sliderHandler(evt) {
            var target = me.target,
                dimension = me.dimension || target[axis.scrollSize];
            me._scrollTo((dimension - target[axis.clientSize]) * evt.target.getValue() / 100);
        };
        me._slider = new baidu.ui.Slider({
            skin: skin + 'track',
            layout: me.orientation,
            onslide: sliderHandler,
            onslideclick: sliderHandler
        });
        me._slider.render(me.getId('track'));
        new baidu.ui.Button({
            skin: skin + 'thumb',
            capture: true,
            tplBody: '<div id="#{id}" #{statable} class="#{class}"><div class="#{class}-thumbPrev"></div>' +
                '#{content}<div class="#{class}-thumbNext"></div></div>'
        }).render(me._slider.getThumb());
        if (me.orientation.toLowerCase() == 'vertical') {//只有竖向滚动条有鼠标事件
            entry = {
                target: panel,
                evtName: me._getEvtName(),
                handler: baidu.fn.bind('_onMouseWheelHandler', me)
            };
            baidu.event.on(entry.target, entry.evtName, entry.handler);
            me.addEventListener('dispose', function() {
                baidu.event.un(entry.target, entry.evtName, entry.handler);
            });
        };
        me._slider.getBody().style[axis.size] = target[axis.offsetSize]
            - me._prev.getBody()[axis.offsetSize]
            - me._next.getBody()[axis.offsetSize] + 'px';
        me._smartThumb();
    },
    /**
     * 将布局渲染成到指定容器中
     * @param {HTMLElement} target 被渲染的容器.
     */
    render: function(target) {
        var me = this,
            target = me.target = baidu.g(target);
        baidu.dom.insertHTML(target, 'afterEnd', me.getString());
        me.renderMain(me.getPanel());
        me.getMain().insertBefore(target, me.getBody());
        me._renderUI();
        me.dispatchEvent('load');
    },

    /**
     * 智能运算滑块容器大小
     */
    _smartThumb: function() {
        var me = this;
            target = me.target,
            slider = me._slider,
            axis = me._axis[me.orientation],
            dimension = me.dimension || target[axis.scrollSize];
        slider.getThumb().style[axis.size] = Math.round(slider.getBody()[axis.clientSize]
            * target[axis.clientSize] / dimension) + 'px';
        slider._updateDragRange();
        me.scrollTo(target[axis.scrollPos]);
        me.setVisible(target[axis.scrollSize] != target[axis.clientSize]);
    },

    /**
     * 滚动条的更新方法
     * @param {options}
     */
    update: function(options) {
        var me = this;
        baidu.object.extend(me, options || {});
        me._smartThumb();
        me.dispatchEvent('update');
    },

    /**
     * 取得存放target和滚动条布局的最外层容器
     */
    getPanel: function() {
        return baidu.g(this.getId('panel'));
    },

    /**
     * 滚动内容到参数指定的像素位置
     * @param {Number} 一个像素值.
     */
    _scrollTo: function(pos) {
        var me = this;
        me.target[me._axis[me.orientation].scrollPos] = pos;
    },

    /**
     * 滚动内容到参数指定的像素位置并更新滚动到对应位置
     * @param {Number} 一个像素值.
     */
    scrollTo: function(pos) {
        var me = this,
            target = me.target,
            axis = me._axis[me.orientation],
            dimension = me.dimension || target[axis.scrollSize];
        me._scrollTo(pos);
        me._slider.update({
            value: (pos == 0 ? 0 : pos / (dimension - target[axis.clientSize]) * 100)
        });
    },

    /**
     *根据参数实现prev和next按钮的基础滚动
     * @param {Boolean} val true:next的滚动方向, false:prev的滚动方向.
     */
    _basicScroll: function(val) {
        var me = this;
        me.scrollTo(me.target[me._axis[me.orientation].scrollPos] - (val ? -me.step : me.step));
    },
    /**
     * 后退一步滚动
     */
    prevScroll: function() {
        this._basicScroll(0);
    },

    /**
     * 前进一步滚动
     */
    nextScroll: function() {
        this._basicScroll(1);
    },

    /**
     * 鼠标点击或是点击不放的轮询滚动
     * @param {String} pos 取值 "prev":后退滚动, "next":前进滚动.
     */
    _onMouseHandler: function(pos) {
        var me = this,
            handler = me[pos.toLowerCase() + 'Scroll'];
        me._mouseIdent = 0;
        handler.call(me);
        function timer() {
            if (me._mouseIdent > -1) {
                4 < me._mouseIdent++ && handler.call(me);
                setTimeout(timer, 100);
            }
        }
        timer();
    },

    /**
     * 滑轮事件侦听器
     * @param {Event} evt 滑轮的事件对象.
     */
    _onMouseWheelHandler: function(evt) {
        var me = this,
            target = me.target,
            evt = evt || window.event,
            detail = evt.detail || -evt.wheelDelta,
            pos = detail > 0 ? 'next' : 'prev';
        baidu.event.preventDefault(evt);
        me[pos + 'Scroll'].call(me);
    },

    /**
     * 设置滚动条的隐藏或显示
     * @param {Boolean} val 取值true:显示, false:隐藏.
     */
    setVisible: function(val) {
        var me = this,
            target = me.target,
            body = me.getBody(),
            statu = body.style.display != 'none' ? true : false,
            axis = me._axis[me.orientation];
        if (val != statu) {
            target.style[axis.tarSize] = target[axis.tarClientSize]
                - (val ? me._trackSize : -me._trackSize) + 'px';
        }
        body.style.display = val ? '' : 'none';
    },

    /**
     * 对各种不同浏览器选择不同的滑轮事件名称
     */
    _getEvtName: function() {
        var me = this,
            ua = navigator.userAgent.toLowerCase(),
            //代码出处jQuery
            matcher = /(webkit)/.exec(ua)
                        || /(opera)/.exec(ua)
                        || /(msie)/.exec(ua)
                        || ua.indexOf('compatible') < 0
                        && /(mozilla)/.exec(ua)
                        || [];
        return matcher[1] == 'mozilla' ? 'DOMMouseScroll' : 'mousewheel';
    },

    /**
     * 销毁对象
     */
    dispose: function() {
        var me = this,
            target = me.target,
            main = me.getMain(),
            i;
        me.dispatchEvent('dispose');
        me.setVisible(false);
        for (i in me._oriValues) {
            target.style[i] = me._oriValues[i];
        }
        main.parentNode.insertBefore(target, main);
        baidu.dom.remove(main);
        baidu.lang.Class.prototype.dispose.call(me);
    }
});
