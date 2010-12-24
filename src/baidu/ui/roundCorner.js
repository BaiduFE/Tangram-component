/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/dialog/Dialog.js
 * author: berg
 * version: 1.0.0
 * date: 2010-05-24
 */


///import baidu.ui;
///import baidu.dom.remove;
///import baidu.string.format;

/**
 * 圆角装饰器
 */
baidu.ui.roundCorner = function(element, options) {
    var container = document.createElement('div');

    options = options || {};
    options['rcClass'] = options['rcClass'] || 'tangram_rc_';

    container.className = options['rcClass'] + 'container';
    container.style.position = 'absolute';
    container.style.zIndex = -1;

    container.innerHTML = baidu.string.format('<table><tr><td class="#{0}lt"></td><td class="#{0}ct"></td><td class="#{0}rt"></td></tr><tr><td class="#{0}lc"></td><td class="#{0}cc"></td><td class="#{0}rc"></td></tr><tr><td class="#{0}bl"></td><td class="#{0}bc"></td><td class="#{0}br"></td></tr></table>', options['rcClass']);
    element.parentNode.appendChild(container);
};
