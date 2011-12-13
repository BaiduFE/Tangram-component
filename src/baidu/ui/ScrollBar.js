/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */
///import baidu.ui.createUI;
///import baidu.string.format;
///import baidu.dom.insertHTML;
///import baidu.ui.Button.Button$capture;
///import baidu.ui.Button.Button$poll;
///import baidu.ui.Slider;
///import baidu.dom.hide;
///import baidu.dom.show;

/**
 * 创建一个简单的滚动条
 * @class ScrollBar基类
 * @grammar new baidu.ui.ScrollBar(options)
 * @param   {Object}    options config参数.
 * @config  {String}    orientation 设置横向或是竖向滚动条，默认值：vertical,可取值：horizontal.
 * @config  {Number}    value       滚动条滚动的百分比值，定义域(0, 100)
 * @config  {Number}    dimension   滚动条滑块占全部内容的百分比，定义域(0, 100)
 * @config  {Number}    step        用户自定义当点击滚动按钮时每次滚动百分比距离，定义域(0, 100)
 * @config  {Function}  onscroll    当滚动时触发该事件，function(evt){}，evt.value可以取得滚动的百分比
 * @plugin  container	支持绑定一个容器
 * @author linlingyu
 */
baidu.ui.ScrollBar = baidu.ui.createUI(function(options) {
    var me = this;
        me._scrollBarSize = {width: 0, height: 0};//用来存入scrollbar的宽度和高度
}).extend(
/**
 *  @lends baidu.ui.ScrollBar.prototype
 */
{
    uiType: 'scrollbar',
    tplDOM: '<div id="#{id}" class="#{class}"></div>',
    tplThumb: '<div class="#{prev}"></div><div class="#{track}"></div><div class="#{next}"></div>',
    value: 0,//描述滑块初始值停留的百分比，定义域(0, 100)
    dimension: 10,//描述滑块占整个可滚动区域的百分比，定义域(0, 100)
    orientation: 'vertical',//横竖向的排列方式，取值 horizontal,vertical
    step: 5,//单步移动5%
    _axis: {
        horizontal: {
            size: 'width',
            unSize: 'height',
            offsetSize: 'offsetWidth',
            unOffsetSize: 'offsetHeight',
            clientSize: 'clientWidth',
            scrollPos: 'scrollLeft',
            scrollSize: 'scrollWidth'
        },
        vertical: {
            size: 'height',
            unSize: 'width',
            offsetSize: 'offsetHeight',
            unOffsetSize: 'offsetWidth',
            clientSize: 'clientHeight',
            scrollPos: 'scrollTop',
            scrollSize: 'scrollHeight'
        }
    },

    /**
     * 生成滑块的内容字符串
     * @return {String}
     * @private
     */
    getThumbString: function() {
        var me = this;
        return baidu.string.format(me.tplThumb, {
            prev: me.getClass('thumb-prev'),
            track: me.getClass('thumb-track'),
            next: me.getClass('thumb-next')
        });
    },

    /**
     * 将scrollBar的body渲染到用户给出的target
     * @param {String|HTMLElement} target 一个dom的id字符串或是dom对象.
     */
    render: function(target) {
        var me = this;
        if (!target || me.getMain()) {return;}
        baidu.dom.insertHTML(me.renderMain(target), 'beforeEnd',
            baidu.string.format(me.tplDOM, {
            id: me.getId(),
            'class': me.getClass()
        }));
        me._renderUI();
        me.dispatchEvent('load');
    },

    /**
     * 将Button和Slider渲染到body中
     * @private
     */
    _renderUI: function() {
        var me = this,
            axis = me._axis[me.orientation],
            body = me.getBody(),
            prev,
            slider,
            next;
        function options(type) {
            return{
                classPrefix: me.classPrefix + '-' +type,
                skin: me.skin ? me.skin + '-' + type : '',
                poll: {time: 4},
                onmousedown: function() {me._basicScroll(type);},
                element: body,
                autoRender: true
            };
        }
        prev = me._prev = new baidu.ui.Button(options('prev'));
        baidu.dom.insertHTML(body, 'beforeEnd', baidu.string.format(me.tplDOM, {
            id: me.getId('track'),
            'class': me.getClass('track')
        }));
        next = me._next = new baidu.ui.Button(options('next'));
        function handler(evt) {
            me.dispatchEvent('scroll', {value: Math.round(evt.target.getValue())});
        }
        slider = me._slider = new baidu.ui.Slider({
            classPrefix: me.classPrefix + '-slider',
            skin: me.skin ? me.skin + '-slider' : '',
            layout: me.orientation,
            onslide: handler,
            onslideclick: handler,
            element: baidu.dom.g(me.getId('track')),
            autoRender: true
        });
        me._scrollBarSize[axis.unSize] = next.getBody()[axis.unOffsetSize];//这里先运算出宽度，在flushUI中运算高度
        me._thumbButton = new baidu.ui.Button({
            classPrefix: me.classPrefix + '-thumb-btn',
            skin: me.skin ? me.skin + '-thumb-btn' : '',
            content: me.getThumbString(),
            capture: true,
            element: slider.getThumb(),
            autoRender: true
        });
        me.flushUI(me.value, me.dimension);
        //注册滚轮事件
        me._registMouseWheelEvt(me.getMain());
    },

    /**
     * 更新组件的外观，通过传入的value来使滚动滑块滚动到指定的百分比位置，通过dimension来更新滑块所占整个内容的百分比宽度
     * @param {Number} value 滑块滑动的百分比，定义域(0, 100).
     * @param {Number} dimension 滑块的宽点占内容的百分比，定义域(0, 100).
     */
    flushUI: function(value, dimension) {
        var me = this,
            axis = me._axis[me.orientation],
            btnSize = me._prev.getBody()[axis.offsetSize] + me._next.getBody()[axis.offsetSize],
            body = me.getBody(),
            slider = me._slider,
            thumb = slider.getThumb(),
            val;
        //当外观改变大小时
        baidu.dom.hide(body);
        val = me.getMain()[axis.clientSize];
        me._scrollBarSize[axis.size] = (val <= 0) ? btnSize : val;
        slider.getMain().style[axis.size] = (val <= 0 ? 0 : val - btnSize) + 'px';//容错处理
        thumb.style[axis.size] = Math.max(Math.min(dimension, 100), 0) + '%';
        baidu.dom.show(body);
        me._scrollTo(value);//slider-update
    },

    /**
     * 滚动内容到参数指定的百分比位置
     * @param {Number} val 一个百分比值.
     * @private
     */
    _scrollTo: function(val) {
        //slider有容错处理
        this._slider.update({value: val});
    },

    /**
     * 滚动内容到参数指定的百分比位置
     * @param {Number} val 一个百分比值.
     */
    scrollTo: function(val) {
        var me = this;
        me._scrollTo(val);
        me.dispatchEvent('scroll', {value: val});
    },

    /**
     * 根据参数实现prev和next按钮的基础滚动
     * @param {String} pos 取值prev|next.
     * @private
     */
    _basicScroll: function(pos) {
        var me = this;
        me.scrollTo(Math.round(me._slider.getValue()) + (pos == 'prev' ? -me.step : me.step));
    },

    /**
     * 滑轮事件侦听器
     * @param {Event} evt 滑轮的事件对象.
     * @private
     */
    _onMouseWheelHandler: function(evt) {
        var me = this,
            target = me.target,
            evt = evt || window.event,
            detail = evt.detail || -evt.wheelDelta;
        baidu.event.preventDefault(evt);
        me._basicScroll(detail > 0 ? 'next' : 'prev');
    },

    /**
     * 注册一个滚轮事件
     * @param {HTMLElement} target 需要注册的目标dom.
     * @private
     */
    _registMouseWheelEvt: function(target) {
//        if(this.orientation != 'vertical'){return;}
        var me = this,
            getEvtName = function() {
                var ua = navigator.userAgent.toLowerCase(),
                    //代码出处jQuery
                    matcher = /(webkit)/.exec(ua)
                        || /(opera)/.exec(ua)
                        || /(msie)/.exec(ua)
                        || ua.indexOf('compatible') < 0
                        && /(mozilla)/.exec(ua)
                        || [];
                return matcher[1] == 'mozilla' ? 'DOMMouseScroll' : 'mousewheel';
            },
            entry = me._mouseWheelEvent = {
                target: target,
                evtName: getEvtName(),
                handler: baidu.fn.bind('_onMouseWheelHandler', me)
            };
        baidu.event.on(entry.target, entry.evtName, entry.handler);
    },
    
    /**
     * 对已经注册了滚轮事件的容器进行解除.
     * @private
     */
    _cancelMouseWheelEvt: function(){
        var entry = this._mouseWheelEvent;
        if(!entry){return;}
        baidu.event.un(entry.target, entry.evtName, entry.handler);
        this._mouseWheelEvent = null;
    },

    /**
     * 设置滚动条的隐藏或显示
     * @param {Boolean} val 布尔值 true:显示, false:隐藏.
     */
    setVisible: function(val) {
        this.getMain().style.display = val ? '' : 'none';
    },

    /**
     * 取得当前是隐藏或是显示状态
     * @return {Boolean} true:显示, false:隐藏.
     */
    isVisible: function() {
        return this.getMain().style.display != 'none';
    },

    /**
     * 取得滚动条的宽度和高度
     * @return {Object} 一个json，有width和height属性.
     */
    getSize: function() {
        return this._scrollBarSize;
    },

    /**
     * 更新滚动条的外观
     * @param {Object} options 参考构造函数参数.
     */
    update: function(options) {
        var me = this;
        me.dispatchEvent('beforeupdate');//该事件是用于和插件container结合使用，不对外开放
        baidu.object.extend(me, options);
        me.flushUI(me.value, me.dimension);
        me.dispatchEvent('update');
    },

    /**
     * 销毁对象
     */
    dispose: function() {
        var me = this;
        me.dispatchEvent('dispose');
        me._cancelMouseWheelEvt();
        me._prev.dispose();
        me._thumbButton.dispose();
        me._slider.dispose();
        me._next.dispose();
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});
