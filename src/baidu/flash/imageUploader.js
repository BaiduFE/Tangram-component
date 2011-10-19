/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu;
///import baidu.flash;
///import baidu.flash._Base;

///resource  baidu.flash.imageUploader.swf;
/**
 * 创建flash based imageUploader
 * @class
 * @grammar baidu.flash.imageUploader(options)
 * @param {Object} createOptions 创建flash时需要的参数，请参照baidu.swf.create文档
 * @config {Object} vars 创建imageUploader时所需要的参数
 * @config {Number} vars.gridWidth 每一个预览图片所占的宽度，应该为flash寛的整除
 * @config {Number} vars.gridHeight 每一个预览图片所占的高度，应该为flash高的整除
 * @config {Number} vars.picWidth 单张预览图片的宽度
 * @config {Number} vars.picHeight 单张预览图片的高度
 * @config {String} vars.uploadDataFieldName POST请求中图片数据的key,默认值'picdata'
 * @config {String} vars.picDescFieldName POST请求中图片描述的key,默认值'picDesc'
 * @config {Number} vars.maxSize 文件的最大体积,单位'MB'
 * @config {Number} vars.compressSize 上传前如果图片体积超过该值，会先压缩
 * @config {Number} vars.maxNum:32 最大上传多少个文件
 * @config {Number} vars.compressLength 能接受的最大边长，超过该值会等比压缩
 * @config {String} vars.url 上传的url地址
 * @config {Number} vars.mode mode == 0时，是使用滚动条，mode == 1时，拉伸flash, 默认值为0
 * @see baidu.swf.createHTML
 * @param {String} backgroundUrl 背景图片路径
 * @param {String} listBacgroundkUrl 布局控件背景
 * @param {String} buttonUrl 按钮图片不背景
 * @param {String|Function} selectFileCallback 选择文件的回调
 * @param {String|Function} exceedFileCallback文件超出限制的最大体积时的回调
 * @param {String|Function} deleteFileCallback 删除文件的回调
 * @param {String|Function} startUploadCallback 开始上传某个文件时的回调
 * @param {String|Function} uploadCompleteCallback 某个文件上传完成的回调
 * @param {String|Function} uploadErrorCallback 某个文件上传失败的回调
 * @param {String|Function} allCompleteCallback 全部上传完成时的回调
 * @param {String|Function} changeFlashHeight 改变Flash的高度，mode==1的时候才有用
 */ 
baidu.flash.imageUploader = baidu.flash.imageUploader || function(options){
   
    var me = this,
        options = options || {},
        _flash = new baidu.flash._Base(options, [
            'selectFileCallback', 
            'exceedFileCallback', 
            'deleteFileCallback', 
            'startUploadCallback',
            'uploadCompleteCallback',
            'uploadErrorCallback',
            'allCompleteCallback',
            'changeFlashHeight'
        ]);
    /**
     * 开始或回复上传图片
     * @public
     * @return {Null}
     */
    me.upload = function(){
        _flash.call('upload');
    };

    /**
     * 暂停上传图片
     * @public
     * @return {Null}
     */
    me.pause = function(){
        _flash.call('pause');
    };
};
