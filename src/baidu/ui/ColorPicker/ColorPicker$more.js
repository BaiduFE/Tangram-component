/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.ColorPicker;
///import baidu.ui.ColorPicker.ColorPalette;
///import baidu.ui.Button;
///import baidu.ui.Dialog.confirm;
///import baidu.ui.create;

///import baidu.object.extend;



/**
 * ColorPalette 插件
 * @name baidu.ui.ColorPicker.ColorPicker$more
 * @param {Number} [options.sliderLength = 150] 滑动条长度.
 * @param {String} options.coverImgSrc 调色板背景渐变图片路径.
 * @param {String} options.sliderImgSrc 滑动条背景图片路径.
 * @param {String} [options.titleText = 'More Colors'] 标题文字.
 * @param {Object} [options.dilogOption] 填出对话框配置.
 * @author walter
 */
baidu.ui.ColorPicker.extend({

    sliderLength: 150,

    coverImgSrc: '',

    sliderImgSrc: '',

    titleText: 'More Colors',

    dialogOption: {},
    
    /**
     * fix mouseUp没有响应
     * @private
     */
    _fixMouseUp: function() {
        var colorPalette = this.colorPalette;
        baidu.event.un(document, 'mousemove', colorPalette._movePadDotHandler);
        baidu.event.un(document, 'mouseup', colorPalette._upPadDotHandler);
    },

    /**
     * 生成调色板对话框
     * @private
     */
    _createColorPaletteDialog: function() {
        var me = this;
        me.colorPaletteDialog =
            baidu.ui.Dialog.confirm('', baidu.object.extend({
                titleText: me.titleText,
                height: 180,
                width: 360,
                modal: true,
                onaccept: function() {
                    me.dispatchEvent('onchosen', {
                        color: me.colorPalette.hex
                    });
                    me._fixMouseUp();
                },
                oncancel: function() {
                    me._fixMouseUp();
                },
                draggable: true,
                autoDispose: false,
                autoOpen: false
            }, me.dialongOption || {}));
    },

    /**
     * 生成复杂调色板
     * @private
     */
    _createColorPalette: function() {
        var me = this;
        me.colorPalette =
            baidu.ui.create(baidu.ui.ColorPicker.ColorPalette, {
                autoRender: true,
                sliderLength: me.sliderLength,
                coverImgSrc: me.coverImgSrc,
                sliderImgSrc: me.sliderImgSrc,
                element: me.colorPaletteDialog.getContent()
            });
    }
});

baidu.ui.ColorPicker.register(function(me) {
    me.addEventListener('onupdate', function() {
        var strArray = [],
            body = me.getBody();
        baidu.ui.create(baidu.ui.Button, {
            content: me.titleText,
            classPrefix: me.getClass('morecolorbutton'),
            autoRender: true,
            element: body,
            onclick: function() {
                me.colorPaletteDialog.open();
            }
        });

        me._createColorPaletteDialog();
        me._createColorPalette();
    });
});
