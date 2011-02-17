/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/dialog/login.js
 * author: berg
 * version: 1.0.0
 * date: 2010-05-18
 */



/**
 * Baidu登陆框
 *
 */


///import baidu.ui.Dialog;

///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.g;
///import baidu.dom.children;

///import baidu.object.extend;


///import baidu.sio.callByBrowser;
///import baidu.sio.callByServer;


/**
 * 应用实现 login
 * @function
 * @param  {String|DOMElement}  content               内容或者内容对应的元素
 * @param  {Object}             [options]             选项参数
 * @config {DOMElement}         content               要放到dialog中的元素，如果传此参数时同时传contentText，则忽略contentText。
 * @config {String}             contentText           dialog中的内容
 * @config {String|Number}      width                 内容区域的宽度，注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
 * @config {String|Number}      height                内容区域的高度
 * @config {String|Number}      top                   dialog距离页面上方的距离
 * @config {String|Number}      left                  dialog距离页面左方的距离
 * @config {String}             titleText             dialog标题文字
 * @config {String}             classPrefix           dialog样式的前缀
 * @config {Number}             zIndex                dialog的zIndex值
 * @config {Function}           onopen                dialog打开时触发
 * @config {Function}           onclose               dialog关闭时触发
 * @config {Function}           onbeforeclose         dialog关闭前触发，如果此函数返回false，则组织dialog关闭。
 * @config {Function}           onupdate              dialog更新内容时触发
 * @config {Boolean}            closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭dialog。
 * @config {String}             closeText             closeButton模块提供支持，关闭按钮上的title。
 * @config {Boolean}            modal                 modal模块支持，是否显示遮罩
 * @config {String}             modalColor            modal模块支持，遮罩的颜色
 * @config {Number}             modalOpacity          modal模块支持，遮罩的透明度
 * @config {Number}             modalZIndex           modal模块支持，遮罩的zIndex值
 * @config {Boolean}            draggable             draggable模块支持，是否支持拖拽
 * @config {Function}           ondragstart           draggable模块支持，当拖拽开始时触发
 * @config {Function}           ondrag                draggable模块支持，拖拽过程中触发
 * @config {Function}           ondragend             draggable模块支持，拖拽结束时触发
 * @config {Boolean}            [autoOpen]            是否一开始就打开，默认为true
 * @config {String}             loginURL              登陆地址
 * @config {String}             regURL                注册地址
 * @config {String}             loginJumpURL          登陆跳转地址
 * @config {String}             regJumpURL            注册跳转地址
 * @config {String}             initialStatus         弹出时初始状态(登录或注册),取值 ['login','reg'],默认为 login
 * @config {Function}           onLoginSuccess        登录成功回调 TODO 默认处理函数 json.un
 * @config {Function}           onLoginFailure        登录失败回调 TODO 默认处理函数, json.error
 * @config {Function}           onRegisterSuccess     注册成功回调函数
 * @config {Function}           onRegisterFailure     注册失败回调函数
 *
 */
baidu.ui.login = function(options) {
	options = options || {};

	options = baidu.extend({
		titleText: '登录',
		loginURL: 'http://passport.rdtest.baidu.com/api/?login&time=&token=&tpl=pp',
		regURL: 'http://passport.rdtest.baidu.com/api/?reg&time=&token=&tpl=pp',
		loginJumpURL: window.location.href,
		regJumpURL: window.location.href,
		//弹出时初始状态(登录或注册),取值 ['login','reg'],默认为 login
		initialStatus: 'login',
		//登录成功回调 TODO 默认处理函数 json.un
		onLoginSuccess: function(obj, json) {},
		//登录失败回调 TODO 默认处理函数, json.error
		onLoginFailure: function(obj, json) {},
		onRegisterSuccess: function(obj,json) {},
		onRegisterFailure: function(obj, json) {},
		loginContainerId: 'loginContainer',
		regContainerId: 'regContainer',
		loginPanelId: 'loginPanel',
		regPanelId: 'regPanel',
		tabId: 'navTab',
		currentTabClass: 'act',
		tplContainer: '\
		<div id="nav" class="passport-nav">\
            <ul id="#{tabId}" class="passport-nav-tab">\
                <li class="#{currentTabClass}" ><a href="##{idLoginPanel}" onclick="#{clickTabLogin};return false;" hidefocus="true" >登录</a></li>\
                <li><a href="##{idRegPanel}" onclick="#{clickTabReg};return false;" hidefocus="true" >注册</a></li>\
            </ul>\
\
            <p class="clear"></p>\
        </div>\
        <div id="content" class="passport-content">\
            <div id="#{idLoginPanel}" class="passport-login-panel">\
	            <div id="#{idLoginContainer}"></div>\
	            <div id="regDiv">\
                    <hr size="0" style="border-top:1px solid #AAAAAA">\
                    <div class="reg">没有百度账号？<a href="##{idRegPanel}" onclick="#{clickTabReg};return false;">立即注册百度账号</a></div>\
\
                </div>\
            </div>\
            <div id="#{idRegPanel}" class="passport-reg-panel" style="display:none">\
                <div id="#{idRegContainer}" class="passport-reg-container"></div>\
            </div>\
        </div>\
'
	},options);

	options.changeTab = options.changeTab || function(type) {
		var panelIds = [options.loginPanelId, options.regPanelId],
			tabs = baidu.dom.children(options.tabId),
			className = options.currentTabClass,
			curIndex = type == 'login' ? 0 : 1;
		for (var i = 0; i < panelIds.length; ++i) {
			baidu.dom.removeClass(tabs[i], className);
			baidu.g(panelIds[i]).style.display = 'none';
		}
		baidu.dom.addClass(tabs[curIndex], className);
		baidu.g(panelIds[curIndex]).style.display = '';
		(type == 'reg') ?
			this.renderReg()
		:
			this.renderLogin();
	};


    var dialogInstance = new baidu.ui.Dialog(options);


    dialogInstance.render();

    dialogInstance.update({
    	contentText: options.contentText || baidu.string.format(options.tplContainer, {
    		clickTabLogin: dialogInstance.getCallRef() + ".changeTab('login')",
    		clickTabReg: dialogInstance.getCallRef() + ".changeTab('reg')",
    		idLoginContainer: options.loginContainerId,
    		idRegContainer: options.regContainerId,
    		idLoginPanel: options.loginPanelId,
    		idRegPanel: options.regPanelId,
    		tabId: options.tabId,
    		currentTabClass: options.currentTabClass
    	})
    });

    baidu.extend(dialogInstance, {
    	open: function() {
    		var me = this;
    		(me.initialStatus == 'login') ?
	    		me.renderLogin()
    		:
    			me.changeTab('reg');
    		me.dispatchEvent('onopen');
    		//baidu.ui.dialog.Dialog.prototype.open.call(me);

    	},
    	close: function() {
    		var me = this;
    		me.loginJson = me.regJson = null;
    		baidu.ui.Dialog.prototype.close.call(me);
    	},
    	renderLogin: function() {
    		var me = this;
    		if (me.loginJson) return;
	    	baidu.sio.callByServer(me.loginURL, function(value) {
	    		var json = me.loginJson = eval(value);
		        baidu.sio.callByBrowser(json.jslink, function(value) {
		        	baidu.ui.Dialog.prototype.open.call(me);

			        dialogInstance.loginDom = bdPass.LoginTemplate.render(json, options.loginContainerId/*dialogInstance.getContent()*/, {
					   renderSafeflg: true,
					   onSuccess: options.onLoginSuccess,
					   jumpUrl: options.loginJumpURL,
					   onFailure: options.onLoginFailure
			        });
			        dialogInstance.update();
		        });
	    	});
    	},

    	renderReg: function() {
    		var me = this;
    		if (me.regJson) return;
	    	baidu.sio.callByServer(me.regURL, function(value) {
	    		var json = me.regJson = eval(value);
		        baidu.sio.callByBrowser(json.jslink, function(value) {
		        	baidu.ui.Dialog.prototype.open.call(me);

			        dialogInstance.registerDom = bdPass.RegTemplate.render(json, options.regContainerId, {
					   renderSafeflg: true,
					   onSuccess: options.onRegisterSuccess,
					   jumpUrl: options.regJumpURL,
					   onFailure: options.onRegisterFailure
			        });
			        dialogInstance.update();
		        });
	    	});
    	}
    });

    return dialogInstance;
};
