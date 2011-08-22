/**
 * check Input properties, methods and events
 */
module("baidu.ui.Input");

(function() {
	function mySetup() {
		var div_test = document.createElement("div");
		div_test.id = "div_test";
		document.body.appendChild(div_test);
		testingElement.dom.push(div_test);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);;
		mySetup();
	};
})();

test("getString", function() {
	var options = {
		text : "input文本框"
	};
	var input = new baidu.ui.Input(options);
	// 测试input.getString是否为空，且options有效。
		ok(input.getString().match("input文本框"), "input string");
		te.dom.push(input.getMain());
	});

test("render--no argument", function() {
	var options = {
		text : "input文本框"
	};
	var input = new baidu.ui.Input(options);
	input.render();
	inputId = document.getElementById("tangramINPUT" + input.guid);
	// 测试input是否显示出来(不显示为正确，render时不允许没有参数target)
		ok(!isShown(inputId), 'Render without argument will be wrong');
		te.dom.push(input.getMain());
	});

test("render--with an argument", function() {
	var options = {
		text : "input文本框"
	};
	var input = new baidu.ui.Input(options);
	input.render(((te.dom[0])).id);
	inputId = document.getElementById("tangramINPUT" + input.guid);
	// 测试button是否显示出来
		ok(isShown(input.getBody()), "input has been shown");
		ok(input.getMain(), te.dom[0], "input is contained in the target");
		te.dom.push(input.getMain());
	});

// 测试input在事件触发时用户定义的函数是否成功调用，并且检查样式是否正确
test("event", function() {
	var options = {
		onfocus : function(evt) {
		    
			ok(true, 'on focus');
			equals(inputEle.className, "tangram-input tangram-input-focus",
					"check input onfocus style");
			equals(evt.DOMEvent.type, 'focus', 'check input event');
		},
		onblur : function(evt) {
			ok(true, 'on blur');
			equals(inputEle.className, "tangram-input",
					"check input onblur style");
			equals(evt.DOMEvent.type, 'blur', 'check input event');
		},
		onchange : function(evt) {
			ok(true, 'on change');
			equals(inputEle.className, "tangram-input",
					"check input onchange style");
			equals(evt.DOMEvent.type, 'change', 'check input event');
		},
		onkeydown : function(evt) {
			ok(true, 'on keydown');
			equals(inputEle.className, "tangram-input tangram-input-focus",
					"check input onkeydown style");
			equals(evt.DOMEvent.type, 'keydown', 'check input event');
		},
		onkeyup : function(evt) {
			ok(true, 'on keyup');
			equals(inputEle.innerHTML, '', 'on up, input value changed');
			equals(inputEle.className, "tangram-input tangram-input-focus",
					"check input onkeyup style");
			equals(evt.DOMEvent.type, 'keyup', 'check input event');
		},
		onmouseover : function(evt) {
			ok(true, 'on mouseover');
			equals(inputEle.className, "tangram-input tangram-input-hover",
					"check input onmouseover style");
			equals(evt.DOMEvent.type, 'mouseover', 'check input event');
		},
		onmouseout : function(evt) {
			ok(true, 'on mouseout');
			equals(inputEle.className, "tangram-input",
					"check input onmouseout style");
			equals(evt.DOMEvent.type, 'mouseout', 'check input event');
		},
		onenable : function() {
			ok(true, 'on enable');
			equals(inputEle.className, "tangram-input",
					"check input onenable style");
		},
		ondisable : function() {
			ok(true, 'on disable');
			equals(inputEle.className, "tangram-input tangram-input-disable",
					"check input ondisable style");
		}
	};
	var input = new baidu.ui.Input(options);
	input.render((te.dom[0]).id);
	var ua = UserAction, inputEle = input.getBody();

	ua.keydown(input.getId(), {
		keyCode : 90
	});
	ua.keyup(input.getId(), {
		keyCode : 90
	});
	ua.mouseover(input.getId());
	ua.mouseout(input.getId());

	input.disable();
	input.enable();
    
    TT.event.fire(input.getBody(), 'focus');
    TT.event.fire(input.getBody(), 'blur');

	input.getBody().value = 'blah blah blah';
	te.dom.push(input.getMain());
});

// 设置disabled属性为true时，只有ondisable会被触发
test("disabled", function() {
	var options = {
		disabled : true,
		onfocus : function() {
			ok(false, 'on focus');
		},
		onblur : function() {
			ok(false, 'on blur');
		},
		onchange : function() {
			ok(false, 'on change');
		},
		onkeydown : function() {
			ok(false, 'on keydown');
		},
		onkeyup : function() {
			ok(false, 'on keyup');
		},
		onmouseover : function() {
			ok(false, 'on mouseover');
		},
		onmouseout : function() {
			ok(false, 'on mouseout');
		},
		onenable : function() {
			ok(false, 'on enable');
		},
		ondisable : function() {
			ok(true, 'on disable');
		}
	};
	var input = new baidu.ui.Input(options);
	input.render((te.dom[0]).id);
	var ua = UserAction, inputEle = input.getBody();

	ua.keydown(input.getId());
	ua.keyup(input.getId());
	ua.mouseover(input.getId());
	ua.mouseout(input.getId());

	input.disable();
	te.dom.push(input.getMain());
});

test("enable", function() {
	var options = {
		disabled : true,
		onfocus : function() {
			ok(true, 'on focus');
		},
		onblur : function() {
			ok(true, 'on blur');
		},
		onchange : function() {
			ok(true, 'on change');
		},
		onkeydown : function() {
			ok(true, 'on keydown');
		},
		onkeyup : function() {
			ok(true, 'on keyup');
		},
		onmouseover : function() {
			ok(true, 'on mouseover');
		},
		onmouseout : function() {
			ok(true, 'on mouseout');
		},
		onenable : function() {
			ok(true, 'on enable');
		},
		ondisable : function() {
			ok(true, 'on disable');
		}
	};
	expect(11);// 该test预期触发12个事件
		var input = new baidu.ui.Input(options);
		input.render("div_test");// 会触发ondisable
		var ua = UserAction, inputEle = baidu.g(input.getId());

		ua.keydown(input.getId());
		ua.keyup(input.getId());
		ua.mouseover(input.getId());
		ua.mouseout(input.getId());

		// enable后触发事件会执行用户定义的函数,onenable等
		input.enable();

		// 测试设置disabled属性为true后再enable是否使得input有效。
		ua.keydown(input.getId());
		ua.keyup(input.getId());
		ua.mouseover(input.getId());
		ua.mouseout(input.getId());

		input.disable();
		// disable后只会触发ondisable
		ua.keydown(input.getId());
		ua.keyup(input.getId());
		ua.mouseover(input.getId());
		ua.mouseout(input.getId());

		input.enable();// 会触发onenable

		// 测试disable后再enable是否使得按钮有效。
		ua.keydown(input.getId());
		ua.keyup(input.getId());
		ua.mouseover(input.getId());
		ua.mouseout(input.getId());
	});

test(
		"isDisabled",
		function() {
			var options = {
				disabled : true
			};
			var input = new baidu.ui.Input(options);
			input.render("div_test");
			equals(
					input.isDisabled(),
					true,
					"Check isDisabled method----after set disabled property to be true,input.isDisabled() should be true");

			input.enable();
			equals(input.isDisabled(), false,
					"Check isDisabled method----after enable,input.isDisabled() should be false");

			input.disable();
			equals(input.isDisabled(), true,
					"Check isDisabled method----after disable,input.isDisabled() should be true");
		});

test("dispose", function() {
	var options = {};

	var input = new baidu.ui.Input(options);
	input.render("div_test");
	input.dispose();
	equals(baidu.g(input.getId()), null, "Check input element exists or not");
})
