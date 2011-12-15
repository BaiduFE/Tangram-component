/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Suggestion;

/**
 * 为Suggestion提供数据内存缓存，可对其扩展做本地缓存
 * @name baidu.ui.Suggestion.Suggestion$data
 * @addon baidu.ui.Suggestion
 * @author berg
 */

baidu.ui.Suggestion.extend({
    /**
     * 设置一组数据给suggestion，调用者可以选择是否立即显示这组数据: noShow
	 * @name baidu.ui.Suggestion.Suggestion$data
	 * @addon baidu.ui.Suggestion
	 * @function
	 * @param  {String}  word     关键字
	 * @param  {Array}   data     数据数组，例如["aaa","bbb"]
	 * @param  {Boolean} noShow  为true则不立即显示这组数据
     * @return {null}
     */
    setData: function(word, data, noShow) {
        var me = this;
		me.dataCache[word] = data;
        if (!noShow) {
            me.show(word, me.dataCache[word]);
        }
    }
});

baidu.ui.Suggestion.register(function(me) {
    //初始化dataCache
    me.dataCache = {},
    /*
     * 获取一个词对应的me数据
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
