/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.behavior.Posable;

///import baidu.dom.getPosition;

baidu.ui.behavior.Posable.setPositionByElement = function(target, element, options){
    target = baidu.g(target);
    element = baidu.g(element) || this.getMain();
    options = options || {};

    me.__execPosFn(element, "_setPositionByElement", options.once, arguments);
};

baidu.ui.behavior.Posable._setPositionByElement = function(target, element, options){
    options.once = false;
    var targetPos = baidu.dom.getPosition(target),
        coordinate = {};

    coordinate['x'] = targetPos.left + (sp.position.indexOf("right") >= 0 ? target.offsetWidth : 0);
    coordinate['y'] = targetPos.top + (sp.position.indexOf("bottom") >= 0 ? target.offsetHeight : 0);

    this._positionByCoordinate(element, coordinate, options);
};
