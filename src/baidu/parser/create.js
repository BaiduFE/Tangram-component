/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.parser;
///import baidu.parser.type;

/**
 * 工厂方法，创建对应type的parser实例
 * @public
 * @param {baidu.parser.type} type
 * @param {Object} options
 */
baidu.parser.create = function(type, options){
    var type = type || '',
        options = options || {};

    if(baidu.parser[type]){
        return new baidu.parser[type](options);
    }

    return null;
};
