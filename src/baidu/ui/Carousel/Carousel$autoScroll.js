/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Carousel;
///import baidu.ui.Carousel.Carousel$cycle;
///import baidu.lang.Class.addEventListeners;

/**
 * 为滚动组件增加自动滚动功能
 * @name baidu.ui.Carousel.Carousel$autoScroll
 * @addon baidu.ui.Carousel.Carousel
 * @param {Object} options config参数.
 * @config {Boolean} isAutoScroll 是否支持自动滚动，默认支持
 * @config {Number} scrollInterval 以毫秒描述每次滚动的时间间隔
 * @config {String} direction 取值，up|right|down|left 描述组件的滚动方向
 * @config {Function} onautuscroll 一个事件，当触发一次autoscroll时触发该事件
 */
baidu.ui.Carousel.register(function(me){
    if(!me.isAutoScroll){return;}
    var key = me._getAutoScrollDirection();
    me.addEventListeners('onprev,onnext', function(){
        clearTimeout(me._autoScrollTimeout);//先清除上一次，防止多次运行
        me._autoScrollTimeout = setTimeout(function(){
            if(me._autoScrolling){
                me[key]();
                me.dispatchEvent('onautoscroll', {direction: key});
            }
        }, me.scrollInterval);
    });
    me.addEventListener('onload', function(evt){
        var me = evt.target;
        setTimeout(function(){
            me.startAutoScroll();
        }, me.scrollInterval);
    });
    me.addEventListener('ondispose', function(evt){
        clearTimeout(evt.target._autoScrollTimeout);
    });
});

baidu.ui.Carousel.extend(
/**
 *  @lends baidu.ui.Carousel.prototype
 */
{
    isAutoScroll: true,
    scrollInterval: 1000,
    direction: 'right',//up|right|down|left 描述组件的滚动方向
    _autoScrolling: true,
    /**
     * 取得当次设定的滚动方向字符串
     * @return {String} prev|next
     * @private
     */
    _getAutoScrollDirection: function(){
        var me = this,
            methods = {up: 'prev', right: 'next', down: 'next', left: 'prev'};
        return methods[me.direction.toLowerCase()]
            || methods[me.orientation == 'horizontal' ? 'right' : 'down'];
    },
    /**
     * 从停止状态开始自动滚动
	 * @name baidu.ui.Carousel.Carousel$autoScroll.startAutoScroll
	 * @addon baidu.ui.Carousel.Carousel$autoScroll
	 * @function 
     */
    startAutoScroll: function(){
        var me = this,
            direction = me._getAutoScrollDirection();
        me._autoScrolling = true;
        me[direction]();
        me.dispatchEvent('onautoscroll', {direction: direction});
    },
    /**
     * 停止当前自动滚动状态
	 * @name baidu.ui.Carousel.Carousel$autoScroll.stopAutoScroll
	 * @addon baidu.ui.Carousel.Carousel$autoScroll
	 * @function 
     */
    stopAutoScroll: function(){
        var me = this;
        clearTimeout(me._autoScrollTimeout);
        me._autoScrolling = false;
    }
});
