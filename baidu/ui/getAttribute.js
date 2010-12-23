/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/ui/getAttribute.js
 * author: berg
 * version: 1.0.0
 * date: 2010/07/27 00:38:11
 */

///import baidu.ui;

///import baidu.string.trim;
///import baidu.string.toCamelCase;

/**
 *  从指定的dom元素中获取ui控件的属性值
 *
 *  todo: &datasource支持
 */

baidu.ui.getAttribute = function(element){
    var attributeName = "data-tangram",
        attrs = element.getAttribute(attributeName),
        params = {},
        len,
        trim = baidu.string.trim;

    if (attrs) {
        //element.removeAttribute(attributeName);
        attrs = attrs.split(';');
        len = attrs.length;

        for (; len--; ) {
            var s = attrs[len],
                pos = s.indexOf(':'),
                name = trim(pos >= 0 ? s.substring(0, pos) : s),
                value = pos >= 0 ? trim(s.substring(pos + 1)) || 'true' : 'true';

            params[baidu.string.toCamelCase(trim(name))] =
                /^\d+(\.\d+)?$/.test(value)
                    ? value - 0
                    : value == 'true' ? true : value == 'false' ? false : value;
        }
    }

    return params;
};
