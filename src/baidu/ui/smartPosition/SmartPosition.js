/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/smartPosition.js
 * author: berg
 * version: 1.0.0
 * date: 2010-07-07
 */



///import baidu.ui.smartPosition;

///import baidu.ui.createUI;

///import baidu.dom.getWindow;
///import baidu.dom.getStyle;
///import baidu.dom.setStyles;
///import baidu.dom.getPosition;
///import baidu.dom._styleFilter.px;
///import baidu.ui.smartPosition.setBorderBoxStyles;


///import baidu.event.on;
///import baidu.page.getViewWidth;
///import baidu.page.getViewHeight;
///import baidu.page.getScrollTop;
///import baidu.page.getScrollLeft;

/**
 *
 *  智能定位，根据用户参数将元素定位到指定位置
 *  TODO: 1. 如果物件定位以后，滚动条出现或者消失，定位可能不准确
 *        2. 用surround做触边折返场景时, 折返的大小通常是原始高宽+另一元素的高宽
 * @param {Object}  [options]
 * @param {Boolean} [options.once = false] 是否默认 window resize
 * 
 * @usage:
 *
 *      baidu.ui.smartPosition(element, options);
 *
 */

baidu.ui.smartPosition.SmartPosition = baidu.ui.createUI(function(options){
    var me = this;

/*
 * todo
    if(!baidu.getAttr(element, 'data-tg-smartposition')){
        baidu.setAttr(element, 'data-tangram', '1');
    }
*/

    if(!this.once){
        baidu.event.on(baidu.dom.getWindow(me.source), "resize", function (){
            me.update();
        });
    }
}).extend({


    //是否只设置一次（为true则不绑定window.resize）
    //once        : false,
    //默认放在右下角
    position    : "bottomright",
    insideScreen : "default",
    //默认放在页面最左上方
    //coordinate  : [0,0],
    offset      : [0,0],
    //onbeforeupdate : new Function,
    //onupdate : new Function,

    /*
     * update smartPosition 定位的元素
     */

    update      : function(options, noFireEvent){
        var me = this,
            elementStyle = {},
            source = me.source,
            cH = baidu.page.getViewHeight(),
            cW = baidu.page.getViewWidth(),
            sourceWidth = source.offsetWidth,
            sourceHeight = source.offsetHeight,
            offsetParent = source.offsetParent,
            parentPos = (!offsetParent || offsetParent == document.body) ? {left:0,top:0} : baidu.dom.getPosition(offsetParent);

        baidu.object.extend(this, options || {});
        //兼容position大小写
        me.position = me.position.toLowerCase();
        //兼容两种coordinate格式
        me.coordinate.x = me.coordinate[0] || me.coordinate.x || me.coordinate.left || 0;
        me.coordinate.y = me.coordinate[1] || me.coordinate.y || me.coordinate.top || 0;
        me.offset.x = me.offset[0] || me.offset.x || me.offset.left || 0;
        me.offset.y = me.offset[1] || me.offset.y || me.offset.top || 0;
        
        me.dispatchEvent("onbeforeupdate");
       
        
        elementStyle.left = me.coordinate.x + me.offset.x - parentPos.left - (me.position.indexOf("left") >= 0 ? sourceWidth : 0);
        elementStyle.top = me.coordinate.y + me.offset.y - parentPos.top - (me.position.indexOf("top") >= 0 ? sourceHeight : 0);
        switch (me.insideScreen){
            case "surround" :
                elementStyle.left = me.coordinate['x'] - parentPos.left - (
                    me.position.indexOf("left") >= 0 ? (me.coordinate["x"] - baidu.page.getScrollLeft() > sourceWidth ? sourceWidth : 0) :
                                                       (cW - me.coordinate["x"] + baidu.page.getScrollLeft() > sourceWidth ? 0 : sourceWidth)
                );
                
                elementStyle.top = me.coordinate['y'] - parentPos.top - (
                    me.position.indexOf("top") >= 0 ? (me.coordinate["y"] - baidu.page.getScrollTop() > sourceHeight ? sourceHeight : 0) : 
                                                      (cH - me.coordinate["y"] + baidu.page.getScrollTop() > sourceHeight ? 0 : sourceHeight)
                );
                break;
            case "fix" :
                elementStyle.left = Math.max(
                        0 - parseFloat(baidu.dom.getStyle(source, "marginLeft")) || 0,
                        Math.min(
                            elementStyle.left,
                            baidu.page.getViewWidth() - sourceWidth - parentPos.left
                            )
                        );
                elementStyle.top = Math.max(
                        0 - parseFloat(baidu.dom.getStyle(source, "marginTop")) || 0,
                        Math.min(
                            elementStyle.top,
                            baidu.page.getViewHeight() - sourceHeight - parentPos.top
                            )
                        );
                break;
            default :;
        }
        baidu.ui.smartPosition.setBorderBoxStyles(source, elementStyle);
        
        //如果因为调整位置令窗口产生了滚动条，重新调整一次。
        //可能出现死循环，用noFireEvent保证重新调整仅限一次。
        if(!noFireEvent && (cH != baidu.page.getViewHeight() || cW != baidu.page.getViewWidth())){
            me.update({}, true);
        }
        if(!noFireEvent){
            me.dispatchEvent("onupdate");
        }
    }
    
});
