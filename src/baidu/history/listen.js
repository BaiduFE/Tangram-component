/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.history;
///import baidu.browser.ie;
///import baidu.browser.firefox;
/**
 * 通过hash值的来记录页面的状态
 * 通过js改变hash的时候，浏览器会增加历史记录，并且执行回调函数
 * @name baidu.history.listen
 * @function
 * @grammar baidu.history.listen(callback)
 * @param {Function} callBack hash值变更时的回调函数.
 */
(function() {

    var _curHash,       //当前hash值，用来判断hash变化
        _frame,
        _callbackFun;   //hash变化时的回调函数

    /**
     * 用于IE更新iframe的hash值
     * @private
     * @param {String} hash
     */
    function _addHistory(hash) {
        var fdoc = _frame.contentWindow.document;
        hash = hash || '#';

        //通过open方法触发frame的onload
        fdoc.open();
        fdoc.write('\<script\>window.top.location.hash="' + hash + '";\</script\>');
        fdoc.close();
        fdoc.location.hash = hash;
    };

    /**
     * @private
     * 执行回调函数并改边hash值
     */
    function _hashChangeCallBack() {
        
        _callbackFun && _callbackFun();
        //设置当前的hash值，防止轮询再次监听到hash变化
        _curHash = (window.location.hash.replace(/^#/, '') || '');
    };

    /**
     * 判断hash是否变化
     * @private
     */
    function _checkHash() {

        var hash = location.hash.replace(/^#/, '');
        if (hash != _curHash) {
            //如果frame存在通过frame的onload事件来触发回调方法，如果不存在直接执行回调函数
            _frame ? _addHistory(hash) : _hashChangeCallBack();
        }
    };

    
    function listen(callBack) {
        _curHash = ('');
        if (callBack)
            _callbackFun = callBack;

        if (baidu.browser.ie) {

            //IE下通过创建frame来增加history
            _frame = document.createElement('iframe');
            _frame.style.display = 'none';
            document.body.appendChild(_frame);

            _addHistory(window.location.hash);
            //通过frame的onload事件触发回调函数
            _frame.attachEvent('onload', function() {
                _hashChangeCallBack();
            });
            setInterval(_checkHash, 100);

        }else if (baidu.browser.firefox < 3.6) {
            //ff3.5以下版本hash变化会自动增加历史记录，只需轮询监听hash变化调用回调函数
            setInterval(_checkHash, 100);

        }else {
            if (_curHash != location.hash.replace(/^#/, ''))
                _curHash = (window.location.hash.replace(/^#/, '') || '');   
            
            //ff3.6 chrome safari oprea11通过onhashchange实现
            window.onhashchange = _hashChangeCallBack;
        }
    };
    
    baidu.history.listen = listen;
})();
