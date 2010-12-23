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


///import baidu.ui.dialog;
///import baidu.ui.dialog.Dialog;

///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.g;
///import baidu.dom.children;

///import baidu.object.extend;


///import baidu.sio.callByBrowser;
///import baidu.sio.callByServer;


/**
 * 
 * @param {} options
 * @return {}
 */
baidu.ui.dialog.login = function(options){
	options = options || {};
	
	options = baidu.extend({
		titleText : "登录",
		loginURL : 'http://passport.rdtest.baidu.com/api/?login&time=&token=&tpl=pp',
		regURL : 'http://passport.rdtest.baidu.com/api/?reg&time=&token=&tpl=pp',
		loginJumpURL : window.location.href,
		regJumpURL : window.location.href,
		//弹出时初始状态(登录或注册),取值 ['login','reg'],默认为 login
		initialStatus : 'login', 
		//登录成功回调 TODO 默认处理函数 json.un
		onLoginSuccess : function(obj, json){},
		//登录失败回调 TODO 默认处理函数, json.error
		onLoginFailure : function(obj, json){},
		onRegisterSuccess : function(obj,json){},
		onRegisterFailure : function(obj, json){},
		loginContainerId : 'loginContainer',
		regContainerId : 'regContainer',
		loginPanelId : 'loginPanel',
		regPanelId : 'regPanel',
		tabId : 'navTab',
		currentTabClass : 'act',
		tplContainer : '\
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
	
	options.changeTab = options.changeTab || function(type){
		var panelIds = [options.loginPanelId, options.regPanelId],
			tabs = baidu.dom.children(options.tabId),
			className = options.currentTabClass,
			curIndex = type == 'login' ? 0 : 1;
		for(var i=0; i < panelIds.length; ++i){
			baidu.dom.removeClass(tabs[i], className);
			baidu.g(panelIds[i]).style.display = 'none';
		}
		baidu.dom.addClass(tabs[curIndex],className);
		baidu.g(panelIds[curIndex]).style.display = '';
		(type == 'reg')?
			this.renderReg()
		:
			this.renderLogin()
	};
	
	
    var dialogInstance = new baidu.ui.dialog.Dialog(options);
    
    
    dialogInstance.render();
    
    dialogInstance.update({
    	contentText : options.contentText || baidu.string.format(options.tplContainer, {
    		clickTabLogin : dialogInstance.getCallRef() + ".changeTab('login')",
    		clickTabReg : dialogInstance.getCallRef() + ".changeTab('reg')",
    		idLoginContainer : options.loginContainerId ,
    		idRegContainer : options.regContainerId,
    		idLoginPanel : options.loginPanelId ,
    		idRegPanel : options.regPanelId,
    		tabId : options.tabId,
    		currentTabClass : options.currentTabClass
    	})
    });
    
    baidu.extend(dialogInstance, {
    	open : function(){
    		var me = this;
    		(me.initialStatus == "login")?
	    		me.renderLogin()
    		:
    			me.changeTab('reg');
    		me.dispatchEvent('onopen');
    		//baidu.ui.dialog.Dialog.prototype.open.call(me);
    		
    	},
    	close : function(){
    		var me = this;
    		me.loginJson = me.regJson = null;
    		baidu.ui.dialog.Dialog.prototype.close.call(me);
    	},
    	renderLogin : function(){
    		var me = this;
    		if(me.loginJson) return;
	    	baidu.sio.callByServer(me.loginURL, function(value){
	    		var json = me.loginJson = eval(value);
		        baidu.sio.callByBrowser(json.jslink, function(value){
		        	baidu.ui.dialog.Dialog.prototype.open.call(me);
		        	
			        dialogInstance.loginDom = bdPass.LoginTemplate.render(json , options.loginContainerId/*dialogInstance.getContent()*/ , {
					   renderSafeflg	: true,
					   onSuccess		: options.onLoginSuccess,
					   jumpUrl			: options.loginJumpURL,
					   onFailure		: options.onLoginFailure 
			        });
			        dialogInstance.update();
		        });
	    	});
    	},
    	
    	renderReg : function(){
    		var me = this;
    		if(me.regJson) return;
	    	baidu.sio.callByServer(me.regURL, function(value){
	    		var json = me.regJson = eval(value);
		        baidu.sio.callByBrowser(json.jslink, function(value){
		        	baidu.ui.dialog.Dialog.prototype.open.call(me);
		        	
			        dialogInstance.registerDom =  bdPass.RegTemplate.render(json , options.regContainerId , {
					   renderSafeflg	: true,
					   onSuccess		: options.onRegisterSuccess,
					   jumpUrl			: options.regJumpURL,
					   onFailure		: options.onRegisterFailure 
			        });
			        dialogInstance.update();
		        });
	    	});
    	}
    });
    
    return dialogInstance;
};
