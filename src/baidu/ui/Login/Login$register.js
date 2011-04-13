/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 */


///import baidu.ui.Dialog;
///import baidu.ui.Login;
///import baidu.dom.insertHTML;

///import baidu.ui.Button;
///import baidu.event.stopPropagation;
/**
 * 应用实现 tab:login&&register 备注：涉及passport的API接口参数可以参见http://fe.baidu.com/doc/zhengxin/passport/openapi_help.text
 * @function
 * @config {String}             regURL                注册地址,无须改动
 * @config {String}             regJumpURL            注册跳转地址,必须，为提交表单跨域使用，可前往 http://fe.baidu.com/~zhengxin/passport/jump.html  下载，或者线上
 * @config {Function}           onRegisterSuccess     注册成功回调函数
 * @config {Function}           onRegisterFailure     注册失败回调函数
 * @config {String}             defaultStatus         弹出时初始状态(登录或注册),取值 ['login','reg'],默认为 login
 */ 
baidu.extend(baidu.ui.Login.prototype,{

     regPanelId: 'regPanel',
     regContainerId: 'regContainer',
     //弹出时初始状态(登录或注册),取值 ['login','reg'],默认为 login
     defaultStatus: 'login',
     tabId: 'navTab',
     currentTabClass: 'act',
     registerText: "",
     register: true,
     regURL: 'http://passport.baidu.com/api/?reg&time=&token=&tpl=pp',
     regJumpURL: window.location.href,
     tplContainer : '\
		<div id="nav" class="passport-nav">\
			<ul id="#{tabId}" class="passport-nav-tab">\
				<li class="#{currentTabClass}" ><a href="##{idLoginPanel}" onclick="#{clickTabLogin};return false;" hidefocus="true" >登录</a></li>\
				<li><a href="##{idRegPanel}" onclick="#{clickTabReg};return false;" hidefocus="true" >注册</a></li>\
			</ul>\
			 <p class="clear"></p>\
		</div>\
	 	<div id="content" class="passport-content">\
			<div id="#{idLoginPanel}" class="passport-login-panel">\
				<div id="#{idLoginContainer}"></div>\
				<div id="regDiv">\
					<hr size="0" style="border-top:1px solid #AAAAAA">\
					<div class="reg">没有百度账号？<a href="##{idRegPanel}" onclick="#{clickTabReg};return false;">立即注册百度账号</a></div>\
				</div>\
			</div>\
		<div id="#{idRegPanel}" class="passport-reg-panel" style="display:none">\
			<div id="#{idRegContainer}" class="passport-reg-container"></div>\
		</div>\
		</div>'  ,

		onRegisterSuccess: function(obj,json) {}, onRegisterFailure: function(obj, json) {},
getString: function() {
       var me = this,
            html,
            title = 'title',
            titleInner = 'title-inner',
            content = 'content',
            footer = 'footer';
	me.contentText = me.contentText || baidu.string.format(me.tplContainer, {
    		clickTabLogin: me.getCallRef() + ".changeTab('login')",
    		clickTabReg: me.getCallRef() + ".changeTab('reg')",
    		idLoginContainer: me.loginContainerId,
    		idRegContainer: me.regContainerId,
    		idLoginPanel: me.loginPanelId,
    		idRegPanel: me.regPanelId,
    		tabId: me.tabId,
    		currentTabClass: me.currentTabClass
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
    		(me.defaultStatus == 'login') ?  me.renderLogin() : me.changeTab('reg');
    		 //me.renderLogin();
    		me.dispatchEvent('onopen');

    	},

     changeTab: function(type) {
        	var me = this,
		 panelIds = [me.loginPanelId, me.regPanelId],
			tabs = baidu.dom.children(me.tabId),
	         className = me.currentTabClass,
			curIndex = (type == 'login') ? 0 : 1;
		for (var i = 0; i < panelIds.length; ++i) {
			baidu.dom.removeClass(tabs[i], className); baidu.g(panelIds[i]).style.display = 'none';
		}
		baidu.dom.addClass(tabs[curIndex], className);
		baidu.g(panelIds[curIndex]).style.display = ''; 
		(type == 'reg') ?  me.renderReg() : me.renderLogin();
	},
renderReg: function() {
    		var me = this;
    		if (me.regJson) return;
	    	baidu.sio.callByServer(me.regURL, function(value) {
	    		var json = me.regJson = eval(value);
		        baidu.sio.callByBrowser(json.jslink, function(value) {
		        	baidu.ui.Dialog.prototype.open.call(me);

			        me.registerDom = bdPass.RegTemplate.render(json, me.regContainerId, {
					   renderSafeflg: true,
					   onSuccess: me.onRegisterSuccess,
					   jumpUrl: me.regJumpURL,
					   onFailure: me.onRegisterFailure
			        });
			        me.update();
		        });
	    	});
    	}

});


