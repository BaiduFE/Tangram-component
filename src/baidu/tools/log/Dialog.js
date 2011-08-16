/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
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
///import baidu.lang.isString;

///import baidu.ui.Dialog;
///import baidu.ui.Dialog.Dialog$resizable;
///import baidu.ui.Dialog.Dialog$draggable;
///import baidu.ui.Dialog.Dialog$coverable;
///import baidu.ui.Dialog.Dialog$closeButton;

///import baidu.ui.Tab;

///import baidu.tools;
///import baidu.tools.log;

/**
 * 打印日志
 * @class
 * @grammar new baidu.tools.log.Dialog(options)
 */
baidu.tools.log.Dialog = function(options){
    var me = this,
        options = options || {};

    me.dialog = new baidu.ui.Dialog({
        width: '522',
        height: '250',
        titleText: 'tangram debug window',
        left:'380px',
        top:'130px'
    },options.dialogOptions || {});
    me.dialog.render();
    me.dialog.open();

    me.tab = new baidu.ui.Tab({
        items: [
            {head: 'all'},
            {head: 'log'},
            {head: 'info'},
            {head: 'warn'},
            {head: 'error'}
        ]
    });
    me.tab.render(me.dialog.getContent());
    me.tabIndex = {
        'all': 0,
        'log': 1,
        'info': 2,
        'warn': 3,
        'error': 4
    };
    
    //log tpl
    me.logTpl = {
        data: '<div>#{content}</div>',
        content: '<span>#{content}</span>',
        split: '<div style="height:1px; background-color:white;"></div>'
    };

    me.color = {
        log: 'black',
        info: 'yellow',
        warn: 'blue',
        error: 'red'
    };
};

baidu.tools.log.Dialog.prototype = {
   
    _verifyFunction: [
        [baidu.lang.isString,'String'],
        [baidu.lang.isNumber,'Number'],
        [baidu.lang.isDate,'Date'],
        [baidu.lang.isArray,'Array'],
        [baidu.lang.isObject,'Object']
    ],

    /**
     * 打开dialog
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
            tmpChild = [],

        baidu.each(data,function(d,i){
            dataString.push(me._getString(d));
            dataString.push(me.logTpl.split);
        });
        
        dataString = dataString.join('');
        me.tab.insertContentHTML(dataString,me.tabIndex['all']);
    },

    /**
     * 清空数据
     * @public
     * @return {Null}
     */
    clear: function(type){
        var me = this,
            type = type || "all";

        if(type == 'all'){
            baidu.object.each(me.tab.bodies,function(item,i){
                item.innerHTML = '';
            });
        }else{
            me.tab.insertContentHTML('',me.index[type]);
        }
    },

    _getString:function(data){
        var me = this,
            type= data.type,
            contentData = data.data,
            contentString = '';

        contentString = baidu.format(me.logTpl['data'],{
            content: baidu.format(me.logTpl['content'],{
                content: me._getContentString(contentData)
            })
        });

        me.tab.insertContentHTML(contentString,me.tabIndex[type]);
        me.tab.insertContentHTML(me.logTpl.split,me.tabIndex[type]);
        return contentString;
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

        return '[' + resultStr.join(', ') + ']';
    },

    _echoObject: function(data){
        var me = this,
            resultStr = [];

        baidu.object.each(data,function(item,index){
            resultStr.push( index + '=' + me._getContentString(item));
        });

        return 'Object { ' + resultStr.join(', ') + ' }';          
    },

    _echoDate: function(data){
        return data.toString();       
    },

    _echoString: function(data){
        return '"' + data.toString() + '"';
    },

    _echoNumber: function(data){
        return data.toString(); 
    }
};
