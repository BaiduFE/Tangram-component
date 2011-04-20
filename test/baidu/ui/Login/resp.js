window.pass = window.pass || {
	version : "1-2-1",
	emptyFn : function() {
	}
};
pass.isString = function(e) {
	return (typeof e == "object" && e && e.constructor == String)
			|| typeof e == "string";
};
pass.G = function() {
	for ( var a = [], i = arguments.length - 1; i > -1; i--) {
		var e = arguments[i];
		a[i] = null;
		if (typeof e == "object" && e && e.dom) {
			a[i] = e.dom;
		} else {
			if ((typeof e == "object" && e && e.tagName) || e == window
					|| e == document) {
				a[i] = e;
			} else {
				if (pass.isString(e) && (e = document.getElementById(e))) {
					a[i] = e;
				}
			}
		}
	}
	return a.length < 2 ? a[0] : a;
};
pass.trim = function(str, type) {
	if (type == "left") {
		return str.replace(/(^[\s\t\xa0\u3000]+)/g, "");
	}
	if (type == "right") {
		return str.replace(new RegExp("[\\u3000\\xa0\\s\\t]+\x24", "g"), "");
	}
	return str.replace(new RegExp(
			"(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g"), "");
};
pass.addClass = function(element, className) {
	if (!(element = pass.G(element))) {
		return null;
	}
	className = pass.trim(className);
	if (!new RegExp("(^| )" + className.replace(/(\W)/g, "\\\x241")
			+ "( |\x24)").test(element.className)) {
		element.className = pass.trim(element.className.split(/\s+/).concat(
				className).join(" "));
	}
};
pass.ac = pass.addClass;
pass.extend = function(target, source) {
	if (target && source && typeof (source) == "object") {
		for ( var p in source) {
			target[p] = source[p];
		}
	}
	return target;
};
pass.namespace = function(str, owner) {
	if ((new RegExp("^(\\.[\\w\\\x24][\\w\\-\\\x24]*)+\x24")).test("." + str)) {
		owner = typeof owner == "function" || typeof owner == "object" ? owner
				|| window : window;
		for ( var e, a = str.split("."), i = 0; i < a.length; i++) {
			e = owner[a[i]];
			if (!e || !(typeof e == "object" || typeof e == "function")) {
				owner[a[i]] = {};
			}
			owner = owner[a[i]];
		}
		return owner;
	}
	return null;
};
pass.ns = pass.namespace;
pass.on = function(obj, type, handler, opt_capture) {
	if (!(obj = pass.G(obj)) || typeof handler != "function") {
		return obj;
	}
	type = type.replace(/^on/i, "").toLowerCase();
	function get_event(evt) {
		return evt || window.event;
	}
	var fn = function(evt) {
		handler.call(fn.src, get_event(evt));
	};
	fn.src = obj;
	var listeners = pass.on._listeners;
	var li = [ obj, type, handler, fn ];
	listeners[listeners.length] = li;
	if (obj.attachEvent) {
		obj.attachEvent("on" + type, fn);
	} else {
		if (obj.addEventListener) {
			obj.addEventListener(type, fn, false);
		}
	}
	return obj;
};
pass.on._listeners = [];
pass.each = function(obj, fun) {
	if (typeof fun != "function") {
		return obj;
	}
	if (obj) {
		var return_value;
		if (obj.length === undefined) {
			for ( var name in obj) {
				if (name in {}) {
					continue;
				}
				return_value = fun.call(obj[name], obj[name], name);
				if (return_value == "break") {
					break;
				}
			}
		} else {
			for ( var i = 0, length = obj.length; i < length; i++) {
				return_value = fun.call(obj[i], obj[i], i);
				if (return_value == "break") {
					break;
				}
			}
		}
	}
	return obj;
};
pass.Q = function(searchClass, parentNode, tagName) {
	if (!pass.isString(searchClass) || searchClass.length <= 0
			|| (parentNode && !(parentNode = pass.G(parentNode)))) {
		return null;
	}
	var result = [], tagName = (typeof tagName == "string" && tagName.length > 0) ? tagName
			.toLowerCase()
			: null, node = parentNode || document;
	if (node.getElementsByClassName) {
		pass.each(node.getElementsByClassName(searchClass), function(n) {
			if (tagName !== null) {
				if (n.tagName.toLowerCase() == tagName) {
					result[result.length] = n;
				}
			} else {
				result[result.length] = n;
			}
		});
	} else {
		searchClass = searchClass.replace(/\-/g, "\\-");
		var reg = new RegExp("(^|\\s{1,})" + pass.trim(searchClass)
				+ "(\\s{1,}|\x24)"), all = (tagName === null) ? (node.all ? node.all
				: node.getElementsByTagName("*"))
				: node.getElementsByTagName(tagName), len = all.length, rel = len;
		while (len--) {
			if (reg.test(all[rel - len - 1].className)) {
				result[result.length] = all[rel - len - 1];
			}
		}
	}
	return result;
};
pass.removeClass = function(element, className) {
	if (!(element = pass.G(element))) {
		return;
	}
	className = pass.trim(className);
	var c = element.className.replace(new RegExp("(^| +)"
			+ className.replace(/(\W)/g, "\\\x241") + "( +|\x24)", "g"),
			"\x242");
	if (element.className != c) {
		element.className = pass.trim(c);
	}
};
pass.rc = pass.removeClass;
pass.sio = pass.sio || {};
pass.url = pass.url || {};
pass.string = pass.string || {};
pass.string.escapeReg = function(me) {
	return String(me).replace(
			new RegExp("([.*+?^=!:\x24{}()|[\\]/\\\\])", "g"), "\\\x241");
};
pass.url.parseQuery = function(me, key) {
	if (key) {
		var a = new RegExp("(^|&|\\?|#)" + pass.string.escapeReg(key)
				+ "=([^&]*)(&|\x24)", "");
		var b = me.match(a);
		if (b) {
			return b[2];
		}
	} else {
		if (me) {
			me = me.substr(me.indexOf("?") + 1, me.length);
			var paramsArr = me.split("&");
			var args = {}, argsStr = [], param, name, value;
			for ( var i = 0; i < paramsArr.length; i++) {
				param = paramsArr[i].split("=");
				name = param[0], value = param[1];
				if (name === "") {
					continue;
				}
				if (typeof args[name] == "undefined") {
					args[name] = value;
				} else {
					if (pass.isString(args[name])) {
						continue;
					} else {
						args[name].push(value);
					}
				}
			}
			return args;
		}
	}
	return null;
};
pass.sio.get = function(url, onsuccess, config) {
	if (!url || !pass.isString(url)) {
		return null;
	}
	var callback = pass.url.parseQuery(url, "callback");
	var scr = document.createElement("SCRIPT");
	if (config) {
		for ( var i in config) {
			scr.setAttribute(i, config[i]);
		}
	}
	if (!callback) {
		var loaded = false;
		scr.onreadystatechange = scr.onload = function() {
			if (loaded) {
				return false;
			}
			if (typeof scr.readyState === "undefined"
					|| scr.readyState == "loaded"
					|| scr.readyState == "complete") {
				loaded = true;
				try {
					onsuccess();
				} finally {
					if (scr && scr.parentNode) {
						scr.parentNode.removeChild(scr);
					}
					scr.onreadystatechange = null;
					scr.onload = null;
					scr = null;
				}
			}
		};
	} else {
		var cbid = "CB" + Math.floor(Math.random() * 2147483648).toString(36);
		url = url.replace(/(&|\?)callback=([^&]*)/, "\x241callback=" + cbid);
		window[cbid] = function() {
			try {
				var os = (onsuccess || window[callback]);
				os.apply(null, arguments);
			} finally {
				if (scr && scr.parentNode) {
					scr.parentNode.removeChild(scr);
				}
				scr = null;
				window[cbid] = null;
			}
		};
	}
	scr.src = url;
	scr.type = "text/javascript";
	var head = document.getElementsByTagName("HEAD")[0];
	head.insertBefore(scr, head.firstChild);
};
var bdPass = bdPass || {};
bdPass.TemplateItems = bdPass.TemplateItems || {};
bdPass.TemplateItems["length"] = bdPass.TemplateItems["length"] || 0;
(function() {
	var statics = {
		itemCache : [],
		preUrl : "https://passport.baidu.com/",
		preUrlHttps : "https://passport.baidu.com/",
		preUrlPost : "https://passport.baidu.com/api/?",
		ctrlVersion : "1,0,0,7",
		regNameValid : true,
		regPwdValid : true,
		templateValue : {
			"login" : [ "\u767b\u5f55", "\u767b\u5f55" ],
			"reg" : [ "\u540c\u610f\u4ee5\u4e0b\u534f\u8bae\u5e76\u63d0\u4ea4",
					"\u6ce8\u518c" ],
			"lockmail" : [ "\u53d1\u9001\u9a8c\u8bc1\u90ae\u4ef6",
					"\u8bbe\u7f6e\u9a8c\u8bc1\u90ae\u7bb1" ],
			"lockphone" : [ "\u63d0\u4ea4",
					"\u8bbe\u7f6e\u9a8c\u8bc1\u624b\u673a" ]
		},
		getVerifyCode : function(el) {
			var time = new Date().getTime();
			var url = this.preUrl + "?verifypic&t=" + time;
			if (pass.G(el)) {
				pass.G(el).src = url;
			}
		},
		regAgreeUrl : "https://passport.baidu.com/js/agree.js?v=1.2",
		regAgreeInsert : function() {
			var area = pass.G("PassRegAgree");
			var reg_text = reg_agree_txt || "";
			if (area && reg_text) {
				area.value = reg_text;
			}
		},
		logM : function(flag) {
			var tempId = "PassVerifycode" + bdPass.s.itemCache.shift();
			if (!pass.G(tempId)) {
				return;
			}
			pass.G(tempId).style.display = +flag ? "block" : "none";
		},
		regM : function(flag) {
			var tempId = "PassUsername" + bdPass.s.itemCache.shift();
			if (!pass.G(tempId)) {
				return;
			}
			var noteArea = pass.Q("pass-valid-note", pass.G(tempId), "span")[0];
			var text = "\u6b64\u7528\u6237\u540d\u5df2\u88ab\u6ce8\u518c\uff0c\u8bf7\u53e6\u6362\u4e00\u4e2a\u3002";
			if (+flag == 1) {
				bdPass.s.regNameValid = false;
				noteArea.innerHTML = text;
				noteArea.style.display = "";
				pass.removeClass(noteArea, "pass-note-passed");
				pass.addClass(noteArea, "pass-note-failed");
			} else {
				if (+flag == 2) {
					text = "\u7528\u6237\u540d\u4ec5\u53ef\u4f7f\u7528\u6c49\u5b57\u3001\u6570\u5b57\u3001\u5b57\u6bcd\u548c\u4e0b\u5212\u7ebf\u3002";
					bdPass.s.regNameValid = false;
					noteArea.innerHTML = text;
					noteArea.style.display = "";
					pass.removeClass(noteArea, "pass-note-passed");
					pass.addClass(noteArea, "pass-note-failed");
				} else {
					if (+flag == 3) {
						text = "\u6b64\u7528\u6237\u540d\u4e0d\u53ef\u4f7f\u7528";
						bdPass.s.regNameValid = false;
						noteArea.innerHTML = text;
						noteArea.style.display = "";
						pass.removeClass(noteArea, "pass-note-passed");
						pass.addClass(noteArea, "pass-note-failed");
					} else {
						bdPass.s.regNameValid = true;
						noteArea.innerHTML = "";
						noteArea.style.display = "none";
						pass.removeClass(noteArea, "pass-note-failed");
						pass.addClass(noteArea, "pass-note-passed");
					}
				}
			}
		},
		regCP : function(flag) {
			var tempId = "PassLoginpass" + bdPass.s.itemCache.shift();
			if (!pass.G(tempId)) {
				return;
			}
			var noteArea = pass.Q("pass-valid-note", pass.G(tempId), "span")[0];
			var text = "\u60a8\u8f93\u5165\u5bc6\u7801\u7ed3\u6784\u6bd4\u8f83\u7b80\u5355\uff0c\u5efa\u8bae\u60a8\u66f4\u6362\u66f4\u52a0\u590d\u6742\u7684\u5bc6\u7801\u3002";
			var text2 = "\u60a8\u7684\u5bc6\u7801\u7ed3\u6784\u592a\u8fc7\u7b80\u5355\uff0c\u4e0d\u80fd\u4f7f\u7528\u3002";
			if (+flag == 1) {
				bdPass.s.regPwdValid = true;
				noteArea.innerHTML = text;
				noteArea.style.display = "";
				pass.removeClass(noteArea, "pass-note-passed");
				pass.addClass(noteArea, "pass-note-failed");
			} else {
				if (+flag == 2) {
					bdPass.s.regPwdValid = false;
					noteArea.innerHTML = text2;
					noteArea.style.display = "";
					pass.removeClass(noteArea, "pass-note-passed");
					pass.addClass(noteArea, "pass-note-failed");
				} else {
					bdPass.s.regPwdValid = true;
					noteArea.innerHTML = "";
					noteArea.style.display = "none";
					pass.removeClass(noteArea, "pass-note-failed");
					pass.addClass(noteArea, "pass-note-passed");
				}
			}
		},
		resetSth : function(obj, flag) {
			var el = pass.G("PassInputPassword" + obj.id);
			if (el) {
				el.value = "";
			}
			el = pass.G("PassInputVerifycode" + obj.id);
			if (el) {
				el.value = "";
				bdPass.s.getVerifyCode("PassVerifypic" + obj.id);
			}
			if (obj.type == "login") {
				el = pass.G("PassVerifycode" + obj.id);
				var json = obj.targetJson.param_in;
				var i = 1;
				while (json["param" + i + "_name"]) {
					if (json["param" + i + "_name"] == "verifycode") {
						el.style.display = +json["param" + i + "_value"] ? ""
								: "none";
						obj.showVCode = +json["param" + i + "_value"];
						break;
					}
					i++;
				}
			}
			if (flag) {
				obj.__initFocus();
			}
		}
	};
	bdPass.s = statics;
})();
(function() {
	var validMessage = {
		login : {
			0 : "\u767b\u5f55\u6210\u529f",
			1 : "\u7528\u6237\u540d\u683c\u5f0f\u9519\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\u3002",
			2 : "\u7528\u6237\u4e0d\u5b58\u5728",
			3 : "",
			4 : "\u767b\u5f55\u5bc6\u7801\u9519\u8bef\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55\u3002",
			5 : "\u4eca\u65e5\u767b\u5f55\u6b21\u6570\u8fc7\u591a",
			6 : "\u9a8c\u8bc1\u7801\u4e0d\u5339\u914d\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\u9a8c\u8bc1\u7801\u3002",
			7 : "\u767b\u5f55\u65f6\u53d1\u751f\u672a\u77e5\u9519\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\u3002",
			8 : "\u767b\u5f55\u65f6\u53d1\u751f\u672a\u77e5\u9519\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\u3002",
			16 : "\u5bf9\u4e0d\u8d77\uff0c\u60a8\u73b0\u5728\u65e0\u6cd5\u767b\u5f55\u3002",
			20 : "\u6b64\u5e10\u53f7\u5df2\u767b\u5f55\u4eba\u6570\u8fc7\u591a",
			51 : "\u8be5\u624b\u673a\u53f7\u672a\u901a\u8fc7\u9a8c\u8bc1",
			52 : "\u8be5\u624b\u673a\u5df2\u7ecf\u7ed1\u5b9a\u591a\u4e2a\u7528\u6237",
			53 : "\u624b\u673a\u53f7\u7801\u683c\u5f0f\u4e0d\u6b63\u786e",
			58 : "\u624b\u673a\u53f7\u683c\u5f0f\u9519\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165",
			256 : "",
			257 : "\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801",
			"default" : "\u767b\u5f55\u65f6\u53d1\u751f\u672a\u77e5\u9519\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\u3002"
		},
		reg : {
			"-1" : [ "error",
					"\u6ce8\u518c\u65f6\u53d1\u751f\u672a\u77e5\u9519\u8bef" ],
			10 : [ "username", "\u8bf7\u586b\u5199\u7528\u6237\u540d" ],
			11 : [
					"username",
					"\u7528\u6237\u540d\u6700\u957f\u4e0d\u5f97\u8d85\u8fc77\u4e2a\u6c49\u5b57\uff0c\u621614\u4e2a\u5b57\u8282(\u6570\u5b57\uff0c\u5b57\u6bcd\u548c\u4e0b\u5212\u7ebf)\u3002" ],
			12 : [
					"username",
					"\u7528\u6237\u540d\u4ec5\u53ef\u4f7f\u7528\u6c49\u5b57\u3001\u6570\u5b57\u3001\u5b57\u6bcd\u548c\u4e0b\u5212\u7ebf\u3002" ],
			13 : [ "error", "\u6ce8\u518c\u6570\u636e\u683c\u5f0f\u9519\u8bef" ],
			14 : [
					"username",
					"\u6b64\u7528\u6237\u540d\u5df2\u88ab\u6ce8\u518c\uff0c\u8bf7\u53e6\u6362\u4e00\u4e2a\u3002" ],
			15 : [ "username",
					"\u6b64\u7528\u6237\u540d\u4e0d\u53ef\u4f7f\u7528" ],
			16 : [ "error",
					"\u6ce8\u518c\u65f6\u53d1\u751f\u672a\u77e5\u9519\u8bef" ],
			20 : [ "loginpass", "\u8bf7\u586b\u5199\u5bc6\u7801" ],
			21 : [
					"loginpass",
					"\u5bc6\u7801\u6700\u5c116\u4e2a\u5b57\u7b26\uff0c\u6700\u957f\u4e0d\u5f97\u8d85\u8fc714\u4e2a\u5b57\u7b26\u3002" ],
			22 : [ "verifypass",
					"\u5bc6\u7801\u4e0e\u786e\u8ba4\u5bc6\u7801\u4e0d\u4e00\u81f4" ],
			23 : [
					"loginpass",
					"\u5bc6\u7801\u4ec5\u53ef\u7531\u6570\u5b57\uff0c\u5b57\u6bcd\u548c\u4e0b\u5212\u7ebf\u7ec4\u6210\u3002" ],
			24 : [
					"loginpass",
					"\u60a8\u7684\u5bc6\u7801\u7ed3\u6784\u592a\u8fc7\u7b80\u5355\uff0c\u8bf7\u66f4\u6362\u66f4\u590d\u6742\u7684\u5bc6\u7801\uff0c\u5426\u5219\u65e0\u6cd5\u6ce8\u518c\u6210\u529f\u3002" ],
			30 : [ "email", "\u8bf7\u8f93\u5165\u90ae\u4ef6\u5730\u5740" ],
			31 : [ "email", "\u90ae\u4ef6\u683c\u5f0f\u4e0d\u6b63\u786e" ],
			40 : [ "verifycode", "\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801" ],
			41 : [ "verifycode", "\u9a8c\u8bc1\u7801\u683c\u5f0f\u9519\u8bef" ],
			42 : [ "verifycode", "\u9a8c\u8bc1\u7801\u9519\u8bef" ]
		},
		lockmail : {
			1 : [ "error",
					"\u672a\u77e5\u9519\u8bef\uff0c\u8bf7\u91cd\u8bd5\u3002" ],
			2 : [ "error", "\u8bf7\u5148\u767b\u5f55" ],
			3 : [
					"password",
					'\u60a8\u7684\u5bc6\u7801\u8fc7\u4e8e\u7b80\u5355\uff0c\u8bf7\u5148<a href="http://passport.baidu.com/passchange" target="_blank">\u5347\u7ea7\u5bc6\u7801</a>\u3002' ],
			4 : [ "error", "\u60a8\u5df2\u8bbe\u7f6e\u5b89\u5168\u90ae\u7bb1" ],
			5 : [
					"error",
					"\u4eca\u65e5\u9a8c\u8bc1\u6b21\u6570\u8fc7\u591a\uff0c\u8bf7\u660e\u5929\u518d\u8bd5\u3002" ],
			6 : [ "error",
					"\u60a8\u8f93\u5165\u5bc6\u7801\u9519\u8bef\u6b21\u6570\u592a\u591a" ],
			11 : [
					"password",
					"\u5bc6\u7801\u9519\u8bef\uff0c\u8bf7\u68c0\u67e5\u662f\u5426\u8f93\u5165\u9519\u8bef\uff0c\u6216\u9519\u6309\u4e86\u5927\u5c0f\u5199\u6309\u952e\u3002" ],
			12 : [ "securemail",
					"\u8bf7\u8f93\u5165\u9a8c\u8bc1\u90ae\u7bb1\u5730\u5740" ],
			13 : [ "securemail",
					"\u9a8c\u8bc1\u90ae\u7bb1\u683c\u5f0f\u4e0d\u6b63\u786e" ],
			14 : [ "securemail",
					"\u9a8c\u8bc1\u90ae\u7bb1\u5730\u5740\u8fc7\u957f" ],
			15 : [ "error",
					"\u6821\u9a8c\u90ae\u7bb1\u683c\u5f0f\u4e0d\u6b63\u786e" ],
			16 : [ "error",
					"\u6b64\u90ae\u7bb1\u9a8c\u8bc1\u6b21\u6570\u8fc7\u591a" ],
			17 : [
					"error",
					"\u6b64\u90ae\u7bb1\u5df2\u88ab\u9a8c\u8bc1\u8fc7\uff0c\u6bcf\u4e2a\u90ae\u7bb1\u4ec5\u53ef\u4e3a\u4e00\u4e2a\u7528\u6237\u540d\u63d0\u4f9b\u9a8c\u8bc1\uff0c\u8bf7\u91cd\u65b0\u586b\u5199\u3002" ],
			20 : [ "error", "\u7cfb\u7edf\u9519\u8bef" ]
		},
		lockphone : {
			1 : [ "error",
					"\u672a\u77e5\u9519\u8bef\uff0c\u8bf7\u91cd\u8bd5\u3002" ],
			2 : [ "error", "\u8bf7\u5148\u767b\u5f55" ],
			3 : [
					"password",
					'\u60a8\u7684\u5bc6\u7801\u8fc7\u4e8e\u7b80\u5355\uff0c\u8bf7\u5148<a href="http://passport.baidu.com/passchange" target="_blank">\u5347\u7ea7\u5bc6\u7801</a>\u3002' ],
			4 : [ "error", "\u60a8\u5df2\u8bbe\u7f6e\u5b89\u5168\u624b\u673a" ],
			5 : [
					"error",
					"\u4eca\u65e5\u9a8c\u8bc1\u6b21\u6570\u8fc7\u591a\uff0c\u8bf7\u660e\u5929\u518d\u8bd5\u3002" ],
			6 : [ "error",
					"\u60a8\u8f93\u5165\u5bc6\u7801\u9519\u8bef\u6b21\u6570\u592a\u591a" ],
			11 : [
					"password",
					"\u5bc6\u7801\u9519\u8bef\uff0c\u8bf7\u68c0\u67e5\u662f\u5426\u8f93\u5165\u9519\u8bef\uff0c\u6216\u9519\u6309\u4e86\u5927\u5c0f\u5199\u6309\u952e\u3002" ],
			12 : [ "securemobile",
					"\u8bf7\u8f93\u5165\u9a8c\u8bc1\u624b\u673a\u53f7\u7801" ],
			13 : [
					"securemobile",
					"\u624b\u673a\u683c\u5f0f\u9519\u8bef\uff0c\u8bf7\u68c0\u67e5\u5e76\u91cd\u65b0\u8f93\u5165\u3002" ],
			16 : [
					"securemobile",
					"\u624b\u673a\u53f7\u7801\u5df2\u88ab\u9a8c\u8bc1\u8d85\u8fc7\u6700\u5927\u6b21\u6570" ],
			17 : [ "securemobile",
					"\u6b64\u624b\u673a\u5df2\u88ab\u9a8c\u8bc1\u8fc7" ],
			20 : [ "error", "\u7cfb\u7edf\u9519\u8bef" ]
		}
	};
	bdPass.vm = validMessage;
})();
(function() {
	var errorHash = {
		login : {
			"-1" : "no-token"
		},
		reg : {
			"-1" : "no-token"
		},
		lockmail : {
			"1" : "no-token",
			"2" : "need-login",
			"20" : "system-error"
		},
		lockphone : {
			"1" : "no-token",
			"2" : "need-login",
			"20" : "system-error"
		}
	};
	bdPass.eh = errorHash;
})();
(function() {
	var templateName = "BPT", formUrlPre = bdPass.s.preUrl + "?api";
	var validMethods = {
		isEmpty : function(v) {
			return ((v === null) || (v.length === 0));
		},
		minLength : function(v, opt) {
			return v && v.length >= opt;
		},
		maxLength : function(v, opt) {
			return v && v.length <= opt;
		},
		regexp : function(v, opt) {
			return opt.test(v);
		}
	};
	var generateHTML = function(name, config) {
		var html = [];
		config = config || {};
		for ( var i in config) {
			if (config.hasOwnProperty(i)) {
				var a = [];
				if (i == "checked") {
					if (!!config[i]) {
						html[html.length] = 'checked="true"';
					}
					continue;
				}
				if (i == "innertext" || i == "endTag") {
					continue;
				}
				a.push(i);
				a.push('"' + config[i] + '"');
				html[html.length] = a.join("=");
			}
		}
		html = "<" + name + " " + html.join(" ") + ">";
		if (name == "input" || name == "img") {
			html = html.slice(0, -1) + "/>";
			return html;
		}
		if (config.innertext) {
			html += config.innertext;
		}
		if (config.endTag) {
			html += "</" + name + ">";
		}
		return html;
	};
	var generateCloseTag = function(name) {
		return "</" + name + ">";
	};
	var Template = function(type, uid, json, target, customConfig) {
		this.type = type;
		this.id = uid;
		this.name = templateName + uid;
		this.valid = true;
		this.formVisEl = [];
		this.formHidEl = [];
		this.formVisInput = [];
		this.targetJson = json;
		this.oldUname = "";
		this.orivalueCache = {};
		this.showVCode = 0;
		this.renderSuccess = true;
		var url = json.sourceUrl;
		if (url.indexOf("/") == 0) {
			url = url.slice(1);
		}
		url = url.replace(/\&amp;/g, "&");
		this.sourceUrl = bdPass.s.preUrl + url;
		var config = {
			immediate : true,
			renderSafeflg : false,
			isPhone : false,
			isMem : true,
			passedClass : "pass-form-passed",
			failedClass : "pass-form-failed",
			passedNoteClass : "pass-note-passed",
			failedNoteClass : "pass-note-failed",
			labelName : {},
			noticeValue : {},
			buttonValue : null,
			errorSpecial : {},
			addHTML : [],
			onSubmit : function() {
			},
			onSuccess : function() {
			},
			onFailure : function() {
			},
			onAfterRender : function() {
			},
			onNotLogin : function() {
			},
			onSystemError : function() {
			}
		};
		pass.extend(config, customConfig);
		this.config = config;
		if (bdPass.eh[this.type][json.error_no]) {
			var error_no = bdPass.eh[this.type][json.error_no];
			switch (error_no) {
			case "need-login":
				this.config.onNotLogin();
				this.renderSuccess = false;
				return;
			case "no-token":
				this.config.onSystemError();
				this.renderSuccess = false;
				return;
			case "system-error":
				this.config.onSystemError();
				this.renderSuccess = false;
				break;
			}
		}
		this.__init(json);
		var html = this.__packForm();
		this.target = pass.G(target);
		if (this.target) {
			this.target.innerHTML = html;
		}
		this.__bindEventListener();
	};
	Template.formElMap = {
		username : [
				1,
				"text",
				"\u7528\u6237\u540d\uff1a",
				"\u4e0d\u8d85\u8fc77\u4e2a\u6c49\u5b57\uff0c\u621614\u4e2a\u5b57\u8282(\u6570\u5b57\uff0c\u5b57\u6bcd\u548c\u4e0b\u5212\u7ebf)\u3002" ],
		phone : [ 1, "text", "\u624b\u673a\u53f7\uff1a" ],
		password : [ 1, "password", "\u5bc6\u7801\uff1a" ],
		loginpass : [
				1,
				"password",
				"\u8bbe\u7f6e\u5bc6\u7801\uff1a",
				"\u5bc6\u7801\u957f\u5ea66\uff5e14\u4f4d\uff0c\u5b57\u6bcd\u533a\u5206\u5927\u5c0f\u5199\u3002" ],
		verifypass : [ 1, "password", "\u786e\u8ba4\u5bc6\u7801\uff1a" ],
		mem_pass : [ 2, "checkbox",
				"\u8bb0\u4f4f\u6211\u7684\u767b\u5f55\u72b6\u6001", true ],
		sex : [ 3, "radio", "\u6027\u522b\uff1a", "",
				[ [ "\u7537", true ], [ "\u5973" ] ] ],
		email : [
				1,
				"text",
				"\u7535\u5b50\u90ae\u4ef6\uff1a",
				"\u8bf7\u8f93\u5165\u6709\u6548\u7684\u90ae\u4ef6\u5730\u5740\uff0c\u5f53\u5bc6\u7801\u9057\u5931\u65f6\u51ed\u6b64\u9886\u53d6\u3002" ],
		verifycode : [ 4, "text", "\u9a8c\u8bc1\u7801\uff1a" ],
		safeflg : [ 5, "text", "\u5bc6\u7801\uff1a" ],
		securemail : [ 1, "text", "\u90ae\u7bb1\u5730\u5740\uff1a" ],
		securemobile : [ 1, "text",
				"\u9700\u8981\u9a8c\u8bc1\u7684\u624b\u673a\uff1a" ]
	};
	Template.loginFormValidMap = {
		"pv:username" : [ [
				"",
				function(v, obj) {
					if (obj.showVCode) {
						return true;
					}
					var url = bdPass.s.preUrl + "?logcheck&username="
							+ encodeURIComponent(v) + "&t="
							+ (new Date().getTime())
							+ "&callback=bdPass.s.logM&pspcs=utf8";
					bdPass.s.itemCache.push(obj.id);
					pass.sio.get(url, bdPass.s.logM);
					return true;
				}, true ] ]
	};
	Template.regFormValidMap = {
		"pv:username" : [
				[ "\u8bf7\u586b\u5199\u7528\u6237\u540d", function(v) {
					return !validMethods.isEmpty(v);
				} ],
				[
						"\u7528\u6237\u540d\u6700\u957f\u4e0d\u5f97\u8d85\u8fc77\u4e2a\u6c49\u5b57\uff0c\u621614\u4e2a\u5b57\u8282(\u6570\u5b57\uff0c\u5b57\u6bcd\u548c\u4e0b\u5212\u7ebf)\u3002",
						function(v) {
							var len = 0;
							for ( var i = 0; i < v.length; i++) {
								if (v.charCodeAt(i) > 127) {
									len++;
								}
								len++;
							}
							return len <= 14;
						} ],
				[
						"\u7528\u6237\u540d\u4ec5\u53ef\u4f7f\u7528\u6c49\u5b57\u3001\u6570\u5b57\u3001\u5b57\u6bcd\u548c\u4e0b\u5212\u7ebf\u3002",
						function(v) {
							for ( var i = 0, l = v.length; i < l; i++) {
								if (v.charCodeAt(i) < 127
										&& !v.substr(i, 1).match(/^\w+$/ig)) {
									return false;
								}
							}
							return true;
						} ],
				[
						"\u6b64\u7528\u6237\u540d\u5df2\u88ab\u6ce8\u518c\uff0c\u8bf7\u53e6\u6362\u4e00\u4e2a\u3002",
						function(v, obj) {
							var url = bdPass.s.preUrl + "?ucheck&username="
									+ encodeURIComponent(v)
									+ "&callback=bdPass.s.regM" + "&t="
									+ (new Date().getTime()) + "&pspcs=utf8";
							bdPass.s.itemCache.push(obj.id);
							pass.sio.get(url, bdPass.s.regM);
							return bdPass.s.regNameValid;
						} ] ],
		"pv:loginpass" : [
				[
						"",
						function(v, obj) {
							if (pass.G("PassInputVerifypass" + obj.id).value.length) {
								obj.__getValid(obj, pass
										.G("PassInputVerifypass" + obj.id));
							}
							return true;
						} ],
				[ "\u8bf7\u586b\u5199\u5bc6\u7801", function(v) {
					return !validMethods.isEmpty(v);
				} ],
				[
						"\u5bc6\u7801\u6700\u5c116\u4e2a\u5b57\u7b26\uff0c\u6700\u957f\u4e0d\u5f97\u8d85\u8fc714\u4e2a\u5b57\u7b26\u3002",
						function(v) {
							return validMethods.minLength(v, 6)
									&& validMethods.maxLength(v, 14);
						} ],
				[
						"",
						function(v, obj) {
							var url = bdPass.s.preUrlHttps
									+ "?weakpasscheck&fromreg=1&username="
									+ encodeURIComponent(pass
											.G("PassInputUsername" + obj.id).value)
									+ "&newpwd="
									+ pass.G("PassInputLoginpass" + obj.id).value
									+ "&callback=bdPass.s.regCP" + "&t="
									+ (new Date()).getTime() + "&pspcs=utf8";
							bdPass.s.itemCache.push(obj.id);
							pass.sio.get(url, bdPass.s.regCP);
							return bdPass.s.regPwdValid;
						} ] ],
		"pv:verifypass" : [
				[ "\u8bf7\u586b\u5199\u786e\u8ba4\u5bc6\u7801", function(v) {
					return !validMethods.isEmpty(v);
				} ],
				[
						"\u5bc6\u7801\u4e0e\u786e\u8ba4\u5bc6\u7801\u4e0d\u4e00\u81f4\u3002",
						function(v) {
							return v == document.getElementsByName("loginpass")[0].value;
						} ] ],
		"pv:email" : [
				[ "\u8bf7\u586b\u5199\u90ae\u7bb1", function(v) {
					return !validMethods.isEmpty(v);
				} ],
				[
						"\u90ae\u4ef6\u683c\u5f0f\u4e0d\u6b63\u786e",
						function(v) {
							return validMethods.regexp(v,
									/^[\w\.\-]+@([\w\-]+\.)+[a-z]{2,4}$/i);
						} ] ],
		"pv:verifycode" : [ [ "\u8bf7\u586b\u5199\u9a8c\u8bc1\u7801",
				function(v) {
					return !validMethods.isEmpty(v);
				} ] ]
	};
	Template.lockphoneFormValidMap = {
		"pv:password" : [ [ "\u8bf7\u586b\u5199\u767b\u5f55\u5bc6\u7801",
				function(v) {
					return !validMethods.isEmpty(v);
				} ] ],
		"pv:securemobile" : [
				[ "\u8bf7\u586b\u5199\u9a8c\u8bc1\u624b\u673a", function(v) {
					return !validMethods.isEmpty(v);
				} ],
				[
						"\u624b\u673a\u683c\u5f0f\u9519\u8bef\uff0c\u8bf7\u68c0\u67e5\u5e76\u91cd\u65b0\u8f93\u5165\u3002",
						function(v) {
							return validMethods
									.regexp(v,
											/(^1[34]\d{9}$)|(^15[0-9]\d{8}$)|(^18[6789]\d{8}$)|(^0[1-9]\d{8,11}$)/);
						} ] ]
	};
	Template.lockmailFormValidMap = {
		"pv:password" : [ [ "\u8bf7\u586b\u5199\u767b\u5f55\u5bc6\u7801",
				function(v) {
					return !validMethods.isEmpty(v);
				} ] ],
		"pv:securemail" : [
				[ "\u8bf7\u586b\u5199\u9a8c\u8bc1\u90ae\u7bb1", function(v) {
					return !validMethods.isEmpty(v);
				} ],
				[
						"\u90ae\u7bb1\u683c\u5f0f\u9519\u8bef\uff0c\u8bf7\u68c0\u67e5\u5e76\u91cd\u65b0\u8f93\u5165\u3002",
						function(v) {
							return validMethods.regexp(v,
									/^[\w\.\-]+@([\w\-]+\.)+[a-z]{2,4}$/i);
						} ] ]
	};
	Template.prototype = {
		__init : function(json) {
			var formEl = json.param_in;
			var i = 1;
			while (formEl["param" + i + "_name"]) {
				var key = "param" + i + "_name", value = "param" + i + "_value", el = formEl[key];
				if (el) {
					this.formVisEl.push([ el, formEl[value] ]);
				}
				i++;
			}
			formEl = json.param_out;
			var i = 1;
			while (formEl["param" + i + "_name"]) {
				this.formHidEl.push([ formEl["param" + i + "_name"],
						formEl["param" + i + "_contex"] ]);
				i++;
			}
			if (this.config.addHTML.length) {
				if (!(this.config.addHTML[0] instanceof Array)) {
					this.config.addHTML = [ this.config.addHTML ];
				}
				for ( var i = 0, l = this.config.addHTML.length; i < l; i++) {
					var item = this.config.addHTML[i];
					switch (item[0]) {
					case "first":
						this.formVisEl.unshift(item[1]);
						break;
					case "last":
						this.formVisEl.push(item[1]);
						break;
					default:
						this.formVisEl.splice(item[0], 0, item[1]);
					}
				}
			}
		},
		__packForm : function() {
			var id = this.id;
			var html = [];
			html.push(generateHTML("div", {
				"id" : "PassWrapper" + id,
				"class" : "pass-wrapper"
			}));
			html.push(generateHTML("form", {
				"id" : "PassForm" + this.type,
				"target" : "PassIframe" + id,
				"action" : bdPass.s.preUrlPost,
				"method" : "post",
				"class" : "pass-form",
				"accept-charset" : "gb2312"
			}));
			html.push(generateHTML("fieldset"));
			var title = bdPass.s.templateValue[this.type][1];
			html.push(generateHTML("legend", {
				"innertext" : "\u767e\u5ea6\u7528\u6237" + title,
				endTag : true
			}));
			html.push(generateHTML("div", {
				"id" : "PassFormWapper" + id,
				"class" : "pass-form-wapper-" + this.type
			}));
			html
					.push('<p class="pass-server-error" style="display:none;" id="PassError'
							+ id
							+ '" >'
							+ (this.config.errorValue || "")
							+ "</p>");
			for ( var i = 0, l = this.formVisEl.length; i < l; i++) {
				var item = this.formVisEl[i];
				if (typeof item == "string") {
					html.push(item);
					continue;
				}
				var type = item[0], value = item[1] || "", formElMap = Template.formElMap, formEl = (this.config.isPhone && type == "username") ? formElMap["phone"]
						: formElMap[type], formName = [];
				if (formEl && formEl[0]) {
					var upperName = type.charAt(0).toUpperCase()
							+ type.slice(1);
					var pDisplay = "";
					if (this.type == "login" && formEl[0] == 4) {
						pDisplay = (+value) ? "" : "none";
						this.showVCode = +value;
					} else {
						if (this.type == "login" && formEl[0] == 5) {
							pDisplay = "none";
						}
					}
					html.push(generateHTML("p", {
						"id" : "Pass" + upperName + id,
						"class" : "pass-" + type,
						"style" : "display:" + pDisplay
					}));
					switch (formEl[0]) {
					case 1:
						formName.push("PassInput" + upperName + this.id);
						var maxLen = "";
						if (this.type == "reg" && type == "username") {
							maxLen = 14;
						}
						html.push(generateHTML("label", {
							"for" : formName[0],
							"innertext" : this.config.labelName[type]
									|| formEl[2],
							"endTag" : true
						}));
						html.push(generateHTML("input", {
							"id" : formName[0],
							"name" : type,
							"type" : formEl[1],
							"class" : "pv:" + type,
							"value" : decodeURIComponent(value),
							"maxlength" : maxLen
						}));
						break;
					case 2:
						formName.push("PassInput" + upperName + this.id);
						html.push(generateHTML("input", {
							"id" : formName[0],
							"name" : type,
							"type" : formEl[1],
							"class" : "pv:" + type,
							"checked" : this.config.isMem
						}));
						html.push(generateHTML("label", {
							"for" : formName[0],
							"innertext" : this.config.labelName[type]
									|| formEl[2],
							"endTag" : true
						}));
						break;
					case 3:
						html.push(generateHTML("label", {
							"for" : "PassInput" + upperName + this.id,
							"innertext" : this.config.labelName[type]
									|| formEl[2],
							"endTag" : true
						}));
						html.push('<span class="pass-input-group">');
						for ( var j = 0, k = formEl[4].length; j < k; j++) {
							formName[j] = ("PassInput" + upperName + this.id + j);
							html.push(generateHTML("input", {
								"id" : formName[j],
								"name" : type,
								"type" : formEl[1],
								"class" : "pv:" + type,
								"value" : j + 1,
								"checked" : formEl[4][j][1]
							}));
							html.push(generateHTML("label", {
								"for" : formName[j],
								"innertext" : formEl[4][j][0],
								"endTag" : true
							}));
						}
						html.push("</span>");
						break;
					case 4:
						formName.push("PassInput" + upperName + this.id);
						html.push(generateHTML("label", {
							"for" : formName[0],
							"innertext" : this.config.labelName[type]
									|| formEl[2],
							"endTag" : true
						}));
						html.push(generateHTML("input", {
							"id" : formName[0],
							"name" : type,
							"type" : formEl[1],
							"class" : "pv:" + type,
							"value" : "",
							"maxlength" : 4,
							"autocomplete" : "off"
						}));
						html.push(generateHTML("img", {
							"id" : "PassVerifypic" + this.id,
							"style" : "border:1px #ccc solid;",
							"src" : bdPass.s.preUrl + "?verifypic" + "&t="
									+ (new Date().getTime())
						}));
						html.push(generateHTML("a", {
							"id" : "PassVerifypicChange" + this.id,
							"href" : "#",
							"innertext" : "\u770b\u4e0d\u6e05?",
							"endTag" : true
						}));
						break;
					case 5:
						formName.push("PassInput" + upperName + this.id);
						html.push(generateHTML("label", {
							"for" : formName[0],
							"innertext" : this.config.labelName[type]
									|| formEl[2],
							"endTag" : true
						}));
						var safeHTML = [];
						safeHTML
								.push('<span id="PassSafeIpt' + this.id + '" >');
						safeHTML.push("</span>");
						safeHTML.push('<input id="PassSafeHidIpt' + this.id
								+ '" type="hidden" name="' + type + '" value="'
								+ value + '" />');
						html.push(safeHTML.join(""));
						break;
					default:
						break;
					}
					var vnoteDisplay = "none";
					if (this.config.errorSpecial[type]
							&& this.config.errorSpecial[type].length) {
						vnoteDisplay = "";
					}
					html
							.push(generateHTML(
									"span",
									{
										"class" : "pass-valid-note "
												+ (this.config.errorSpecial[type] ? "pass-note-failed"
														: ""),
										"endTag" : true,
										"innertext" : this.config.errorSpecial[type]
												|| "",
										"style" : "display:" + vnoteDisplay
												+ ";"
									}));
					var descDisplay = "none";
					if (this.type == "reg") {
						if ((this.config.noticeValue[type] && this.config.noticeValue[type].length)
								|| (formEl[3] && formEl[3].length)) {
							descDisplay = "";
						}
					}
					html
							.push(generateHTML(
									"span",
									{
										"class" : "pass-desc",
										"innertext" : (this.type == "reg") ? (this.config.noticeValue[type]
												|| formEl[3] || "")
												: "",
										"endTag" : true,
										"style" : "display:" + descDisplay
												+ ";"
									}));
					this.formVisInput = this.formVisInput.concat(formName);
					html.push("</p>");
				} else {
					html.push('<input name="' + type + '" id="Pass'
							+ type.charAt(0).toUpperCase() + type.slice(1)
							+ this.id + '" type="hidden"/>');
				}
			}
			html.push(generateHTML("span", {
				"id" : "PassHidIptItems" + this.id,
				"style" : "display:none"
			}));
			for ( var i = 0, l = this.formHidEl.length; i < l; i++) {
				html.push(generateHTML("input", {
					"type" : "hidden",
					"name" : this.formHidEl[i][0],
					"value" : this.formHidEl[i][1]
				}));
			}
			html.push("</span>");
			if (this.config.jumpUrl) {
				html.push(generateHTML("input", {
					"type" : "hidden",
					"name" : "staticpage",
					"value" : this.config.jumpUrl
				}));
			}
			if (this.config.isPhone) {
				html.push(generateHTML("input", {
					"type" : "hidden",
					"name" : "isphone",
					"value" : this.config.isPhone
				}));
			}
			html.push(generateHTML("input", {
				"type" : "hidden",
				"name" : "callback",
				"value" : templateName + id
			}));
			html.push("</div>");
			var submitHTML = '<p class="pass-submit"><button type="submit"><span>'
					+ (this.config.buttonValue || bdPass.s.templateValue[this.type][0])
					+ "</span></button>";
			if (this.type == "login") {
				submitHTML += '<a target="_blank" href="'
						+ this.targetJson.more_ext["ext1_url"]
						+ '">\u5fd8\u8bb0\u5bc6\u7801</a>';
			}
			submitHTML += "</p>";
			html.push(submitHTML);
			html.push("</fieldset>");
			html.push("</form>");
			html.push('<iframe name="PassIframe' + id
					+ '" style="display:none;"></iframe>');
			if (this.type == "reg") {
				html
						.push('<p class="pass-agree-area"><textarea readonly="true" id="PassRegAgree"></textarea></p>');
				pass.sio.get(bdPass.s.regAgreeUrl, bdPass.s.regAgreeInsert, {
					"charset" : "gb2312"
				});
			}
			html.push("</div>");
			if (this.type == "login" && this.config.renderSafeflg) {
				html
						.push('<ul id="PassSafeTrigger" class="pass-safe-trigger"><li class="selected" id="PassLoginHideSafe"><b>\u666e\u901a\u767b\u5f55</b></li><li id="PassLoginShowSafe"><b>\u5b89\u5168\u767b\u5f55</b><span>[<a target="_blank" href="http://www.baidu.com/search/passport_help.html#08">?</a>]</span></li></ul>');
			}
			return html.join("");
		},
		__initFocus : function() {
			var inputEl = pass.G("PassFormWapper" + this.id)
					.getElementsByTagName("input");
			for ( var i = 0, l = inputEl.length; i < l; i++) {
				if (inputEl[i].value === "") {
					try {
						inputEl[i].focus();
						this.orivalueCache[inputEl[i].name] = inputEl[i].value
								|| "";
						break;
					} catch (x) {
						continue;
					}
				}
			}
		},
		__bindEventListener : function() {
			var me = this;
			if (pass.G("PassVerifypicChange" + me.id)) {
				pass.G("PassVerifypicChange" + me.id).onclick = function() {
					bdPass.s.getVerifyCode("PassVerifypic" + me.id);
					return false;
				};
			}
			var ts = null;
			function setstatus() {
				if (pass.G("safeModPsp") && (pass.G("safeModPsp").Output1)) {
					clearInterval(ts);
					pass.G("safeModPsp_err")
							&& (pass.G("safeModPsp_err").style.display = "none");
					pass.G("safeModPsp").style.display = "";
					pass.G("safeModPsp").onkeydown = function(e) {
						e = window.event || e;
						var ENTER_KEY_CODE = 13;
						var keyCode = e.which ? e.which : e.keyCode;
						if (ENTER_KEY_CODE == keyCode) {
							var flg = validForm();
							if (flg) {
								pass.G("PassForm" + me.type).submit();
							}
						}
					};
				}
			}
			if (me.type == "login" && me.config.renderSafeflg) {
				if (!pass.G("safeModPsp") || !pass.G("safeModPsp").Output1) {
					ts = setInterval(setstatus, 600);
				} else {
					setstatus();
				}
				pass.G("PassLoginShowSafe").onclick = function() {
					me.__showSafeInput(me);
				};
				pass.G("PassLoginHideSafe").onclick = function() {
					me.__hideSafeInput(me);
				};
			}
			var wrapper = pass.G("PassFormWapper" + this.id);
			function validFunc(e) {
				if (!me.config.immediate) {
					return;
				}
				e = e || window.event;
				var target = e.target || e.srcElement;
				if (me.failure
						&& ((me.orivalueCache[target.name] && me.orivalueCache[target.name] == target.value) || !target.value)) {
					return;
				}
				me.__getValid(me, target, "blur");
			}
			function saveOriValue(e) {
				if (!me.failure) {
					return;
				}
				e = e || window.event;
				var target = e.target || e.srcElement;
				var name = target.name, value = target.value;
				me.orivalueCache[name] = value || "";
			}
			try {
				wrapper.addEventListener("blur", validFunc, true);
				wrapper.addEventListener("focus", saveOriValue, true);
			} catch (e) {
				wrapper.onfocusout = validFunc;
				wrapper.onfocusin = saveOriValue;
			}
			var form = pass.G("PassForm" + this.type);
			function checkSafeFlg() {
				if (pass.G("PassPassword" + me.id).style.display == "none") {
					var el = pass.G("safeModPsp");
					if (el && el.Output6) {
						pass.G("PassInputPassword" + me.id).value = el.Output6;
					}
					pass.G("PassSafeHidIpt" + me.id).value = "1";
				} else {
					pass.G("PassSafeHidIpt" + me.id).value = "0";
				}
			}
			function validForm(e) {
				e = e || window.event;
				me.valid = true;
				for ( var i = 0, l = me.formVisInput.length; i < l; i++) {
					var input = pass.G(me.formVisInput[i]);
					if (!input) {
						continue;
					}
					me.valid = !!me.__getValid(me, input, "submit") && me.valid;
				}
				me.valid = me.valid && bdPass.s.regNameValid
						&& bdPass.s.regPwdValid;
				if (me.type == "login") {
					checkSafeFlg();
				}
				if (me.valid) {
					if (pass.G("PassInputUsername" + me.id)) {
						me.oldUname = encodeURIComponent(pass
								.G("PassInputUsername" + me.id).value);
					}
					if (document.attachEvent) {
						me.charset = document.charset;
						document.charset = "gb2312";
					}
					me.config.onSubmit(me);
				}
				return me.valid;
			}
			form.onsubmit = validForm;
		},
		__getValid : function(obj, target, trigger) {
			var methods = target.className.split(" ");
			var noteArea = pass.Q("pass-valid-note", target.parentNode, "span")[0];
			var valid = true;
			var validMap = Template[obj.type + "FormValidMap"];
			if (!validMap) {
				return valid;
			}
			for ( var i = 0, l = methods.length; i < l; i++) {
				if (!validMap[methods[i]]) {
					continue;
				}
				var validMethodItems = validMap[methods[i]];
				var value = target.value;
				if (!(validMethodItems[0] instanceof Array)) {
					validMethodItems = [ validMethodItems ];
				}
				if (trigger == 'submit' && methods[i] == 'pv:username') {
					continue;
				} else {
					for ( var j = 0, k = validMethodItems.length; j < k; j++) {
						if (trigger == "submit" && validMethodItems[j][2]) {
							continue;
						}
						var validMethod = validMethodItems[j][1], text = validMethodItems[j][0];
						if (!validMethod(value, obj)) {
							noteArea.innerHTML = text;
							noteArea.style.display = "";
							pass.removeClass(noteArea,
									obj.config.passedNoteClass);
							pass.addClass(noteArea, obj.config.failedNoteClass);
							valid = false;
							break;
						} else {
							noteArea.innerHTML = "";
							noteArea.style.display = "none";
							pass.removeClass(noteArea,
									obj.config.failedNoteClass);
							pass.addClass(noteArea, obj.config.passedNoteClass);
						}
					}
				}
			}
			return valid;
		},
		__onFailure : function(json) {
			var me = this, json = json;
			me.failure = true;
			me.orivalueCache = {};
			var url = me.sourceUrl + "&t=" + (new Date().getTime());
			if (me.type == "login") {
				url += "&pspcs=utf8&username=" + me.oldUname || "";
			}
			var needFocus = false;
			if (bdPass.vm[me.type]) {
				if (bdPass.vm[me.type][+json.error]
						&& bdPass.vm[me.type][+json.error] instanceof Array) {
					pass.G("PassError" + me.id).innerHTML = "";
					pass.G("PassError" + me.id).style.display = "none";
					var error = bdPass.vm[me.type][+json.error];
					var message = error[1], pos = error[0];
					var el = "Pass" + pos.charAt(0).toUpperCase()
							+ pos.slice(1) + me.id;
					var allNoteArea = pass.Q("pass-valid-note", pass
							.G("PassFormWapper" + me.id), "span");
					for ( var i = 0, l = allNoteArea.length; i < l; i++) {
						allNoteArea[i].innerHTML = "";
						allNoteArea[i].style.display = "none";
						pass.removeClass(allNoteArea[i],
								me.config.failedNoteClass);
						pass
								.addClass(allNoteArea[i],
										me.config.passedNoteClass);
						break;
					}
					var noteArea = pass
							.Q("pass-valid-note", pass.G(el), "span")[0];
					if (!noteArea) {
						if (pass.G(el)) {
							pass.G(el).innerHTML = message;
							pass.G(el).style.display = "";
						}
					} else {
						noteArea.innerHTML = message;
						noteArea.style.display = "";
						pass.removeClass(noteArea, me.config.passedNoteClass);
						pass.addClass(noteArea, me.config.failedNoteClass);
						var ipt = pass.G(el).getElementsByTagName("input")[0];
						try {
							ipt.focus();
							me.orivalueCache[ipt.name] = ipt.value || "";
						} catch (x) {
						}
					}
				} else {
					if (bdPass.vm[me.type][+json.error]
							|| bdPass.vm[me.type][+json.error] === "") {
						pass.G("PassError" + me.id).innerHTML = bdPass.vm[me.type][+json.error];
						pass.G("PassError" + me.id).style.display = bdPass.vm[me.type][+json.error].length ? ""
								: "none";
					} else {
						pass.G("PassError" + me.id).innerHTML = bdPass.vm[me.type]["default"]
								|| "";
						pass.G("PassError" + me.id).style.display = bdPass.vm[me.type]["default"].length ? ""
								: "none";
					}
					needFocus = true;
				}
			}
			var renderCallback = function() {
				var paramForReset = me.targetJson.param_out;
				var i = 1;
				var html = [];
				while (paramForReset["param" + i + "_name"]) {
					var name = paramForReset["param" + i + "_name"];
					var value = paramForReset["param" + i + "_contex"];
					html.push(generateHTML("input", {
						"type" : "hidden",
						"name" : name,
						"value" : value
					}));
					i++;
				}
				pass.G("PassHidIptItems" + me.id).innerHTML = html.join("");
				bdPass.s.resetSth(me, needFocus);
				me.config.onFailure(me, json);
			};
			var callback = function(v) {
				if (typeof v == "string") {
					v = eval(v);
				}
				me.targetJson = v;
				if (bdPass.eh[me.type][v.error_no]) {
					var error_no = bdPass.eh[me.type][v.error_no];
					switch (error_no) {
					case "need-login":
						me.config.onNotLogin();
						return;
					case "no-token":
						me.config.onSystemError();
						return;
					case "system-error":
						me.config.onSystemError();
						break;
					}
				}
				renderCallback();
			};
			pass.sio.get(url, callback, {
				"charset" : "gb2312"
			});
		},
		__onSuccess : function(json) {
			this.config.onSuccess(this, json);
		},
		complete : function(isFailed, json) {debugger
			if (document.attachEvent && this.charset) {
				document.charset = this.charset;
			}
			(+isFailed || isFailed === "") ? this.__onFailure(json) : this
					.__onSuccess(json);
		},
		__showSafeInput : function(obj) {
			if (obj.config.renderSafeflg && !pass.G("safeModPsp")) {
				var safeHTML = [];
				safeHTML
						.push('<object id="safeModPsp" name="safeModPsp" data="data:application/x-oleobject;base64,VUKKSDYys0SPJ/oa7KqIRBAHAADYEwAA2BMAAA==" classid="clsid:E0E9F6EF-871B-42AE-89C9-CD6AF7A2E5D3" border="0" value="dddddd" width="120" height="24" codebase="https://www.baifubao.com/download/baiedit.cab#version='
								+ bdPass.s.ctrlVersion + '">');
				safeHTML.push('<param name="Mode" value="0">');
				safeHTML.push('<param name="MaxLength" value="14">');
				safeHTML.push('<param name="Input1" value="9">');
				safeHTML.push('<param name="Input2" value="">');
				safeHTML.push("</object>");
				pass.G("PassSafeIpt" + obj.id).innerHTML = safeHTML.join("");
				if (!pass.G("safeModPsp").Output1) {
					var msg = !!window.ActiveXObject ? "\u8bf7\u70b9\u51fb\u4e0b\u8f7d\u5b89\u5168\u63a7\u4ef6"
							: "\u8bf7\u4f7f\u7528IE\u6d4f\u89c8\u5668";
					pass.G("safeModPsp")
							&& (pass.G("safeModPsp").style.display = "none");
					var spa = document.createElement("span");
					spa.className = "sc-ns";
					spa.id = "safeModPsp_err";
					spa.innerHTML = '<a href="https://www.baifubao.com/download/baiedit.exe" target="_blank">'
							+ msg + "</a>";
					pass.G("PassSafeIpt" + obj.id).appendChild(spa);
				}
			}
			if (pass.G("PassSafeflg" + obj.id)) {
				pass.G("PassSafeflg" + obj.id).style.display = "";
				pass.G("PassPassword" + obj.id).style.display = "none";
				pass.G("PassInputPassword" + obj.id).value = "";
				pass.G("PassLoginHideSafe").className = "";
				pass.G("PassLoginShowSafe").className = "selected";
			}
		},
		__hideSafeInput : function(obj) {
			if (pass.G("PassSafeflg" + obj.id)) {
				pass.G("PassSafeflg" + obj.id).style.display = "none";
				pass.G("PassPassword" + obj.id).style.display = "";
				pass.G("PassInputPassword" + obj.id).value = "";
				pass.G("PassLoginShowSafe").className = "";
				pass.G("PassLoginHideSafe").className = "selected";
			}
		},
		getIptValue : function(el) {
			var id = this.id;
			el = "PassInput" + el.charAt(0).toUpperCase() + el.slice(1) + id;
			if (pass.G(el)) {
				return pass.G(el).value;
			} else {
				if (pass.G(el)) {
					return pass.G(el).Output6 || pass.G(el).value;
				}
			}
		}
	};
	var templateFactory = function(type, json, target, config) {
		if (!config.jumpUrl) {
			alert("\u7f3a\u5c11jumpUrl");
			throw new Error("No jumpUrl");
		}
		var uid = bdPass.TemplateItems["length"];
		var id = templateName + uid;
		var temp = bdPass.TemplateItems[id] = new Template(type, uid, json,
				target, config);
		bdPass.TemplateItems["length"]++;
		if (temp.renderSuccess) {
			try {
				temp.config.onAfterRender(temp);
				temp.__initFocus();
			} catch (x) {
			}
		}
		return bdPass.TemplateItems[id];
	};
	bdPass.LoginTemplate = function() {
		return {
			render : function(json, target, config) {
				return templateFactory("login", json, target, config);
			}
		};
	}();
	bdPass.RegTemplate = function() {
		return {
			render : function(json, target, config) {
				return templateFactory("reg", json, target, config);
			}
		};
	}();
	bdPass.LockmailTemplate = function() {
		return {
			render : function(json, target, config) {
				return templateFactory("lockmail", json, target, config);
			}
		};
	}();
	bdPass.LockphoneTemplate = function() {
		return {
			render : function(json, target, config) {
				return templateFactory("lockphone", json, target, config);
			}
		};
	}();
	bdPass.tips = Template.formElMap;
	bdPass.rfvm = Template.regFormValidMap;
})();