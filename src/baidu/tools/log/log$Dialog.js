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
///import baidu.array.each;
///import baidu.object.each;
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
///import baidu.ui.Dialog.Dialog$smartCover;
///import baidu.ui.Dialog.Dialog$closeButton;

///import baidu.ui.Tab;

///import baidu.tools;
///import baidu.tools.log;

baidu.tools.log.Dialog = function(options){
    var me = this,
        options = options || {};

    me.dialog = new baidu.ui.Dialog({
        width: '200',
        height: '30',
        titleText: 'tangram debug window',
        left:'600px',
        top:'30px'
    },options.dialogOptions || {});
    me.dialog.render();
    me.dialog.open();

    //暂定直接向content中添加数据
    me.dContent = me.dialog.getContent();
    me.tmpContent = document.createElement('div');
   
    me.tab = new baidu.ui.Tab({
        items: [
            {head: 'all'},
            {head: 'log'},
            {head: 'error'},
            {head: 'info'},
            {head: 'warn'}
        ]
    });
    me.tab.render(me.dialog.getContent());
    
    //log tpl
    me.logTpl = {
        data: '<div>#{type}#{content}</div>',
        type: '<span style="font-color:#{color}">#{type}:</span>',
        content: '<span>#{content}</span>'
    };

    me.color = {
        log: 'black',
        info: 'yellow',
        warn: 'blue',
        error: 'red'
    };
};
baidu.extend(baidu.tools.log.Dialog.prototype,{
   
    _verifyFunction:[
        [baidu.lang.isString,'String'],
        [baidu.lang.isNumber,'Number'],
        [baidu.lang.isDate,'Date'],
        [baidu.lang.isArray,'Array'],
        [baidu.lang.isObject,'Object']
    ],

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

        me.tmpContent.innerHTML = dataString.join('');
        tmpChild = baidu.dom.children(me.tmpContent);
        (tmpChild.length > 0) && baidu.each(tmpChild, function(d,i){
            me.dContent.appendChild(d);
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
            contentData = data.data;

        return baidu.format(me.logTpl['data'],{
            type: baidu.format(me.logTpl['type'],{
                color: me.color[typeStr],
                'type': typeStr
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
        baidu.each(me._verifyFunction,function(fun,index){
            
            if(fun[0](data)){
                str = me['_echo' + fun[1]](data);
                return false;
            }
        }); 
        
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

        baidu.object.each(data,function(item,index){
            resultStr.push( index + '=' + me._getContentString(item) + '<br/>');
        });

        return 'Object = {' + resultStr.join(',') + '}';          
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
