module("baidu.ui.Login");

test("Basic test", function() {
	expect(8)
	stop();
	ua.loadcss(upath + 'css/style.css', function() {
		var options = {
			autoRender : true,
			defaultStatus : 'reg',
			regURL : upath + "/Register.php" // 打个桩,干掉跨域
		};
		var l = baidu.event._listeners.length;
		var login = new baidu.ui.Login(options);
		login.open();
		setTimeout(function(){
			ok(bdPass.TemplateItems['BPT0'], 'The callback BPT0 is created');
			ok(bdPass.TemplateItems['BPT0'].renderSuccess, "Render success");
			equals(bdPass.TemplateItems['BPT0'].config.jumpUrl, window.location.href, "The jumpUrl is defined");
			ok(bdPass.TemplateItems['BPT0'].config.onSuccess == login.onRegisterSuccess, "The success callback function is defined");
			ok(bdPass.TemplateItems['BPT0'].config.onFailure == login.onRegisterFailure, "The failure callback function is defined");
			ok(baidu.g("PassFormreg"), 'The register dialog is shown.');
			login.close();
			isShown(!login.getMain(), 'The register window is hidden');
			login.dispose();
			equals(baidu.g(login.getId()), null, "Check login element exists or not");
			equals(baidu.event._listeners.length, l, 'Events are removed');
			start();
		},100)
	}, 'tangram-dialog', 'width', '500px');
});

test("Register with right information", function() {
	stop();
	ua.loadcss(upath + 'css/style.css', function() {
		var options = {
			autoRender : true,
			defaultStatus : 'reg',
			regURL : upath + "/Register.php", // 打个桩,干掉跨域
			onRegisterSuccess : function() {
				ok(true, "Register successfully");
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
			bdPass.s.preUrlPost = upath + "registerResult.php?userName=yuanyuan_3283";
			oo.apply(this, arguments);
		};
		login.open();
		setTimeout(function(){
			ok(baidu.g("PassFormreg"), 'The register dialog is shown.');
			baidu.g('PassInputUsername1').value = "yuanyuan_3283";
			baidu.g('PassInputLoginpass1').value = "19881129";
			baidu.g('PassInputVerifypass1').value = "19881129";
			baidu.g('PassInputEmail1').value = "tianlili3283@gmail.com";
			baidu.g('PassInputVerifycode1').value = "1234";
			$('button').click();
		},100)
	}, 'tangram-dialog', 'width', '500px');
});

test("Register with wrong information", function() {
	stop();
	ua.loadcss(upath + 'css/style.css', function() {
		var options = {
			autoRender : true,
			defaultStatus : 'reg',
			regURL : upath + "/Register.php", // 打个桩,干掉跨域
			onRegisterFailure : function() {
				ok(true, "Register fail");
				login.close();
				login.dispose();
				start();
			}
		};
		var login = new baidu.ui.Login(options);
		var oo = baidu.ui.Dialog.prototype.open;
		baidu.ui.Dialog.prototype.open = function() {
			bdPass.s.preUrlPost = upath + "registerResult.php?userName=tianlili_3283";
			oo.apply(this, arguments);
		};
		login.open();
		setTimeout(function(){
			ok(baidu.g("PassFormreg"), 'The register dialog is shown.');
			baidu.g('PassInputUsername2').value = "yuanyuan_3283";
			baidu.g('PassInputLoginpass2').value = "19881129";
			baidu.g('PassInputVerifypass2').value = "19881129";
			baidu.g('PassInputEmail2').value = "tianlili3283@gmail.com";
			baidu.g('PassInputVerifycode2').value = "1234";
			$('button').click();
		},100)
	}, 'tangram-dialog', 'width', '500px');
});