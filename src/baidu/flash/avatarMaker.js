/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu;
///import baidu.flash;
///import baidu.flash._Base;

///resource baidu.flash.avatarMaker.swf;

/**
 * 创建flash based avatarMaker
 * @class
 * @grammar baidu.flash.avatarMaker(options)
 * @param {Object} createOptions 创建flash时需要的参数，请参照baidu.swf.create文档
 * @config {Object} vars 创建avatarMaker时所需要的参数
 * @config {String} [vars.locale] 地区,现在支持vi、th、ar三种，分别是越南语、泰语和阿拉伯语，当使用阿拉伯语时，界面会变成rtl形式,默认为[zh-cn]
 * @config {String} [vars.bigFileName] 80*80图片文件数据字段名，默认为'bigFile'
 * @config {String} [vars.middleFileName] 60*60图片文件数据字段名，默认为'middleFile'
 * @config {String} [vars.smallFileName] 60*60图片文件数据字段名，默认为’smallFile‘
 * @config {Number} [vars.imageQuality] 图片的压缩质量0-100， 默认为 80
 * @config {String} uploadURL 上传图片到的url地址
 * @config {Function|String} tipHandler js提示函数，当flash发生异常，调用此函数显示出错信息。该函数接收一个String类型的参数，为需要显示的文字 
 * @config {Function|String} uploadCallBack 上传之后的回调函数
 */
baidu.flash.avatarMaker = baidu.flash.avatarMaker || function(options){
    var me = this,
        options = options || {},
        _uploadURL = options.uploadURL,
        _flash = new baidu.flash._Base(options, [
                'uploadCallBack',
                'tipHandler'
            ]);
    /**
     * 开始上传头像
     * @public
     * @param {String} [uploadURL] 上传路径
     * @return {Null}
     */
    me.upload = function(uploadURL){
        _flash.call('upload', [uploadURL || _uploadURL]);
    };
};
