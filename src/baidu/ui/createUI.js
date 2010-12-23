/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: baidu/ui/createUI.js
 * author: berg
 * version: 1.1.0
 * date: 2010/12/02
 */

///import baidu.ui;
///import baidu.ui.Base;
///import baidu.object.extend;

/**
 * 创建一个UI控件类
 *
 * @param {function} constructor ui控件构造器
 * @param {object} options 选项
 *
 * @return {object} ui控件
 */
baidu.ui.createUI = function(constructor, options) {
    options = options || {};
    var superClass = options.superClass || baidu.lang.Class,
        lastStep = superClass == baidu.lang.Class ? 1 : 0,
        i,
        n,
        ui = function(opt){// 创建新类的真构造器函数
            var me = this;
            opt = opt || {};
            // 继承父类的构造器
            superClass.call(me, !lastStep ? opt : (opt.guid || ""));

            //扩展静态配置到this上
            baidu.object.extend(me, ui.options);
            //扩展当前options中的项到this上
            baidu.object.extend(me, opt);


            me.classPrefix = me.classPrefix || "tangram-" + me.uiType.toLowerCase();

            //初始化行为
            //行为就是在控件实例上附加一些属性和方法
            for(i in baidu.ui.behavior){
                //添加行为到控件上
                if(typeof me[i] != 'undefined'){
                    baidu.object.extend(me, baidu.ui.behavior[i]);
                    baidu.ui.behavior[i].call(me);
                }
            }

            //执行控件自己的构造器
            constructor.apply(me, arguments);

            //执行所有addons中的方法
            for (i=0, n=ui.addons.length; i<n; i++) {
                ui.addons[i](me);
            }
        },
        C = function(){};

    C.prototype = superClass.prototype;

    // 继承父类的原型（prototype)链
    var fp = ui.prototype = new C();

    //继承Base中的方法到prototype中
    for (i in baidu.ui.Base) {
        fp[i] = baidu.ui.Base[i];
    }

    //给类扩展出一个静态方法，以代替 baidu.object.extend()
    ui.extend = function(json){
        for (i in json) {
            ui.prototype[i] = json[i];
        }
        //将create方法扩展到静态方法中
        var uiType = json.uiType,
            uiNS = uiType ? baidu.ui[uiType] : "";

        if(uiNS){
            uiNS.create = function(options){
                return baidu.ui.create(uiNS[uiType.charAt(0).toUpperCase() + uiType.slice(1)], options);
            };
        }
        return ui;  // 这个静态方法也返回类对象本身
    };

    //插件支持
    ui.addons = [];
    ui.register = function(f){
        if (typeof f == "function")
            ui.addons.push(f);
    };
    
    //静态配置支持
    ui.options = {};

    return ui;
};
