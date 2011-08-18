/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */
///import baidu.widget;
///import baidu.array.each;
///import baidu.page.load;
///import baidu.widget._isWidget;
///import baidu.widget.get;
///import baidu.widget.getPath;
///import baidu.lang.module;
///import baidu.object.extend;
///import baidu.fn.blank;
/**
 * 加载widget, 并在widget加载完成后执行传入的方法.
 * @name baidu.widget.load
 * @function
 * @grammar baidu.widget.load(widgets, executer)
 * @param {Array<String>|String} widgets widget名称数组.
 * @param {Function} executer widget加载完成时执行,第一个参数为获取widget API的方法(require).
 * @author rocy
 */
baidu.widget.load = function(widgets, executer) {
    var files = [],
        executer = executer || baidu.fn.blank,
        makeRequire = function(context){
            var ret = function (id){
                var widget = ret.context[id];
                if(!baidu.widget._isWidget(widget)){
                    throw "NO DEPENDS declare for: " + id;
                }
                return widget.exports;
            };
            ret.context = context;
            return ret;
        },
        realCallback = function() {
            var i = 0,
                length = widgets.length,
                context = baidu.object.extend({}, baidu.widget._defaultContext),
                widgetName,
                widget, widgetLoading;
            for (; i < length; ++i) {
                widgetName = widgets[i],
                widget = baidu.widget.get(widgetName),
                widgetLoading = baidu.widget._widgetLoading[widgetName];
                //避免重复加载.若widget正在加载中,则等待加载完成后再触发.否则清空加载状态.
                if (widgetLoading && widgetLoading.depends.length){
                    window.setTimeout(function() {
                        baidu.widget.load(widgetLoading.depends, realCallback);
                    }, 20);
                    return;
                }
                widget.load();

                //累加依赖模块的context，并将依赖模块置于context中，
                baidu.extend(context, widget.context);
                context[widgetName] = widget;
            }
            executer(makeRequire(context));
        };
    if (!widgets) {
        executer(makeRequire(baidu.widget._defaultContext));
    }
    //widget列表支持逗号分隔的字符串描述
    if (baidu.lang.isString(widgets)) {
        widgets = widgets.split(',');
    }
    baidu.each(widgets, function(widget) {
        if (baidu.widget._isWidget(baidu.widget.get(widget))) {//已加载
            return;
        }
        files.push({url: baidu.widget.getPath(widget)});
    });
    files.length ?
        baidu.page.load(files, {onload: realCallback}) :
        realCallback();
};
