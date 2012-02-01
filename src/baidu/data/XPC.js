/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.data;
///import baidu.dom.setStyles;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.lang.createClass;
///import baidu.fn.bind;

/**
 * XPC(cross page channel) 跨域通信模块
 * @name baidu.data.XPC
 * @function
 * @grammar new baidu.data.XPC(true, url[, {timeout:1000}])
 * @param {boolean} isParent 确定当前页面角色，如果是父页面，则为true，跨域的子页面为false，默认值为false.
 * @param {string} url 在对方域下部署的子页面，如果isParent为true，则此参数为必须，否则可以省略.
 * @param {number} timeout 设置超时时间(ms)，超过这个时间视为初始化失败，默认值是3000.
 * @author zhangyunlong
 */
baidu.data.XPC = baidu.lang.createClass(function(isParent, url, options) {

    options = options || {};

    //浏览器特性检查，判断是否支持postMessage，一次运行得到结果
    this._canUsePostMessage = (typeof window.postMessage === 'function' || typeof window.postMessage === 'object');
    //确定角色，父页面为true，子页面为false或undefined
    this._isParent = isParent;
    //初始化完毕标志位
    this.ready = false;
    //当前页面domain，形如(http://www.example.com)
    this.currentDomain = this._getDomainByUrl(location.href);
    //父页面的初始化过程
    if (isParent && url) {
        //创建iframe
        this._channel = this._createIframe(url);
        //设置对方域
        this.targetDomain = this._getDomainByUrl(url);
        this.source = (this._channel.contentWindow || this._channel);
        //页面载入完毕后，由父页面先发送初始化消息
        baidu.on(this._channel, 'load', baidu.fn.bind(function() {this.send('init');}, this));
        //设置超时时间，默认为30秒
        timeout = parseInt(options.timeout) || 30000;
        this._timer = setTimeout(baidu.fn.bind(function() {
            this.dispatchEvent(this._createEvent('error', 'Tiemout.'));
        }, this), timeout);
    } else if (!isParent) {
        //子页面初始化过程
        this.targetDomain = null;
        this.source = window.parent;
        //子页面允许与之通信的父页面domain列表
        this.allowDomains = options.allowDomains || ['*'];
    } else {
        //初始化失败，派发错误消息
        this.dispatchEvent(this._createEvent('error', 'need url.'));
    }

    var handler = baidu.fn.bind('_onMessage', this);

    if (this._canUsePostMessage) {
        baidu.on(window, 'message', handler);
    } else {
        try {
            //IE6-7通过opener对象挂载父子页面互调方法进行通信，这里不排除身份伪造漏洞，使用时请注意，目前没有很好的方法fix
            var win = isParent ? this.source : window,
                opener = win.opener || {},
                handlerNames = ['parentReceiveHandler', 'childReceiveHandler'],
                receiveHandlerName = handlerNames[isParent ? 0 : 1],
                sendHandlerName = handlerNames[isParent ? 1 : 0];
            opener.xpc = opener.xpc || {};
            opener.xpc[receiveHandlerName] = handler;
            this._sendHandlerName = sendHandlerName;
            this._xpc = opener.xpc;
            win.opener = opener;
        } catch (e) {
            this.dispatchEvent(this._createEvent('error', e.message));
        }
    }
}).extend(
/**@lends baidu.data.XPC.prototype*/
{
    //创建iframe，并返回DOM引用
    _createIframe: function(url) {
        var ifrm = document.createElement('IFRAME');
        //firefox下，动态创建的iframe会从缓存中读取页面，通过将空白页指定给iframe的src属性来修正该问题
        ifrm.src = 'about:blank';
        ifrm.frameBorder = 0;
        baidu.dom.setStyles(ifrm, {
            position: 'absolute',
            left: '-10000px',
            top: '-10000px',
            width: '10px',
            height: '10px'
        });
        document.body.appendChild(ifrm);
        ifrm.src = url;
        return ifrm;
    },
    _createEvent: function(type, data) {
        return {
            type: type,
            data: data
        };
    },
    _checkDomain: function(domain) {
        if (this._isParent) {
            return domain === this.targetDomain;
        } else {
            var arr = this.allowDomains,
                len = arr.length;
            while (len--) {
                var tmp = arr[len];
                if (tmp === '*' || tmp === domain) {
                    return true;
                }
            }
            return false;
        }
    },
    //根据url获取domain信息
    _getDomainByUrl: function(url) {
        var a = document.createElement('A');
        a.href = url;
        //IE8将www.a.com:80和www.a.com认为是不同domain
        return a.protocol + '\/\/' + a.hostname + ((parseInt(a.port) || 80) === 80 ? '' : ':' + a.port);
    },
    _onMessage: function(evt) {
        evt = evt || window.event;
        if (this._checkDomain(evt.origin)) {
            this.source = evt.source;
            this.targetDomain = evt.origin;
            if (this.ready) {
                this.dispatchEvent(this._createEvent('message', evt.data));
            } else {
                //初始化进行一次握手
                if (this._isParent) {
                    //清除超时计时器
                    clearTimeout(this._timer);
                    delete this._timer;
                } else {
                    this.send('init');
                }
                //派发初始化事件
                this.ready = true;
                this.dispatchEvent(this._createEvent('ready'));
            }
        }
    },
    /**
     * 发送消息方法。
     * @function
     * @param {string} msg 要发送的消息.
     */
    send: function(msg) {
        if (this._canUsePostMessage) {
            this.source.postMessage(msg, this.targetDomain);
        } else {
            var e = {
                type: 'message',
                data: msg,
                origin: this.currentDomain,
                source: window
            };
            this._xpc[this._sendHandlerName](e);
        }
    }
});
