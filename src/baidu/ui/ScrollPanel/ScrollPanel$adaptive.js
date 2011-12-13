/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.ui.ScrollPanel;
///import baidu.ui.ScrollBar.ScrollBar$container;
///import baidu.lang.isNumber;

/**
 * 为滚动面板增加自动适应功能
 * @name baidu.ui.ScrollPanel.ScrollPanel$poll
 * @addon baidu.ui.ScrollPanel
 * @param {Object} options config参数.
 * @config {Boolean} adaptive 是否支持当滚动容器大小发生变化时自适应滚动面板，默认支持
 * @author linlingyu
 */
baidu.ui.ScrollPanel.register(function(me){
    if(!me.adaptive){return;}
    me.addEventListener('onload', function(){
        var interval = 20,
            container = me.getContainer(),
            offset = {
                w: container.clientWidth,
                h: container.clientHeight
            },
            timer = setInterval(function(){
                var container = me.getContainer(),
                    prevVal = offset, newVal;
                if(prevVal.w == container.clientWidth
                    && prevVal.h == container.clientHeight){return;}
                newVal = offset = {
                    w: container.clientWidth,
                    h: container.clientHeight
                };
                function isInnerChange(orie){//测试是否是scrollPanel内部对container进行了边界设置
                    var bar = me['_' + orie + 'Scrollbar'],
                        axis = me._axis[orie],
                        visible = bar ? bar.isVisible() : false,
                        val = me.getMain()[axis.unClientSize] - me.getContainer()[axis.unOffsetSize];
                    return (visible && val == me._scrollBarSize) || (!visible && val == 0);
                }
                if(isInnerChange('y') && isInnerChange('x')){return;}
                me.flushBounds();
            }, interval);
            me.addEventListener('dispose', function(){
                clearInterval(timer);
            });
    });
});
baidu.ui.ScrollPanel.extend({
    adaptive: true,
    
    /**
     * 根据滚动容器的大小来重新刷新滚动条面板的外观
     * @name baidu.ui.ScrollPanel.ScrollPanel$adaptive.flushBounds
     * @addon baidu.ui.ScrollPanel.ScrollPanel$adaptive
     * @function
     * @param {Object} bounds 给予一个滚动容器的大小变化值，例如：{width: 320, height:240}，该参数是可选，如果给出该参数，滚动容器将以该参数来重新设置，如果不给出该参数，滚动条的外观将以当时滚动容器的大小来自适应。
     */
    flushBounds: function(bounds){
        var me = this,
            main = me.getMain(),
            container = me.getContainer(),
            defaultVisible = {y: me._yVisible, x: me._xVisible},
            _bounds = {
                w: bounds && baidu.lang.isNumber(bounds.width) ? bounds.width : container.clientWidth,
                h: bounds && baidu.lang.isNumber(bounds.height) ? bounds.height : container.clientHeight
            };
        me.setVisible(false);
        container.style.width = _bounds.w + 'px';
        container.style.height = _bounds.h + 'px';
        main.style.width = container.offsetWidth + 'px';
        main.style.height = container.offsetHeight + 'px';
        me._yVisible = defaultVisible.y;
        me._xVisible = defaultVisible.x;
        me._smartVisible();
    }
});