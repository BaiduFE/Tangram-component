/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

baidu.ui.Console = baidu.ui.createUI(function(options){
}).extend(
    /**
     *  @lends baidu.ui.Console.prototype
     */
{

    //console对象，使用浏览器内置对象或者baidu.ui.console生成的对象
    _console: null,

    //是否默认使用浏览器中已经存在的console对象
    useNatvie: true,

    //message type的枚举类型
    _type: {
        log: 'log',
        info: 'info',
        error: 'error',
        warn: 'warn'
    },

    //当console处于隐藏状态时，并不向console输出内容，而是只记录在_log数组中
    //使用该变量记录index，当console被呼出，从该index开始向console进行输出
    _index: 0,

    //用来存储需要输出的内容，格式为{type:[content[,content,...]]} 
    _log: [],

    //存储time handler
    _timeHandler: {},

    //是否以显示console的标志位
    _isShown: false, 

    //html模板
    //目前的设想是使用和dialog相似的样式，在顶部放有closebutton和draggable的title
    //下面时可点击的目录，用来分别显示log，error，info，warn，以及all
    //可以使用快捷键进行呼出与隐藏

    /**
     * @private
     * 获取console的html代码
     */
    getString: function() {},

    /**
     * @public
     * 绘制console到页面
     */
    render: function() {},

    /**
     * @public
     * 打印log到console
     * @param {Object[,Object,...]} content 需要输出的内容,支持多参数
     * @return {Null}
     */
    log: function(content) {
        var me = this;
        me._write(me._type.log,arguments);
    },
    
    /**
     * @public
     * 打印error到console
     * @param {Object[,Object,...]} content 需要输出的内容,支持多参数
     * @return {Null}
     */
    error: function(content) {
        var me = this;
        me._write(me._type.error,arguments);      
    },
    
    /**
     * @public
     * 打印warn到console
     * @param {Object[,Object,...]} content 需要输出的内容,支持多参数
     * @return {Null}
     */
    warn: function(content) {
        var me = this;
        me._write(me._type.warn,arguments);     
    },

    /**
     * @public
     * 打印log到console
     * @param {Object[,Object,...]} content 需要输出的内容,支持多参数
     * @return {NULL}
     */
    info: function(content) {
        var me = this;
        me._write(me._type.info,arguments);     
    },

    /**
     * @public
     * 创建计时器
     * @param {String} name 计时器的handler name，若传入的name已经存在，则自动停止并重新创建
     * @return {Null}
     */
    time: function(name){},

    /**
     * @public
     * 停止计时器并输出时间
     * @param {String} name 计时器的handler name，若传入的name存在，则停止并输出时间，不存在则输出error
     * @return {Null}
     */
    timeEnd: function(name){},

    /**
     * @public
     * 清除log日志
     * @return {Null}
     */
    clear: function() {},

    /**
     * @private
     * 将文本输出值console
     * @param {String} type 文本的输出类型
     * @param {Object} content 输出美容@param {Object} 需要输出的内容
     * @return {Null}
     */
    _write: function(type,content) {
        /**
         * 目前的设想时这样的：
         * 1.支持String format，即当传入的第一个参数为带有带有format标识的字符串时，将之后传入的参数与其进行format计算，并输出
         * 2.支持传入Object对象，遍历其所有的子对象，并输出
         * */
    },

    /**
     * @public
     * 显示console
     * @return {Null}
     */
    show: function(){
        //若此时使用的时浏览器内置的console，需要运行特定的commandline API
        //不知是否可行，需调研
    },

    /**
     * @public
     * 隐藏console
     * @return {Null}
     */
    hide: function(){
        //若此时使用的时浏览器内置的console，需要运行特定的commandline API
        //不知是否可行，需调研
    },

    /**
     * @private
     * 将未输出到console的数据输入输出
     * @return {Null}
     */
    _push: function(){
    
    }
});
