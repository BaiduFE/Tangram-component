/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/behavior/decorator.js
 * author: berg
 * version: 1.1.0
 * date: 2010/11/1
 */


///import baidu.ui.behavior;
///import baidu.ui.Decorator;
///import baidu.lang.isString;
///import baidu.array.each;

/**
 * 为ui控件添加装饰器
 */
(function(){
    var Decorator = baidu.ui.behavior.decorator = function(){
        this.addEventListener("onload", function(){
            var me = this,
                opt;
            baidu.each(me.decorator, function(decoratorName, i){
                opt = { ui : me , skin : me.skin };
                if(baidu.lang.isString(decoratorName)){
                    opt['type'] = decoratorName;
                }else{
                    baidu.extend(opt, decoratorName);
                }
                me._decoratorInstance[i] = new baidu.ui.Decorator(opt);
                me._decoratorInstance[i].render();
            });
        });

        this.addEventListener("ondispose", function(){
            this._decoratorInstance = [];
            baidu.each(this._decoratorInstance, function(decorator){
                decorator.dispose();
            });
        });
    };

    /**
     * 存放装饰器控件实例
     */
    Decorator._decoratorInstance = [];

    /**
     * 获取所有装饰器控件实例
     * @return {array|Decorator} 所有装饰器的数组或者单个装饰器
     */
    Decorator.getDecorator = function(){
        var instance = this._decoratorInstance;
        return instance.length > 0 ? instance : instance[0];
    };
})();
