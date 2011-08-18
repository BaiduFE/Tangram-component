/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.createUI;
///import baidu.ui.Slider;

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
 * @name baidu.ui.ColorPalette
 * @class
 * @grammar new baidu.ui.ColorPalette(options)
 * @param {Object}  options 配置.
 * @config {Number} sliderLength 滑动条长度，默认150.
 * @config {String} coverImgSrc 调色板渐变背景图片地址.
 * @config {String} sliderImgSrc 滑动条背景图片地址.
 * @author walter
 */
baidu.ui.ColorPalette = baidu.ui.createUI(function(options) {
    var me = this;
    me.hue = 360; //色相初始值
    me.saturation = 100; //饱和度初始值
    me.brightness = 100; //亮度初始值
    me.sliderDotY = 0;  //滑动块初始值
    me.padDotY = 0; //面板调色块Y轴初始值
    me.padDotX = me.sliderLength; //面板调色块X轴初始值
}).extend(
/**
 *  @lends baidu.ui.ColorPalette.prototype
 */
{
    uiType: 'colorpalette',

    tplBody: '<div id="#{id}" class="#{class}">#{content}</div>',

    /**
     * 调色板模板
     */
    tplPad: '<div id="#{padId}" class="#{padClass}"><div id="#{coverId}" class="#{coverClass}"></div>#{padDot}</div>',

    /**
     * 滑动条模板
     */
    tplSlider: '<div id="#{sliderId}" class="#{sliderClass}"></div>',

    /**
     * 调色块模板
     */
    tplPadDot: '<div id="#{padDotId}" class="#{padDotClass}" onmousedown="#{mousedown}"></div>',

    /**
     * 颜色展示区域模板
     */
    tplShow: '<div id="#{newColorId}" class="#{newColorClass}" onclick="#{showClick}"></div><div id="#{savedColorId}" class="#{savedColorClass}" onclick="#{savedColorClick}"></div><div id="#{hexId}" class="#{hexClass}"></div><div id="#{saveId}" class="#{saveClass}" onclick="#{saveClick}"></div>',

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
        me._padClickHandler = baidu.fn.bind('_onPadClick', me);

        me.on(me.getPad(), 'click', me._padClickHandler);

        me._setColorImgs();
        me.setSliderDot(me.sliderDotY);
        me.setPadDot(me.padDotY, me.padDotX);
        me._saveColor();

        me.dispatchEvent('onload');
    },

    /**
     * 设置滑动条和调色板背景图片
     * @private
     */
    _setColorImgs: function() {
        var me = this,
            cover = me._getCover(),
            slider = me.getSliderBody();

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
        if (!src) {
            return;
        }
        baidu.dom.setStyle(obj, 'background', 'url(' + src + ')');
    },

    /**
     * 设置对象fliter背景图片,此方法应用于IE系列浏览器
     * @private
     * @param {Object} obj 要设置的对象.
     * @param {Object} src 图片src.
     */
    _setFilterImg: function(obj, src) {        
        if (!src) {
            return;
        }
        baidu.dom.setStyle(obj, 'filter',
             'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' +
              src + '", sizingMethod="crop")');
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
            mousedown: me.getCallString('_onPadDotMouseDown')
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
            sliderId: me.getId('slider'),
            sliderClass: me.getClass('sliderMain')
        });
    },

    /**
     * 创建滑动条
     * @private
     */
    _createSlider: function() {
        var me = this,
            target = me._getSliderMain();

        me.slider = baidu.ui.create(baidu.ui.Slider, {
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
            savedColorId: me.getId('savedColor'),
            savedColorClass: me.getClass('savedColor'),
            savedColorClick: me.getCallString('_onSavedColorClick'),
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
    _onPadDotMouseDown: function() {
        var me = this,
            pad = me.getPad(),
            position = baidu.dom.getPosition(pad);

        me.padTop = position.top; //计算调色板的offsetTop，用于_onPadDotMouseMove辅助计算
        me.padLeft = position.left; //计算调色板的offsetTop，用于_onPadDotMouseMove辅助计算

        me._movePadDotHandler = baidu.fn.bind('_onPadDotMouseMove', me);
        me._upPadDotHandler = baidu.fn.bind('_onPadDotMouseUp', me);

        baidu.event.on(document, 'mousemove', me._movePadDotHandler);
        baidu.event.on(document, 'mouseup', me._upPadDotHandler);
    },

    /**
     * 鼠标移动调色块事件
     * @private
     * @param {Object} e 鼠标事件对象.
     */
    _onPadDotMouseMove: function(e) {
        e = e || event;
        var me = this,
            pageX = baidu.event.getPageX(e),
            pageY = baidu.event.getPageY(e);

        //计算鼠标坐标相对调色板左上角距离
        me.padDotY = me._adjustValue(me.sliderLength, pageY - me.padTop);
        me.padDotX = me._adjustValue(me.sliderLength, pageX - me.padLeft);

        me.setPadDot(me.padDotY, me.padDotX); //设置调色块
    },

    /**
     * 校准value值，保证它在合理范围内
     * @private
     * @param {Number} x 范围上限,被校准的数值不能超过这个数值.
     * @param {Number} y 需要校准的数值.
     * @return {Number} 校准过的数值.
     */
    _adjustValue: function(x, y) {
        return Math.max(0, Math.min(x, y));
    },

    /**
     * 鼠标松开调色块事件
     * @private
     */
    _onPadDotMouseUp: function() {
        var me = this;
        if(!me._movePadDotHandler){return;}
        baidu.event.un(document, 'mousemove', me._movePadDotHandler);
        baidu.event.un(document, 'mouseup', me._upPadDotHandler);
    },

    /**
     * 调色板单击事件
     * @param {Object} e 鼠标事件.
     * @private
     */
    _onPadClick: function(e) {
        var me = this,
            pad = me.getPad(),
            position = baidu.dom.getPosition(pad);

        me.padTop = position.top;
        me.padLeft = position.left;

        me._onPadDotMouseMove(e); //将调色块移动到鼠标点击的位置
    },

    /**
     * savedColor 单击事件
     * @private
     */
    _onSavedColorClick: function() {
        var me = this,
            dot = me.getSliderDot(),
            position = me.savedColorPosition;

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
    getSliderBody: function() {
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
            savedColorContainer = baidu.dom.g(this.getId('savedColor'));

        baidu.dom.setStyle(savedColorContainer,
                           'background-color',
                            me.hex); //显示颜色

        me.savedColorHex = me.hex; //保存颜色值

        //保存滑动块、调色块状态
        me.savedColorPosition = {
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

        
        me.dispatchEvent('ondispose');
        me.slider.dispose();

        if (me.getMain()) {
            baidu.dom.remove(me.getMain());
        }
        baidu.lang.Class.prototype.dispose.call(me);
    }

});
