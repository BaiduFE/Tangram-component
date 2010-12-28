/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.behavior.Posable;

///import baidu.dom.getPosition;

/**
 * 将控件或者指定元素与指定的元素对齐
 *
 * @param {HTMLElement|string} target 要对齐到的元素.
 * @param {HTMLElement|string} element optional 要对齐的元素或元素id，如果不指定，默认为当前控件的主元素.
 * @param {Object} options optional 选项，同setPosition方法.
 */
baidu.ui.behavior.Posable.setPositionByElement =
    function(target, element, options) {
        target = baidu.g(target);
        element = baidu.g(element) || this.getMain();
        options = options || {};

        me.__execPosFn(element, '_setPositionByElement', options.once, arguments);
    };

/**
 * 将控件或者指定元素与指定的元素对齐
 * @private
 *
 * @param {HTMLElement|string} target 要对齐到的元素.
 * @param {HTMLElement|string} element optional 要对齐的元素或元素id，如果不指定，默认为当前控件的主元素.
 * @param {Object} options optional 选项，同setPosition方法.
 */
baidu.ui.behavior.Posable._setPositionByElement =
    function(target, element, options) {
        options.once = false;
        var targetPos = baidu.dom.getPosition(target),
            coordinate = {};

        coordinate['x'] = targetPos.left +
                            (sp.position.indexOf('right') >= 0 ? target.offsetWidth : 0);
        coordinate['y'] = targetPos.top +
                            (sp.position.indexOf('bottom') >= 0 ? target.offsetHeight : 0);

        this._positionByCoordinate(element, coordinate, options);
    };
