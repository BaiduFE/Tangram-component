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

/**
 * 一个本地存储对象，使用key-value的方式来存值，不具备夸浏览器通信功能，根据浏览器的不同自动选择userData或是localStorage或是cookie来存值.
 */
baidu.data.storage = baidu.data.storage || baidu.lang.createSingle({
    _status: {//各种成功或失败的状态
        'SUCCESS': 0,
        'FAILURE': 1,
        'OVERFLOW': 2
    },

    /**
     * 将一个key再进一步格式化为本地存储的格式来避免和其它的key种造成冲突
     * @param {String} key
     * @return {String}
     * @private
     */
    _getKey: function(key) {
        //escape spaces in name，单下划线替换为双下划线，空格替换为_s
        return 'PS' + key.replace(/[_\s]/g, function(matcher) {
            return matcher == '_' ? '__' : '_s';
        });
    },

    /**
     * 当是userData的存储方式时通过该方法来取得在页面中创建的用于存储的div对象
     * @return {HTMLElement} 返回一个div的html对象.
     * @private
     */
    _getElement: function() {
        return baidu.dom.g(this.guid + '-storage');
    },

    /**
     * 根据不同浏览器来返回一个本地存储对象
     * @return {Object} 返回一个对象，该对象包含set, get, del方法.
     * @private
     */
    _getInstance: function() {
        var me = this;
        if (!me._storage) {
            if (window.ActiveXObject) {
                me._storage = me._createUserData();
            }else if (window.localStorage) {
                me._storage = me._createLocalStorage();
            }else {
                me._storage = me._createCookie();
            }
        }
        return me._storage;
    },

    /**
     * 将userData进行包装并返回一个只包含三个方法的对象
     * @return {Object} 一个对象，包括set, get, del接口.
     * @private
     */
    _createUserData: function() {
        var me = this;
        baidu.dom.insertHTML(document.body,
            'beforeEnd',
            baidu.string.format('<div id="#{id}" style="display:none;"></div>',
                {id: me.guid + '-storage'})
        );
        me._getElement().addBehavior('#default#userData');
        return {
//            size: 64 * 1024,
            set: function(key, value, callback, options) {
                var status = me._status.SUCCESS,
                    ele = me._getElement(),
                    newKey = me._getKey(key),
                    time = options && options.expires ? options.expires
                        : new Date().getTime() + 365 * 24 * 60 * 60 * 1000;//默认保存一年时间
                baidu.lang.isDate(time) && (time = time.getTime());
                ele.expires = new Date(time).toUTCString();
                try {
                    ele.setAttribute(newKey, value);
                    ele.save(newKey);
                }catch (e) {
                    status = me._status.OVERFLOW;//存储时抛出异常认为是溢出
                }
                ele = null;
                callback && callback.call(me, status, value);
            },
            get: function(key, callback) {
                var status = me._status.SUCCESS,
                    ele = me._getElement(),
                    newKey = me._getKey(key),
                    val = null;
                try {
                    ele.load(newKey);
                    val = ele.getAttribute(newKey);//若过期则返回null
                }catch (e) {
                    status = me._status.FAILURE;
                    alert('baidu.data.storage.get error!');
                }
                callback && callback.call(me, status, val);
            },
            del: function(key, callback) {
                var status = me._status.SUCCESS,
                    ele = me._getElement(),
                    newKey = me._getKey(key),
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
                        status = me._status.FAILURE;
                    }
                }catch (e) {
                    status = me._status.FAILURE;
                }
                callback && callback.call(me, status, val);
            }
        };
    },

    /**
     * 将localstorage进行包装并返回一个只包含三个方法的对象
     * @return {Object} 一个对象，包括set, get, del接口.
     * @private
     */
    _createLocalStorage: function() {
        var me = this;
        return {
//            size: 10 * 1024 * 1024,
            set: function(key, value, callback, options) {
                var status = me._status.SUCCESS,
                    storage = window.localStorage,
                    newKey = me._getKey(key),
                    time = options && options.expires ? options.expires : 0;
                baidu.lang.isDate(time) && (time = time.getTime());
                try {
                    storage.setItem(newKey, time + '|' + value);
                }catch (e) {
                    status = me._status.OVERFLOW;
                }
                callback && callback.call(me, status, value);
            },
            get: function(key, callback) {
                var status = me._status.SUCCESS,
                    storage = window.localStorage,
                    newKey = me._getKey(key),
                    val = null,
                    index,
                    time;
                try {
                    val = storage.getItem(newKey);
                }catch (e) {
                    status = me._status.FAILURE;
                }
                if (val) {
                    index = val.indexOf('|');
                    time = parseInt(val.substring(0, index), 10);
                    if (new Date(time).getTime() > new Date().getTime()
                        || time == 0) {
                        val = val.substring(index + 1, val.length);
                    }else{
                        val = null;
                        status = me._status.FAILURE;
                        this.del(key);
                    }
                }else {
                    status = me._status.FAILURE;
                }
                callback && callback.call(me, status, val);
            },
            del: function(key, callback) {
                var status = me._status.SUCCESS,
                    storage = window.localStorage,
                    newKey = me._getKey(key),
                    val = null;
                try {
                    val = storage.getItem(newKey);
                }catch (e) {
                    status = me._status.FAILURE;
                }
                if (val) {
                    val = val.substring(val.indexOf('|'), val.length);
                    status = me._status[val ? 'SUCCESS' : 'FAILURE'];
                    val && storage.removeItem(newKey);
                }else {
                    status = me._status.FAILURE;
                }
                callback && callback.call(me, status, val);
            }
        };
    },

    /**
     * 将baidu.cookie进行包装并返回一个只包含三个方法的对象
     * @return {Object} 一个对象，包括set, get, del接口.
     * @private
     */
    _createCookie: function() {
        var me = this;
        return {
//            size: 4 * 1024,
            set: function(key, value, callback, options) {
                baidu.cookie.set(me._getKey(key), value, options);
                callback && callback.call(me, me._status.SUCCESS, value);
            },

            get: function(key, callback) {
                var val = baidu.cookie.get(me._getKey(key));
                callback && callback.call(me, me._status[val ? 'SUCCESS' : 'FAILURE'], val);
            },
            del: function(key, callback) {
                var newKey = me._getKey(key),
                    val = baidu.cookie.get(newKey);
                baidu.cookie.remove(newKey);
                callback && callback.call(me, me._status[val ? 'SUCCESS' : 'FAILURE'], val);
            }
        };
    },

    /**
     * 将一个键值对存入到本地存储中
     * @param {String} key 一个键名.
     * @param {String} value 一个值.
     * @param {Function} callback 一个回调函数，函数的第一参数返回该次存储的状态码，各状码表示{0: 成功, 1: 失败, 2: 溢出}，第二参数返回当次的value.
     * @param {Object} options config参数.
     * @config {Date|Number} expires 设置一个过期时间，值的类型必须是一个Date对象或是一个毫秒数
     */
    set: function(key, value, callback, options) {
        var me = this, storage = me._getInstance();
        storage.set.apply(storage, arguments);
    },

    /**
     * 依据一个键名称来取得本地存储中的值
     * @param {String} key 一个键名称.
     * @param {Function} callback 一个回调函数，函数的第一参数返回该次存储的状态码，各状码表示{0: 成功, 1: 失败, 2: 溢出}，第二参数返回当次的value.
     */
    get: function(key, callback) {
        var me = this, storage = me._getInstance();
        storage.get.apply(storage, arguments);
    },

    /**
     * 根据一个键名称来删除在本地存储中的值
     * @param {String} key 一个键名称.
     * @param {Function} callback 一个回调函数，函数的第一参数返回该次存储的状态码，各状码表示{0: 成功, 1: 失败, 2: 溢出}，第二参数返回当次的value.
     */
    remove: function(key, callback) {
        var me = this, storage = me._getInstance();
        storage.del.apply(storage, arguments);
    }
});
