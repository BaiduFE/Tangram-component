/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.suggestion.Suggestion;

/**
 * 为Suggestion提供数据内存缓存
 * 扩展这里可做本地缓存
 */

baidu.object.extend(baidu.ui.suggestion.Suggestion.prototype, {
    /*
     * 设置一组数据给suggestion
     * 调用者可以选择是否立即显示这组数据: noShow
     * @public
     */
    setData: function(word, data, noShow) {
        var me = this;
		me.dataCache[word] = data;
        if (!noShow) {
            me.show(word, me.dataCache[word]);
        }
    }
});

baidu.ui.suggestion.Suggestion.register(function(me) {
    //初始化dataCache
    me.dataCache = {},
    /*
     * 获取一个词对应的suggestion数据
     * 通过事件返回结果
     */
    me.addEventListener('onneeddata', function(ev, word) {
        var dataCache = me.dataCache;
        if (typeof dataCache[word] == 'undefined') {
            //没有数据就去取数据
            me.getData(word);
        }else {
            //有数据就直接显示
            me.show(word, dataCache[word]);
        }
    });
});
