/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path: ui/Login.js
 * author:tianhua 
 * version: 1.0.0
 * date: 2011-02-24
 */
/**
 * Baidu登陆框
 * */


///import baidu.ui.Dialog;

///import baidu.dom.addClass; 
///import baidu.dom.removeClass; 
///import baidu.dom.g; 
///import baidu.dom.children;
///import baidu.object.extend;

///import baidu.sio.callByBrowser;
///import baidu.sio.callByServer;

/**
 * 应用实现 login 备注：涉及passport的API接口参数可以参见http://fe.baidu.com/doc/zhengxin/passport/openapi_help.text
 * @name baidu.ui.Login
 * @class
 * @grammar new baidu.ui.Login(options)
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
 * @config {Function}           onupdate              dialog更新内容时触发 * @config {Boolean}            closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭dialog。 * @config {String}             closeText             closeButton模块提供支持，关闭按钮上的title。
 * @config {Boolean}            modal                 modal模块支持，是否显示遮罩
 * @config {String}             modalColor            modal模块支持，遮罩的颜色
 * @config {Number}             modalOpacity          modal模块支持，遮罩的透明度
 * @config {Number}             modalZIndex           modal模块支持，遮罩的zIndex值
 * @config {Boolean}            draggable             draggable模块支持，是否支持拖拽
 * @config {Function}           ondragstart           draggable模块支持，当拖拽开始时触发
 * @config {Function}           ondrag                draggable模块支持，拖拽过程中触发
 * @config {Function}           ondragend             draggable模块支持，拖拽结束时触发
 * @config {Boolean}            [autoOpen]            是否一开始就打开，默认为true
 * @config {String}             loginURL              登陆地址,无须改动
 * @config {String}             regURL                注册地址,无须改动
 * @config {String}             loginJumpURL          登陆跳转地址,必须，为提交表单跨域使用，可前往 http://fe.baidu.com/~zhengxin/passport/jump.html  下载，或者线上 http://passport.baidu.com/jump.html 
 * @config {String}             regJumpURL            注册跳转地址,必须，为提交表单跨域使用，可前往 http://fe.baidu.com/~zhengxin/passport/jump.html  下载，或者线上http://passport.baidu.com/jump.html 
 * @config {String}             defaultStatus         弹出时初始状态(登录或注册),取值 ['login','reg'],默认为 login
 * @config {Function}           onLoginSuccess        登录成功回调 TODO 默认处理函数 json.un
 * @config {Function}           onLoginFailure        登录失败回调 TODO 默认处理函数, json.error
 * @config {Function}           onRegisterSuccess     注册成功回调函数
 * @config {Function}           onRegisterFailure     注册失败回调函数
 *
 */

baidu.ui.Login = baidu.ui.createUI(function(options){ },{superClass:baidu.ui.Dialog}).extend(
/**
 * @lends baidu.ui.Login.prototype
 */
{
    		//ui控件的类型，传入给UIBase **必须**
		uiType: 'login',
    		//ui控件的class样式前缀 可选
    		classPrefix     : "tangram-dialog",
		//titleText: '登录',
		loginURL: 'http://passport.baidu.com/api/?login&time=&token=&tpl=pp',
		loginJumpURL: window.location.href,
		/**
		 * 登录成功回调 TODO 默认处理函数 json.un
		 * @private
		 */
		onLoginSuccess: function(obj, json) {},
		/**
		 * 登录失败回调 TODO 默认处理函数, json.error
		 * @private
		 */
		onLoginFailure: function(obj, json) {},
		loginContainerId: 'loginContainer',
		loginPanelId: 'loginPanel',
		tplContainer: '\
        <div id="content" class="passport-content">\
            <div id="#{idLoginPanel}" class="passport-login-panel">\
	            <div id="#{idLoginContainer}"></div>\
	            <div id="regDiv">\
                    <hr size="0" style="border-top:1px solid #AAAAAA">\
                    <div class="reg">没有百度账号？<a href="https://passport.baidu.com/?reg&tpl=mn" target="_self">立即注册百度账号</a></div>\
                </div>\
            </div>\
        </div>\
           ' ,

    getString: function() {
       var me = this,
            html,
            title = 'title',
            titleInner = 'title-inner',
            content = 'content',
            footer = 'footer';
	me.contentText = me.contentText || baidu.string.format(me.tplContainer, {
    		idLoginContainer: me.loginContainerId,
    		idLoginPanel: me.loginPanelId
    	});

	 return baidu.format(me.tplDOM, {
            id: me.getId(),
            'class' : me.getClass(),
            title: baidu.format(
                me.tplTitle, {
                    id: me.getId(title),
                    'class' : me.getClass(title),
                    'inner-id' : me.getId(titleInner),
                    'inner-class' : me.getClass(titleInner),
                    content: me.titleText || ''
                }),
            content: baidu.format(
                me.tplContent, {
                    id: me.getId(content),
                    'class' : me.getClass(content),
                    content: me.contentText || ''
                }),
            footer: baidu.format(
                me.tplFooter, {
                    id: me.getId(footer),
                    'class' : me.getClass(footer)
            })
        });

},
    
    open: function() {
    		var me = this;
    		me.renderLogin();
    		me.dispatchEvent('onopen');

    	},
   close: function() {
    		var me = this;
    		me.loginJson = me.regJson = null;
		if (me.dispatchEvent('onbeforeclose')) {
			me.getMain().style.marginLeft = '-100000px';
			baidu.ui.Login.instances[me.guid] = 'hide';
			me.dispatchEvent('onclose');
		}

    	},
   renderLogin: function() {
    		var me = this;
    		if (me.loginJson) return;
	    	baidu.sio.callByServer(me.loginURL, function(value) {
	    		var json = me.loginJson = eval(value);
		        baidu.sio.callByBrowser(json.jslink, function(value) {
		        	baidu.ui.Dialog.prototype.open.call(me);

			        me.loginDom = bdPass.LoginTemplate.render(json, me.loginContainerId, {
					   renderSafeflg: true,
					   onSuccess: me.onLoginSuccess,
					   jumpUrl: me.loginJumpURL,
					   onFailure: me.onLoginFailure
			        });
			        me.update();
		        });
	    	});
    	},
     dispose: function() {
		 var me = this;
		 //删除实例引用
		 delete baidu.ui.Login.instances[me.guid];
		 me.dispatchEvent('dispose');
		 baidu.un(window, 'resize', me.windowResizeHandler);
		 baidu.dom.remove(me.getMain());
		 baidu.lang.Class.prototype.dispose.call(me);
	 }
});
baidu.ui.Login.instances = baidu.ui.Login.instances || {};
