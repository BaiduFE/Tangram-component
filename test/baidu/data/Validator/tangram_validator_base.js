// Copyright (c) 2009, Baidu Inc. All rights reserved.
// 
// Licensed under the BSD License
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http:// tangram.baidu.com/license.html
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
 /**
 * @namespace T Tangram七巧板
 * @name T
 * @version 1.3.9
*/

/**
 * 声明baidu包
 * @author: allstar, erik, meizz, berg
 */
var T,
    baidu = T = baidu || {version: "1.3.9"}; 

//提出guid，防止在与老版本Tangram混用时
//在下一行错误的修改window[undefined]
baidu.guid = "$BAIDU$";

//Tangram可能被放在闭包中
//一些页面级别唯一的属性，需要挂载在window[baidu.guid]上
window[baidu.guid] = window[baidu.guid] || {};

/**
 * @namespace baidu.lang 对语言层面的封装，包括类型判断、模块扩展、继承基类以及对象自定义事件的支持。
*/
baidu.lang = baidu.lang || {};

/**
 * 返回一个当前页面的唯一标识字符串。
 * @name baidu.lang.guid
 * @function
 * @grammar baidu.lang.guid()
 * @version 1.1.1
 * @meta standard
 *             
 * @returns {String} 当前页面的唯一标识字符串
 */

(function(){
    //不直接使用window，可以提高3倍左右性能
    var guid = window[baidu.guid];

    baidu.lang.guid = function() {
        return "TANGRAM__" + (guid._counter ++).toString(36);
    };

    guid._counter = guid._counter || 1;
})();

/**
 * 所有类的实例的容器
 * key为每个实例的guid
 * @meta standard
 */

window[baidu.guid]._instances = window[baidu.guid]._instances || {};

/**
 * 判断目标参数是否为function或Function实例
 * @name baidu.lang.isFunction
 * @function
 * @grammar baidu.lang.isFunction(source)
 * @param {Any} source 目标参数
 * @version 1.2
 * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 * @meta standard
 * @returns {boolean} 类型判断结果
 */
baidu.lang.isFunction = function (source) {
    // chrome下,'function' == typeof /a/ 为true.
    return '[object Function]' == Object.prototype.toString.call(source);
};


/**
 * Tangram继承机制提供的一个基类，用户可以通过继承baidu.lang.Class来获取它的属性及方法。
 * @class
 * @name    baidu.lang.Class
 * @grammar baidu.lang.Class(guid)
 * @param   {string}    guid    对象的唯一标识
 * @meta standard
 * @remark baidu.lang.Class和它的子类的实例均包含一个全局唯一的标识guid。guid是在构造函数中生成的，因此，继承自baidu.lang.Class的类应该直接或者间接调用它的构造函数。<br>baidu.lang.Class的构造函数中产生guid的方式可以保证guid的唯一性，及每个实例都有一个全局唯一的guid。
 * @meta standard
 * @see baidu.lang.inherits,baidu.lang.Event
 */
baidu.lang.Class = function(guid) {
    this.guid = guid || baidu.lang.guid();
    window[baidu.guid]._instances[this.guid] = this;
};
window[baidu.guid]._instances = window[baidu.guid]._instances || {};

/**
 * 释放对象所持有的资源，主要是自定义事件。
 * @name dispose
 * @grammar obj.dispose()
 * TODO: 将_listeners中绑定的事件剔除掉
 */
baidu.lang.Class.prototype.dispose = function(){
    delete window[baidu.guid]._instances[this.guid];

    for(var property in this){
        if (!baidu.lang.isFunction(this[property])) {
            delete this[property];
        }
    }
    this.disposed = true;   // 20100716
};

/**
 * 重载了默认的toString方法，使得返回信息更加准确一些。
 * @return {string} 对象的String表示形式
 */
baidu.lang.Class.prototype.toString = function(){
    return "[object " + (this._className || "Object" ) + "]";
};

/**
 * 判断目标参数是否string类型或String对象
 * @name baidu.lang.isString
 * @function
 * @grammar baidu.lang.isString(source)
 * @param {Any} source 目标参数
 * @shortcut isString
 * @meta standard
 * @see baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 *             
 * @returns {boolean} 类型判断结果
 */
baidu.lang.isString = function (source) {
    return '[object String]' == Object.prototype.toString.call(source);
};

// 声明快捷方法
baidu.isString = baidu.lang.isString;


/**
 * 自定义的事件对象。
 * @class
 * @name    baidu.lang.Event
 * @grammar baidu.lang.Event(type[, target])
 * @param   {string} type    事件类型名称。为了方便区分事件和一个普通的方法，事件类型名称必须以"on"(小写)开头。
 * @param   {Object} [target]触发事件的对象
 * @meta standard
 * @remark 引入该模块，会自动为Class引入3个事件扩展方法：addEventListener、removeEventListener和dispatchEvent。
 * @meta standard
 * @see baidu.lang.Class
 */
baidu.lang.Event = function (type, target) {
    this.type = type;
    this.returnValue = true;
    this.target = target || null;
    this.currentTarget = null;
};

/**
 * 注册对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
 * @grammar obj.addEventListener(type, handler[, key])
 * @param   {string}   type         自定义事件的名称
 * @param   {Function} handler      自定义事件被触发时应该调用的回调函数
 * @param   {string}   [key]        为事件监听函数指定的名称，可在移除时使用。如果不提供，方法会默认为它生成一个全局唯一的key。
 * @remark  事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。 
 */
baidu.lang.Class.prototype.addEventListener = function (type, handler, key) {
    if (!baidu.lang.isFunction(handler)) {
        return;
    }

    !this.__listeners && (this.__listeners = {});

    var t = this.__listeners, id;
    if (typeof key == "string" && key) {
        if (/[^\w\-]/.test(key)) {
            throw("nonstandard key:" + key);
        } else {
            handler.hashCode = key; 
            id = key;
        }
    }
    type.indexOf("on") != 0 && (type = "on" + type);

    typeof t[type] != "object" && (t[type] = {});
    id = id || baidu.lang.guid();
    handler.hashCode = id;
    t[type][id] = handler;
};
 
/**
 * 移除对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
 * @grammar obj.removeEventListener(type, handler)
 * @param {string}   type     事件类型
 * @param {Function|string} handler  要移除的事件监听函数或者监听函数的key
 * @remark  如果第二个参数handler没有被绑定到对应的自定义事件中，什么也不做。
 */
baidu.lang.Class.prototype.removeEventListener = function (type, handler) {
    if (typeof handler != "undefined") {
        if ( (baidu.lang.isFunction(handler) && ! (handler = handler.hashCode))
            || (! baidu.lang.isString(handler))
        ){
            return;
        }
    }

    !this.__listeners && (this.__listeners = {});

    type.indexOf("on") != 0 && (type = "on" + type);

    var t = this.__listeners;
    if (!t[type]) {
        return;
    }
    if (typeof handler != "undefined") {
        t[type][handler] && delete t[type][handler];
    } else {
        for(var guid in t[type]){
            delete t[type][guid];
        }
    }
};

/**
 * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
 * @grammar obj.dispatchEvent(event, options)
 * @param {baidu.lang.Event|String} event   Event对象，或事件名称(1.1.1起支持)
 * @param {Object}                  options 扩展参数,所含属性键值会扩展到Event对象上(1.2起支持)
 * @remark 处理会调用通过addEventListenr绑定的自定义事件回调函数之外，还会调用直接绑定到对象上面的自定义事件。例如：<br>
myobj.onMyEvent = function(){}<br>
myobj.addEventListener("onMyEvent", function(){});
 */
baidu.lang.Class.prototype.dispatchEvent = function (event, options) {
    if (baidu.lang.isString(event)) {
        event = new baidu.lang.Event(event);
    }
    !this.__listeners && (this.__listeners = {});

    // 20100603 添加本方法的第二个参数，将 options extend到event中去传递
    options = options || {};
    for (var i in options) {
        event[i] = options[i];
    }

    var i, t = this.__listeners, p = event.type;
    event.target = event.target || this;
    event.currentTarget = this;

    p.indexOf("on") != 0 && (p = "on" + p);

    baidu.lang.isFunction(this[p]) && this[p].apply(this, arguments);

    if (typeof t[p] == "object") {
        for (i in t[p]) {
            t[p][i].apply(this, arguments);
        }
    }
    return event.returnValue;
};


/**
 * 创建一个类，包括创造类的构造器、继承基类Class
 * @name baidu.lang.createClass
 * @function
 * @grammar baidu.lang.createClass(constructor[, options])
 * @param {Function} constructor 类的构造器函数
 * @param {Object} [options] 
                
 * @config {string} [className] 类名
 * @config {Function} [superClass] 父类，默认为baidu.lang.Class
 * @version 1.2
 * @remark
 * 
            使用createClass能方便的创建一个带有继承关系的类。同时会为返回的类对象添加extend方法，使用obj.extend({});可以方便的扩展原型链上的方法和属性
        
 * @see baidu.lang.Class,baidu.lang.inherits
 *             
 * @returns {Object} 一个类对象
 */

baidu.lang.createClass = /**@function*/function(constructor, options) {
    options = options || {};
    var superClass = options.superClass || baidu.lang.Class;

    // 创建新类的真构造器函数
    var fn = function(){
        // 继承父类的构造器
        if(superClass != baidu.lang.Class){
            superClass.apply(this, arguments);
        }else{
            superClass.call(this);
        }
        constructor.apply(this, arguments);
    };

    fn.options = options.options || {};

    var C = function(){},
        cp = constructor.prototype;
    C.prototype = superClass.prototype;

    // 继承父类的原型（prototype)链
    var fp = fn.prototype = new C();

    // 继承传参进来的构造器的 prototype 不会丢
    for (var i in cp) fp[i] = cp[i];

    typeof options.className == "string" && (fp._className = options.className);

    // 修正这种继承方式带来的 constructor 混乱的问题
    fp.constructor = cp.constructor;

    // 给类扩展出一个静态方法，以代替 baidu.object.extend()
    fn.extend = function(json){
        for (var i in json) {
            fn.prototype[i] = json[i];
        }
        return fn;  // 这个静态方法也返回类对象本身
    };

    return fn;
};

/**
 * 判断目标参数是否Array对象
 * @name baidu.lang.isArray
 * @function
 * @grammar baidu.lang.isArray(source)
 * @param {Any} source 目标参数
 * @meta standard
 * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 *             
 * @returns {boolean} 类型判断结果
 */
baidu.lang.isArray = function (source) {
    return '[object Array]' == Object.prototype.toString.call(source);
};

/**
 * 判断目标参数是否Boolean对象
 * @name baidu.lang.isBoolean
 * @function
 * @grammar baidu.lang.isBoolean(source)
 * @param {Any} source 目标参数
 * @version 1.3
 * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isElement,baidu.lang.isArray,baidu.lang.isDate
 *             
 * @returns {boolean} 类型判断结果
 */
baidu.lang.isBoolean = function(o) {
    return typeof o === 'boolean';
};

/**
 * 判断目标参数是否为Date对象
 * @name baidu.lang.isDate
 * @function
 * @grammar baidu.lang.isDate(source)
 * @param {Any} source 目标参数
 * @version 1.3
 * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isBoolean,baidu.lang.isElement
 *             
 * @returns {boolean} 类型判断结果
 */
baidu.lang.isDate = function(o) {
    // return o instanceof Date;
    return {}.toString.call(o) === "[object Date]" && o.toString() !== 'Invalid Date' && !isNaN(o);
};

/**
 * 判断目标参数是否number类型或Number对象
 * @name baidu.lang.isNumber
 * @function
 * @grammar baidu.lang.isNumber(source)
 * @param {Any} source 目标参数
 * @meta standard
 * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 *             
 * @returns {boolean} 类型判断结果
 * @remark 用本函数判断NaN会返回false，尽管在Javascript中是Number类型。
 */
baidu.lang.isNumber = function (source) {
    return '[object Number]' == Object.prototype.toString.call(source) && isFinite(source);
};

/**
 * 判断目标参数是否为Object对象
 * @name baidu.lang.isObject
 * @function
 * @grammar baidu.lang.isObject(source)
 * @param {Any} source 目标参数
 * @shortcut isObject
 * @meta standard
 * @see baidu.lang.isString,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 *             
 * @returns {boolean} 类型判断结果
 */
baidu.lang.isObject = function (source) {
    return 'function' == typeof source || !!(source && 'object' == typeof source);
};

// 声明快捷方法
baidu.isObject = baidu.lang.isObject;
/**
 * @namespace baidu.ajax 对XMLHttpRequest请求的封装。
*/
baidu.ajax = baidu.ajax || {};

/**
 * @namespace baidu.fn 对方法的操作，解决内存泄露问题。
 */
baidu.fn = baidu.fn || {};


/**
 * 这是一个空函数，用于需要排除函数作用域链干扰的情况.
 * @author rocy
 * @name baidu.fn.blank
 * @function
 * @grammar baidu.fn.blank()
 * @meta standard
 * @return {Function} 一个空函数
 * @version 1.3.3
 */
baidu.fn.blank = function () {};


/**
 * 发送一个ajax请求
 * @author: allstar, erik, berg
 * @name baidu.ajax.request
 * @function
 * @grammar baidu.ajax.request(url[, options])
 * @param {string}  url 发送请求的url
 * @param {Object}  options 发送请求的选项参数
 * @config {String}     [method]            请求发送的类型。默认为GET
 * @config {Boolean}  [async]           是否异步请求。默认为true（异步）
 * @config {String}     [data]              需要发送的数据。如果是GET请求的话，不需要这个属性
 * @config {Object}     [headers]           要设置的http request header
 * @config {number}   [timeout]       超时时间，单位ms
 * @config {String}     [username]          用户名
 * @config {String}     [password]          密码
 * @config {Function} [onsuccess]       请求成功时触发，function(XMLHttpRequest xhr, string responseText)。
 * @config {Function} [onfailure]       请求失败时触发，function(XMLHttpRequest xhr)。
 * @config {Function} [onbeforerequest] 发送请求之前触发，function(XMLHttpRequest xhr)。
 * @config {Function} [on{STATUS_CODE}]     当请求为相应状态码时触发的事件，如on302、on404、on500，function(XMLHttpRequest xhr)。3XX的状态码浏览器无法获取，4xx的，可能因为未知问题导致获取失败。
 * @config {Boolean}  [noCache]             是否需要缓存，默认为false（缓存），1.1.1起支持。
 * 
 * @meta standard
 * @see baidu.ajax.get,baidu.ajax.post,baidu.ajax.form
 *             
 * @returns {XMLHttpRequest} 发送请求的XMLHttpRequest对象
 */
baidu.ajax.request = function (url, opt_options) {
    var options     = opt_options || {},
        data        = options.data || "",
        async       = !(options.async === false),
        username    = options.username || "",
        password    = options.password || "",
        method      = (options.method || "GET").toUpperCase(),
        headers     = options.headers || {},
        // 基本的逻辑来自lili同学提供的patch
        timeout     = options.timeout || 0,
        eventHandlers = {},
        tick, key, xhr;

    /**
     * readyState发生变更时调用
     * 
     * @ignore
     */
    function stateChangeHandler() {
        if (xhr.readyState == 4) {
            try {
                var stat = xhr.status;
            } catch (ex) {
                // 在请求时，如果网络中断，Firefox会无法取得status
                fire('failure');
                return;
            }
            
            fire(stat);
            
            // http://www.never-online.net/blog/article.asp?id=261
            // case 12002: // Server timeout      
            // case 12029: // dropped connections
            // case 12030: // dropped connections
            // case 12031: // dropped connections
            // case 12152: // closed by server
            // case 13030: // status and statusText are unavailable
            
            // IE error sometimes returns 1223 when it 
            // should be 204, so treat it as success
            if ((stat >= 200 && stat < 300)
                || stat == 304
                || stat == 1223) {
                fire('success');
            } else {
                fire('failure');
            }
            
            /*
             * NOTE: Testing discovered that for some bizarre reason, on Mozilla, the
             * JavaScript <code>XmlHttpRequest.onreadystatechange</code> handler
             * function maybe still be called after it is deleted. The theory is that the
             * callback is cached somewhere. Setting it to null or an empty function does
             * seem to work properly, though.
             * 
             * On IE, there are two problems: Setting onreadystatechange to null (as
             * opposed to an empty function) sometimes throws an exception. With
             * particular (rare) versions of jscript.dll, setting onreadystatechange from
             * within onreadystatechange causes a crash. Setting it from within a timeout
             * fixes this bug (see issue 1610).
             * 
             * End result: *always* set onreadystatechange to an empty function (never to
             * null). Never set onreadystatechange from within onreadystatechange (always
             * in a setTimeout()).
             */
            window.setTimeout(
                function() {
                    // 避免内存泄露.
                    // 由new Function改成不含此作用域链的 baidu.fn.blank 函数,
                    // 以避免作用域链带来的隐性循环引用导致的IE下内存泄露. By rocy 2011-01-05 .
                    xhr.onreadystatechange = baidu.fn.blank;
                    if (async) {
                        xhr = null;
                    }
                }, 0);
        }
    }
    
    /**
     * 获取XMLHttpRequest对象
     * 
     * @ignore
     * @return {XMLHttpRequest} XMLHttpRequest对象
     */
    function getXHR() {
        if (window.ActiveXObject) {
            try {
                return new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {}
            }
        }
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
    }
    
    /**
     * 触发事件
     * 
     * @ignore
     * @param {String} type 事件类型
     */
    function fire(type) {
        type = 'on' + type;
        var handler = eventHandlers[type],
            globelHandler = baidu.ajax[type];
        
        // 不对事件类型进行验证
        if (handler) {
            if (tick) {
              clearTimeout(tick);
            }

            if (type != 'onsuccess') {
                handler(xhr);
            } else {
                //处理获取xhr.responseText导致出错的情况,比如请求图片地址.
                try {
                    xhr.responseText;
                } catch(error) {
                    return handler(xhr);
                }
                handler(xhr, xhr.responseText);
            }
        } else if (globelHandler) {
            //onsuccess不支持全局事件
            if (type == 'onsuccess') {
                return;
            }
            globelHandler(xhr);
        }
    }
    
    
    for (key in options) {
        // 将options参数中的事件参数复制到eventHandlers对象中
        // 这里复制所有options的成员，eventHandlers有冗余
        // 但是不会产生任何影响，并且代码紧凑
        eventHandlers[key] = options[key];
    }
    
    headers['X-Requested-With'] = 'XMLHttpRequest';
    
    
    try {
        xhr = getXHR();
        
        if (method == 'GET') {
            if (data) {
                url += (url.indexOf('?') >= 0 ? '&' : '?') + data;
                data = null;
            }
            if(options['noCache'])
                url += (url.indexOf('?') >= 0 ? '&' : '?') + 'b' + (+ new Date) + '=1';
        }
        
        if (username) {
            xhr.open(method, url, async, username, password);
        } else {
            xhr.open(method, url, async);
        }
        
        if (async) {
            xhr.onreadystatechange = stateChangeHandler;
        }
        
        // 在open之后再进行http请求头设定
        // FIXME 是否需要添加; charset=UTF-8呢
        if (method == 'POST') {
            xhr.setRequestHeader("Content-Type",
                (headers['Content-Type'] || "application/x-www-form-urlencoded"));
        }
        
        for (key in headers) {
            if (headers.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }
        
        fire('beforerequest');

        if (timeout) {
          tick = setTimeout(function(){
            xhr.onreadystatechange = baidu.fn.blank;
            xhr.abort();
            fire("timeout");
          }, timeout);
        }
        xhr.send(data);
        
        if (!async) {
            stateChangeHandler();
        }
    } catch (ex) {
        fire('failure');
    }
    
    return xhr;
};


/**
 * @namespace baidu.array 操作数组的方法。
 */

baidu.array = baidu.array || {};


/**
 * 遍历数组中所有元素
 * @name baidu.array.each
 * @function
 * @grammar baidu.array.each(source, iterator[, thisObject])
 * @param {Array} source 需要遍历的数组
 * @param {Function} iterator 对每个数组元素进行调用的函数，该函数有两个参数，第一个为数组元素，第二个为数组索引值，function (item, index)。
 * @param {Object} [thisObject] 函数调用时的this指针，如果没有此参数，默认是当前遍历的数组
 * @remark
 * each方法不支持对Object的遍历,对Object的遍历使用baidu.object.each 。
 * @shortcut each
 * @meta standard
 *             
 * @returns {Array} 遍历的数组
 */
 
baidu.each = baidu.array.forEach = baidu.array.each = function (source, iterator, thisObject) {
    var returnValue, item, i, len = source.length;
    
    if ('function' == typeof iterator) {
        for (i = 0; i < len; i++) {
            item = source[i];
            //TODO
            //此处实现和标准不符合，标准中是这样说的：
            //If a thisObject parameter is provided to forEach, it will be used as the this for each invocation of the callback. If it is not provided, or is null, the global object associated with callback is used instead.
            returnValue = iterator.call(thisObject || source, item, i);
    
            if (returnValue === false) {
                break;
            }
        }
    }
    return source;
};

/**
 * 查询数组中指定元素的索引位置
 * @name baidu.array.indexOf
 * @function
 * @grammar baidu.array.indexOf(source, match[, fromIndex])
 * @param {Array} source 需要查询的数组
 * @param {Any} match 查询项
 * @param {number} [fromIndex] 查询的起始位索引位置，如果为负数，则从source.length+fromIndex往后开始查找
 * @see baidu.array.find,baidu.array.lastIndexOf
 *             
 * @returns {number} 指定元素的索引位置，查询不到时返回-1
 */
baidu.array.indexOf = function (source, match, fromIndex) {
    var len = source.length,
        iterator = match;
        
    fromIndex = fromIndex | 0;
    if(fromIndex < 0){//小于0
        fromIndex = Math.max(0, len + fromIndex)
    }
    for ( ; fromIndex < len; fromIndex++) {
        if(fromIndex in source && source[fromIndex] === match) {
            return fromIndex;
        }
    }
    
    return -1;
};


/**
 * 判断一个数组中是否包含给定元素
 * @name baidu.array.contains
 * @function
 * @grammar baidu.array.contains(source, obj)
 * @param {Array} source 需要判断的数组.
 * @param {Any} obj 要查找的元素.
 * @return {boolean} 判断结果.
 * @author berg
 */
baidu.array.contains = function(source, obj) {
    return (baidu.array.indexOf(source, obj) >= 0);
};

/**
 * @namespace baidu.string 操作字符串的方法。
 */
baidu.string = baidu.string || {};


/**
 * 删除目标字符串两端的空白字符
 * @name baidu.string.trim
 * @function
 * @grammar baidu.string.trim(source)
 * @param {string} source 目标字符串
 * @remark
 * 不支持删除单侧空白字符
 * @shortcut trim
 * @meta standard
 *             
 * @returns {string} 删除两端空白字符后的字符串
 */

(function () {
    var trimer = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g");
    
    baidu.string.trim = function (source) {
        return String(source)
                .replace(trimer, "");
    };
})();

// 声明快捷方法
baidu.trim = baidu.string.trim;

/**
 * @namespace baidu.object 操作原生对象的方法。
 */
baidu.object = baidu.object || {};


/**
 * 遍历Object中所有元素，1.1.1增加
 * @name baidu.object.each
 * @function
 * @grammar baidu.object.each(source, iterator)
 * @param {Object} source 需要遍历的Object
 * @param {Function} iterator 对每个Object元素进行调用的函数，function (item, key)
 * @version 1.1.1
 *             
 * @returns {Object} 遍历的Object
 */
baidu.object.each = function (source, iterator) {
    var returnValue, key, item; 
    if ('function' == typeof iterator) {
        for (key in source) {
            if (source.hasOwnProperty(key)) {
                item = source[key];
                returnValue = iterator.call(source, item, key);
        
                if (returnValue === false) {
                    break;
                }
            }
        }
    }
    return source;
};

﻿/** @namespace */
baidu.data = baidu.data || {};

/**
 * @namespace baidu.dom 操作dom的方法。
 */
baidu.dom = baidu.dom || {};


/**
 * 从文档中获取指定的DOM元素
 * @name baidu.dom.g
 * @function
 * @grammar baidu.dom.g(id)
 * @param {string|HTMLElement} id 元素的id或DOM元素
 * @shortcut g,T.G
 * @meta standard
 * @see baidu.dom.q
 *             
 * @returns {HTMLElement|null} 获取的元素，查找不到时返回null,如果参数不合法，直接返回参数
 */
baidu.dom.g = function (id) {
    if ('string' == typeof id || id instanceof String) {
        return document.getElementById(id);
    } else if (id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
        return id;
    }
    return null;
};

// 声明快捷方法
baidu.g = baidu.G = baidu.dom.g;

/**
 * 提供给setStyle与getStyle使用
 */
baidu.dom._styleFixer = baidu.dom._styleFixer || {};

/**
 * 提供给setStyle与getStyle使用
 */
baidu.dom._styleFilter = baidu.dom._styleFilter || [];



/**
 * 为获取和设置样式的过滤器
 * @private
 * @meta standard
 */
baidu.dom._styleFilter.filter = function (key, value, method) {
    for (var i = 0, filters = baidu.dom._styleFilter, filter; filter = filters[i]; i++) {
        if (filter = filter[method]) {
            value = filter(key, value);
        }
    }

    return value;
};

/**
 * 将目标字符串进行驼峰化处理
 * @name baidu.string.toCamelCase
 * @function
 * @grammar baidu.string.toCamelCase(source)
 * @param {string} source 目标字符串
 * @remark
 * 支持单词以“-_”分隔
 * @meta standard
 *             
 * @returns {string} 驼峰化处理后的字符串
 */
 
 //todo:考虑以后去掉下划线支持？
baidu.string.toCamelCase = function (source) {
    //提前判断，提高getStyle等的效率 thanks xianwei
    if (source.indexOf('-') < 0 && source.indexOf('_') < 0) {
        return source;
    }
    return source.replace(/[-_][^-_]/g, function (match) {
        return match.charAt(1).toUpperCase();
    });
};


/**
 * 设置目标元素的style样式值
 * @name baidu.dom.setStyle
 * @function
 * @grammar baidu.dom.setStyle(element, key, value)
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {string} key 要设置的样式名
 * @param {string} value 要设置的样式值
 * @remark
 * 
            为了精简代码，本模块默认不对任何浏览器返回值进行归一化处理（如使用getStyle时，不同浏览器下可能返回rgb颜色或hex颜色），也不会修复浏览器的bug和差异性（如设置IE的float属性叫styleFloat，firefox则是cssFloat）。<br />
baidu.dom._styleFixer和baidu.dom._styleFilter可以为本模块提供支持。<br />
其中_styleFilter能对颜色和px进行归一化处理，_styleFixer能对display，float，opacity，textOverflow的浏览器兼容性bug进行处理。
        
 * @shortcut setStyle
 * @meta standard
 * @see baidu.dom.getStyle,baidu.dom.setStyles
 *             
 * @returns {HTMLElement} 目标元素
 */
baidu.dom.setStyle = function (element, key, value) {
    var dom = baidu.dom, fixer;
    
    // 放弃了对firefox 0.9的opacity的支持
    element = dom.g(element);
    key = baidu.string.toCamelCase(key);

    if (fixer = dom._styleFilter) {
        value = fixer.filter(key, value, 'set');
    }

    fixer = dom._styleFixer[key];
    (fixer && fixer.set) ? fixer.set(element, value) : (element.style[fixer || key] = value);

    return element;
};

// 声明快捷方法
baidu.setStyle = baidu.dom.setStyle;


/**
 * 批量设置目标元素的style样式值
 * @name baidu.dom.setStyles
 * @function
 * @grammar baidu.dom.setStyles(element, styles)
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {Object} styles 要设置的样式集合
 * @shortcut setStyles
 * @meta standard
 * @see baidu.dom.setStyle,baidu.dom.getStyle
 *             
 * @returns {HTMLElement} 目标元素
 */
baidu.dom.setStyles = function (element, styles) {
    element = baidu.dom.g(element);

    for (var key in styles) {
        baidu.dom.setStyle(element, key, styles[key]);
    }

    return element;
};

// 声明快捷方法
baidu.setStyles = baidu.dom.setStyles;
/**
 * @namespace baidu.event 屏蔽浏览器差异性的事件封装。
 * @property target     事件的触发元素
 * @property pageX      鼠标事件的鼠标x坐标
 * @property pageY      鼠标事件的鼠标y坐标
 * @property keyCode    键盘事件的键值
 */
baidu.event = baidu.event || {};


/**
 * 事件监听器的存储表
 * @private
 * @meta standard
 */
baidu.event._listeners = baidu.event._listeners || [];

/**
 * 从文档中获取指定的DOM元素
 * **内部方法**
 * 
 * @param {string|HTMLElement} id 元素的id或DOM元素
 * @meta standard
 * @return {HTMLElement} DOM元素，如果不存在，返回null，如果参数不合法，直接返回参数
 */
baidu.dom._g = function (id) {
    if (baidu.lang.isString(id)) {
        return document.getElementById(id);
    }
    return id;
};

// 声明快捷方法
baidu._g = baidu.dom._g;


/**
 * 为目标元素添加事件监听器
 * @name baidu.event.on
 * @function
 * @grammar baidu.event.on(element, type, listener)
 * @param {HTMLElement|string|window} element 目标元素或目标元素id
 * @param {string} type 事件类型
 * @param {Function} listener 需要添加的监听器
 * @remark
 * 
1. 不支持跨浏览器的鼠标滚轮事件监听器添加<br>
2. 改方法不为监听器灌入事件对象，以防止跨iframe事件挂载的事件对象获取失败
    
 * @shortcut on
 * @meta standard
 * @see baidu.event.un
 * @returns {HTMLElement|window} 目标元素
 */
baidu.event.on = /**@function*/function (element, type, listener) {
    type = type.replace(/^on/i, '');
    element = baidu.dom._g(element);

    var realListener = function (ev) {
            // 1. 这里不支持EventArgument,  原因是跨frame的事件挂载
            // 2. element是为了修正this
            listener.call(element, ev);
        },
        lis = baidu.event._listeners,
        filter = baidu.event._eventFilter,
        afterFilter,
        realType = type;
    type = type.toLowerCase();
    // filter过滤
    if(filter && filter[type]){
        afterFilter = filter[type](element, type, realListener);
        realType = afterFilter.type;
        realListener = afterFilter.listener;
    }
    
    // 事件监听器挂载
    if (element.addEventListener) {
        element.addEventListener(realType, realListener, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + realType, realListener);
    }
  
    // 将监听器存储到数组中
    lis[lis.length] = [element, type, listener, realListener, realType];
    return element;
};

// 声明快捷方法
baidu.on = baidu.event.on;

/**
 * 为目标元素移除事件监听器
 * @name baidu.event.un
 * @function
 * @grammar baidu.event.un(element, type, listener)
 * @param {HTMLElement|string|window} element 目标元素或目标元素id
 * @param {string} type 事件类型
 * @param {Function} listener 需要移除的监听器
 * @shortcut un
 * @meta standard
 * @see baidu.event.on
 *             
 * @returns {HTMLElement|window} 目标元素
 */
baidu.event.un = function (element, type, listener) {
    element = baidu.dom._g(element);
    type = type.replace(/^on/i, '').toLowerCase();
    
    var lis = baidu.event._listeners, 
        len = lis.length,
        isRemoveAll = !listener,
        item,
        realType, realListener;
    
    //如果将listener的结构改成json
    //可以节省掉这个循环，优化性能
    //但是由于un的使用频率并不高，同时在listener不多的时候
    //遍历数组的性能消耗不会对代码产生影响
    //暂不考虑此优化
    while (len--) {
        item = lis[len];
        
        // listener存在时，移除element的所有以listener监听的type类型事件
        // listener不存在时，移除element的所有type类型事件
        if (item[1] === type
            && item[0] === element
            && (isRemoveAll || item[2] === listener)) {
            realType = item[4];
            realListener = item[3];
            if (element.removeEventListener) {
                element.removeEventListener(realType, realListener, false);
            } else if (element.detachEvent) {
                element.detachEvent('on' + realType, realListener);
            }
            lis.splice(len, 1);
        }
    }
    
    return element;
};

// 声明快捷方法
baidu.un = baidu.event.un;


/** 
 * 为对象绑定方法和作用域
 * @name baidu.fn.bind
 * @function
 * @grammar baidu.fn.bind(handler[, obj, args])
 * @param {Function|String} handler 要绑定的函数，或者一个在作用域下可用的函数名
 * @param {Object} obj 执行运行时this，如果不传入则运行时this为函数本身
 * @param {args* 0..n} args 函数执行时附加到执行时函数前面的参数
 * @version 1.3
 *
 * @returns {Function} 封装后的函数
 */
baidu.fn.bind = function(func, scope) {
    var xargs = arguments.length > 2 ? [].slice.call(arguments, 2) : null;
    return function () {
        var fn = baidu.lang.isString(func) ? scope[func] : func,
            args = (xargs) ? xargs.concat([].slice.call(arguments, 0)) : arguments;
        return fn.apply(scope || fn, args);
    };
};


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

/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:data/dataSource/DataSource.js
 * @author:Walter
 * @version:1.0.0
 * @date:2010-11-30
 */
/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:data/dataSource.js
 * @author:walter
 * @version:1.0.0
 * @date:2010-11-30
 */



/**
 * @namespace 定义命名空间
 */
baidu.data.dataSource = baidu.dataSource = baidu.data.dataSource || {};



/**
 * 将源对象的所有属性拷贝到目标对象中
 * @author erik
 * @name baidu.object.extend
 * @function
 * @grammar baidu.object.extend(target, source)
 * @param {Object} target 目标对象
 * @param {Object} source 源对象
 * @see baidu.array.merge
 * @remark
 * 
1.目标对象中，与源对象key相同的成员将会被覆盖。<br>
2.源对象的prototype成员不会拷贝。
        
 * @shortcut extend
 * @meta standard
 *             
 * @returns {Object} 目标对象
 */
baidu.extend =
baidu.object.extend = function (target, source) {
    for (var p in source) {
        if (source.hasOwnProperty(p)) {
            target[p] = source[p];
        }
    }
    
    return target;
};

/**
 * 获取目标对象的键名列表
 * @name baidu.object.keys
 * @function
 * @grammar baidu.object.keys(source)
 * @param {Object} source 目标对象
 * @see baidu.object.values
 *             
 * @returns {Array} 键名列表
 */
baidu.object.keys = function (source) {
    var result = [], resultLen = 0, k;
    for (k in source) {
        if (source.hasOwnProperty(k)) {
            result[resultLen++] = k;
        }
    }
    return result;
};


/**
 * 数据源类
 * @class
 * @grammar new baidu.data.dataSource.DataSource(options)
 * @param {Object}      [options]              config参数
 * @config {Number}     [maxCache = 10]       缓存数据的最大个数
 * @config {Boolean}    [cache = true]        是否使用缓存
 * @config {Function}   [transition]          转换数据算法
 * @return {baidu.data.dataSource.DataSource} 数据源类
 * @private
 */
baidu.data.dataSource.DataSource = baidu.lang.createClass(function(options){
    this._cacheData = {};
    baidu.object.extend(this, options);
    
    this.addEventListener("onbeforeget", function(evt){
        var me = this, 
            data;
        if (me.cache && (data = me._cacheData[evt.key]) && evt.onsuccess) {
            evt.onsuccess.call(me, data);
        }
        
        evt.returnValue = !!data;
    });
}, {
    className: "baidu.data.dataSource.DataSource"
}).extend(
    /**
     *  @lends baidu.data.dataSource.DataSource.prototype
     */
    {
    
    maxCache: 100,
    
    cache: true,
    
    /**
     * 更新配置
     * @param {Object} options
     */
    update: function(options){
        var me = this;
        baidu.object.extend(me, options);
    },
    
    /**
     * 
     * 获取数据
     * @interface 
     * @param {Object} options 配置信息
     */
    get: function(options){
    
    },
    
    /**
     * 转换数据格式并调用回调函数
     * @private 
     * @param {Object} options
     * @return {Object} 返回数据
     */
    _get: function(options){
        var me = this, 
            data;
        data = me.transition.call(me, me.source);
        me.cache && options.key && data && me._addCacheData(options.key, data);
        options.onsuccess && options.onsuccess.call(me, data);
        return data;
    },
    
    /**
     * 转换数据格式
     * @function 
     * @param  {Object} source 数据源
     * @return {Object} source 转换格式后的数据源
     */
    transition: function(source){
        return source;
    },
    
    /**
     * 增加缓存数据
     * @privite 
     * @param {Object} key    数据键值对Key值
     * @param {Object} value  数据键值对value值
     */
    _addCacheData: function(key, value){
        var me = this, 
            keySet = baidu.object.keys(me._cacheData);
        while (me.maxCache > 0 && keySet.length >= me.maxCache) {
            delete me._cacheData[keySet.shift()];
        }
        if (me.maxCache > 0) {
            me._cacheData[key] = value;
        }
    }
});

/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:data/dataSource/ajax.js
 * @author:Walter
 * @version:1.0.0
 * @date:2010-11-30
 */


/**
 * @namespace baidu.json 操作json对象的方法。
 */
baidu.json = baidu.json || {};


/**
 * 将json对象序列化
 * @name baidu.json.stringify
 * @function
 * @grammar baidu.json.stringify(value)
 * @param {JSON} value 需要序列化的json对象
 * @remark
 * 该方法的实现与ecma-262第五版中规定的JSON.stringify不同，暂时只支持传入一个参数。后续会进行功能丰富。
 * @meta standard
 * @see baidu.json.parse,baidu.json.encode
 *             
 * @returns {string} 序列化后的字符串
 */
baidu.json.stringify = (function () {
    /**
     * 字符串处理时需要转义的字符表
     * @private
     */
    var escapeMap = {
        "\b": '\\b',
        "\t": '\\t',
        "\n": '\\n',
        "\f": '\\f',
        "\r": '\\r',
        '"' : '\\"',
        "\\": '\\\\'
    };
    
    /**
     * 字符串序列化
     * @private
     */
    function encodeString(source) {
        if (/["\\\x00-\x1f]/.test(source)) {
            source = source.replace(
                /["\\\x00-\x1f]/g, 
                function (match) {
                    var c = escapeMap[match];
                    if (c) {
                        return c;
                    }
                    c = match.charCodeAt();
                    return "\\u00" 
                            + Math.floor(c / 16).toString(16) 
                            + (c % 16).toString(16);
                });
        }
        return '"' + source + '"';
    }
    
    /**
     * 数组序列化
     * @private
     */
    function encodeArray(source) {
        var result = ["["], 
            l = source.length,
            preComma, i, item;
            
        for (i = 0; i < l; i++) {
            item = source[i];
            
            switch (typeof item) {
            case "undefined":
            case "function":
            case "unknown":
                break;
            default:
                if(preComma) {
                    result.push(',');
                }
                result.push(baidu.json.stringify(item));
                preComma = 1;
            }
        }
        result.push("]");
        return result.join("");
    }
    
    /**
     * 处理日期序列化时的补零
     * @private
     */
    function pad(source) {
        return source < 10 ? '0' + source : source;
    }
    
    /**
     * 日期序列化
     * @private
     */
    function encodeDate(source){
        return '"' + source.getFullYear() + "-" 
                + pad(source.getMonth() + 1) + "-" 
                + pad(source.getDate()) + "T" 
                + pad(source.getHours()) + ":" 
                + pad(source.getMinutes()) + ":" 
                + pad(source.getSeconds()) + '"';
    }
    
    return function (value) {
        switch (typeof value) {
        case 'undefined':
            return 'undefined';
            
        case 'number':
            return isFinite(value) ? String(value) : "null";
            
        case 'string':
            return encodeString(value);
            
        case 'boolean':
            return String(value);
            
        default:
            if (value === null) {
                return 'null';
            } else if (value instanceof Array) {
                return encodeArray(value);
            } else if (value instanceof Date) {
                return encodeDate(value);
            } else {
                var result = ['{'],
                    encode = baidu.json.stringify,
                    preComma,
                    item;
                    
                for (var key in value) {
                    if (Object.prototype.hasOwnProperty.call(value, key)) {
                        item = value[key];
                        switch (typeof item) {
                        case 'undefined':
                        case 'unknown':
                        case 'function':
                            break;
                        default:
                            if (preComma) {
                                result.push(',');
                            }
                            preComma = 1;
                            result.push(encode(key) + ':' + encode(item));
                        }
                    }
                }
                result.push('}');
                return result.join('');
            }
        }
    };
})();



/**
 * 异步调用数据源类
 * @function
 * @grammar baidu.data.dataSource.ajax(url, options)
 * @param {String}     url                           数据源地址
 * @param {Object}     [options]                     配置
 * @config {Number} maxCache 缓存数据的最大个数，默认10
 * @config {Boolean} cache 是否使用缓存，默认开启
 * @config {Function} transition 转换数据算法  
 * @config {Function} onbeforeget beforeget事件
 */
baidu.data.dataSource.ajax = function(url, options){
    options = baidu.object.extend({
        url: url
    }, options || {});
    
    var dataSource = new baidu.data.dataSource.DataSource(options);
    
    /**
     * 获取数据
     * @param {Object}    options                 配置
     * @param {String}    [options.key = url + param]     用于存取缓存
     * @param {String}    [options.method = 'GET']        请求的类型
     * @param {Object}    [options.param]                 需要发送的数据
     * @param {Function}  [options.onsuccess]             加载成功回调函数
     * @param {Function}  [options.onfailure]             加载失败回调函数
     * @param {Object}    [options.ajaxOption]            request参数
     */
    dataSource.get = function(options){
        var me = this;
        options = options || {};
        options.key = options.key || (me.url + (options.param ? "?" + baidu.json.stringify(options.param) : ""));
        if (!me.dispatchEvent("onbeforeget", options)) {
            baidu.ajax.request(me.url, me.ajaxOption ||
            {
                method: options.method || 'get',
                data: options.param,
                onsuccess: function(xhr, responseText){
                    me.source = responseText;
                    me._get(options);
                },
                onfailure: function(xhr){
                    options.onfailure && options.onfailure.call(me, xhr);
                }
            });
        }
    };
    return dataSource;
};

/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:data/dataSource/local.js
 * @author:Walter
 * @version:1.0.0
 * @date:2010-11-30
 */



/**
 * 本地数据源类
 * @function
 * @grammar baidu.data.dataSource.local(source, options)
 * @param {Object}     source                        数据源
 * @param {Object}     [options]                     配置
 * @config {Number} maxCache 缓存数据的最大个数，默认10
 * @config {Boolean} cache 是否使用缓存，默认开启
 * @config {Function} transition 转换数据算法  
 * @config {Function} onbeforeget beforeget事件
 */
baidu.data.dataSource.local = function(source, options){
    options = baidu.object.extend({
        source: source
    }, options || {});
    
    var dataSource = new baidu.data.dataSource.DataSource(options);
    
    /**
     * 获取数据
     * @param {Object}    options                 配置
     * @param {String}    [options.key = 'local']     用于存取缓存
     * @param {Function}  [options.onsuccess]             加载成功回调函数
     */
    dataSource.get = function(options){
        var me = this, 
            data;
        options = baidu.object.extend({
            'key': 'local'
        }, options || {});
        
        if (!me.dispatchEvent("onbeforeget", options)) {
            data = me._get(options);
        }
        return data;
    };
    return dataSource;
};

/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:data/dataSource/sio.js
 * @author:Walter
 * @version:1.0.0
 * @date:2010-11-30
 */

/**
 * @namespace baidu.sio 使用动态script标签请求服务器资源，包括由服务器端的回调和浏览器端的回调。
 */
baidu.sio = baidu.sio || {};

/**
 * 
 * @param {HTMLElement} src script节点
 * @param {String} url script节点的地址
 * @param {String} [charset] 编码
 */
baidu.sio._createScriptTag = function(scr, url, charset){
    scr.setAttribute('type', 'text/javascript');
    charset && scr.setAttribute('charset', charset);
    scr.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(scr);
};

/**
 * 删除script的属性，再删除script标签，以解决修复内存泄漏的问题
 * 
 * @param {HTMLElement} src script节点
 */
baidu.sio._removeScriptTag = function(scr){
    if (scr.clearAttributes) {
        scr.clearAttributes();
    } else {
        for (var attr in scr) {
            if (scr.hasOwnProperty(attr)) {
                delete scr[attr];
            }
        }
    }
    if(scr && scr.parentNode){
        scr.parentNode.removeChild(scr);
    }
    scr = null;
};


/**
 * 通过script标签加载数据，加载完成由浏览器端触发回调
 * @name baidu.sio.callByBrowser
 * @function
 * @grammar baidu.sio.callByBrowser(url, opt_callback, opt_options)
 * @param {string} url 加载数据的url
 * @param {Function|string} opt_callback 数据加载结束时调用的函数或函数名
 * @param {Object} opt_options 其他可选项
 * @config {String} [charset] script的字符集
 * @config {Integer} [timeOut] 超时时间，超过这个时间将不再响应本请求，并触发onfailure函数
 * @config {Function} [onfailure] timeOut设定后才生效，到达超时时间时触发本函数
 * @remark
 * 1、与callByServer不同，callback参数只支持Function类型，不支持string。
 * 2、如果请求了一个不存在的页面，callback函数在IE/opera下也会被调用，因此使用者需要在onsuccess函数中判断数据是否正确加载。
 * @meta standard
 * @see baidu.sio.callByServer
 */
baidu.sio.callByBrowser = function (url, opt_callback, opt_options) {
    var scr = document.createElement("SCRIPT"),
        scriptLoaded = 0,
        options = opt_options || {},
        charset = options['charset'],
        callback = opt_callback || function(){},
        timeOut = options['timeOut'] || 0,
        timer;
    
    // IE和opera支持onreadystatechange
    // safari、chrome、opera支持onload
    scr.onload = scr.onreadystatechange = function () {
        // 避免opera下的多次调用
        if (scriptLoaded) {
            return;
        }
        
        var readyState = scr.readyState;
        if ('undefined' == typeof readyState
            || readyState == "loaded"
            || readyState == "complete") {
            scriptLoaded = 1;
            try {
                callback();
                clearTimeout(timer);
            } finally {
                scr.onload = scr.onreadystatechange = null;
                baidu.sio._removeScriptTag(scr);
            }
        }
    };

    if( timeOut ){
        timer = setTimeout(function(){
            scr.onload = scr.onreadystatechange = null;
            baidu.sio._removeScriptTag(scr);
            options.onfailure && options.onfailure();
        }, timeOut);
    }
    
    baidu.sio._createScriptTag(scr, url, charset);
};

/**
 * 通过script标签加载数据，加载完成由服务器端触发回调
 * @name baidu.sio.callByServer
 * @function
 * @grammar baidu.sio.callByServer(url, callback[, opt_options])
 * @param {string} url 加载数据的url.
 * @param {Function|string} callback 服务器端调用的函数或函数名。如果没有指定本参数，将在URL中寻找options['queryField']做为callback的方法名.
 * @param {Object} opt_options 加载数据时的选项.
 * @config {string} [charset] script的字符集
 * @config {string} [queryField] 服务器端callback请求字段名，默认为callback
 * @config {Integer} [timeOut] 超时时间(单位：ms)，超过这个时间将不再响应本请求，并触发onfailure函数
 * @config {Function} [onfailure] timeOut设定后才生效，到达超时时间时触发本函数
 * @remark
 * 如果url中已经包含key为“options['queryField']”的query项，将会被替换成callback中参数传递或自动生成的函数名。
 * @meta standard
 * @see baidu.sio.callByBrowser
 */
baidu.sio.callByServer = /**@function*/function(url, callback, opt_options) {
    var scr = document.createElement('SCRIPT'),
        prefix = 'bd__cbs__',
        callbackName,
        callbackImpl,
        options = opt_options || {},
        charset = options['charset'],
        queryField = options['queryField'] || 'callback',
        timeOut = options['timeOut'] || 0,
        timer,
        reg = new RegExp('(\\?|&)' + queryField + '=([^&]*)'),
        matches;

    if (baidu.lang.isFunction(callback)) {
        callbackName = prefix + Math.floor(Math.random() * 2147483648).toString(36);
        window[callbackName] = getCallBack(0);
    } else if(baidu.lang.isString(callback)){
        // 如果callback是一个字符串的话，就需要保证url是唯一的，不要去改变它
        // TODO 当调用了callback之后，无法删除动态创建的script标签
        callbackName = callback;
    } else {
        if (matches = reg.exec(url)) {
            callbackName = matches[2];
        }
    }

    if( timeOut ){
        timer = setTimeout(getCallBack(1), timeOut);
    }

    //如果用户在URL中已有callback，用参数传入的callback替换之
    url = url.replace(reg, '\x241' + queryField + '=' + callbackName);
    
    if (url.search(reg) < 0) {
        url += (url.indexOf('?') < 0 ? '?' : '&') + queryField + '=' + callbackName;
    }
    baidu.sio._createScriptTag(scr, url, charset);

    /*
     * 返回一个函数，用于立即（挂在window上）或者超时（挂在setTimeout中）时执行
     */
    function getCallBack(onTimeOut){
        /*global callbackName, callback, scr, options;*/
        return function(){
            try {
                if( onTimeOut ){
                    options.onfailure && options.onfailure();
                }else{
                    callback.apply(window, arguments);
                    clearTimeout(timer);
                }
                window[callbackName] = null;
                delete window[callbackName];
            } catch (exception) {
                // ignore the exception
            } finally {
                baidu.sio._removeScriptTag(scr);
            }
        }
    }
};



/**
 * 跨域数据源类
 * @function
 * @grammar baidu.data.dataSource.sio(url, options)
 * @param {String}     url                           数据源地址
 * @param {Object}     [options]                     配置
 * @config {Number} maxCache 缓存数据的最大个数，默认10
 * @config {Boolean} cache 是否使用缓存，默认开启
 * @config {Function} transition 转换数据算法  
 * @config {Function} onbeforeget beforeget事件
 */
baidu.data.dataSource.sio = function(url, options){
    options = baidu.object.extend({
        url: url
    }, options || {});
    
    var dataSource = new baidu.data.dataSource.DataSource(options);
    
    /**
     * 获取数据
     * @param {Object}    options                 配置
     * @param {String}    [options.key = url + param]            用于存取缓存
     * @param {String}    [options.callByType = 'server']        请求的类型
     * @param {Object}    [options.param]                        需要发送的数据
     * @param {Function}  [options.onsuccess]                    加载成功回调函数
     */
    dataSource.get = function(options){
        var me = this;
        options = options || {};
        options.key = options.key || (me.url + (options.param ? "?" + baidu.json.stringify(options.param) : ""));
        if (options.callByType && options.callByType.toLowerCase() == "browser") {
            options.callByType = "callByBrowser";
        }
        else {
            options.callByType = "callByServer";
        }
        if (!me.dispatchEvent("onbeforeget", options)) {
            baidu.sio[options.callByType](options.key, function(){
                me._get(options);
            });
        }
    };
    return dataSource;
};

/**
 * 判断一个对象是不是字面量对象，即判断这个对象是不是由{}或者new Object类似方式创建
 * 
 * @name baidu.object.isPlain
 * @function
 * @grammar baidu.object.isPlain(source)
 * @param {Object} source 需要检查的对象
 * @remark
 * 事实上来说，在Javascript语言中，任何判断都一定会有漏洞，因此本方法只针对一些最常用的情况进行了判断
 *             
 * @returns {Boolean} 检查结果
 */
baidu.object.isPlain  = function(obj){
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        key;
    if ( !obj ||
         //一般的情况，直接用toString判断
         Object.prototype.toString.call(obj) !== "[object Object]" ||
         //IE下，window/document/document.body/HTMLElement/HTMLCollection/NodeList等DOM对象上一个语句为true
         //isPrototypeOf挂在Object.prototype上的，因此所有的字面量都应该会有这个属性
         //对于在window上挂了isPrototypeOf属性的情况，直接忽略不考虑
         !('isPrototypeOf' in obj)
       ) {
        return false;
    }

    //判断new fun()自定义对象的情况
    //constructor不是继承自原型链的
    //并且原型中有isPrototypeOf方法才是Object
    if ( obj.constructor &&
        !hasOwnProperty.call(obj, "constructor") &&
        !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
        return false;
    }
    //判断有继承的情况
    //如果有一项是继承过来的，那么一定不是字面量Object
    //OwnProperty会首先被遍历，为了加速遍历过程，直接看最后一项
    for ( key in obj ) {}
    return key === undefined || hasOwnProperty.call( obj, key );
};


/**
 * 对一个object进行深度拷贝
 * 
 * @author berg
 * @name baidu.object.clone
 * @function
 * @grammar baidu.object.clone(source)
 * @param {Object} source 需要进行拷贝的对象
 * @remark
 * 对于Object来说，只拷贝自身成员，不拷贝prototype成员
 * @meta standard
 *             
 * @returns {Object} 拷贝后的新对象
 */
baidu.object.clone  = function (source) {
    var result = source, i, len;
    if (!source
        || source instanceof Number
        || source instanceof String
        || source instanceof Boolean) {
        return result;
    } else if (baidu.lang.isArray(source)) {
        result = [];
        var resultLen = 0;
        for (i = 0, len = source.length; i < len; i++) {
            result[resultLen++] = baidu.object.clone(source[i]);
        }
    } else if (baidu.object.isPlain(source)) {
        result = {};
        for (i in source) {
            if (source.hasOwnProperty(i)) {
                result[i] = baidu.object.clone(source[i]);
            }
        }
    }
    return result;
};

/**
 * 对方法的操作，解决内存泄露问题
 * @namespace baidu.fn
 */
baidu.fn = baidu.fn || {};


/**
 * 这是一个空函数，用于需要排除函数作用域链干扰的情况.
 * @author rocy
 * @name baidu.fn.blank
 * @function
 * @grammar baidu.fn.blank()
 * @meta standard
 * @return {Function} 一个空函数
 * @version 1.3.3
 */
baidu.fn.blank = function () {};