/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu;
///import baidu.flash;
///import baidu.flash._Base;

///import baidu.object.extend;
///import baidu.array.each;

///resource  baidu.flash.fileUploader.swf;

/**
 * 创建flash based fileUploader
 * @class
 * @grammar baidu.flash.fileUploader(options)
 * @param {Object} options
 * @config {Object} createOptions 创建flash时需要的参数，请参照baidu.swf.create文档
 * @config {String} createOptions.width
 * @config {String} createOptions.height
 * @config {Number} maxNum 最大可选文件数
 * @config {Function|String} selectFile
 * @config {Function|String} exceedMaxSize
 * @config {Function|String} deleteFile
 * @config {Function|String} uploadStart
 * @config {Function|String} uploadComplete
 * @config {Function|String} uploadError
 * @config {Function|String} uploadProgress
 */
baidu.flash.fileUploader = baidu.flash.fileUploader || function(options){
    var me = this,
        options = options || {};
    
    options.createOptions = baidu.extend({
        wmod: 'transparent'
    },options.createOptions || {});
    
    var _flash = new baidu.flash._Base(options, [
        'selectFile',
        'exceedMaxSize',
        'deleteFile',
        'uploadStart',
        'uploadComplete',
        'uploadError', 
        'uploadProgress'
    ]);

    _flash.call('setMaxNum', options.maxNum ? [options.maxNum] : [1]);

    /**
     * 设置当鼠标移动到flash上时，是否变成手型
     * @public
     * @param {Boolean} isCursor
     * @return {Null}
     */
    me.setHandCursor = function(isCursor){
        _flash.call('setHandCursor', [isCursor || false]);
    };

    /**
     * 设置鼠标相应函数名
     * @param {String|Function} fun
     */
    me.setMSFunName = function(fun){
        _flash.call('setMSFunName',[_flash.createFunName(fun)]);
    }; 

    /**
     * 执行上传操作
     * @param {String} url 上传的url
     * @param {String} fieldName 上传的表单字段名
     * @param {Object} postData 键值对，上传的POST数据
     * @param {Number|Array|null|-1} [index]上传的文件序列
     *                            Int值上传该文件
     *                            Array一次串行上传该序列文件
     *                            -1/null上传所有文件
     * @return {Null}
     */
    me.upload = function(url, fieldName, postData, index){

        if(typeof url !== 'string' || typeof fieldName !== 'string') return;
        if(typeof index === 'undefined') index = -1;

        _flash.call('upload', [url, fieldName, postData, index]);
    };

    /**
     * 取消上传操作
     * @public
     * @param {Number|-1} index
     */
    me.cancel = function(index){
        if(typeof index === 'undefined') index = -1;
        _flash.call('cancel', [index]);
    };

    /**
     * 删除文件
     * @public
     * @param {Number|Array} [index] 要删除的index，不传则全部删除
     * @param {Function} callBack
     * @param 
     * */
    me.deleteFile = function(index, callBack){

        var callBackAll = function(list){
                callBack && callBack(list);
            };

        if(typeof index === 'undefined'){
            _flash.call('deleteFilesAll', [], callBackAll);
            return;
        };
        
        if(typeof index === 'Number') index = [index];
        index.sort(function(a,b){
            return b-a;
        });
        baidu.each(index, function(item){
            _flash.call('deleteFileBy', item, callBackAll);
        });
    };

    /**
     * 添加文件类型，支持macType
     * @public
     * @param {Object|Array[Object]} type {description:String, extention:String}
     * @return {Null};
     */
    me.addFileType = function(type){
        var type = type || [[]];
        
        if(type instanceof Array) type = [type];
        else type = [[type]];
        _flash.call('addFileTypes', type);
    };
    
    /**
     * 设置文件类型，支持macType
     * @public
     * @param {Object|Array[Object]} type {description:String, extention:String}
     * @return {Null};
     */
    me.setFileType = function(type){
        var type = type || [[]];
        
        if(type instanceof Array) type = [type];
        else type = [[type]];
        _flash.call('setFileTypes', type);
    };

    /**
     * 设置可选文件的数量限制
     * @public
     * @param {Number} num
     * @return {Null}
     */
    me.setMaxNum = function(num){
        _flash.call('setMaxNum', [num]);
    };

    /**
     * 设置可选文件大小限制，以兆M为单位
     * @public
     * @param {Number} num,0为无限制
     * @return {Null}
     */
    me.setMaxSize = function(num){
        _flash.call('setMaxSize', [num]);
    };

    /**
     * @public
     */
    me.getFileAll = function(callBack){
        _flash.call('getFileAll', [], callBack);
    };

    /**
     * @public
     * @param {Number} index
     * @param {Function} [callBack]
     */
    me.getFileByIndex = function(index, callBack){
        _flash.call('getFileByIndex', [], callBack);
    };

    /**
     * @public
     * @param {Number} index
     * @param {function} [callBack]
     */
    me.getStatusByIndex = function(index, callBack){
        _flash.call('getStatusByIndex', [], callBack);
    };
};
