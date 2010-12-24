/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: baidu/ui/Base/setParent.js
 * author: berg
 * version: 1.0.0
 * date: 2010/12/02
 */

///import baidu.ui.Base;


/**
 * 设置UI控件的父控件
 *
 * @param {UI} 父控件.
 */
baidu.ui.Base.setParent = function(parent) {
    var me = this,
        oldParent = me._parent;
    oldParent && oldParent.dispatchEvent('removechild');
    if (parent.dispatchEvent('appendchild', { child: me })) {
        me._parent = parent;
    }
};
