/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.colorPicker.ColorPicker;
///import baidu.ui.colorPicker.ColorPalette;
///import baidu.ui.button.Button;
///import baidu.ui.dialog.confirm;
///import baidu.ui.create;

///import baidu.object.extend;



/**
 * ColorPalette 插件
 * @name baidu.ui.colorPicker.ColorPicker$more
 * @param {Number} [options.sliderLength = 150] 滑动条长度.
 * @param {String} options.coverImgSrc 调色板背景渐变图片路径.
 * @param {String} options.sliderImgSrc 滑动条背景图片路径.
 * @param {String} [options.titleText = 'More Colors'] 标题文字.
 * @param {Object} [options.dilogOption] 填出对话框配置.
 * @param {Object} [options.more] 插件开关.
 * @author walter
 */
baidu.ui.colorPicker.ColorPicker.extend({

    sliderLength: 150,

    coverImgSrc: '',

    sliderImgSrc: '',

    titleText: 'More Colors',

    dialogOption: {},
    
    more: true,
    
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
            baidu.ui.dialog.confirm('', baidu.object.extend({
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
            baidu.ui.create(baidu.ui.colorPicker.ColorPalette, {
                autoRender: true,
                sliderLength: me.sliderLength,
                coverImgSrc: me.coverImgSrc,
                sliderImgSrc: me.sliderImgSrc,
                element: me.colorPaletteDialog.getContent()
            });
    }
});

baidu.ui.colorPicker.ColorPicker.register(function(me) {
    if(!me.more) return;
    me.addEventListener('onupdate', function() {
        var strArray = [],
            body = me.getBody();
        baidu.ui.create(baidu.ui.button.Button, {
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
