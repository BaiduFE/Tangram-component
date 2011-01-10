/**
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/colorPicker/ColorPalette.js
 * author: walter
 * version: 1.0.0
 * date: 2010-12-20
 */

///import baidu.ui.colorPicker;
///import baidu.ui.createUI;
///import baidu.ui.slider.Slider;

///import baidu.string.format;

///import baidu.dom.insertHTML;
///import baidu.dom.setStyle;
///import baidu.dom.setStyles;
///import baidu.dom.getPosition;
///import baidu.dom.g;
///import baidu.dom.remove;

///import baidu.fn.bind;

///import baidu.event.on;
///import baidu.event.getPageX;
///import baidu.event.getPageY;
///import baidu.event.un;

///import baidu.browser.ie;

///import baidu.array.each;

/**
 * 复杂颜色拾取器
 * @param {Object}  options 配置.
 * @param {Number}  [options.sliderLength = 150] 滑动条长度.
 * @param {String}  options.coverImgSrc 调色板渐变背景图片地址.
 * @param {String}  options.sliderImgSrc 滑动条背景图片地址.
 */
baidu.ui.colorPicker.ColorPalette = baidu.ui.createUI(function(options) {
    var me = this;
    me.hue = 360; //色相初始值
    me.saturation = 100; //饱和度初始值
    me.brightness = 100; //亮度初始值
    me.sliderDotY = 0;  //滑动块初始值
    me.padDotY = 0; //面板调色块Y轴初始值
    me.padDotX = me.sliderLength; //面板调色块X轴初始值
}).extend({
    uiType: 'colorpalette',

    tplBody: '<div id="#{id}" class="#{class}">#{content}</div>',

    /**
     * 调色板模板
     */
    tplPad: '<div id="#{padId}" class="#{padClass}"><div id="#{coverId}" class="#{coverClass}"></div>#{padDot}</div>',

    /**
     * 滑动条模板
     */
    tplSlider: '<div id="#{sliderId}"></div>',

    /**
     * 调色块模板
     */
    tplPadDot: '<div id="#{padDotId}" class="#{padDotClass}" onmousedown="#{mousedown}"></div>',

    /**
     * 颜色展示区域模板
     */
    tplShow: '<div id="#{newColorId}" class="#{newColorClass}" onclick="#{showClick}"></div><div id="#{currentColorId}" class="#{currentColorClass}" onclick="#{currentClick}"></div><div id="#{hexId}" class="#{hexClass}"></div><div id="#{saveId}" class="#{saveClass}" onclick="#{saveClick}"></div>',

    sliderLength: 150,

    coverImgSrc: '',

    sliderImgSrc: '',

    /**
     * 生成ColorPalette的html字符串
     *  @return {String} 生成html字符串.
     */
    getString: function() {
        var me = this,
            strArray = [];

        strArray.push(me._getPadString(),
                      me._getSliderString(),
                      me._getShowString());

        return baidu.string.format(me.tplBody, {
            id: me.getId(),
            'class': me.getClass(),
            content: strArray.join('')
        });
    },

    /**
     * 渲染控件
     * @param {Object} target 目标渲染对象.
     */
    render: function(target) {
        var me = this;
        if (me.getMain()) {
            return;
        }
        baidu.dom.insertHTML(me.renderMain(target),
                             'beforeEnd',
                             me.getString());

        me._createSlider();
        me.padClickHandler = baidu.fn.bind('_padClick', me);
        me.sliderClickHandler = baidu.fn.bind('_sliderClick', me);

        baidu.event.on(me.getPad(), 'click', me.padClickHandler);

        me._setImg();
        me.setSliderDot(me.sliderDotY);
        me.setPadDot(me.padDotY, me.padDotX);
        me._saveColor();

        me.dispatchEvent('onload');
    },

    /**
     * 设置滑动条和调色板背景图片
     * @private
     */
    _setImg: function() {
        var me = this,
            cover = me._getCover(),
            slider = me.getSlider();

        if (baidu.browser.ie) {
            me._setFilterImg(cover, me.coverImgSrc);
        }
        else {
            me._setBackgroundImg(cover, me.coverImgSrc);
        }
        me._setBackgroundImg(slider, me.sliderImgSrc);
    },

    /**
     * 设置对象背景图片
     * @private
     * @param {Object} obj 要设置的对象.
     * @param {Object} src 图片src.
     */
    _setBackgroundImg: function(obj, src) {
        var tpl = 'url(#{url})';
        if (!src) {
            return;
        }
        baidu.dom.setStyle(obj, 'background', baidu.string.format(tpl, {
            url: src
        }));
    },

    /**
     * 设置对象fliter背景图片,此方法应用于IE系列浏览器
     * @private
     * @param {Object} obj 要设置的对象.
     * @param {Object} src 图片src.
     */
    _setFilterImg: function(obj, src) {
        var tpl = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="#{url}", sizingMethod="crop")';
        if (!src) {
            return;
        }
        baidu.dom.setStyle(obj, 'filter', baidu.string.format(tpl, {
            url: src
        }));
    },

    /**
     * 生成调色板的html字符串
     * @private
     * @return {String} 生成html字符串.
     */
    _getPadString: function() {
        var me = this;
        return baidu.string.format(me.tplPad, {
            padId: me.getId('pad'),
            padClass: me.getClass('pad'),
            coverId: me.getId('cover'),
            coverClass: me.getClass('cover'),
            padDot: me._getPadDotString()
        });
    },

    /**
     * 生成调色块html字符串
     * @private
     * @return {String} 生成html字符串.
     */
    _getPadDotString: function() {
        var me = this;
        return baidu.string.format(me.tplPadDot, {
            padDotId: me.getId('padDot'),
            padDotClass: me.getClass('padDot'),
            mousedown: me.getCallString('_mouseDownPadDot')
        });
    },

    /**
     * 生成滑动条html字符串
     * @private
     * @return {String} 生成html字符串.
     */
    _getSliderString: function() {
        var me = this;
        return baidu.string.format(me.tplSlider, {
            sliderId: me.getId('slider')
        });
    },

    /**
     * 创建滑动条
     * @private
     */
    _createSlider: function() {
        var me = this,
            target = me._getSliderMain();

        me.slider = baidu.ui.create(baidu.ui.slider.Slider, {
            autoRender: true,
            element: target,
            layout: 'vertical',
            max: me.sliderLength,
            classPrefix: me.getClass('slider'),
            onslide: function() {
                me.setSliderDot(this.value); //设置滑动块
            },
            onslideclick: function() {
                me.setSliderDot(this.value); //设置滑动块
            }
        });

    },

    /**
     * 生成颜色展示区域html字符串
     * @private
     * @return {String} 生成html字符串.
     */
    _getShowString: function() {
        var me = this;
        return baidu.string.format(me.tplShow, {
            newColorId: me.getId('newColor'),
            newColorClass: me.getClass('newColor'),
            currentColorId: me.getId('currentColor'),
            currentColorClass: me.getClass('currentColor'),
            currentClick: me.getCallString('_currentColorClick'),
            hexId: me.getId('hex'),
            hexClass: me.getClass('hex'),
            saveId: me.getId('save'),
            saveClass: me.getClass('save'),
            saveClick: me.getCallString('_saveColor')
        });
    },

    /**
     * 鼠标按下调色块事件
     * @private
     */
    _mouseDownPadDot: function() {
        var me = this,
            pad = me.getPad(),
            position = baidu.dom.getPosition(pad);

        me.padTop = position.top; //计算调色板的offsetTop，用于_mouseMovePadDot辅助计算
        me.padLeft = position.left; //计算调色板的offsetTop，用于_mouseMovePadDot辅助计算

        me.movePadDotHandler = baidu.fn.bind('_mouseMovePadDot', me);
        me.upPadDotHandler = baidu.fn.bind('_mouseUpPadDot', me);

        baidu.event.on(document, 'mousemove', me.movePadDotHandler);
        baidu.event.on(document, 'mouseup', me.upPadDotHandler);
    },

    /**
     * 鼠标移动调色块事件
     * @private
     * @param {Object} e 鼠标事件对象.
     */
    _mouseMovePadDot: function(e) {
        e = e || event;
        var me = this,
            pageX = baidu.event.getPageX(e),
            pageY = baidu.event.getPageY(e);

        //计算鼠标坐标相对调色板左上角距离
        me.padDotY = me._fixNumber(me.sliderLength, pageY - me.padTop);
        me.padDotX = me._fixNumber(me.sliderLength, pageX - me.padLeft);

        me.setPadDot(me.padDotY, me.padDotX); //设置调色块
    },

    /**
     * 修正数值
     * @private
     * @param {Number} x 被比较的数值.
     * @param {Number} y 需要修正的数值.
     * @return {Number} 修正过的数值.
     */
    _fixNumber: function(x, y) {
        return Math.max(0, Math.min(x, y));
    },

    /**
     * 鼠标松开调色块事件
     * @private
     */
    _mouseUpPadDot: function() {
        var me = this;
        baidu.event.un(document, 'mousemove', me.movePadDotHandler);
        baidu.event.un(document, 'mouseup', me.upPadDotHandler);
    },

    /**
     * fix mouseUp没有响应
     * @private
     */
    _fixMouseUp: function() {
        var me = this;
        baidu.event.un(document, 'mousemove', me.movePadDotHandler);
        baidu.event.un(document, 'mouseup', me.upPadDotHandler);
    },

    /**
     * 调色板单击事件
     * @param {Object} e 鼠标事件.
     * @private
     */
    _padClick: function(e) {
        var me = this,
            pad = me.getPad(),
            position = baidu.dom.getPosition(pad);

        me.padTop = position.top;
        me.padLeft = position.left;

        me._mouseMovePadDot(e); //将调色块移动到鼠标点击的位置
    },

    /**
     * currentColor 单击事件
     * @private
     */
    _currentColorClick: function() {
        var me = this,
            dot = me.getSliderDot(),
            position = me.currentPosition;

        me.setSliderDot(position.sliderDotY);
        baidu.dom.setStyle(dot, 'top', position.sliderDotY); //恢复滑动块位置
        me.setPadDot(position.padDotY, position.padDotX); //恢复调色块位置
    },

    /**
     * 获取滑动条容器对象
     * @private
     * @return {HTMLElement} dom节点.
     */
    _getSliderMain: function() {
        return baidu.dom.g(this.getId('slider'));
    },

    /**
     * 获取滑动条容器对象
     * @return {HTMLElement} dom节点.
     */
    getSlider: function() {
        return this.slider.getBody();
    },

    /**
     * 获取滑动块对象
     * @return {HTMLElement} dom节点.
     */
    getSliderDot: function() {
        return this.slider.getThumb();
    },

    /**
     * 获取调色板对象
     * @return {HTMLElement} dom节点.
     */
    getPad: function() {
        return baidu.dom.g(this.getId('pad'));
    },

    /**
     * 获取调色块对象
     * @return {HTMLElement} dom节点.
     */
    getPadDot: function() {
        return baidu.dom.g(this.getId('padDot'));
    },

    /**
     * 获取调色板cover图层对象
     * @private
     * @return {HTMLElement} dom节点.
     */
    _getCover: function() {
        return baidu.dom.g(this.getId('cover'));
    },

    /**
     * 设置滑动块位置
     * @param {Object} value 滑动块top位置值.
     */
    setSliderDot: function(value) {
        var me = this,
            pad = me.getPad();

        me.sliderDotY = value;
        me.hue = parseInt(360 * (me.sliderLength - value) / me.sliderLength,
                          10); //根据滑动块位置计算色相值

        baidu.dom.setStyle(pad, 'background-color', '#' + me._HSBToHex({
            h: me.hue,
            s: 100,
            b: 100
        })); //设置调色板背景颜色

        me._setNewColor();
    },

    /**
     * 设置调色块位置
     * @param {Object} top 调色块 offsetTop值.
     * @param {Object} left 调色块 offsetLeft值.
     */
    setPadDot: function(top, left) {
        var me = this,
            dot = me.getPadDot();

        me.saturation = parseInt(100 * left / 150, 10); //根据调色块top值计算饱和度
        me.brightness = parseInt(100 * (150 - top) / 150, 10); //根据调色块left值计算亮度

        baidu.dom.setStyles(dot, {
            top: top,
            left: left
        });

        me._setNewColor();
    },

    /**
     * 设置实时颜色
     * @private
     */
    _setNewColor: function() {
        var me = this,
            newColorContainer = baidu.dom.g(this.getId('newColor')),
            hexContainer = baidu.dom.g(this.getId('hex'));

        //记录当前hex格式颜色值
        me.hex = '#' + me._HSBToHex({
            h: me.hue,
            s: me.saturation,
            b: me.brightness
        });

        baidu.dom.setStyle(newColorContainer, 'background-color', me.hex);
        hexContainer.innerHTML = me.hex;
    },

    /**
     * 保存当前颜色
     * @private
     */
    _saveColor: function() {
        var me = this,
            currentColorContaner = baidu.dom.g(this.getId('currentColor'));

        baidu.dom.setStyle(currentColorContaner,
                           'background-color',
                            me.hex); //显示颜色

        me.currentHex = me.hex; //保存颜色值

        //保存滑动块、调色块状态
        me.currentPosition = {
            sliderDotY: me.sliderDotY,
            padDotY: me.padDotY,
            padDotX: me.padDotX
        };
    },

    /**
     * 获取当前颜色值
     * @return {String} 颜色值.
     */
    getColor: function() {
        return this.hex;
    },

    /**
     * 将HSB格式转成RGB格式
     * @private
     * @param {Object} hsb hsb格式颜色值.
     * @return {Object} rgb格式颜色值.
     */
    _HSBToRGB: function(hsb) {
        var rgb = {},
            h = Math.round(hsb.h),
            s = Math.round(hsb.s * 255 / 100),
            v = Math.round(hsb.b * 255 / 100);
        if (s == 0) {
            rgb.r = rgb.g = rgb.b = v;
        } else {
            var t1 = v,
                t2 = (255 - s) * v / 255,
                t3 = (t1 - t2) * (h % 60) / 60;
            if (h == 360) h = 0;
            if (h < 60) {rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3;}
            else if (h < 120) {rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3;}
            else if (h < 180) {rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3;}
            else if (h < 240) {rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3;}
            else if (h < 300) {rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3;}
            else if (h < 360) {rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3;}
            else {rgb.r = 0; rgb.g = 0; rgb.b = 0;}
        }

        return {
            r: Math.round(rgb.r),
            g: Math.round(rgb.g),
            b: Math.round(rgb.b)
        };
    },

    /**
     * 将rgb格式转成hex格式
     * @private
     * @param {Object} rgb rgb格式颜色值.
     * @return {String} hex格式颜色值.
     */
    _RGBToHex: function(rgb) {
        var hex = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)];
        baidu.array.each(hex, function(val, nr) {
            if (val.length == 1) {
                hex[nr] = '0' + val;
            }
        });
        return hex.join('');
    },

    /**
     * 将hsb格式转成hex格式
     * @private
     * @param {Object} hsb hsb格式颜色值.
     * @return {String} hex格式颜色值.
     */
    _HSBToHex: function(hsb) {
        var me = this;
        return me._RGBToHex(me._HSBToRGB(hsb));
    },

    /**
     * 销毁 ColorPalette
     */
    dispose: function() {
        var me = this;

        baidu.event.un(me.getPad(), 'click', me.padClickHandler);
        me.slider.dispose();

        me.dispatchEvent('ondispose');
        if (me.getMain()) {
            baidu.dom.remove(me.getMain());
        }
        baidu.lang.Class.prototype.dispose.call(me);
    }

});
