/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/smartPosition/element.js
 * author: berg
 * version: 1.0.0
 * date: 2010-07-14
 */

/**
 *
 * 按照元素位置定位
 *
 */


///import baidu.ui.smartPosition.SmartPosition;
///import baidu.dom.getPosition;

baidu.ui.smartPosition.element = function(element, target, options){
    element = baidu.g(element);
    target = baidu.g(target);

    options = options || {};
    options.coordinate = options.coordinate || {};
    options.source = element;

    var sp = new baidu.ui.smartPosition.SmartPosition(options);

    //在update之前，修正coordinate
    sp.addEventListener("onbeforeupdate", function(){
        var sp = this,
            targetPos = baidu.dom.getPosition(target);
            //取消了根据parent位置的修正
        sp['coordinate']['x'] = targetPos.left + (sp.position.indexOf("right") >= 0 ? target.offsetWidth : 0);
        sp['coordinate']['y'] = targetPos.top + (sp.position.indexOf("bottom") >= 0 ? target.offsetHeight : 0);
    });

    sp.update();

    return sp;
};
