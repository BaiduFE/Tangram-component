/**
 * check Button properties, methods and events
 */
module("baidu.ui.button.Button");

//getString函数被取消
/*test("getString", function() {
	var options = {
		content : "按钮"
	};
	var button = new baidu.ui.button.Button(options);
	ok(button.getString().indexOf("按钮") > 0, "button string");
});*/

test("render--no argument", function() {
	var options = {
		content : "按钮"
	};
	var button = new baidu.ui.button.Button(options);
	var div = document.createElement('div');
	document.body.appendChild(div);
	button.render(div);
	ok(isShown(button.getBody()), 'button has been shown');
	te.dom.push(button.getMain());
});

test("render--with an argument", function() {
	var div_test = te.dom[0];
	var options = {
		content : "按钮"
	};
	var button = new baidu.ui.button.Button(options);
	button.render(div_test.id);
	ok(isShown(button.getBody()), "button has been shown");
	equals(button.getMain(), div_test, "button is contained in the target");
	te.dom.push(button.getBody());
});

// 测试button在事件触发时用户定义的函数是否成功调用，并且检查样式是否正确
test("event", function() {
	var options = {
		onmouseover : function() {
			ok(true, 'on mouseover');
			equals(buttonEle.className, "tangram-button tangram-button-hover",
					"check button onmouseover style");
		},
		onmousedown : function() {
			ok(true, 'on mousedown');
			equals(buttonEle.className, "tangram-button tangram-button-hover tangram-button-press",
					"check button onmousedown style");
		},
		onmouseup : function() {
			ok(true, 'on mouseup');
			equals(buttonEle.className, "tangram-button tangram-button-hover",
					"check button onmouseup style");
		},
		onmouseout : function() {
			ok(true, 'on mouseout');
			equals(buttonEle.className, "tangram-button",
					"check button onmouseout style");
		},
		ondisable : function() {
			ok(true, 'on disable');
		},
		onenable : function() {
			ok(true, 'on enable');
		},
		onclick : function(){
			ok(true, 'on click');
		}
	};
	var button = new baidu.ui.button.Button(options);
	var div = document.createElement('div');
	document.body.appendChild(div);
	button.render(div);
	var ua = UserAction, buttonEle = button.getBody();
	ua.mouseover(button.getId());
	ua.mousedown(button.getId());
	ua.mouseup(button.getId());
	ua.click(button.getId());
	ua.mouseout(button.getId());
	button.disable();
	equals(buttonEle.className,"tangram-button tangram-button-disabled","check button ondisable style");
	button.enable();
	equals(buttonEle.className, "tangram-button","check button onenable style");
	te.dom.push(button.getMain());
});

// 设置disabled属性为true时，只有ondisable会被触发
test("disabled", function() {
	expect(1);
	var options = {
		disabled : true,
		onmouseover : function() {
			ok(false, 'on mouseover');
		},
		onmousedown : function() {
			ok(false, 'on mousedown');
		},
		onmouseup : function() {
			ok(false, 'on mouseup');
		},
		onmouseout : function() {
			ok(false, 'on mouseout');
		},
		onenable : function() {
			ok(false, 'on enable');
		}
	};
	var button = new baidu.ui.button.Button(options);
	var div = document.createElement('div');
	document.body.appendChild(div);
	button.render(div);
	var ua = UserAction, buttonEle = baidu.g(button.getId());
	ua.mouseover(button.getId());
	ua.mousedown(button.getId());
	ua.mouseup(button.getId());
	ua.mouseout(button.getId());
//	button.disable(button.getId());
	ok(true,"the button is disabled");
	te.dom.push(button.getMain());
});

test("enable", function() {
	var options = {
		disabled : true,
		onmouseover : function() {
			ok(true, 'on mouseover');
		},
		onmousedown : function() {
			ok(true, 'on mousedown');
		},
		onmouseup : function() {
			ok(true, 'on mouseup');
		},
		onmouseout : function() {
			ok(true, 'on mouseout');
		},
		ondisable : function() {
			ok(true, 'on disable');
		},
		onenable : function() {
			ok(true, 'on enable');
		}
	};
	expect(11);// 该test预期触发11个事件 1+4+1+1+4
		var button = new baidu.ui.button.Button(options);
		var div = document.createElement('div');
		document.body.appendChild(div);
		button.render(div);// 触发ondisable
		var ua = UserAction, buttonEle = baidu.g(button.getId());

		ua.mouseover(button.getId());
		ua.mousedown(button.getId());
		ua.mouseup(button.getId());
		ua.mouseout(button.getId());

		// enable后触发事件会执行用户定义的函数,onenable、onmouseover、onmousedown、onmouseup、onmouseout
		button.enable(button.getId());

		// 测试设置disabled属性为true后再enable是否使得按钮有效。
		ua.mouseover(button.getId());
		ua.mousedown(button.getId());
		ua.mouseup(button.getId());
		ua.mouseout(button.getId());

		button.disable(button.getId());
		// disable后只会触发ondisable
		ua.mouseover(button.getId());
		ua.mousedown(button.getId());
		ua.mouseup(button.getId());
		ua.mouseout(button.getId());

		button.enable(button.getId());// 会触发onenable

		// 测试disable后再enable是否使得按钮有效。会触发onmouseover、onmousedown、onmouseup、onmouseout
		ua.mouseover(button.getId());
		ua.mousedown(button.getId());
		ua.mouseup(button.getId());
		ua.mouseout(button.getId());te.dom.push(button.getMain());
	});

test("isDisabled",function() {
			var options = {
				disabled : true
			};
			var button = new baidu.ui.button.Button(options);
			var div = document.createElement('div');
			document.body.appendChild(div);
			button.render(div);
			equals(button.isDisabled(),true,
					"Check isDisabled method----after set disabled "
							+ "property to be true,button.isDisabled() should be true");

			button.enable(button.getId());
			equals(button.isDisabled(), false,
					"Check isDisabled method----after enable,"
							+ "button.isDisabled() should be false");

			button.disable(button.getId());
			equals(button.isDisabled(), true,
					"Check isDisabled method----after disable,"
							+ "button.isDisabled() should be true");
			te.dom.push(button.getMain());
		});

test("dispose",
		function() {
			var options = {};

			var button = new baidu.ui.button.Button(options);
			var div = document.createElement('div');
			document.body.appendChild(div);
			button.render(div);
			button.dispose();
			equals(baidu.g(button.getId()), null,
					"Check button element exists or not");
		});
