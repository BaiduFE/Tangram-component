/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/suggestion/Suggestion$fixWidth.js
 * author: berg
 * version: 1.1.0
 * date: 2010-06-02
 */

///import baidu.ui.suggestion.Suggestion;

///import baidu.object.extend;
///import baidu.browser.ie;
///import baidu.dom.getPosition;
///import baidu.dom.getStyle;
///import baidu.dom.setStyle;
///import baidu.dom._styleFilter.px;

///import baidu.ui.smartPosition.set;

///import baidu.event.on;
///import baidu.event.un;

/**
 * 为Suggestion提供位置校准功能
 */
baidu.extend(baidu.ui.suggestion.Suggestion.prototype, {
    fixWidth : true,
    getWindowResizeHandler : function(){
        var suggestion = this;
        return function(){
            suggestion.adjustPosition(true);
        };
    },

	/*
     * 重新放置suggestion
     * @private
     */
    adjustPosition : function(onlyAdjustShown){
        var suggestion = this,
            target = suggestion.getTarget(),
            targetPosition,
            main = suggestion.getMain(),
            pos;

        if(!suggestion.isShowing() && onlyAdjustShown){
            return ;
        }
        targetPosition = baidu.dom.getPosition(target),
        pos = {
                top     : (targetPosition.top + target.offsetHeight - 1),
                left    : targetPosition.left,
                width   : target.offsetWidth
            };
        //交给用户的view函数计算
        pos =  typeof suggestion.view == "function" ? suggestion.view(pos) : pos;

        baidu.ui.smartPosition.set(main, [pos.left, pos.top], {once:true});
        baidu.ui.smartPosition.setBorderBoxStyles(
            main, 
            {
                width : pos.width
            }
        );
    }
});
baidu.ui.suggestion.Suggestion.register(function(suggestion){

    suggestion.windowResizeHandler = suggestion.getWindowResizeHandler();

    suggestion.addEventListener("onload", function(){
        suggestion.adjustPosition();
        //监听搜索框与suggestion弹出层的宽度是否一致。
        if(suggestion.fixWidth){
            suggestion.fixWidthTimer = setInterval(function (){
                var main = suggestion.getMain();
                if(main.offsetWidth !=0 && suggestion.getTarget().offsetWidth != main.offsetWidth){
                    suggestion.adjustPosition();
                    main.style.display = 'block';
                }
            }, 100);
        }
        //当窗口变化的时候重新放置
        baidu.on(window, "resize", suggestion.windowResizeHandler);
    });

    //每次出现的时候都重新定位，保证用户在初始化之后修改了input的位置，也不会出现混乱 
    suggestion.addEventListener("onshow", function(){
        suggestion.adjustPosition();
    });

    suggestion.addEventListener("ondispose", function(){
        baidu.un(window, "resize", suggestion.windowResizeHandler);
        clearInterval(suggestion.fixWidthTimer);
    });

});
