/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Suggestion;
///import baidu.event.stop;
///import baidu.dom.g;
///import baidu.event.on;
///import baidu.event.un;
/**
 * 支持快捷键操作，如上下，回车等
 * @name  baidu.ui.Suggestion.Suggestion$input
 * @addon baidu.ui.Suggestion
 */
baidu.ui.Suggestion.register(function(me) {
    var target,

        //每次轮询获得的value
        oldValue = '',

        //一打开页面就有的input value
        keyValue,

        //使用pick方法上框的input value
        pickValue,
        mousedownView = false,
        stopCircleTemporary = false;
    
    function initKeyValue(){
        setTimeout(function(){//防止opera和ie回退时自动打开sug
            keyValue = me.getTarget().value;
        }, 20);
    }

    me.addEventListener('onload', function() {
        target = this.getTarget();

        initKeyValue();
        
        me.on(window, 'onload', initKeyValue);

        //生成dom事件函数
        me.targetKeydownHandler = me.getTargetKeydownHandler();

        //加入dom事件
        me.on(target, 'keydown', me.targetKeydownHandler);

        target.setAttribute('autocomplete', 'off');

        //轮询计时器
        me.circleTimer = setInterval(function() {
            if (stopCircleTemporary) {
                return;
            }

            if (baidu.g(target) == null) {
                me.dispose();
            }

            var nowValue = target.value;
            //todo,这里的流程可以再简化一点
            if (
                nowValue == oldValue &&
                nowValue != '' &&
                nowValue != keyValue &&
                nowValue != pickValue
              ) {
                if (me.requestTimer == 0) {
                    me.requestTimer = setTimeout(function() {
                        me.dispatchEvent('onneeddata', nowValue);
                    }, 100);
                }
            }else {
                clearTimeout(me.requestTimer);
                me.requestTimer = 0;
                if (nowValue == '' && oldValue != '') {
                    pickValue = '';
                    me.hide();
                }
                oldValue = nowValue;
                if (nowValue != pickValue) {
                    me.defaultIptValue = nowValue;
                }
                if (keyValue != target.value) {
                    keyValue = '';
                }
            }
        }, 10);

        me.on(target, 'beforedeactivate', me.beforedeactivateHandler);
    });

    me.addEventListener('onitemclick', function() {
        stopCircleTemporary = false;
        //更新oldValue，否则circle的时候会再次出现suggestion
        me.defaultIptValue = oldValue = me.getTargetValue();
    });

    me.addEventListener('onpick', function(event) {
        //firefox2.0和搜狗输入法的冲突
        if (mousedownView)
            target.blur();
        target.value = pickValue = event.data.item.value;
        if (mousedownView)
            target.focus();
    });

    me.addEventListener('onmousedownitem', function(e) {
        mousedownView = true;
        //chrome和搜狗输入法冲突的问题
        //在chrome下面，输入到一半的字会进框，如果这个时候点击一下suggestion，就会清空里面的东西，导致suggestion重新被刷新
        stopCircleTemporary = true;
        setTimeout(function() {
            stopCircleTemporary = false;
            mousedownView = false;
        },500);
    });
    me.addEventListener('ondispose', function() {
        clearInterval(me.circleTimer);
    });
});

baidu.ui.Suggestion.extend({
    /*
     * IE和M$输入法打架的问题
     * 在失去焦点的时候，如果是点击在了suggestion上面，那就取消其默认动作(默认动作会把字上屏)
     */
    beforedeactivateHandler: function() {
        return function() {
            if (mousedownView) {
                window.event.cancelBubble = true;
                window.event.returnValue = false;
            }
        };
    },

    getTargetKeydownHandler: function() {
        var me = this;

        /*
         * 上下键对suggestion的处理
         */
        function keyUpDown(up) {

            if (!me._isShowing()) {
                me.dispatchEvent('onneeddata', me.getTargetValue());
                return;
            }

            var enableIndex = me.enableIndex,
                currentIndex = me.currentIndex;

            //当所有的data都处于disable状态。直接返回
            if (enableIndex.length == 0) return;
            if (up) {
                switch (currentIndex) {
                    case -1:
                        currentIndex = enableIndex.length - 1;
                        me.pick(enableIndex[currentIndex]);
                        me.highLight(enableIndex[currentIndex]);
                        break;
                    case 0:
                        currentIndex = -1;
                        me.pick(me.defaultIptValue);
                        me.clearHighLight();
                        break;
                    default:
                        currentIndex--;
                        me.pick(enableIndex[currentIndex]);
                        me.highLight(enableIndex[currentIndex]);
                        break;
                }
            }else {
                switch (currentIndex) {
                    case -1:
                        currentIndex = 0;
                        me.pick(enableIndex[currentIndex]);
                        me.highLight(enableIndex[currentIndex]);
                        break;
                    case enableIndex.length - 1:
                        currentIndex = -1;
                        me.pick(me.defaultIptValue);
                        me.clearHighLight();
                        break;
                    default:
                        currentIndex++;
                        me.pick(enableIndex[currentIndex]);
                        me.highLight(enableIndex[currentIndex]);
                        break;
                }
            }
            me.currentIndex = currentIndex;
        }
        return function(e) {
            var up = false, index;
            e = e || window.event;
            switch (e.keyCode) {
                case 9:     //tab
                case 27:    //esc
                    me.hide();
                    break;
                case 13:    //回车，默认为表单提交
                    baidu.event.stop(e);
                    me.confirm( me.currentIndex == -1 ? me.getTarget().value : me.enableIndex[me.currentIndex], 'keyboard');
                    break;
                case 38:    //向上，在firefox下，按上会出现光标左移的现象
                    up = true;
                case 40:    //向下
                    baidu.event.stop(e);
                    keyUpDown(up);
                    break;
                default:
                   me.currentIndex = -1;
            }
        };
    },

    /*
     * pick选择之外的oldValue
     */
    defaultIptValue: ''

});
