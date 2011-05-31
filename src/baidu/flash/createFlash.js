/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.flash;

baidu.flash.createFlash = function(constructor) {
    var i,
        flash = function(opt, _isInherits){// 创建新类的真构造器函数
            var me = this;
            opt = opt || {};
            
            //扩展当前options中的项到this上
            baidu.object.extend(me, opt);

            //执行控件自己的构造器
            constructor.apply(me, arguments);
        },

    //继承Base中的方法到prototype中
    for (i in baidu.flash.Base) {
        proto[i] = baidu.flash.Base[i];
    }

    /**
     * 扩展控件的prototype
     * @param {Object} json 要扩展进prototype的对象
     * @return {Object} 扩展后的对象
     */
    flash.extend = function(json){
        for (i in json) {
            flash.prototype[i] = json[i];
        }
        return flash;  // 这个静态方法也返回类对象本身
    };

    return flash;
};
