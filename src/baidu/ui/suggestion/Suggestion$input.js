/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */


/**
 * 为Suggestion提供输入框监控功能
 */

///import baidu.ui.suggestion;
///import baidu.ui.suggestion.Suggestion;
///import baidu.event.preventDefault;
///import baidu.event.stopPropagation;
///import baidu.dom.g;
///import baidu.event.on;
///import baidu.event.un;

baidu.ui.suggestion.Suggestion.register(function(me) {
    var target,
            //每次轮询获得的value
            oldValue = '',
            //一打开页面就有的input value
            keyValue,

            //使用pick方法上框的input value
            pickValue,
            mousedownView = false,
            stopCircleTemporary = false;

    me.addEventListener('onload', function() {
        target = this.getTarget();

        keyValue = target.value;

        //生成dom事件函数
        me.targetKeydownHandler = me.getTargetKeydownHandler();

        //加入dom事件
        baidu.on(target, 'keydown', me.targetKeydownHandler);

        target.setAttribute('autocomplete', 'off');

        /*
         * 轮询计时器
         */
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

        baidu.on(target, 'beforedeactivate', me.beforedeactivateHandler);
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
        baidu.un(target, 'keydown', me.targetKeydownHandler);
        baidu.un(target, 'beforedeactivate', me.beforedeactivateHandler);
        clearInterval(me.circleTimer);
    });
});
baidu.object.extend(baidu.ui.suggestion.Suggestion.prototype, {

    selectIndexByKeybord: -1,

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
            var currentData = me.currentData,
                selected;
            //如果当前没有显示，就重新去获取一次数据
            if (!me.isShowing()) {
                me.dispatchEvent('onneeddata', me.getTargetValue());
                return;
            }
            selected = me.getHighlightIndex();
            me.clearHighlight();
            if (up) {
                //最上面再按上
                if (selected == 0) {
                    //把原始的内容放上去
                    me.pick(me.defaultIptValue);
                    me.selectIndexByKeybord--;
                    return;
                }
                if (selected == -1)
                    selected = currentData.length;
                selected--;
            }else {
                //最下面再按下
                if (selected == currentData.length - 1) {
                    me.pick(me.defaultIptValue);
                    me.selectIndexByKeybord = -1;
                    return;
                }
                selected++;
            }
            me.highlight(selected);
            me.pick(selected);
            me.selectIndexByKeybord = selected;
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
                    baidu.event.preventDefault(e);
                    me.confirm(me.selectIndexByKeybord < 0 ? me.getTarget().value : me.selectIndexByKeybord, 'keyboard');
                    break;
                case 38:    //向上，在firefox下，按上会出现光标左移的现象
                    up = true;
                case 40:    //向下
                    baidu.event.preventDefault(e);
                    keyUpDown(up);
                    break;
                default:
                    me.selectIndexByKeybord = -1;
            }
        };
    },

    /*
     * pick选择之外的oldValue
     */
    defaultIptValue: ''

});
