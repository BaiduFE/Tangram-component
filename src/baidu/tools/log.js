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

(function(){
 
        //日志队列
    var _logStack = [], 

        //存放time调用的datehandle
        _timeObject = {},   
        
        //回调函数
        callBack = new Function(),
        
        /**
         * 设置的push数据时使用的timeHandler
         * 若timeStep为零，则立即输出数据
         **/
        _timeHandler = null,
    
        /**
         * 时间间隔
         * 当timeStep = 0时，则当有日志需要输出时，立即输出
         * 当timeStep > 0时，则以该timeStep为间隔时间，输出日志
         * 默认值为0
         * */
        timeStep = 0,
    
        //日志等级
        _logLevel = {
            'log': 0,
            'info': 1,
            'warn': 2,
            'error': 3
        },

        //默认输出日志等级
        logLevel = 0;

    /**
     * 打印log
     * @public
     * @param {Object} data 需要打印的内容
     * @return {Null}
     */
    var log = function(data){
        _log(data, 'log'); 
    };

    /**
     * 打印error
     * @public
     * @param {Object} data 需要打印的内容
     * @return {Null}
     */
    log.error = function(data){
        _log(data,'error');
    },

    /**
     * 打印info
     * @public
     * @param {Object} data 需要打印的内容
     * @return {Null}
     */
    log.info = function(data){
        _log(data,'info');
    };

    /**
     * 打印warn
     * @public
     * @param {Object} data 需要打印的内容
     * @return {Null}
     */
    log.warn = function(data){
        _log(data,'warn');
    };

    /**
     * 设置timer
     * @public
     * @param {String} name timer的标识名称
     * @return {Null}
     */
    log.time = function(name){
        var timeOld = _timeObject[name],
            timeNew = new Date().getTime();

        if(timeOld){
            _log(timeNew - timeOld, 'info');
        }else{
            _timeObject[name] = timeNew;
        }
    };

    /**
     * 终止timer,并打印
     * @public
     * @param {String} name timer的标识名称
     * @return {Null}
     */
    log.timeEnd = function(name){
        var timeOld = _timeObject[name],
            timeNew = new Date().getTime();

        if(timeOld){
            _log(timeNew - timeOld, 'info');
            delete(_timeObject[name]);
        }else{
            _log('timer not exist', 'error');
        }
    };
   
    /**
     * 输出log
     * @public
     * @param {String} data 需要打印的内容
     * @return {Null}
     */
    var _log = function(data,type){
      
        if(_logLevel[type] >= logLevel){
            
            //log 压栈
            _logStack.push({type:type,data:data});

            if(timeStep == 0){
                //如果这是time为0，则立即调用_push方法
                _push(); 
            }else{
                //如果timeStep > 0
                !_timeHandler && (_timeHandler = setInterval(function(){_push();},timeStep));
            }
        }
    };

    /**
     * 推送log,并调用回调函数
     * @private
     * @return {Null}
     */
    var _push = function(){
        var data = _logStack;

        //清空栈
        _logStack = [];

        //dialog对话框
        baidu.tools.log.DInstance && baidu.tools.log.DInstance.push(data);
        callBack(data);
    };

    /**
     * 传入log配置
     * @public {Object} log配置
     * @config {Function} callBack 当log向外push数据时，同时调用的函数，并井数据以参数形式传入
     * @config {Number} timeStep 设置log输出时间间隔，默认为0，即只要有数据就立即输出
     * @config {String} logLevel 所需记录的log的等级,枚举值['log','error','info','warn']
     */
    log.update = function(cfg){
        var cfg = cfg || {}; 

        (cfg.logLevel && _logLevel[cfg.logLevel]) && (cfg.logLevel = _logLevel[cfg.logLevel]);
        
        callBack = cfg.callBack || callBack;
        timeStep = cfg.timeStep || timeStep;
        logLevel = cfg.logLevel || logLevel;

        //停止当前的计时
        if(_timeHandler && timeStep == 0){
            clearInterval(_timeHandler);
            _timeHandler = null;
        }
    };

    baidu.log = baidu.tools.log = log;
})();
