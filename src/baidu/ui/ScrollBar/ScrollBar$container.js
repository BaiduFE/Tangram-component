/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.ScrollBar;
///import baidu.dom.g;
///import baidu.lang.Class.addEventListeners;
/**
 * 让滚动条邦定一个容器
 * @param   {Object}                options config参数.
 * @config  {String|HTMLElement}    container 一个容器的dom或是id的字符串
 * @author linlingyu
 */
baidu.ui.ScrollBar.register(function(me) {
    if (!me.container) {return;}
    me.addEventListeners({
        load: function() {
            me.update();
            if (me.orientation == 'vertical') {
                me._registMouseWheelEvt(me.getContainer());
            }
        },
        beforeupdate: function() {
            var me = this;
                axis = me._axis[me.orientation],
                container = me.getContainer();
            if (!container) {return;}

            me.dimension = Math.round(container[axis.clientSize]
                    / container[axis.scrollSize] * 100);
            me.value = container[axis.scrollSize] - container[axis.clientSize];
            me.value > 0 && (me.value = Math.round(container[axis.scrollPos]
                / (container[axis.scrollSize]
                - container[axis.clientSize]) * 100));
        },
        scroll: function(evt) {
            var container = me.getContainer(),
                axis = me._axis[me.orientation];
            container[axis.scrollPos] = evt.value / 100
                * (container[axis.scrollSize] - container[axis.clientSize]);
        }
    });
});
baidu.object.extend(baidu.ui.ScrollBar.prototype, {
    /**
     * 取得用户传入的需要被滚动条管理的对象
     * @return {HTMLElement}
     */
    getContainer: function() {
        return baidu.dom.g(this.container);
    }
});
