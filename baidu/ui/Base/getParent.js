/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/ui/Base/getParent.js
 * author: berg
 * version: 1.0.0
 * date: 2010/12/02
 */

///import baidu.ui.Base;

/**
 * 获取UI控件的父控件
 *
 * @return {UI} 父控件
 */
baidu.ui.Base.getParent = function(){
    return this._parent || null;
};
