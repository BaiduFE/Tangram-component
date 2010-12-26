/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.behavior.Posable;
///import baidu.page.getMousePosition;

Posable.setPositionByMouse = function(element, options){
    var me = this;
    element = baidu.g(element) || me.getMain();
    me._positionByCoordinate(element, baidu.page.getMousePosition(), options);
};
