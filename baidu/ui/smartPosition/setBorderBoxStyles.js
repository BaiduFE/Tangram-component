/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/smartPosition/setBorderBoxStyles.js
 * author: berg
 * version: 1.0
 * date: 2010/07/23 
 */

///import baidu.ui.smartPosition;

///import baidu.dom.g;
///import baidu.dom.setStyles;
///import baidu.dom.getStyle;

/**
 * 按照borderBox盒模型设置DOM元素的样式值
 * 会对top, left, width, height进行处理
 * 保证设置的值为border内部的值
 * 
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {Object}             styles  要设置的样式集合
 * @return {HTMLElement} 被操作的DOM元素
 */
baidu.ui.smartPosition.setBorderBoxStyles = function(element, styles){
    var stylesNeeded = ['marginTop',
                'marginLeft',
                'borderLeftWidth',
                'borderRightWidth',
                'borderTopWidth',
                'borderBottomWidth',
                'paddingLeft',
                'paddingRight',
                'paddingTop',
                'paddingBottom'],
        stylesValue = {},
        i = stylesNeeded.length - 1;
    for(;i>=0;i--){
        stylesValue[stylesNeeded[i]] = parseFloat(baidu.getStyle(element, stylesNeeded[i])) || 0;
    }
    
    if(styles.top){
        styles.top -= stylesValue['marginTop'];
    }
    if(styles.left){
        styles.left -= stylesValue['marginLeft'];
    }
    if(document.compatMode != 'BackCompat'){
	    if(styles.width){
            styles.width -= stylesValue['paddingLeft'] + stylesValue['paddingRight'] + stylesValue['borderLeftWidth'] + stylesValue['borderRightWidth'];
	    }
	    if(styles.height){
            styles.height -= stylesValue['paddingTop'] + stylesValue['paddingBottom'] + stylesValue['borderTopWidth'] + stylesValue['borderBottomWidth'];
	    }
    }
    return baidu.dom.setStyles(element, styles);
};
