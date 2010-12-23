/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/data/storage.js
 * author: kexin
 * version: 1.0
 * date: 2010/07/16
 */

///import baidu.data;
///import baidu.event.on;
///import baidu.cookie.get;
///import baidu.cookie.set;
///import baidu.cookie.remove;

/*
 * storage 浏览器本地存储，基于key-value
 *
 */
(function() {

	// escape spaces in name，单下划线替换为双下划线，空格替换为_s
	var esc = function(str) {
		return 'PS' + str.replace(/_/g, '__').replace(/ /g, '_s');
	};

	/**
    * 一些配置项
    */
	var Config = {

		// Backend search order.
		// TODO: flash, gears, whatwg_db, air, globalStorage, silverlight，去掉cookie
		searchList: ['userData', 'localStorage', 'cookie'],

		// list of backend methods
		// TODO: clear method
		methods: ['init', 'get', 'set', 'remove'],

		// set,get,remove操作结果状态标识
		status: {
			"SUCCESS": 0,
			"FAILURE": 1,
			"OVERFLOW": 2
		},

		// 保存参数设置 
		option: {}
	};

  /**
   * 内建支持的后端
   * 目前包括：localStorage，userData，cookie
   *
   */
	var Backends = {

    /* HTML5标准  Firefox3.5+, Chrome4+, Safari4+(win)
     * (src: http://www.whatwg.org/specs/web-apps/current-work/#the-localstorage)
	 * 
	 * 每个域名和子域名有他们自己独立的本地存储区域。主域可以访问子域的存储区域，子域也可以访问父域的存储区域。
	 *
	 */
		localStorage: {
			// (unknown?)
			size: 10 * 1024 * 1024,

			test: function() {
				return window.localStorage ? true: false;
			},

			methods: {
				init: function() {
					this.store = window.localStorage;
				},

				expand: function(key) {
					return esc(this.name) + esc(key);
				},

				set: function(key, val, fn, option) {
					var status = Config.status.SUCCESS;
					key = this.expand(key);

					var value;
					if (option && option.expires) {
						value = option.expires + "|" + val;
					} else {
						value = "0|" + val;
					};

					try {
						this.store.setItem(key, value);
					} catch(ex) {
						status = Config.status.OVERFLOW;
					};

					if (fn) {
						fn.call(this, status, val);
					};
				},

				get: function(key, fn) {
					var status = Config.status.SUCCESS;
					key = this.expand(key);

					try {
						var value = this.store.getItem(key);
						if (value == null) { // key不存在时返回null
							status = Config.status.FAILURE;
						};

						// 判断是否过期，过期返回null
						var pos = value.indexOf("|");
						var exp = value.substring(0, pos);
						var now = (new Date()).getTime();

						if (exp > now || exp == "0") {
							value = value.substring(pos + 1, value.length);
						} else {
							value = null;
							this.store.removeItem(key); // 过期时，再次读取删除key
							status = Config.status.FAILURE;
						};
					} catch(ex) {
						status = Config.status.FAILURE;
					};

					if (fn) {
						fn.call(this, status, value);
					};
				},

				remove: function(key, fn) {
					var status = Config.status.SUCCESS;
					var value = null;
					key = this.expand(key);

					try {
						var val = this.store.getItem(key);
						var pos = val.indexOf("|");
						value = val.substring(pos + 1, val.length);
						if (val == null) { // 若key不存在则返回失败状态
							status = Config.status.FAILURE;
						} else {
							this.store.removeItem(key);
						};
					} catch(ex) {
						status = Config.status.FAILURE;
					};

					if (fn) {
						fn.call(this, status, value);
					};
				}
			}
		},

		/**
	 * IE5+
	 * 受限站点，单个网页可存储64K，整个域可存储640K。
	 * Expires这个属性是用来设置userdata的超时时间的。Userdata的超时设置是针对一个文件的，一旦过期，整个文件都过期了，不能单独设置每个属性的过期时间。
	 * userData被人为删除，此时执行getAttribute()、setAttribute()会报错：“Error:数据无效"。
	 * 如果在一个浏览器进程中重复删除、写入userdata数据，userdata空间将很快被撑满，因为每次删除都是逻辑删除，等到浏览器进程结束后才会真正执行删除操作。
	 *
	 *
	 */
		userData: {
			size: 64 * 1024,

			test: function() {
				return window.ActiveXObject ? true: false;
			},

			methods: {
				/**
                 * 不兼容页面无body的情况，需要body加载完成调用
                 *
                 *
                 */
				init: function() {
					var prefix = '_storage_data_';
					var id = prefix + esc(this.name);
					this.el = document.createElement('div');
					this.el.id = id;
					this.el.style.display = 'none';
					this.el.addBehavior('#default#userData');
					var me = this;
					//document.body.appendChild(this.el);
					document.body.insertBefore(this.el, document.body.firstChild);

					// 防止内存泄漏
					baidu.on(window, "unload", function() {
						me.el = null;
					});
				},

				expand: function(key) {
					return esc(this.name) + esc(key);
				},

				/**
                 * setAttribute(key)
                 * 利用key生成文件名，一个文件存储一个key
                 *
                 */
				set: function(key, val, fn, option) {
					key = this.expand(key);
					var status = Config.status.SUCCESS;

					try {
						var value;
						// 添加过期时间
						if (option && option.expires) {
							this.el.expires = (new Date(option.expires + 8 * 60 * 60 * 1000)).toUTCString();
							value = option.expires + "|" + val;
						} else {
							value = "0|" + val;
						};

						this.el.setAttribute(key, value);
						this.el.save(key);
					} catch(ex) {
						status = Config.status.OVERFLOW; // 存储时抛出异常认为是溢出
						val = null;
					};

					if (fn) {
						fn.call(this, status, val);
					};
				},

				/**
                 * getAttribute(key)
                 * 利用key生成文件名，一个文件存储一个key
                 *
                 */
				get: function(key, fn) {
					key = this.expand(key);
					var status = Config.status.SUCCESS;
					try {
						this.el.load(key);
					} catch(e) {
						alert("error!");
					}

					var value = this.el.getAttribute(key); // 若过期则返回null
					if (value) {
						var pos = value.indexOf("|");
						var exp = value.substring(0, pos);
						var now = (new Date()).getTime();

						if (exp > now || exp == "0") {
							value = value.substring(pos + 1, value.length);
						} else {
							value = null;
							status = Config.status.FAILURE;
						};
					};

					if (value == null) {
						status = Config.status.FAILURE;
						this.remove(key);
					};

					if (fn) {
						fn.call(this, status, value);
					};
				},

				/**
                 * 通过设过期时间删除，需要关闭浏览器才能真正删除
                 * 如果手动删除XML文件，则用过的key不能再用，否则会出错
                 * removeAttribute方法好像不是很管用
                 */
				remove: function(key, fn) {
					key = this.expand(key);
					var status = Config.status.SUCCESS;
					var val = null;

					try {
						this.el.load(key);
						val = this.el.getAttribute(key);

						if (val == null) {
							status = Config.status.FAILURE;
						} else {
							var pos = val.indexOf("|");
							val = val.substring(pos + 1, val.length);
							this.el.expires = new Date(315532799000).toUTCString(); // 315532799000 是格林威治时间1979年12月31日23时59分59秒。这是删除UserData的最靠前的一个有效expires时间了，再往前一毫秒，expires = new Date(315532798999).toUTCString(); 就删不掉userdata了，可以认为是IE的一个bug。
							this.el.removeAttribute(key);
							this.el.save(key);
						};
					} catch(ex) {
						status = Config.status.FAILURE;
					};

					if (fn) {
						fn.call(this, status, val);
					};
				}
			}
		},

		// cookie backend
		// TODO: 加上设置项
		cookie: {
			size: 4 * 1024,

			test: function() {
				return true;
			},

			methods: {
				expand: function(key) {
					return this.name + key;
				},

				get: function(key, fn) {
					var status = Config.status.SUCCESS;
					key = this.expand(key);
					var val = baidu.cookie.get(key);
					if (val == null) {
						status = Config.status.FAILURE;
					};
					if (fn) {
						fn.call(this, status, val);
					};
				},

				set: function(key, val, fn, option) {
					var status = Config.status.SUCCESS;
					key = this.expand(key);

					// expires参数类型转换
					if (option && option.expires) {
						option.expires = new Date(expires);
					};
					baidu.cookie.set(key, val, option);
					if (fn) {
						fn.call(this, status, val);
					};
				},

				remove: function(key, fn) {
					var status = Config.status.SUCCESS;
					key = this.expand(key);
					var val = baidu.cookie.get(key);
					baidu.cookie.remove(key);
					if (val == null) {
						status = Config.status.FAILURE;
					};
					if (fn) {
						fn.call(this, status, val);
					};
				}
			}
		}
	};

	/** 
     * 初始化Storage
     * 主要工作，确定一种后端，根据搜索列表或用户指定，加载会默认调用，实例化时会再次调用。
     *
     */
	var init = function(storage) {
		var empty = function() {};

		// 重置 type 和 size
		storage.type = null;
		storage.size = - 1;

		// 初始化后端方法列表
		for (var i = 0, l = Config.methods.length; i < l; i++) {
			storage.Store.prototype[Config.methods[i]] = empty;
		};

		if (Config.option.backend) {
			// TODO: 若参数后端不在支持列表的情况
			var b = Config.option.backend;

			if (Backends[b] && Backends[b].test()) {
				storage.type = b;
				storage.size = Backends[b].size;
				for (key in Backends[b].methods) {
					storage.Store.prototype[key] = Backends[b].methods[key];
				};
			} else {
				// 参数backend有误情况
				for (var i = 0, l = Config.searchList.length; ! storage.type && i < l; i++) {
					var b = Backends[Config.searchList[i]];

					if (b.test()) {
						storage.type = Config.searchList[i];
						storage.size = b.size;

						// 用实例方法扩展构造函数
						for (key in b.methods) {
							storage.Store.prototype[key] = b.methods[key];
						};
					};
				};
			};

		} else {
			// 遍历后端列表
			for (var i = 0, l = Config.searchList.length; ! storage.type && i < l; i++) {
				var b = Backends[Config.searchList[i]];

				if (b.test()) {
					storage.type = Config.searchList[i];
					storage.size = b.size;

					// 用实例方法扩展构造函数
					for (key in b.methods) {
						storage.Store.prototype[key] = b.methods[key];
					};
				};
			};
		};
	};

	/**
       * Storage接口
       *
       */
	var storage = {
		version: "1.0",
		type: null,
		size: - 1,

		// 获取浏览器支持列表
		getSupportList: function() {
			var result = [];
			for (var i = 0, l = Config.searchList.length; i < l; i++) {
				if (Backends[Config.searchList[i]].test()) {
					result.push(Config.searchList[i]);
				};
			};
			return result;
		},

		// store API
		Store: function(name, option) {
			// 名字检查
			var name_re = /^[a-z][a-z0-9_ -]+$/i;
			if (!name_re.exec(name)) {
				throw new Error("Invalid name");
			};

			if (!storage.type) {
				throw new Error("No suitable storage found");
			};

			this.name = name;

			Config.option = option || {};
			Config.option.domain = option.domain || location.hostname || 'localhost.localdomain';
			Config.option.expires = Config.option.expires || 365 * 24 * 60 * 60 * 1000;
			Config.option.path = Config.option.path || '/';

			this.init();
		},

		set: function(key, val, fn, option) {
			var st = new storage.Store("bd_storage", {});
			st.set(key, val, fn, option);
		},

		get: function(key, fn, option) {
			var st = new storage.Store("bd_storage", {});
			st.get(key, fn, option);
		},

		remove: function(key, fn) {
			var st = new storage.Store("bd_storage", {});
			st.remove(key, fn);
		}
	};

	// init persist
	init(storage);

    baidu.data.storage = storage;
})();
