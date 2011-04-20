/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.behavior.posable;
///import baidu.dom.getPosition;
///import baidu.page.getScrollLeft;
///import baidu.page.getScrollTop;
///import baidu.page.getViewWidth;
///import baidu.page.getViewHeight;

/**
 * 将控件或者指定元素与指定的元素对齐
 *
 * @param {HTMLElement|string} target 要对齐到的元素.
 * @param {HTMLElement|string} element optional 要对齐的元素或元素id，如果不指定，默认为当前控件的主元素.
 * @param {Object} options optional 选项，同setPosition方法.
 */
baidu.ui.behavior.posable.setPositionByElement =
    function(target, element, options) {
        target = baidu.g(target);
        element = baidu.g(element) || this.getMain();
        options = options || {};

        this.__execPosFn(element, '_setPositionByElement', options.once, arguments);
    };

/**
 * 将控件或者指定元素与指定的元素对齐
 * @private
 *
 * @param {HTMLElement|string} target 要对齐到的元素.
 * @param {HTMLElement|string} element optional 要对齐的元素或元素id，如果不指定，默认为当前控件的主元素.
 * @param {Object} options optional 选项，同setPosition方法.
 */
baidu.ui.behavior.posable._setPositionByElement = function(target, element, options){
    var targetPos = baidu.dom.getPosition(target),
        scrollPos = {left: baidu.page.getScrollLeft(), top: baidu.page.getScrollTop()},
        viewSize = {width: baidu.page.getViewWidth(), height: baidu.page.getViewHeight()};
    options.once = false;
    options.position && (options.position = options.position.toLowerCase());
    function getPosition(type){
        var val = 0,
            axis = {
                x: {pos: 'left', size: 'width', offset: 'offsetWidth'},
                y: {pos: 'top', size: 'height', offset: 'offsetHeight'}
            }[type];
        if(options.position.indexOf('x' == type ? 'right' : 'bottom') > -1){
            val = targetPos[axis.pos] + target[axis.offset] + element[axis.offset] - scrollPos[axis.pos] > 
                viewSize[axis.size] ? targetPos[axis.pos] - element[axis.offset]
                : targetPos[axis.pos] + target[axis.offset]
        }else{
            val = targetPos[axis.pos] + element[axis.offset] - scrollPos[axis.pos] > 
                viewSize[axis.size] ? targetPos[axis.pos] - element[axis.offset] + target[axis.offset]
                : targetPos[axis.pos];
        }
        return val;
    }
    this._positionByCoordinate(element, {x: getPosition('x'), y: getPosition('y')}, options);
}