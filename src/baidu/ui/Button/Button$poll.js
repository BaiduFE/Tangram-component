/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Button;
/**
 * 使按钮支持poll轮询，实现在按钮上点击并保持鼠标按着状态时连续激活事件侦听器
 * @name baidu.ui.Button.Button$poll
 * @function
 * @param {Object} options 创建scrollBar的自定义参数.
 * @param {Boolean} options.poll 当为true时表示需要使按钮是一个poll的按钮.当是{time: 4}表示400毫秒后第二次
 * @author linlingyu
 */
baidu.ui.Button.register(function(me){
    if(!me.poll){return;}
    me.addEventListener('mousedown', function(evt){
        var pollIdent = 0,
            timer = me.poll.time || 0;
        function invoke(){
            if(me.getState()['press']){
                pollIdent++ > timer && me.onmousedown();
                setTimeout(invoke, 100);
            }
        }
        invoke();
    });
});