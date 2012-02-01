/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.data;
///import baidu.lang.createSingle;
///import baidu.dom.insertHTML;
///import baidu.string.format;
///import baidu.object.extend;
///import baidu.lang.isDate;
///import baidu.cookie.set;
///import baidu.cookie.get;
///import baidu.cookie.remove;
///import baidu.browser.ie;

/**
 * 一个本地存储对象，使用key-value的方式来存值，不具备夸浏览器通信功能，根据浏览器的不同自动选择userData或是localStorage或是cookie来存值.
 * @Object
 * @grammar baidu.data.storage
 * @return {baidu.data.storage}
 */
baidu.data.storage = (function() {
    var _guid = baidu.lang.guid(),
        _status = {//状态说明
            SUCCESS: 0,
            FAILURE: 1,
            OVERFLOW: 2
        };
    function _getKey(key) {
        //escape spaces in name，单下划线替换为双下划线，空格替换为_s
        return key.replace(/[_\s]/g, function(matcher) {
            return matcher == '_' ? '__' : '_s';
        });
    }

    function _getElement() {
        return baidu.dom.g(_guid + '-storage');
    }

    function _getInstance() {
        var _storage;
        if (window.ActiveXObject && baidu.browser.ie < 9) { //IE9不再支持userData，暂时采用版本判断的临时方法解决。by xiadengping
            _storage = _createUserData();
        }else if (window.localStorage) {
            _storage = _createLocalStorage();
        }else {
            _storage = _createCookie();
        }
        return _storage;
    }

    /**
     * 将userData进行包装并返回一个只包含三个方法的对象
     * @return {Object} 一个对象，包括set, get, del接口.
     * @private
     */
    function _createUserData() {
        baidu.dom.insertHTML(document.body,
            'beforeEnd',
            baidu.string.format('<div id="#{id}" style="display:none;"></div>',
                {id: _guid + '-storage'})
        );
        _getElement().addBehavior('#default#userData');
        return {
//            size: 64 * 1024,
            set: function(key, value, callback, options) {
                var status = _status.SUCCESS,
                    ele = _getElement(),
                    newKey = _getKey(key),
                    time = options && options.expires ? options.expires
                        : new Date().getTime() + 365 * 24 * 60 * 60 * 1000;//默认保存一年时间
                //bugfix 若expires是毫秒数，先要new Date().getTime()再加上毫秒数。 
                //另外time有可能是字符串，需要变成数字。by xiadengping
                if (baidu.lang.isDate(time)) {
                    time = time.getTime();
                } else {
                    time = new Date().getTime() + (time - 0);
                }
                ele.expires = new Date(time).toUTCString();
                try {
                    ele.setAttribute(newKey, value);
                    ele.save(newKey);
                }catch (e) {
                    status = _status.OVERFLOW;//存储时抛出异常认为是溢出
                }
                ele = null;
                callback && callback.call(this, status, value);
            },
            get: function(key, callback) {
                var status = _status.SUCCESS,
                    ele = _getElement(),
                    newKey = _getKey(key),
                    val = null;
                try {
                    ele.load(newKey);
                    val = ele.getAttribute(newKey);//若过期则返回null
                }catch (e) {
                    status = _status.FAILURE;
                    throw 'baidu.data.storage.get error!';
                }
                callback && callback.call(this, status, val);
            },
            del: function(key, callback) {
                var status = _status.SUCCESS,
                    ele = _getElement(),
                    newKey = _getKey(key),
                    val;
                try {
                    ele.load(newKey);
                    val = ele.getAttribute(newKey);
                    if (val) {
                        //315532799000 是格林威治时间1979年12月31日23时59分59秒。这是删除UserData的最靠前的一个有效expires时间了，再往前一毫秒，expires = new Date(315532798999).toUTCString(); 就删不掉userdata了，可以认为是IE的一个bug
                        ele.removeAttribute(newKey);
                        ele.expires = new Date(315532799000).toUTCString();
                        ele.save(newKey);
                    }else {
                        status = _status.FAILURE;
                    }
                }catch (e) {
                    status = _status.FAILURE;
                }
                callback && callback.call(this, status, val);
            }
        };
    }

    /**
     * 将localstorage进行包装并返回一个只包含三个方法的对象
     * @return {Object} 一个对象，包括set, get, del接口.
     * @private
     */
    function _createLocalStorage() {
        return {
//            size: 10 * 1024 * 1024,
            set: function(key, value, callback, options) {
                var status = _status.SUCCESS,
                    storage = window.localStorage,
                    newKey = _getKey(key),
                    time = options && options.expires ? options.expires : 0;
                //bugfix 若expires是毫秒数，先要new Date().getTime()再加上毫秒数。
                //另外time有可能是字符串，需要变成数字。by xiadengping
                if (baidu.lang.isDate(time)) {
                    time = time.getTime();
                } else if (time > 0) {
                    time = new Date().getTime() + (time - 0);
                }
                
                try {
                    storage.setItem(newKey, time + '|' + value);
                }catch (e) {
                    status = _status.OVERFLOW;
                }
                callback && callback.call(this, status, value);
            },
            get: function(key, callback) {
                var status = _status.SUCCESS,
                    storage = window.localStorage,
                    newKey = _getKey(key),
                    val = null,
                    index,
                    time;
                try {
                    val = storage.getItem(newKey);
                }catch (e) {
                    status = _status.FAILURE;
                }
                if (val) {
                    index = val.indexOf('|');
                    time = parseInt(val.substring(0, index), 10);
                    if (new Date(time).getTime() > new Date().getTime()
                        || time == 0) {
                        val = val.substring(index + 1, val.length);
                    }else {
                        val = null;
                        status = _status.FAILURE;
                        this.del(key);
                    }
                }else {
                    status = _status.FAILURE;
                }
                callback && callback.call(this, status, val);
            },
            del: function(key, callback) {
                var status = _status.SUCCESS,
                    storage = window.localStorage,
                    newKey = _getKey(key),
                    val = null;
                try {
                    val = storage.getItem(newKey);
                }catch (e) {
                    status = _status.FAILURE;
                }
                if (val) {
                    val = val.substring(val.indexOf('|') + 1, val.length);
                    status = _status[val ? 'SUCCESS' : 'FAILURE'];
                    val && storage.removeItem(newKey);
                }else {
                    status = _status.FAILURE;
                }
                callback && callback.call(this, status, val);
            }
        };
    }

    /**
     * 将baidu.cookie进行包装并返回一个只包含三个方法的对象
     * @return {Object} 一个对象，包括set, get, del接口.
     * @private
     */
    function _createCookie() {
        return {
//            size: 4 * 1024,
            set: function(key, value, callback, options) {
                baidu.cookie.set(_getKey(key), value, options);
                callback && callback.call(me, _status.SUCCESS, value);
            },

            get: function(key, callback) {
                var val = baidu.cookie.get(_getKey(key));
                callback && callback.call(me, _status[val ? 'SUCCESS' : 'FAILURE'], val);
            },
            del: function(key, callback) {
                var newKey = _getKey(key),
                    val = baidu.cookie.get(newKey);
                baidu.cookie.remove(newKey);
                callback && callback.call(me, _status[val ? 'SUCCESS' : 'FAILURE'], val);
            }
        };
    }


    return /**@lends baidu.data.storage.prototype*/{
        /**
         * 将一个键值对存入到本地存储中
         * @function
         * @grammar baidu.data.storage.set(key, value, callback, options)
         * @param {String} key 一个键名.
         * @param {String} value 一个值.
         * @param {Function} callback 一个回调函数，函数的第一参数返回该次存储的状态码，各状码表示{0: 成功, 1: 失败, 2: 溢出}，第二参数返回当次的value.
         * @param {Object} options config参数.
         * @config {Date|Number} expires 设置一个过期时间，值的类型必须是一个Date对象或是一个毫秒数
         */
        set: function(key, value, callback, options) {
            var me = this;
            !me._storage && (me._storage = _getInstance());
            me._storage.set.apply(me._storage, arguments);
        },

        /**
         * 依据一个键名称来取得本地存储中的值
         * @function
         * @grammar baidu.data.storage.get(key, callback)
         * @param {String} key 一个键名称.
         * @param {Function} callback 一个回调函数，函数的第一参数返回该次存储的状态码，各状码表示{0: 成功, 1: 失败, 2: 溢出}，第二参数返回当次的value.
         */
        get: function(key, callback) {
            var me = this;
            !me._storage && (me._storage = _getInstance());
            me._storage.get.apply(me._storage, arguments);
        },

        /**
         * 根据一个键名称来删除在本地存储中的值
         * @function
         * @grammar baidu.data.storage.remove(key, callback)
         * @param {String} key 一个键名称.
         * @param {Function} callback 一个回调函数，函数的第一参数返回该次存储的状态码，各状码表示{0: 成功, 1: 失败, 2: 溢出}，第二参数返回当次的value.
         */
        remove: function(key, callback) {
            var me = this;
            !me._storage && (me._storage = _getInstance());
            me._storage.del.apply(me._storage, arguments);
        }
    };
})();
