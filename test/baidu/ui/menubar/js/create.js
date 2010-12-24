test('data', function() {
	var data = [ {
		content : 'm11'
	} ]
	var menu = baidu.ui.menubar.create(data);
	testingElement.obj.push(menu);
	equals(menu.data, data, 'check menu data');
});

test('target', function() {
	var data = [ {
		content : 'm11'
	} ], options = {
		target : testingElement.dom[0]
	};
	var menu = baidu.ui.menubar.create(data, options);
	testingElement.obj.push(menu);
	equals(menu.target, options.target, 'check target');
	menu.render(options.target);
	menu.update();
	ok(isShown(menu.getBody()), 'menu is shown');
})

test('width and height', function() {
	var options = {
		target : testingElement.dom[0],
		width : '100px',
		height : '100px',
		data : [ {
			content : 'm11'
		} ]
	};
	var menu = baidu.ui.menubar.create(null, options);
	testingElement.obj.push(menu);
	menu.render(options.target);
	menu.update();
	equals(menu.width, options.width, 'check width');
	equals(menu.height, options.height, 'check height');
	equals(menu.getBody().style.width, options.width, 'menu is appended');
	equals(menu.getBody().style.height, options.height, 'menu is appended');
})

test('zindex', function() {
	var options = {
		target : testingElement.dom[0],
		zIndex : 1001,
		data : [ {
			content : 'm11'
		} ]
	};
	var menu = baidu.ui.menubar.create(null, options);
	testingElement.obj.push(menu);
	equals(menu.zIndex, options.zIndex, 'check zIndex');
	menu.render(options.target), menu.update();
	equals(menu.getMain().style.zIndex, options.zIndex, 'check dom zIndex');
})

test('onitemclick', function() {
	expect(7);
	var index, options = {
		target : testingElement.dom[0],
		onitemclick : function(idx) {
			check(idx);
		},
		data : [ {
			content : 'm11'
		}, {
			content : 'm12'
		} ]
	}, check = function(e) {
		equals(index, e.index, 'index in event');
		equals(e.value, menu.items[index], 'data in event');
		ok(!isShown(menu.getItem(index)), 'hide after on item click');
	};
	var menu = baidu.ui.menubar.create(options.data, options);
	testingElement.obj.push(menu);
	menu.render(options.target);
	menu.open();

	index = '0-0';
	UserAction.click(menu.getItem(index));
	menu.open();

	index = '0-1';
	UserAction.click(menu.getItem(index));
	ok(menu.getBody().className, 'tangram-menubar tangram-menubar-empty',
			'items removed for close');
})

test('on status', function() {
	var _index = 0, handle = function(type, index) {
		return function() {
			equals(_index++, index, 'check steps');
			/* check event */
			var event = arguments.callee.arguments[0];
			equals(event.type, type, 'check type');

		}
	}, options = {
		target : testingElement.dom[0],
		oninit : handle('oninit', 0),
		onbeforeopen : handle('onbeforeopen', 1),
		onopen : handle('onopen', 2),
		onbeforeclose : handle('onbeforeclose', 3),
		onclose : handle('onclose', 4),
		data : [ {
			content : 'm11'
		}, {
			content : 'm12'
		} ]
	};
	var menu = baidu.ui.menubar.create(options.data, options);
	testingElement.obj.push(menu);
	menu.render(options.target);
	menu.open();
	menu.close(false);
})

/* TODO check show delay and hide delay, checked in hover() */
