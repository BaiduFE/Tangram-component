/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Button;
///import baidu.lang.isBoolean;
/**
 * 使按钮支持poll轮询，实现在按钮上点击并保持鼠标按着状态时连续激活事件侦听器
 * @name baidu.ui.Button.Button$poll
 * @addon baidu.ui.Button
 * @param   {Object}    options config参数.
 * @config  {Object}    poll 当为true时表示需要使按钮是一个poll的按钮，如果是一个json的描述，可以有两个可选参数：{interval: 100, time: 4}，interval表示轮询的时间间隔，time表示第一次执行和第二执行之间的时间间隔是time*interval毫秒 
 * @author linlingyu
 */
baidu.ui.Button.register(function(me) {
    if (!me.poll) {return;}
    baidu.lang.isBoolean(me.poll) && (me.poll = {});
    me.addEventListener('mousedown', function(evt) {
        var pollIdent = 0,
            interval = me.poll.interval || 100,
            timer = me.poll.time || 0;
        (function() {
            if (me.getState()['press']) {
                pollIdent++ > timer && me.onmousedown && me.onmousedown();
                me.poll.timeOut = setTimeout(arguments.callee, interval);
            }
        })();
    });
    me.addEventListener('dispose', function(){
        if(me.poll.timeOut){
            me.disable();
            window.clearTimeout(me.poll.timeOut);
        }
    });
});
