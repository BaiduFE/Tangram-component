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

baidu.tools.log = function(){
    var me = this;

    me._logStack = [];
    me._timeObject = {};

    me.callBack = new Function();
    me.timeStep = 0;
    
    me._logLevel = {
        'log': 0,
        'info': 1,
        'warn': 2,
        'error': 3
    };

    me.logLevel = 0;


    /**
     * 设置的push数据时使用的timeHandler
     * 若timeStep为零，则立即输出数据
     **/
    me._timeHandler = null;

};



baidu.extend(baidu.tools.log.prototype,{

    /**
     * 打印log
     * @public
     * @param {Object} data 需要打印的内容
     * @return {Null}
     * */
    log: function(data){
        this._log(data,'log');
    },

    /**
     * 打印error
     * @public
     * @param {Object} data 需要打印的内容
     * @return {Null}
     * */
    error: function(data){
        this._log(data,'error');
    },

    /**
     * 打印info
     * @public
     * @param {Object} data 需要打印的内容
     * @return {Null}
     * */
    info: function(data){
        this._log(data,'info');
    },

    /**
     * 打印warn
     * @public
     * @param {Object} data 需要打印的内容
     * @return {Null}
     * */
    warn: function(data){
        this._log(data,'warn');
    },

    /**
     * 设置timer
     * @public
     * @param {String} name timer的标识名称
     * @return {Null}
     */
    time: function(name){
        var me = this,
        timeOld = me._timeObject[name],
        timeNew = new Date().getTime();

        if(timeOld){
            me._log(timeNew - timeOld, 'info');
        }else{
            me._timeObject[name] = timeNew;
        }
    },

    /**
     * 终止timer,并打印
     * @public
     * @param {String} name timer的标识名称
     * @return {Null}
     */
    timeEnd: function(name){
        var me = this,
        timeOld = me._timeObject[name],
        timeNew = new Date().getTime();

        if(timeOld){
            me._log(timeNew - timeOld, 'info');
            delete(me._timeObject[name]);
        }else{
            me._log('timer not exist', 'error');
        }
    },

    /**
     * 输出log
     * @public
     * @param {String} data 需要打印的内容
     * @return {Null}
     */
    _log: function(data,type){
        var me = this;
      
        if(me._logLevel[type] >= me.logLevel){
            
            //log 压栈
            me._logStack.push({type:type,data:data});

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
            data = me._logStack;

        //清空栈
        me._logStack = [];

        baidu.tools.log.DInstance && baidu.tools.log.DInstance.push(data);
        me.callBack(data);
    },

    
    

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

baidu.logger = function(){
    return new baidu.tools.log();
}();
