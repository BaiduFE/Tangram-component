/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.object.extend;
///import baidu.tools;
///import baidu.array.each;
///import baidu.fn.blank;
/**
 * 打印log
 * @class
 * @name baidu.tools.log
 * @grammar baidu.tools.log
 * @param {Object} data 需要打印的内容
 * @return {Null}
 */
(function(){
 
        //日志队列
    var _logStack = [], 

        //存放time调用的datehandle
        _timeObject = {},   
        
        /**
         * 设置的push数据时使用的timeHandler
         * 若timeInterval为零，则立即输出数据
         **/
        _timeHandler = null,

        timeInterval = 0,
    
        _logLevel = parseInt('1111',2),

        _enableDialg = false,
        _dialog = null;
     
    /**
     * 打印log
     * @class
     * @grammar baidu.tools.log
     * @param {Object} data 需要打印的内容
     * @return {Null}
     */
    function log(data){
        _log(data, 'log'); 
    };

    /**
     * 打印error
     * @memberOf baidu.tools.log.prototype
     * @param {Object} data 需要打印的内容
     * @return {Null}
     */
    log.error = function(data){
        _log(data,'error');
    };

    /**
     * 打印info
     * @memberOf baidu.tools.log.prototype
     * @param {Object} data 需要打印的内容
     * @return {Null}
     */
    log.info = function(data){
        _log(data,'info');
    };

    /**
     * 打印warn
     * @memberOf baidu.tools.log.prototype
     * @param {Object} data 需要打印的内容
     * @return {Null}
     */
    log.warn = function(data){
        _log(data,'warn');
    };

    /**
     * 设置timer
     * 若此时一寸在相同名称的计时器，则立即输出，并重新初始化
     * 若不存在，则初始化计时器
     * @memberOf baidu.tools.log.prototype
     * @param {String} name timer的标识名称
     * @return {Null}
     */
    log.time = function(name){
        var timeOld = _timeObject[name],
            timeNew = new Date().getTime();

        if(timeOld){
            _log(timeNew - timeOld, 'info');
        }
        _timeObject[name] = timeNew;
    };

    /**
     * 终止timer,并打印
     * @memberOf baidu.tools.log.prototype
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
     * 开启dialog进行输出
     * @memberOf baidu.tools.log.prototype
     * @return {Null}
     */
    log.enableDialog = function(){
        
        _enableDialg = true;
        if(!_dialog && baidu.tools.log.Dialog){
            baidu.tools.log.DInstance = _dialog = new baidu.tools.log.Dialog();
        }else{
            _dialog.open();
        }
    };

    /**
     * 关闭dialog
     * @memberOf baidu.tools.log.prototype
     * @return {Null}
     */
    log.disableDialog = function(){
        
        _enableDialg = false;
        _dialog && _dialog.close();
    };
   
    /**
     * 输出log
     * @private
     * @param {String} data 需要打印的内容
     * @return {Null}
     */
    function _log (data,type){
        var me = log;

        if(_logLevel & me.logLevel[type]){
            _logStack.push({type:type,data:data});
        }

        if(timeInterval == 0){
            //如果这是time为0，则立即调用_push方法
            _push();
        }else{
            //如果timeInterval > 0
            !_timeHandler && (_timeHandler = setInterval(_push,timeInterval));
        }
    };

    /**
     * 推送log,并调用回调函数
     * @private
     * @return {Null}
     */
    function _push (){
        var me = log,
            data = _logStack;

        //清空栈
        _logStack = [];
        _dialog && _dialog.push(data);

        me.callBack(data);
    };

    /**
     * 设置log的timeInterval值
     * 当timeInterval = 0时，则当有日志需要输出时，立即输出
     * 当timeInterval > 0时，则以该timeStep为间隔时间，输出日志
     * 默认值为0
     * @param {Number} ts timeInterval
     * @return {Null}
     * @memberOf baidu.tools.log.prototype
     */
    log.setTimeInterval = function(ti){
        
        timeInterval = ti;
        
        //停止当前的计时
        if(_timeHandler && timeInterval == 0){
            clearInterval(_timeHandler);
            _timeHandler = null;
        }
    };

    
   /**
    * 设置所要记录的log的level
    * @param {String} 'log','error','info','warn'中一个或多个
    * @return {Null}
    * @memberOf baidu.tools.log.prototype
    */ 
    log.setLogLevel = function(){
        var me = log,
            logLevel = parseInt('0000',2);
            
        baidu.each(arguments,function(ll){
            logLevel = logLevel | me.logLevel[ll];
        });

        _logLevel = logLevel;
    };
   
    //日志等级
    log.logLevel = {
        'log'   : parseInt('0001', 2),
        'info'  : parseInt('0010', 2),
        'warn'  : parseInt('0100', 2),
        'error' : parseInt('1000', 2)
    };

    //回调函数
    log.callBack = baidu.fn.blank;

    baidu.log = baidu.tools.log = log;
})();
