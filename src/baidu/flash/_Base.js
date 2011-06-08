/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu;
///import baidu.flash;

///import baidu.dom.g;
///import baidu.array.each;
///import baidu.lang.isFunction;
///import baidu.lang.isString;

///import baidu.swf.create;
///import baidu.swf.getMovie;

baidu.flash._Base = function(options){
    var me = this,
        autoRender = (typeof options.autoRender !== 'undefined' ? options.autoRender : true),
        createOptions = options.createOptions || {},
        id = '',
        target = null,
        prefix = 'bd__flash__',
        container = baidu.g(createOptions.container || ''),
        isReady = false,
        callQueue = [],
        timeHandle = null;

    /**
     * 将flash文件绘制到页面上
     * @public
     * @return {Null}
     */
    me.render = function(){
        if(!createOptions.id){
            createOptions.id = _createString();
        }
        id = createOptions.id;

        baidu.swf.create(createOptions, container);
        target = baidu.swf.getMovie(id);
    };

    /**
     * 创建一个随机的字符串
     * @private
     * @return {String}
     */
    function _createString(){
        return  prefix + Math.floor(Math.random() * 2147483648).toString(36);
    };

    /**
     * 返回flash状态
     * @return {Boolean}
     */
    me.isReady = function(){
        return isReady;
    };

    /**
     * 调用flash接口的统一入口
     * @param {String} fnName 调用的函数名
     * @param {Array} params 传入的参数组成的数组,若不许要参数，需传入空数组
     * @param {Function} [callBack] 异步调用后将返回值作为参数的调用回调函数，如无返回值，可以不传入此参数
     * @return {Null}
     */
    me.call = function(fnName, params, callBack){
        if(!fnName) return;
        callBack = callBack || new Function();

        var result = null;

        if(isReady){
            result = target.call(fnName, params);
            callBack(result);
        }else{
            callQueue.push({
                fnName: fnName,
                params: params,
                callBack: callBack
            });

            (!timeHandle) && (timeHandle = setInterval(_check, 16));
        }
    };

    /**
     * 为传入的匿名函数创建函数名
     * @param {String|Function} fun 传入的匿名函数或者函数名
     * @return {String}
     */
    me.createFunName = function(fun){
        var name = '';
        
        if(baidu.lang.isFunction(fun)){
            name = _createString();
            window[name] = function(){
                fun.apply(window, arguments);
            };

            return name;
        }else if(baidu.lang.isString){
            return fun;
        }
    }

    /**
     * 检查flash状态
     * @private
     */
    function _check(){
        if(target.flashInit && target.flashInit()){
            clearInterval(timeHandle);
            timeHandle = null;
            _call();

            isReady = true;
        }
    };

    /**
     * 调用之前进行压栈的函数
     * @private
     * @return {Null}
     */
    function _call(){
        var result = null;
        
        callQueue = callQueue.reverse();
        baidu.each(callQueue, function(item){
            result = target.call(item.fnName, item.params);
            item.callBack(result);
        });
        
        callQueue = [];
    };

    delete(createOptions.container);
    autoRender && me.render(); 
};
