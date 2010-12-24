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

///import baidu.ui.decorator.create;

///import baidu.lang.isString;

/**
 * 为ui控件添加装饰器
 */
baidu.ui.behavior.decorator = function() {
    this.addEventListener('onload', function() {
        var me = this,
            opt;
        baidu.each(me.decorator, function(decoratorName, i) {
            opt = { ui: me, skin: me.skin };
            if (baidu.lang.isString(decoratorName)) {
                opt['type'] = decoratorName;
            }else {
                baidu.extend(opt, decoratorName);
            }
            me._decoratorInstance[i] = baidu.ui.decorator.create(opt);
        });
    });

    this.addEventListener('ondispose', function() {
        this._decoratorInstance = [];
        baidu.each(this._decoratorInstance, function(decorator) {
            decorator.dispose();
        });
    });
};

/**
 * 存放装饰器控件实例
 * @private
 * @type {Array.<baidu.ui.decorator.Decorator>}
 */
baidu.ui.behavior.decorator._decoratorInstance = [];

/**
 * 获取所有装饰器控件实例
 * @return {Array.<baidu.ui.decorator.Decorator>|baidu.ui.decorator.Decorator} 所有装饰器的数组或者单个装饰器.
 */
baidu.ui.behavior.decorator.getDecorator = function() {
    var instance = this._decoratorInstance;
    return instance.length > 0 ? instance : instance[0];
};
