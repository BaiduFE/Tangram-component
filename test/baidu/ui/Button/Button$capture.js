module("baidu.ui.Button.Button$capture");

test("Mouse down on the button and mouse up on another div", function() {
	var div_test = te.dom[0];
	var div = document.createElement("div");
	document.body.appendChild(div);
	var options = {
		content : "按钮",
		capture : true
	};
	var button = new baidu.ui.Button(options);
	button.render(div_test.id);
	ua.mousedown(button.getBody());
	ok(button.getState()['press'], 'The press state of the button exists after mousedown');
	ua.mouseout(button.getBody());
	ua.mouseup(div);
	ok(!button.getState()['press'], 'The press state of the button dosen\'t exist after mousedown');
	te.obj.push(button);
});

test("Mouse down on the button and mouse up on another div", function() {
	var div_test = te.dom[0];
	var div = document.createElement("div");
	document.body.appendChild(div);
	var options = {
		content : "按钮",
		capture : true
	};
	var button = new baidu.ui.Button(options);
	button.render(div_test.id);
	ua.mousedown(button.getBody());
	ok(button.getState()['press'], 'The press state of the button exists after mousedown');
	ua.mouseout(button.getBody());
	$(button).mouseenter();
	ua.mouseup(div);
	ok(!button.getState()['press'], 'The press state of the button dosen\'t exist after mousedown');
	te.obj.push(button);
});

test("Test whether the events are un after disposing", function() {
	var div_test = te.dom[0];
	var ic = baidu.event._listeners.length;
	var div = document.createElement("div");
	document.body.appendChild(div);
	var options = {
		content : "按钮",
		capture : true
	};
	var button = new baidu.ui.Button(options);
	button.render(div_test.id);
	ua.mousedown(button.getBody());
	ua.mouseout(button.getBody());
	ua.mouseup(div);
	button.dispose();
	var ie = baidu.event._listeners.length;
	equals(ie, ic, 'The mouseout and mouseup event is un PUBLICGE-342');
});
