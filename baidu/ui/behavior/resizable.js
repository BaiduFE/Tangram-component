/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/behavior/resizable.js
 * author: lixiaopeng
 * version: 1.0.0
 * date: 2010/11/02
 */


///import baidu.ui.behavior;
///import baidu.dom.resizable;

/**
 * 为ui控件提供resize的行为 
 */
(function(){
    var Resizable = baidu.ui.behavior.resizable = function(){};

    /**
     * 更新reiszable设置
     * 创建resize handle
     * @param {Object} options 可子定义参数
     * */
    Resizable.resizeUpdate = function(options){
        var me = this,target;
        options = options || {};
        if(!me.resizable){
            return;
        }

        baidu.object.extend(me,options);
        me._resizeOption = {
            onresizestart : function(){
                me.dispatchEvent("onresizestart");              
            },
            onresize : function(){
                me.dispatchEvent("onresize");              
            },
            onresizeend : function(){
                me.dispatchEvent("onresizeend");              
            }
        };
        baidu.each(["minWidth","minHeight","maxWidth","maxHeight"],function(item,index){
            me[item] && (me._resizeOption[item] = me[item])
        });
        
        me._resizeOption.classPrefix = options.classPrefix || me.classPrefix;
        options.container && (me._resizeOption.container = options.container)
        target = options.target || me.getBody(); 
        baidu.dom.resizable(target,me._resizeOption);
    };
})();
