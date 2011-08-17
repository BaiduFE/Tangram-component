/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui;

/**
 * 通过uiType找到UI类，查找规则：suggestion -> baidu.ui.Suggestion，toolbar-spacer -> baidu.ui.Toolbar.Spacer.
 * @function
 * @grammar baidu.ui.getUI(uiType)
 * @param {String} uiType
 * @return {object} UI类
 * @author berg
 */
baidu.ui.getUI = function(uiType){
    var uiType = uiType.split('-'),
        result = baidu.ui,
        len = uiType.length,
        i = 0;

    for (; i < len; i++) {
        result = result[uiType[i].charAt(0).toUpperCase() + uiType[i].slice(1)];
    }
    return result;
};
