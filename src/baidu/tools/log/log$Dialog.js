/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: tools/log$dDialog.js
 * author: lixiaopeng
 * version: 1.0.0
 * date: 2011/2/28
 */

///import baidu.object.extend;
///import baidu.string.format;
///import baidu.dom.children;
///import baidu.dom.ready;

///import baidu.lang.isArray;
///import baidu.lang.isBoolean;
///import baidu.lang.isDate;
///import baidu.lang.isNumber;
///import baidu.lang.isObject;
///import baiud.lang.isString;

///import baidu.ui.Dialog;
///import baidu.ui.Dialog.Dialog$resizable;
///import baidu.ui.Dialog.Dialog$draggable;

///import baidu.tools;
///import baidu.tools.log;

baidu.tools.log.Dialog = function(){
    var me = this;

    me.dialog = new baidu.ui.Dialog({
        width: '500',
        height: '500'
    });
    me.dialog.render();
    me.dialog.open();

    //暂定直接向content中添加数据
    me.dContent = me.dialog.getContent();
    me.tmpContent = document.createElement('div');

    //log tpl
    me.logTpl = {
        data: '<div>{#type}#{content}</div>',
        type: '<span style="font-color:#{color}">#{type}:<span>',
        content: '<span>#{content}<span>'
    };

    me.color = {
        log: 'black',
        info: 'yellow',
        warn: 'blue',
        error: 'red'
    };
};
baidu.extend(baidu.tools.log.Dialog,{
    
    /**
     * 打开dialog
     * @public
     * @return {Null}
     */
    open: function(){
        this.dialog.open();        
    },
    
    /**
     * 关闭dialog
     * @public
     * @return {Null}
     */
    close: function(){
        this.dialog.close();
    },

    /**
     * 向dialog中pushlog日志
     * @public
     * @return {Null}
     */
    push:function(data){
        var me =  this,
            data = data || [],
            dataString = []
            tmpChild = [];

        baidu.each(data,function(d,i){
            dataString.push(me._getString(d));
        });

        me.tmpContent.innerHTM = dataString.join('');
        tmpChild = baidu.dom.children(me.tmpContent);
        (tmpChild.legth > 0) && baidu.each(tmpChild, function(d,i){
            me.dContent.append(d);
        });
    },

    /**
     * 清空数据
     * @public
     * @return {Null}
     */
    clear: function(){
           
    },

    _getString:function(data){
        var me = this,
            typeStr= data.type,
            contentData = data.content;

        return baidu.format(me.logTpl['data'],{
            title: baidu.format(me.logTpl['title'],{
                color: me.color[typeStr],
                title: typeStr
            }),
            content: baidu.format(me.logTpl['content'],{
                content: me._getContentString(contentData)
            })
        });
    },

    /**
     * 根据不同的数据列型生成不同的content字符串，并返回
     * @private
     * @param {Object} data content数据
     * @return {String} str
     * */
    _getContentString: function(data){
        var me = this,
            str = '';
        
        //判断数据类型
        //目前支持数据类型：
        //Array,Object,Boolean,Date,String,Number
        if(baidu.lang.isArray(data)) str = me._echoArray(data);
        else if(baidu.lang.isDate) str = me._echoDate(data);
        else if(baidu.lang.isObject) str = me._echoObject(data);
        else if(baidu.lang.isString) str = me._echoString(data);
        else if(baidu.lang.isNumber) str = me._echoNumber(data);

        return str;
    },

    _echoArray: function(data){
        var me = this,
            resultStr = [];
                    
        baidu.each(data,function(item,index){
            resultStr.push(me._getContentString(item));
        });

        return '[' + resultStr.join(',') + ']';
    },

    _echoObject: function(data){
        var me = this,
            resultStr = [];

        baidu.each(data,function(item,index){
            resultStr.push( index + '=' + me._getContentString(item));
        });

        return '{' + resultStr.join(',') + '}';          
    },

    _echoDate: function(data){
        return data.toString();       
    },

    _echoString: function(data){
        return data.toString();
    },

    _echoNumber: function(data){
        return data.toString(); 
    }
});

baidu.dom.ready(function(){
    baidu.tools.log.DInstance = new baidu.tools.log.Dialog();
});
