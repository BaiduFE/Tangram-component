/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: tools/log.js
 * author: lixiaopeng
 * version: 1.0.0
 * date: 2011/2/28
 */

///import baidu.object.extend;

///import baidu.tools;

/**
 * 打印log
 * @public
 * @param {String} log 需要打印的内容
 * @return {Null}
 * */
baidu.tools.log = function(log){
    this._log(log,'log');
};

/**
 * 打印error
 * @public
 * @param {String} log 需要打印的内容
 * @return {Null}
 * */
baidu.tools.log.error = function(log){
    this._log(log,'error');
};

/**
 * 打印info
 * @public
 * @param {String} log 需要打印的内容
 * @return {Null}
 * */
baidu.tools.log.info = function(log){
    this._log(log,'info');
};

/**
 * 打印warn
 * @public
 * @param {String} log 需要打印的内容
 * @return {Null}
 * */
baidu.tools.log.warn = function(log){
    this._log(log,'warn');
};

/**
 * 设置timer
 * @public
 * @param {String} name timer的标识名称
 * @return {Null}
 */
baidu.tools.log.time = function(name){
    var me = this,
        timeOld = me._timeObject[name],
        timeNew = new Date().getTime();
    
    if(timeOld){
        me._log(timeNew - timeOld, 'info');
    }else{
        me._timeObject[name] = timeNew;
    }
};

/**
 * 终止timer,并打印
 * @public
 * @param {String} name timer的标识名称
 * @return {Null}
 */
baidu.tools.log.timeEnd = function(name){
    var me = this,
        timeOld = me._timeObject[name],
        timeNew = new Date().getTime();

    if(timeOld){
        me._log(timeNew - timeOld, 'info');
        delete(me._timeObject[name]);
    }else{
        me._log('timer not exist', 'error');
    }
};

baidu.extend(baidu.tools.log,{
    
    /**
     * 输出log
     * @public
     * @param {String} log 需要打印的内容
     * @return {Null}
     */
    _log: function(log,type){
        var me = this;
      
        if(me._logLevel[type] >= me.logLevel){
            
            //log 压栈
            me._logStack.push({type:log});

            if(me.timeStep == 0){
                //如果这是time为0，则立即调用_push方法
                me._push(); 
            }else{
                //如果timeStep > 0
                if(!me._timeHandler){

                    me._timeHandler = setInterval(_p,me.timeStep * 1000);
                    function _p(){
                        me._push();
                    }
                }
            }
        }
    },

    /**
     * 推送log,并调用回调函数
     * @private
     * @return {Null}
     */
    _push: function(){
        var me = this,
            log = me._logStack;

        //清空栈
        me._logStack = [];

        baidu.tools.log.DInstance && baidu.tools.log.DInstance.push(log);
        me.callBack(log);
    },

    _logStack: [],
    _timeObject: {},

    callBack: new Function(),
    timeStep: 0,
    
    _logLevel: {
        'log': 0,
        'info': 1,
        'warn': 2,
        'error': 3
    },

    logLevel: 0,


    /**
     * 设置的push数据时使用的timeHandler
     * 若timeStep为零，则立即输出数据
     **/
    _timeHandler: null,

    /**
     * 传入log配置
     * @public {Object} log配置
     * @config {Function} callBack 当log向外push数据时，同时调用的函数，并井数据以参数形式传入
     * @config {Number} timeStep 设置log输出时间间隔，默认为0，即只要有数据就立即输出
     * @config {String} logLevel 所需记录的log的等级,枚举值['log','error','info','warn']
     */
    config: function(cfg){
        var me = this,
            cfg = cfg || {}; 

        (cfg.logLevel && me._logLevel[cfg.logLevel]) &&(cfg.logLevel = me._logLevel[cfg.logLevel]);
        baidu.extend(me,cfg);
        
        //停止当前的计时
        if(me._timeHandler && me.timeStep == 0){
            clearInterval(me._timeHandler);
            me._timeHandler = null;
        }
    }
});
