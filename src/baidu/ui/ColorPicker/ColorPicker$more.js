/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.ColorPicker;
///import baidu.ui.ColorPalette;
///import baidu.ui.Button;
///import baidu.ui.Dialog;
///import baidu.ui.Dialog.Dialog$button;
///import baidu.ui.create;

///import baidu.object.extend;



/**
 * ColorPalette 插件
 * @name baidu.ui.ColorPicker
 * @param {Number} [options.sliderLength = 150] 滑动条长度.
 * @param {String} options.coverImgSrc 调色板背景渐变图片路径.
 * @param {String} options.sliderImgSrc 滑动条背景图片路径.
 * @param {String} [options.titleText = 'More Colors'] 标题文字.
 * @param {Object} [options.dilogOption] 填出对话框配置.
 * @param {Object} [options.more = true] 是否开启插件功能.
 * @author walter
 */
baidu.ui.ColorPicker.extend({

    sliderLength: 150,

    coverImgSrc: '',

    sliderImgSrc: '',

    titleText: 'More Colors',

    dialogOption: {},
    
    more: true,
    /**
     * 生成调色板对话框
     * @private
     */
    _createColorPaletteDialog: function() {
        var me = this;
        me.colorPaletteDialog = new baidu.ui.Dialog(baidu.object.extend({
            titleText: me.titleText,
            height: 180,
            width: 360,
            modal: true,
            type: 'confirm',
            onaccept: function() {
                me.dispatchEvent('onchosen', {
                    color: me.colorPalette.hex
                });
            },
            onclose: function(){
                me.colorPalette._onPadDotMouseUp();
            },
            draggable: true,
            autoDispose: false,
            autoOpen: false,
            autoRender: true
        }, me.dialongOption || {}));
    },

    /**
     * 生成复杂调色板
     * @private
     */
    _createColorPalette: function() {
        var me = this;
        me.colorPalette =
            baidu.ui.create(baidu.ui.ColorPalette, {
                autoRender: true,
                sliderLength: me.sliderLength,
                coverImgSrc: me.coverImgSrc,
                sliderImgSrc: me.sliderImgSrc,
                element: me.colorPaletteDialog.getContent()
            });
    }
});

baidu.ui.ColorPicker.register(function(me) {
    if(!me.more) return;
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
