/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu;
///import baidu.flash;
///import baidu.flash.Base;

///import baidu.onject.extend;

baidu.flash.imageUploader = baidu.flash.imageUploader || baidu.flash.createFlash(function(options){

    var me = this;
    me.flash = me._getFlash();

}).extend({
    
    render: function(){
        var me = this,
            options;

        //创建options
        options = {};

        me._createFlash(url, id, container);
    },

    //根据flash的接口属性添加对应的方法

    flashInit: function(){
        return this.flash.flashInit();
    },

    upload: function(){
        return this.flash.upload();
    },

    pause: function(){
        return this.flash.pause();
    }
};
