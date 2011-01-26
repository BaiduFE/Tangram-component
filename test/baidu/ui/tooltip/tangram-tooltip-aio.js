/* Copyright (c) 2010 Baidu */
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/tooltip/hover.js
 * author: rocy
 * version: 1.0.0
 * date: 2010-06-01
 */



/**
 * 基础方法
 *
 * 获得tooltip实例
 * 
 *
 */


/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu.js
 * author: allstar, erik
 * version: 1.1.0
 * date: 2009/12/2
 */

/**
 * 声明baidu包
 */
var baidu = baidu || {version: "1-1-1", guid: "$BAIDU$"};

/**
 * meizz 2010/02/04
 * 顶级域名 baidu 有可能被闭包劫持，而需要页面级唯一信息时需要用到下面这个对象
 */

window[baidu.guid] = window[baidu.guid] || {};


baidu.ui = baidu.ui || {
    get : function(element){
        var buid;
        while((element = element.parentNode) != document.body){
            if(buid = baidu.dom.getAttr(element, "data-tguid")){
                return baidu.lang.instance(buid);
            }
        }
    }
};

//instances用于存放实例guid及其状态
baidu.ui.tooltip = baidu.ui.tooltip || {instances : {}};
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/tooltip/create.js
 * author: rocy
 * version: 1.0.0
 * date: 2010-06-01
 */



/**
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/dialog/Dialog.js
 * author: rocy
 * version: 1.0.0
 * date: 2010-05-18
 */



/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/ui/UIBase.js
 * author: berg
 * version: 1.0.0
 * date: 2010-05-20
 */

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/dom/g.js
 * author: allstar, erik
 * version: 1.1.0
 * date: 2009/11/17
 */

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/dom.js
 * author: allstar, erik
 * version: 1.1.0
 * date: 2009/12/02
 */



/**
 * 声明baidu.dom包
 */
baidu.dom = baidu.dom || {};


/**
 * 从文档中获取指定的DOM元素
 * 
 * @param {string|HTMLElement} id 元素的id或DOM元素
 * @return {HTMLElement} DOM元素，如果不存在，返回null，如果参数不合法，直接返回参数
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


/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/lang/Class.js
 * author: meizz, erik
 * version: 1.1.0
 * date: 2009/12/1
 */

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/lang/guid.js
 * author: meizz
 * version: 1.1.0
 * date: 2010/02/04
 */

/**
 * 产生一个当前页面的唯一标识字符串
 * 
 * @return {String} 返回一个页面唯一的 GUID
 */

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/lang.js
 * author: erik
 * version: 1.1.0
 * date: 2009/12/02
 */



/**
 * 声明baidu.lang包
 */
baidu.lang = baidu.lang || {};

baidu.lang.guid = function() {
    return "TANGRAM__" + (window[baidu.guid]._counter ++).toString(36);
};

window[baidu.guid]._counter = window[baidu.guid]._counter || 1;

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/lang/_instances.js
 * author: meizz, erik
 * version: 1.1.0
 * date: 2009/12/1
 */




/**
 * 所有类的实例的容器
 * key为每个实例的guid
 */

window[baidu.guid]._instances = window[baidu.guid]._instances || {};


/**
 * baidu.JS框架的基类
 * @param {string} guid 可以在类的实例化时指定类的guid
 */
baidu.lang.Class = function(guid) {
    this.guid = guid || baidu.lang.guid();
    window[baidu.guid]._instances[this.guid] = this;
};
window[baidu.guid]._instances = window[baidu.guid]._instances || {};

/**
 * 释放对象所持有的资源。
 * 主要是自定义事件。
 * 好像没有将_listeners中绑定的事件剔除掉..
 */
baidu.lang.Class.prototype.dispose = function(){
    delete window[baidu.guid]._instances[this.guid];

    for(var property in this){
        if (typeof this[property] != "function"){
            delete this[property];
        }
    }
};

/**
 * 重载了默认的toString方法，使得返回信息更加准确一些。
 * @return {string} 对象的String表示形式
 */
baidu.lang.Class.prototype.toString = function(){
    return "[object " + (this._className || "Object" ) + "]";
};

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/lang/Event.js
 * author: meizz, erik, berg
 * version: 1.1.1
 * date: 2009/11/24
 * modify: 2010/04/19 berg
 */




/**
 * 自定义的事件对象
 * 
 * @config {string}   事件的名称
 * @config {boolean}  当事件发生之后处理结果的返回值
 * @config {Object}   在事件被触发后传递的对象
 * @config {Object}   触发该事件的对象
 */
baidu.lang.Event = function (type, target) {
    this.type = type;
    this.returnValue = true;
    this.target = target || null;
    this.currentTarget = null;
};

/**
 * 扩展baidu.lang.Class来添加自定义事件
 * 
 * @param {string}   type         自定义事件的名称
 * @param {Function} handler      自定义事件被触发时应该调用的回调函数
 * @param {string}   key optional 绑定到事件上的函数对应的索引key
 */
baidu.lang.Class.prototype.addEventListener = function (type, handler, key) {
    if (typeof handler != "function") {
        return;
        // throw("addEventListener:" + handler + " is not a function");
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
 * 删除自定义事件中绑定的一个回调函数。如果第二个参数handler没有被
 * 绑定到对应的自定义事件中，什么也不做。
 * 
 * @param {string}   type     自定义事件的名称
 * @param {Function} handler  需要删除的自定义事件的函数或者该函数对应的索引key
 */
baidu.lang.Class.prototype.removeEventListener = function (type, handler) {
    if (typeof handler == "function") {
        handler = handler.hashCode;
    } else if (typeof handler != "string") {
        return;
    }

    !this.__listeners && (this.__listeners = {});

    type.indexOf("on") != 0 && (type = "on" + type);

    var t = this.__listeners;
    if (!t[type]) {
        return;
    }
    t[type][handler] && delete t[type][handler];
};


/**
 * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行。
 * 
 * 但是这些绑定函数的执行顺序无法保证。
 * 处理会调用通过addEventListenr绑定的自定义事件回调函数之外，还会调用
 * 直接绑定到对象上面的自定义事件。例如：
 * myobj.onMyEvent = function(){}
 * myobj.addEventListener("onMyEvent", function(){});
 * 
 * @param {Object} event 派发的自定义事件类型
 */
baidu.lang.Class.prototype.dispatchEvent = function (event) {
    if("string" == typeof event){
        event = new baidu.lang.Event(event);
    }
    !this.__listeners && (this.__listeners = {});

    var i, t = this.__listeners, p = event.type;
    event.target = event.target || this;
    event.currentTarget = this;

    typeof this[p] == "function" && this[p].apply(this, arguments);

    p.indexOf("on") != 0 && (p = "on" + p);

    if (typeof t[p] == "object") {
        for (i in t[p]) {
            t[p][i].apply(this, arguments);
        }
    }
    return event.returnValue;
};

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/object/extend.js
 * author: erik
 * version: 1.1.0
 * date: 2009/11/30
 */

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/object.js
 * author: erik
 * version: 1.1.0
 * date: 2009/11/15
 */



/**
 * 声明baidu.object包
 */
baidu.object = baidu.object || {};


/**
 * 将源对象的所有属性拷贝到目标对象中
 * 
 * @param {Object} target 目标对象
 * @param {Object} source 源对象
 * @return {Object} 目标对象
 */
baidu.object.extend = function (target, source) {
    for (var p in source) {
        if (source.hasOwnProperty(p)) {
            target[p] = source[p];
        }
    }
    
    return target;
};

// 声明快捷方法
baidu.extend = baidu.object.extend;



/**
 * UI基类，所有的UI都应该从这个类中派生出去
 * 
 * todo: 添加baidu.dom.getRelativePosition
 */

(function(){
var UIBase  = {
    /**
     * 获得id
     */
    getId : function(key){
        //通过guid区别多实例
        var idPrefix = 'tangram' + this.type + this.guid;
        return key ? idPrefix + key : idPrefix;
    },

    /**
     * 获得class
     *
     * skinName 可用做以后扩展皮肤样式
     */
    getClass : function(key){
        var ui = this,
            type = ui.type.toLowerCase(),
            className = this.classPrefix ? this.classPrefix :  "tangram-" + type;//,
            //skinName = 'skin-' + ui.skin;
         if (key) {
             className += '-' + key;
             //skinName += '-' + key;
         }
         /*
         if (ui.skin) {
             className += ' ' + skinName;
         }*/
         return className;
    },

    getMain : function(){
        return baidu.g(this.getId());
    },

    
    /**
     * 控件类型：如dialog
     */
    type : "",
    
    /**
     * 放置插件方法
     */
    addons : [],

    /*
     * interface
     * 每个ui类都需要实现render方法
    
    render : function(){}
     
     */

    /**
     * 获取调用的字符串
     */
    getCallString : function(fn){
        var argLen = arguments.length,
            params = [],
            i, arg;
        if (argLen > 1) {
            for (i = 1; i < argLen; i++) {
                arg = arguments[i];
                if (typeof arg == 'string') {
                    arg = "'" + arg +"'";
                }
                params.push(arg);
            }
        }
        //如果被闭包包起来了，用baidu.lang.instance会找到最外面的baidu函数，可能出错
        return "window[baidu.guid]._instances['" + this.guid + "']"
                + '.' + fn + '('
                + params.join(',') 
                + ');'; 
    }//,
    
    /*
     * 销毁当前实例
    dispose : function(){

        
    }
     */
};
baidu.ui.create = function(constructor, options) {
    options = options || {};
    var parentClass = options.parentClass || baidu.lang.Class,
        i,
        ui = function(options){// 创建新类的真构造器函数
            // 继承父类的构造器
            if(parentClass == baidu.lang.Class){
                parentClass.call(this, options ? options.guid : "");
            }else{
                parentClass.call(this, options);
            }

            //先把静态配置扩展到this上
            baidu.object.extend(this, ui.options);
            //把当前options中的项扩展到this上
            baidu.object.extend(this, options);

            //执行传入的构造器
            constructor.apply(this, arguments);

            //执行所有addons中的方法
            for (i=0, n=ui.addons.length; i<n; i++) {
                ui.addons[i](this);
            }

        };


    var C = function(){},
        cp = constructor.prototype;

    C.prototype = parentClass.prototype;

    // 继承父类的原型（prototype)链
    var fp = ui.prototype = new C();

    // 继承传参进来的构造器的 prototype 不会丢
    for (var i in cp)
        fp[i] = cp[i];

    //设置classname
    typeof options.className == "string" && (fp._className = options.className);

    // 修正这种继承方式带来的 constructor 混乱的问题
    fp.constructor = cp.constructor;

    //继承UIBase中的方法到prototype中
    for (i in UIBase) {
        fp[i] = UIBase[i];
    }

    // 给类扩展出一个静态方法，以代替 baidu.object.extend()
    ui.extend = function(json){
        for (var i in json) {
            ui.prototype[i] = json[i];
        }
        return ui;  // 这个静态方法也返回类对象本身
    };
    // 插件模式
    ui.addons = [];
    ui.register = function(f){
        if (typeof f == "function")
            ui.addons.push(f);
    };
    //静态配置支持
    ui.options = {};

    return ui;
};
})();


/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/page/getViewWidth.js
 * author: allstar
 * version: 1.1.0
 * date: 2009/11/20
 */

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/page.js
 * author: erik
 * version: 1.1.0
 * date: 2009/11/17
 */



/**
 * 声明baidu.page包
 */
baidu.page = baidu.page || {};


/**
 * 获取页面视觉区域宽度
 * 
 * @return {number} 页面视觉区域宽度
 */
baidu.page.getViewWidth = function () {
    var doc = document,
        client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;

    return client.clientWidth;
};

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/page/getViewHeight.js
 * author: allstar
 * version: 1.1.0
 * date: 2009/11/20
 */



/**
 * 获取页面视觉区域高度
 * 
 * @return {number} 页面视觉区域高度
 */
baidu.page.getViewHeight = function () {
    var doc = document,
        client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;

    return client.clientHeight;
};

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/page/getScrollLeft.js
 * author: erik
 * version: 1.1.0
 * date: 2009/11/17
 */



/**
 * 获取横向滚动量
 * 
 * @return {number} 横向滚动量
 */
baidu.page.getScrollLeft = function () {
    var d = document;
    return d.documentElement.scrollLeft || d.body.scrollLeft;
};

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/page/getScrollTop.js
 * author: erik
 * version: 1.1.0
 * date: 2009/11/17
 */



/**
 * 获取纵向滚动量
 * 
 * @return {number} 纵向滚动量
 */
baidu.page.getScrollTop = function () {
    var d = document;
    return d.documentElement.scrollTop || d.body.scrollTop;
};





/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/dom/getAttr.js
 * author: allstar, erik
 * version: 1.1.0
 * date: 2009/12/02
 */


/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/dom/_NAME_ATTRS.js
 * author: allstar, erik
 * version: 1.1.0
 * date: 2009/12/2
 */


/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/browser/ie.js
 * author: allstar
 * version: 1.1.0
 * date: 2009/11/23
 */

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/browser.js
 * author: allstar, erik
 * version: 1.1.0
 * date: 2009/12/02
 */



/**
 * 声明baidu.browser包
 */
baidu.browser = baidu.browser || {};


/**
 * 判断是否为ie浏览器
 */
if (/msie (\d+\.\d)/i.test(navigator.userAgent)) {
    baidu.ie = baidu.browser.ie = parseFloat(RegExp['\x241']);
}



/**
 * 提供给setAttr与getAttr方法作名称转换使用
 * ie6,7下class要转换成className
 */

baidu.dom._NAME_ATTRS = (function () {
    var result = {
        'cellpadding': 'cellPadding',
        'cellspacing': 'cellSpacing',
        'colspan': 'colSpan',
        'rowspan': 'rowSpan',
        'valign': 'vAlign',
        'usemap': 'useMap',
        'frameborder': 'frameBorder'
    };
    
    if (baidu.browser.ie < 8) {
        result['for'] = 'htmlFor';
        result['class'] = 'className';
    } else {
        result['htmlFor'] = 'for';
        result['className'] = 'class';
    }
    
    return result;
})();


/**
 * 获取DOM元素指定的属性值
 * 设置元素属性使用setAttr方法
 * 
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {string}             key     属性名称
 * @return {string} DOM元素的属性值，不存在的属性返回null
 */
baidu.dom.getAttr = function (element, key) {
    element = baidu.dom.g(element);

    if ('style' == key){
        return element.style.cssText;
    }

    key = baidu.dom._NAME_ATTRS[key] || key;
    return element.getAttribute(key);
};

// 声明快捷方法
baidu.getAttr = baidu.dom.getAttr;

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/dom/setAttr.js
 * author: allstar
 * version: 1.1.0
 * date: 2009/11/17
 */




/**
 * 设置DOM元素的属性值
 * 获取元素属性使用getAttr方法
 * 
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {string}             key     属性名称
 * @param {string}             value   属性值
 * @return {HTMLElement} 被操作的DOM元素
 */
baidu.dom.setAttr = function (element, key, value) {
    element = baidu.dom.g(element);

    if ('style' == key){
        element.style.cssText = value;
    } else {
        key = baidu.dom._NAME_ATTRS[key] || key;
        element.setAttribute(key, value);
    }

    return element;
};

// 声明快捷方法
baidu.setAttr = baidu.dom.setAttr;
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/dom/insertHTML.js
 * author: allstar, erik
 * version: 1.1.0
 * date: 2009/12/04
 */



/**
 * 获取目标元素所属的window对象
 *
 * @param {HTMLElement|string} element  目标元素或目标元素的id
 * @param {string}             position 插入html的位置信息，取值为beforeBegin,afterBegin,beforeEnd,afterEnd
 * @param {string}             html     要插入的html
 */
baidu.dom.insertHTML = function (element, position, html) {
    element = baidu.dom.g(element);

    if (element.insertAdjacentHTML) {
        element.insertAdjacentHTML(position, html);
    } else {
        // 这里不做"undefined" != typeof(HTMLElement) && !window.opera判断，其它浏览器将出错？！
        // 但是其实做了判断，其它浏览器下等于这个函数就不能执行了
        var range = element.ownerDocument.createRange();
        range.setStartBefore(element);
        var fragment = range.createContextualFragment(html),
            parent = element.parentNode, tmpEl;
        switch (position.toUpperCase()) {
            case 'BEFOREBEGIN':
                parent.insertBefore(fragment, element);
                break;
            case 'AFTERBEGIN':
                element.insertBefore(fragment, element.firstChild);
                break;
            case 'BEFOREEND':
                element.appendChild(fragment);
                break;
            case 'AFTEREND':
                (tmpEl = element.nextSibling) ? parent.insertBefore(fragment, tmpEl) : parent.appendChild(fragment);
        }
    }

        // 如果要代码最精简，还有一种写法
        // var fragment = range.createContextualFragment(html),
        //     parent = element.parentNode, tmpEl = element;
        // switch (position.toUpperCase()) {
        //     case 'AFTERBEGIN':
        //         element = element.firstChild;
        //     case 'BEFOREBEGIN':
        //         parent.insertBefore(fragment, element);
        //         break;
        //     case 'BEFOREEND':
        //         element.appendChild(fragment);
        //         break;
        //     case 'AFTEREND':
        //         (element = element.nextSibling) ? parent.insertBefore(fragment, element) : parent.appendChild(fragment);
        // }


        // 增加一次判断，代码可以更少
        // var fragment = range.createContextualFragment(html),
        //     parent = element.parentNode, tmpEl = element;
        // switch (position.toUpperCase()) {
        //     case 'AFTERBEGIN':
        //         element = element.firstChild;
        //         break;
        //     case 'BEFOREEND':
        //         parent = element;
        //         element = null;
        //         break;
        //     case 'AFTEREND':
        //         element = element.nextSibling;
        // }
        // element ? parent.insertBefore(fragment, element) : parent.appendChild(fragment);
};

baidu.insertHTML = baidu.dom.insertHTML;

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/dom/remove.js
 * author: allstar
 * version: 1.1.0
 * date: 2009/11/17
 */




/**
 * 从DOM树上移除目标元素
 * 
 * @param {Element|String} element 必需，目标元素或目标元素的id
 * @return {Element} 被操作的DOM元素
 */
baidu.dom.remove = function (element) {
    element = baidu.dom.g(element);

    if ("HTML BODY HEAD".indexOf(element.nodeName) == -1) {
        if (baidu.browser.ie) {
            var tmpEl = document.createElement('DIV');
            tmpEl.appendChild(element);
            tmpEl.innerHTML = '';
        } else {
            (tmpEl = element.parentNode) && tmpEl.removeChild(element);
        }
    }
};

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/dom/getPosition.js
 * author: --
 * version: 1.0.0
 * date: 2009/--/--
 */

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/dom/getDocument.js
 * author: allstar
 * version: 1.1.0
 * date: 2009/11/17
 */



/**
 * 获取目标元素所属的document对象
 *
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @return {HTMLDocument} element所属的document对象
 */
baidu.dom.getDocument = function (element) {
    element = baidu.dom.g(element);
    return element.nodeType == 9 ? element : element.ownerDocument || element.document;
};


/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/dom/getStyle.js
 * author: allstar
 * version: 1.1.0
 * date: 2009/11/18
 */


/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/dom/_styleFixer.js
 * author: allstar
 * version: 1.1.0
 * date: 2009/11/17
 */



/**
 * 提供给setStyle与getStyle使用
 */
baidu.dom._styleFixer = baidu.dom._styleFixer || {};

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/dom/_styleFilter/filter.js
 * author: allstar, erik
 * version: 1.1.0
 * date: 2009/12/02
 */

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/dom/_styleFilters.js
 * author: allstar
 * version: 1.1.0
 * date: 2009/12/02
 */



/**
 * 提供给setStyle与getStyle使用
 */
baidu.dom._styleFilter = baidu.dom._styleFilter || [];



/**
 * 为获取和设置样式的过滤器
 * @private
 */
baidu.dom._styleFilter.filter = function (key, value, method) {
    for (var i = 0, filters = baidu.dom._styleFilter, filter; filter = filters[i]; i++) {
        if (filter = filter[method]) {
            value = filter(key, value);
        }
    }

    return value;
};

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/string/toCamelCase.js
 * author: erik
 * version: 1.1.0
 * date: 2009/11/30
 */

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/string.js
 * author: erik
 * version: 1.1.0
 * date: 2009/11/15
 */



/**
 * 声明baidu.string包
 */
baidu.string = baidu.string || {};


/**
 * 将目标字符串进行驼峰化处理
 * 
 * @param {string} source 目标字符串
 * @return {string} 驼峰化处理后的字符串
 */
baidu.string.toCamelCase = function (source) {
    return String(source).replace(/[-_]\D/g, function (match) {
                return match.charAt(1).toUpperCase();
            });
};



/**
 * 获取DOM元素的样式值
 * 
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {string}             key     要获取的样式名
 * @return {string} 要获取的样式值
 */
baidu.dom.getStyle = function (element, key) {
    var dom = baidu.dom;

    element = dom.g(element);
    key = baidu.string.toCamelCase(key);

    var value = element.style[key];
    
    // 在取不到值的时候，用fixer进行修正
    if (!value) {
        var fixer = dom._styleFixer[key],
        	/* 在IE下，Element没有在文档树上时，没有currentStyle属性 */
    	    style = element.currentStyle || (baidu.browser.ie ? element.style : getComputedStyle(element, null));
            
        if ('string' == typeof fixer) {
            value = style[fixer];
        } else if (fixer && fixer.get) {
            value = fixer.get(element, style);
        } else {
            value = style[key];
        }
    }
    
    /* 检查结果过滤器 */
    if (fixer = dom._styleFilter) {
        value = fixer.filter(key, value, 'get');
    }

    return value;
};

// 声明快捷方法
baidu.getStyle = baidu.dom.getStyle;


/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/browser/opera.js
 * author: allstar
 * version: 1.1.0
 * date: 2009/11/23
 */



/**
 * 判断是否为opera浏览器
 */
if (/opera\/(\d+\.\d)/i.test(navigator.userAgent)) {
    baidu.browser.opera = parseFloat(RegExp['\x241']);
}

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/browser/isWebkit.js
 * author: allstar
 * version: 1.1.0
 * date: 2009/11/23
 */



/**
 * 判断是否为isWebkit
 */
baidu.browser.isWebkit = /webkit/i.test(navigator.userAgent);

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/browser/isGecko.js
 * author: allstar
 * version: 1.1.0
 * date: 2009/11/23
 */



/**
 * 判断是否为isGecko
 */
baidu.browser.isGecko = /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent);

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/browser/isStrict.js
 * author: allstar
 * version: 1.1.0
 * date: 2009/11/23
 */



/**
 * 判断是否为标准模式
 */
baidu.browser.isStrict = document.compatMode == "CSS1Compat";


/*
 * 获取目标元素元素相对于整个文档左上角的位置
 *
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @return {Object} 
 *   {
 *       left:xx,//{integer} 页面距离页面左上角的水平偏移量
 *       top:xx //{integer} 页面距离页面坐上角的垂直偏移量
 *   }
 */
baidu.dom.getPosition = function (element) {
    var doc = baidu.dom.getDocument(element), 
        browser = baidu.browser;

    element = baidu.dom.g(element);

    // Gecko browsers normally use getBoxObjectFor to calculate the position.
    // When invoked for an element with an implicit absolute position though it
    // can be off by one. Therefor the recursive implementation is used in those
    // (relatively rare) cases.
    var BUGGY_GECKO_BOX_OBJECT = browser.isGecko > 0 && 
                                 doc.getBoxObjectFor &&
                                 baidu.dom.getStyle(element, 'position') == 'absolute' &&
                                 (element.style.top === '' || element.style.left === '');

    // NOTE(arv): If element is hidden (display none or disconnected or any the
    // ancestors are hidden) we get (0,0) by default but we still do the
    // accumulation of scroll position.

    var pos = {"left":0,"top":0};

    var viewportElement = (browser.ie && !browser.isStrict) ? doc.body : doc.documentElement;
    
    if(element == viewportElement){
        // viewport is always at 0,0 as that defined the coordinate system for this
        // function - this avoids special case checks in the code below
        return pos;
    }

    var parent = null;
    var box;

    if(element.getBoundingClientRect){ // IE and Gecko 1.9+
        box = element.getBoundingClientRect();

        pos.left = Math.floor(box.left) + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
        pos.top  = Math.floor(box.top)  + Math.max(doc.documentElement.scrollTop,  doc.body.scrollTop);
	        
        // IE adds the HTML element's border, by default it is medium which is 2px
        // IE 6 and 7 quirks mode the border width is overwritable by the following css html { border: 0; }
        // IE 7 standards mode, the border is always 2px
        // This border/offset is typically represented by the clientLeft and clientTop properties
        // However, in IE6 and 7 quirks mode the clientLeft and clientTop properties are not updated when overwriting it via CSS
        // Therefore this method will be off by 2px in IE while in quirksmode
        pos.left -= doc.documentElement.clientLeft;
        pos.top  -= doc.documentElement.clientTop;

        if(browser.ie && !browser.isStrict){
            pos.left -= 2;
            pos.top  -= 2;
        }
    } else if (doc.getBoxObjectFor && !BUGGY_GECKO_BOX_OBJECT/* && !goog.style.BUGGY_CAMINO_*/){ // gecko
        // Gecko ignores the scroll values for ancestors, up to 1.9.  See:
        // https://bugzilla.mozilla.org/show_bug.cgi?id=328881 and
        // https://bugzilla.mozilla.org/show_bug.cgi?id=330619

        box = doc.getBoxObjectFor(element);
        var vpBox = doc.getBoxObjectFor(viewportElement);
        pos.left = box.screenX - vpBox.screenX;
        pos.top  = box.screenY - vpBox.screenY;
    } else { // safari/opera
        parent = element;

        do {
            pos.left += parent.offsetLeft;
            pos.top  += parent.offsetTop;
      
            // In Safari when hit a position fixed element the rest of the offsets
            // are not correct.
            if (browser.isWebkit > 0 && baidu.dom.getStyle(parent, 'position') == 'fixed') {
                pos.left += doc.body.scrollLeft;
                pos.top  += doc.body.scrollTop;
                break;
            }
            
            parent = parent.offsetParent;
        } while (parent && parent != element);

        // opera & (safari absolute) incorrectly account for body offsetTop
        if(browser.opera > 0 || (browser.isWebkit > 0 && baidu.dom.getStyle(element, 'position') == 'absolute')){
            pos.top  -= doc.body.offsetTop;
        }

        // accumulate the scroll positions for everything but the body element
        parent = element.offsetParent;
        while (parent && parent != doc.body) {
            pos.left -= parent.scrollLeft;
            // see https://bugs.opera.com/show_bug.cgi?id=249965
            if (!b.opera || parent.tagName != 'TR') {
                pos.top -= parent.scrollTop;
            }
            parent = parent.offsetParent;
        }
    }

    return pos;
};

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/dom/setStyles.js
 * author: allstar
 * version: 1.1.0
 * date: 2009/11/18
 */


/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/dom/setStyle.js
 * author: allstar
 * version: 1.1.0
 * date: 2009/11/18
 */






/**
 * 设置DOM元素的样式值
 * 
 * @param {HTMLElement|string}  element 目标元素或目标元素的id
 * @param {string}              key     要设置的样式名
 * @param {string}              value   要设置的样式值
 * @return {HTMLElement} 被操作的DOM元素
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
 * 批量设置DOM元素的样式值
 * 
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {Object}             styles  要设置的样式集合
 * @return {HTMLElement} 被操作的DOM元素
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

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/string/format.js
 * author: dron, erik
 * version: 1.1.0
 * date: 2009/11/30
 */



/**
 * 对目标字符串进行格式化
 * 
 * @param {string}          source  目标字符串
 * @param {Object|string*}  opts    提供相应数据的对象
 * @return {string} 格式化后的字符串
 */
baidu.string.format = function (source, opts) {
    source = String(source);
    
    if (typeof opts != 'undefined') {
        if ('[object Object]' == Object.prototype.toString.call(opts)) {
            //参数是object的情况
            return source.replace(/#\{(.+?)\}/g,
                function (match, key) {
                    var replacer = opts[key];
                    if ('function' == typeof replacer) {
                        replacer = replacer(key);
                    }
                    return ('undefined' == typeof replacer ? '' : replacer);
                });
        } else {
            //多个参数的情况
            var data = Array.prototype.slice.call(arguments, 1),
                len = data.length;
            return source.replace(/#\{(\d+)\}/g,
                function (match, index) {
                    index = parseInt(index, 10);
                    return (index >= len ? match : data[index]);
                });
        }
    }
    
    return source;
};

// 声明快捷方法
baidu.format = baidu.string.format;


/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/event/get.js
 * author: erik
 * version: 1.1.0
 * date: 2009/11/23
 */

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/event/EventArg.js
 * author: erik
 * version: 1.1.0
 * date: 2010/01/11
 */

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/event.js
 * author: erik
 * version: 1.1.0
 * date: 2009/12/02
 */



/**
 * 声明baidu.event包
 */
baidu.event = baidu.event || {};


/**
 * 事件对象构造器
 * 监听框架中事件时需要传入框架window对象
 * 
 * @param {Event}   event        事件对象
 * @param {Window}  win optional 窗口对象，默认为window
 */
baidu.event.EventArg = function (event, win) {
    win = win || window;
    event = event || win.event;
    var doc = win.document;
    
    this.target = event.srcElement;
    this.keyCode = event.which;
    for (var k in event) {
        var item = event[k];
        // 避免拷贝preventDefault等事件对象方法
        if ('function' != typeof item) {
            this[k] = item;
        }
    }
    
    if (!this.pageX && this.pageX !== 0) {
        this.pageX = (event.clientX || 0) 
                        + (doc.documentElement.scrollLeft 
                            || doc.body.scrollLeft);
        this.pageY = (event.clientY || 0) 
                        + (doc.documentElement.scrollTop 
                            || doc.body.scrollTop);
    }
    this._event = event;
};

/**
 * 阻止事件的默认行为
 */
baidu.event.EventArg.prototype.preventDefault = function () {
    if (this._event.preventDefault) {
        this._event.preventDefault();
    } else {
        this._event.returnValue = false;
    }
    return this;
};

/**
 * 停止事件的传播
 */
baidu.event.EventArg.prototype.stopPropagation = function () {
    if (this._event.stopPropagation) {
        this._event.stopPropagation();
    } else {
        this._event.cancelBubble = true;
    }
    return this;
};

/**
 * 停止事件
 */
baidu.event.EventArg.prototype.stop = function () {
    return this.stopPropagation().preventDefault();
};


/**
 * 获取扩展的事件对象
 * 
 * @param {Event}  event 原生事件对象
 * @param {window} win   窗体对象
 * @return {EventArg} 扩展的事件对象
 */
baidu.event.get = function (event, win) {
    return new baidu.event.EventArg(event, win);
};

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/event/on.js
 * author: erik
 * version: 1.1.0
 * date: 2009/12/16
 */

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/event/_listeners.js
 * author: erik
 * version: 1.1.0
 * date: 2009/11/23
 */

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/event/_unload.js
 * author: erik, berg
 * version: 1.1.0
 * date: 2009/12/16
 */



/**
 * 卸载所有事件监听器
 * @private
 */
baidu.event._unload = function () {
    var lis = baidu.event._listeners,
        len = lis.length,
        standard = !!window.removeEventListener,
        item, el;
        
    while (len--) {
        item = lis[len];
        //20100409 berg: 不解除unload的绑定，保证用户的事件一定会被执行
        //否则用户挂载进入的unload事件也可能会在这里被删除
        if(item[1] == 'unload'){
            continue;
        }
        el = item[0];
        if (el.removeEventListener) {
            el.removeEventListener(item[1], item[3], false);
        } else if (el.detachEvent){
            el.detachEvent('on' + item[1], item[3]);
        }
    }
    
    if (standard) {
        window.removeEventListener('unload', baidu.event._unload, false);
    } else {
        window.detachEvent('onunload', baidu.event._unload);
    }
};

// 在页面卸载的时候，将所有事件监听器移除
if (window.attachEvent) {
    window.attachEvent('onunload', baidu.event._unload);
} else {
    window.addEventListener('unload', baidu.event._unload, false);
}


/**
 * 事件监听器的存储表
 * @private
 */
baidu.event._listeners = baidu.event._listeners || [];


/**
 * 为目标元素添加事件监听器
 * 
 * @param {HTMLElement|string|window} element  目标元素或目标元素id
 * @param {string}                    type     事件类型
 * @param {Function}                  listener 事件监听器
 * @return {HTMLElement} 目标元素
 */
baidu.event.on = function (element, type, listener) {
    type = type.replace(/^on/i, '');
    if ('string' == typeof element) {
        element = baidu.dom.g(element);
    }

    var fn = function (ev) {
            // 这里不支持EventArgument
            // 原因是跨frame的时间挂载
            listener.call(element, ev);
        },
        lis = baidu.event._listeners;
    
    // 将监听器存储到数组中
    lis[lis.length] = [element, type, listener, fn];
    
    // 事件监听器挂载
    if (element.addEventListener) {
        element.addEventListener(type, fn, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + type, fn);
    } 
    
    return element;
};

// 声明快捷方法
baidu.on = baidu.event.on;


baidu.ui.tooltip.Tooltip = baidu.ui.tooltip.Tooltip || baidu.ui.create(function (options){
	var me = this;
    //已经可以删除了 berg
	baidu.object.extend(this,options);//TODO ui.create 调整之后,删除此多余代码
	//options 必须有target属性
	if(!me.target) return null;
	me.content = me.content || baidu.dom.getAttr(me.target, 'title') || '';
	baidu.dom.setAttr(me.target, 'title', '');
	me.dispatchEvent("oninit");
}).extend({
	//ui控件的类型 **必须**
    type            : "TOOLTIP",
    //ui控件的class样式前缀 可选
    //classPrefix     : "tangram_tooltip_",
    width			: '',
    height			: '',
	content			: '',
	singleton		: true,
	xOffset			: 10,
	yOffset			: 10,
	zIndex			: 1000,
	positionBy		: 'mouse',
	tplMain			: '<div id="#{id}" class="#{class}" data-guid="#{guid}"></div>',

	getString : function(){
		var me = this;
		return baidu.format(me.tplMain,{
			id: me.getId(),
			"class" : me.getClass(),
			guid: me.guid
		});
	},
	
	render : function(e){
		var me = this,
            //传入的应该是dom原生对象而不是baidu event吧？ berg
            //而且你这个地方如果是open调render，会被封装两次
			e = baidu.event.get(e);
		if(me.singleton){
			try{ baidu.ui.tooltip.showing.dispose(); }catch(error){}
		}
		baidu.ui.tooltip.showing = me;
		! me.getMain() && 
			baidu.dom.insertHTML(document.body,"beforeEnd", me.getString());
		me.update();
		me.setPosition(e);
		me.dispatchEvent("onload", {DOMEvent:e});
	},
	
	update : function(options){
		var me = this,
			el = me.getMain();
		baidu.object.extend(this,options);
		if(el){
			baidu.dom.setStyles(el,{
				position : 'absolute',
				zIndex   : me.zIndex,
				width    : me.width,
				height   : me.height
			});
			el.innerHTML = me.content;
		}
	},
    

    //这个函数可做的事情还有很多
    //如果元素有margin或border，这个计算会有偏差
    //berg
	
	setPosition : function(e){
		var me = this,
			el = me.getMain(),
			target = me.target;
		function inView(value,delta,direction){
			var scroll = direction == 'x' ? baidu.page.getScrollLeft() : baidu.page.getScrollTop() ,
				view   = direction == 'x' ? baidu.page.getViewWidth()  : baidu.page.getViewHeight();
			return value + delta - scroll > view ? Math.max(value - delta, 0) : value;
		}
		function setStyles(left, top){
			baidu.dom.setStyles(el,{ //TODO quirk mode
				left : inView(left + me.xOffset,el.offsetWidth,'x'),
				top  : inView(top + me.yOffset,el.offsetHeight,'y')
			});
		}
		if(me.positionBy == 'mouse'){
            //对应的这里可以用getPageX 和 getPageY berg
			setStyles(e.pageX, e.pageY);
		} else {
			var offset = baidu.dom.getPosition(target);
			setStyles(offset.left, offset.top);
		}
        //上面的setStyles是否可以改成：
        //在if-else中间赋值两个变量，在if-else结束后直接setStyle
        //这样阅读代码会更加顺畅。
        //berg
	},
	
	open : function(e){
		var me = this;
        //传入的应该是dom原生对象而不是baidu event吧？ berg
		e = baidu.event.get(e);
		me.dispatchEvent("onbeforeopen",{DOMEvent:e});
		me.render(e);
		me.dispatchEvent("onopen",{DOMEvent:e});
	},
	
	close : function(e){
		var me = this;
		if(me.dispatchEvent("onbeforeclose")){
			me.dispose();
			me.dispatchEvent("onclose");
		}
	},
	
	dispose: function(){
		try{
			baidu.dom.remove(this.getId());
			baidu.ui.tooltip.showing = null;
		}catch(error){}
	}
});

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/array/each.js
 * author: erik
 * version: 1.1.0
 * date: 2009/12/02
 */

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/array.js
 * author: erik
 * version: 1.1.0
 * date: 2009/12/02
 */



/**
 * 声明baidu.array包
 */
baidu.array = baidu.array || {};


/**
 * 遍历数组中所有元素
 * 
 * @param {Array}    source   需要遍历的数组
 * @param {Function} iterator 对每个数组元素进行调用的函数
 * @return {Array} 遍历的数组
 */
baidu.array.each = function (source, iterator) {
    var returnValue, item, i, len = source.length;
    
    if ('function' == typeof iterator) {
        for (i = 0; i < len; i++) {
            item = source[i];
            returnValue = iterator.call(source, item, i);
    
            if (returnValue === false) {
                break;
            }
        }
    }
    return source;
};

// 声明快捷方法
baidu.each = baidu.array.each;

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/lang/isArray.js
 * author: erik
 * version: 1.1.0
 * date: 2009/12/30
 */



/**
 * 判断目标参数是否Array对象
 * 
 * @param {Any} source 目标参数
 * @return {boolean} 类型判断结果
 */
baidu.lang.isArray = function (source) {
    return '[object Array]' == Object.prototype.toString.call(source);
};

/**
 * 获得tooltip实例
 * @param {} elements
 * @param {} options
 * @return {}
 */
baidu.ui.tooltip.create = function(elements,options){
	if(!elements) return null;
	var ret = [],me;
	elements = baidu.lang.isArray(elements)? elements : [elements];
	options = options || {};
	baidu.array.each(elements, function(element){
		options.target = element;
		me = new baidu.ui.tooltip.Tooltip(options);
		ret.push(me);
	});
    return ret.length == 1 ? ret[0] : ret;
};



baidu.ui.tooltip.Tooltip.prototype.showDelay = 100;
baidu.ui.tooltip.Tooltip.prototype.hideDelay = 500;

baidu.ui.tooltip.hover = function(elements,options){
	options = options || {};
	options["oninit"] = function(){
		var me = this;
		baidu.on(me.target, 'mouseover',function(e){
			e = baidu.event.get(e);
			clearTimeout(me.hideHdl);
            //这个变量什么意思: showHandler? berg
			me.showHdl = setTimeout(function(){
				me.open(e);
			},me.showDelay);
		});
		me.addEventListener('onload', function(){
            //getMain()可代替 berg
			baidu.on(baidu.g(me.getId()), 'mouseover', function(e){clearTimeout(me.hideHdl);});
		});
		
		function closeMe(e){
			clearTimeout(me.showHdl);
			me.hideHdl = setTimeout(function(){
				//防止dispose之后调用
				try{me.close(e);}catch(error){};
			},me.hideDelay);
		}
		
		baidu.on(me.target, 'mouseout', closeMe);
		me.addEventListener('onload', function(){
            //getMain()可代替 berg
			baidu.on(baidu.g(me.getId()),'mouseout', closeMe);
		});
	};

	return baidu.ui.tooltip.create(elements, options);
};

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/tooltip/click.js
 * author: rocy
 * version: 1.0.0
 * date: 2010-06-01
 */



/**
 * 基础方法
 *
 * 获得tooltip实例
 * 
 *
 */





baidu.ui.tooltip.click = function(elements,options){
	options = options || {};
	options["oninit"] = function(){
		var me = this;
		baidu.on(me.target, 'click',function(e){
			e = baidu.event.get(e);
			me.open(e);
			e.stopPropagation();
		});
		me.addEventListener('onload', function(){
            //可以改成getMain();
            //后面可以直接用baidu.event.stopPropagation(e);
            //就不用引入一个很大的baidu event对象了 berg
			baidu.on(baidu.g(me.getId()), 'click', function(e){e = baidu.event.get(e);e.stopPropagation();});
		});
		baidu.on(document, 'click', function(e){me.close(e)});
	};
	return baidu.ui.tooltip.create(elements,options);
};



