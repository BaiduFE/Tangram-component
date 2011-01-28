/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.behavior.posable;
///import baidu.page.getMousePosition;

/**
 * 将控件或者指定元素放置到当前鼠标位置
 *
 * @param {HTMLElement|string} element optional 要对齐的元素或元素id，如果不指定，默认为当前控件的主元素.
 * @param {Object} options optional 选项，同setPosition方法.
 */
baidu.ui.behavior.posable.setPositionByMouse = function(element, options) {
    var me = this;
    element = baidu.g(element) || me.getMain();
    me._positionByCoordinate(element, baidu.page.getMousePosition(), options);
};
