/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Tooltip;
///import baidu.ui.get;
///import baidu.event._eventFilter.mouseenter;
///import baidu.event._eventFilter.mouseleave;
///import baidu.event.getTarget;
///import baidu.dom.getAncestorBy;
///import baidu.lang.isArray;
///import baidu.array.each;
///import baidu.event.stop;
/**
 * 支持鼠标滑过隐藏显示
 * @name  baidu.ui.Tooltip.Tooltip$hover
 * @addon baidu.ui.Tooltip
 */
baidu.ui.Tooltip.extend({
    hideDelay: 500
});

baidu.ui.Tooltip.register(function(me) {
    
    if (me.type != 'hover') {return;}//断言句式

    var hideHandle = null,
        mouseInContainer = false;//用标识鼠标是否落在Tooltip容器内

    //onload时绑定显示方法
    me.addEventListener("onload", function(){
        baidu.each(me.target,function(target){
            me.on(target, 'mouseenter', showFn);
            me.on(target, 'mouseleave', hideFn);
        });
        me.on(me.getBody(), 'mouseover', setMouseInContainer);
        me.on(me.getBody(), 'mouseout', setMouseInContainer);
    });
    
    //用于设置鼠标在移入和移出Tooltip-body时标识状态
    function setMouseInContainer(evt){
        mouseInContainer = (evt.type.toLowerCase() == 'mouseover');
        !mouseInContainer && hideFn(evt);
    }
    
    //显示tooltip
    function showFn(e){
        hideHandle && clearTimeout(hideHandle);
        me.open(this);
    }

    //隐藏tooltip
    function hideFn(e){
        hideHandle = setTimeout(function(){
            !mouseInContainer && me.close();
        }, me.hideDelay);
    }
});
