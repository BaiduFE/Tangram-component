/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.dom.g;

///import baidu.ui.Suggestion;
///import baidu.ui.behavior.coverable;
/**
 * 支持背景遮罩掩盖select、flash、iframe元素
 * @name baidu.ui.Suggestion.Suggestion$coverable
 * @addon baidu.ui.Suggestion
 */
baidu.extend(baidu.ui.Suggestion.prototype, {
    coverable: true,
    coverableOptions: {}
});

baidu.ui.Suggestion.register(function(me) {

    if (me.coverable) {

        me.addEventListener('onshow', function() {
            me.Coverable_show();
        });

        me.addEventListener('onhide', function() {
            me.Coverable_hide();
        });
    }
});
