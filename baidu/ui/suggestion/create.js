/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/suggestion/create.js
 * author: berg
 * version: 1.0.0
 * date: 2010-06-01
 */
 
///import baidu.dom.g;

///import baidu.ui.suggestion;
///import baidu.ui.suggestion.Suggestion;

///import baidu.ui.suggestion.Suggestion$data;
///import baidu.ui.suggestion.Suggestion$input;
///import baidu.ui.suggestion.Suggestion$fixWidth;
 


/**
 * 创建suggetion对象
 * 
 * @param {String|DOMELement}    target   需要添加的input
 * @param {object}    options   选项
 *
 * @return {baidu.ui.suggetion.Suggestion} suggestion对象
 */

baidu.ui.suggestion.create = function(target, options){ 
    var s = new baidu.ui.suggestion.Suggestion(options);
    s.render(target);
    return s;
};
