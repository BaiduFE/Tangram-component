/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui;

/**
 * ͨ��uiType�ҵ�UI��
 * ���ҹ���
 * suggestion -> baidu.ui.Suggestion
 * toolbar-spacer -> baidu.ui.Toolbar.Spacer.
 *
 * @author berg
 *
 * @param {String} uiType
 * @return {object} UI��
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
