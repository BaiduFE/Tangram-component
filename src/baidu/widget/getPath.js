/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.widget;

/**
 * 获取widget的url路径. <br/> 优先查找baidu.widget._pathInfo下的配置, 默认会将"pkg1.pkg2.widget" 映射成"pkg1/pkg2/widget.js"
 * @name baidu.widget.getPath
 * @function
 * @grammar baidu.widget.getPath(name)
 * @param {String} name widget名.
 * @remark
 *     可以根据实际情况重写
 *
 * @return {String} widget路径.
 * @author rocy
 */
baidu.widget.getPath = function(name) {
    return baidu.widget._basePath + 
    	(baidu.widget._pathInfo[name] || (name.replace(/\./g, '/') + '.js'));
};
