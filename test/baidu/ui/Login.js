module("baidu.ui.Login");

test("Basic test", function() {
	expect(8)
	stop();
	ua.loadcss(upath + 'Login/css/style.css', function() {
		var options = {
			autoRender : true,
			titleText : "登录窗口"
		};
		var l = baidu.event._listeners.length;
		var login = new baidu.ui.Login(options);
		login.open();
		setTimeout(function(){
			ok(bdPass.TemplateItems['BPT0'], 'The callback BPT0 is created');
			ok(bdPass.TemplateItems['BPT0'].renderSuccess, "Render success");
			equals(bdPass.TemplateItems['BPT0'].config.jumpUrl, window.location.href, "The jumpUrl is defined");
			ok(bdPass.TemplateItems['BPT0'].config.onSuccess == login.onLoginSuccess, "The success callback function is defined");
			ok(bdPass.TemplateItems['BPT0'].config.onFailure == login.onLoginFailure, "The failure callback function is defined");
			ok(baidu.g("PassFormlogin"), 'The login dialog is shown.');
			login.close();
			isShown(!login.getMain(), 'The login window is hidden');
			login.dispose();
			equals(baidu.g(login.getId()), null, "Check login element exists or not");
			equals(baidu.event._listeners.length, l, 'Events are removed');
			start();
		},100)
	}, 'tangram-dialog', 'width', '500px');
});

test("Login with right username and password", function() {
	stop();
	ua.loadcss(upath + 'Login/css/style.css', function() {
		var options = {
			autoRender : true,
			titleText : "登录窗口",
			loginURL : upath + "Login/login.php", // 打个桩,干掉跨域
			onLoginSuccess : function() {
				ok(true, "Login successfully");
				login.close();
				login.dispose();
				baidu.ui.Dialog.prototype.open = function() {
					oo.apply(this, arguments);
				};
				start();
			}
		};
		var login = new baidu.ui.Login(options);
		var oo = baidu.ui.Dialog.prototype.open;
		baidu.ui.Dialog.prototype.open = function() {
			bdPass.s.preUrlPost = upath + "Login/loginResult.php?userName=tianlili_3283&passWord=19881129";
			oo.apply(this, arguments);
		};
		login.open();
		setTimeout(function(){
			ok(baidu.g("PassFormlogin"), 'The login dialog is shown.');
			baidu.g('PassInputUsername1').value = "tianlili_3283";
			baidu.g('PassInputPassword1').value = "19881129";
			$('button').click();
		},100)
	}, 'tangram-dialog', 'width', '500px');
});

test("Login with wrong username and password", function() {
	stop();
	ua.loadcss(upath + 'Login/css/style.css', function() {
		var options = {
			autoRender : true,
			titleText : "登录窗口",
			loginURL : upath + "Login/login.php", // 打个桩,干掉跨域
			onLoginFailure : function() {
				ok(true, "Login fail");
				login.close();
				login.dispose();
				start();
			}
		};
		var login = new baidu.ui.Login(options);
		var oo = baidu.ui.Dialog.prototype.open;
		baidu.ui.Dialog.prototype.open = function() {
			bdPass.s.preUrlPost = upath + "Login/loginResult.php?userName=tianlili&passWord=19881129";
			oo.apply(this, arguments);
		};
		login.open();
		setTimeout(function(){
			ok(baidu.g("PassFormlogin"), 'The login dialog is shown.');
			baidu.g('PassInputUsername2').value = "tianlili";
			baidu.g('PassInputPassword2').value = "19881129";
			$('button').click();
		},100)
	}, 'tangram-dialog', 'width', '500px');
});