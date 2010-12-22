/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/suggestion/Suggestion$data.js
 * author: berg
 * version: 1.1.0
 * date: 2010-06-02
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
    setData : function(word, data, noShow){
        var suggestion = this;
		suggestion.dataCache[word] = data;
        if(!noShow){
            suggestion.show(word, suggestion.dataCache[word]); 
        }
    }
});

baidu.ui.suggestion.Suggestion.register(function(suggestion){
    //初始化dataCache
    suggestion.dataCache = {},
    /*
     * 获取一个词对应的suggestion数据
     * 通过事件返回结果
     */
    suggestion.addEventListener("onneeddata", function(ev, word) {
        var dataCache = suggestion.dataCache;
        if(typeof dataCache[word] == 'undefined'){
            //没有数据就去取数据
            suggestion.getData(word);
        }else{
            //有数据就直接显示
            suggestion.show(word, dataCache[word]); 
        }
    });
});
