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
 * @function
 * @grammar baidu.flash.imageUploader(options)
 * @param {Object} createOptions 创建flash时需要的参数，请参照baidu.swf.create文档
 * @config {Object} vars 创建imageUploader时所需要的参数
 * @config {String} [vars.url] 图片上传的url地址,默认值'Upload.php'
 * @config {String} [vars.fileType] 可上传的图片的类型字符串，默认值
 *                  '{"description":"图片", "extension":"*.gif; *.jpeg; *.png; *.jpg; *.bmp"}'
 * @config {Number} [vars.maxNum] 允许上传的最大图片数量，默认值32
 * @config {Number} [vars.maxSize] 允许上传的单张图片的最大体积,默认值3MB
 * @config {Number} [vars.compressSize] 超过多少MB的图片需要压缩,默认值3MB
 * @config {Number} [vars.compressLength] 允许上传的图片最大尺寸,默认值1200px
 * @config {String} [vars.uploadDataFieldName] 上传的图片数据在POST请求中的key值,默认值'uploadDataField'
 * @config {String} [vars.picDescFieldName] 图片的描述信息在POST请求中的key值,默认值'uploadDescField'
 * @config {object} [vars.ext] 其他需要通过post上传的参数，默认值null
 * @config {Number} [vars.supportGif] 是否支持动态gif图片,取值范围[0,1]，默认值为0
 */ 
baidu.flash.imageUploader = function(options){
   
    var me = this,
        options = options || {},
        _flash = new baidu.flash._Base(options, [
                'single',    
                'allComplete',
                'changeHigh'
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
