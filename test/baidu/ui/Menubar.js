module('baidu.ui.Menubar');
ua.importsrc("baidu.dom.getStyle");

(function() {
	function mySetup() {
		var div = document.createElement('div');
		div.id = 'div_test';
		document.body.appendChild(div);
		var m = document.createElement('ul');
		m.className = 'menu';
		div.appendChild(m);
		var m1 = document.createElement('li');
		m1.id = 'm1';
		m1.innerHTML = 'm1';
		m.appendChild(m1);
		testingElement.dom.push(m1);
		testingElement.dom.push(m);
		testingElement.dom.push(div);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);
		mySetup();
	};
})();

/**
 * dispose after update
 */
test('dispose',
		function() {
			var options = {
				data : [ {
					content : 'm11'
				} ],
				target : testingElement.dom[0]
			};
			var menu = new baidu.ui.Menubar(options);
			equals(menu.uiType, 'menubar', 'check type');
			testingElement.obj.push(menu);
			menu.render(menu.target);
			equals(document.body.lastChild, menu.getMain(),
					'dom shown after render');
			menu.dispose();
			equals(document.body.lastChild.id, 'div_test',
					'dom removed after dispose');
		});

/**
 * <li> check item
 * <li> check item on click
 * <li> check item on hover
 * <li> check item on mouse out
 * <li> check item event
 */
test('getItem and item event', function() {
	var _step = 0, handle = function(type, step, callback) {
		return function(event) {
			/* check event */
			equals(event.type, type, 'check event type');
			equals(event.index, '0-0', 'check event index');
			ok(event.target === menu, 'check event target');
			equals(event.value.content, options.data[0].content,
					'check event value');
			callback();
			equals(_step++, step, 'check event step');
		};
	}, item, options = {
		data : [ {
			content : 'm11'
		} ],
		target : testingElement.dom[0],
		onitemmouseover : handle('onitemmouseover', 0, function() {
			/* check item class */
			equals(item.className,
					'tangram-menubar-item tangram-menubar-item-hover',
					'item class changed after mouse over');
		}),
		onitemmouseout : handle('onitemmouseout', 1, function() {
			/* check item class */
			equals(item.className, 'tangram-menubar-item',
					'item class changed after mouse out');
		}),
		onitemclick : handle('onitemclick', 1, function() {
			/* check item disposed */
			ok(!isShown(menu.getBody()), 'item hide after click');
			// ok(menu.getBody().className.match('tangram-menubar-empty')&&!menu.getBody().className.match('tangram-menubar-open'),'class
			// empty is add and class open is remove ');
		})
	};
	var menu = new baidu.ui.Menubar(options);
	testingElement.obj.push(menu);
	menu.render(menu.target);
	menu.update();
	item = menu.getItem('0-0');
	equals($(item).text(), menu.items['0-0'].content, 'get content');
	// ok(/itemClick\(\'0-0\'\)/.test(item.onclick), 'check item click');
	// ok(/itemMouseOver\(\'0-0\'\)/.test(item.parentNode.onmouseover), 'check
	// item on hover');
	// ok(/itemMouseOut\(\'0-0\'\)/.test(item.parentNode.onmouseout), 'check
	// item on mouse out');
	menu.open();
	item = menu.getItem('0-0');
	// UserAction.mouseover(item);
	// UserAction.mouseout(item);
	UserAction.click(item);
});

/**
 * TODO 需要考虑所有参数类型的有效性，目前通过create校验
 * <li> target
 */
test('update', function() {
	var m1 = testingElement.dom[0], options = {
		data : [ {
			content : 'm11'
		} ],
		target : m1,
		zIndex : 1000
	};
	var menu = new baidu.ui.Menubar(options);
	testingElement.obj.push(menu);
	menu.render(m1);
	equals(menu.zIndex, 1000, 'zindex before update');
	menu.update({
		zIndex : 1001
	});
	equals(menu.zIndex, 1001, 'zindex after update');
});

test('data', function() {
	var data = [ {
		content : 'm11'
	} ], options = {
		data : data,
		autoRender : true
	};
	var menu = baidu.ui.create(baidu.ui.Menubar, options);
	testingElement.obj.push(menu);
	equals(menu.data, data, 'check menu data');
});

test('target', function() {
	var data = [ {
		content : 'm11'
	} ], options = {
		element : testingElement.dom[0],
		data : data,
		autoRender : true
	};
	var menu = baidu.ui.create(baidu.ui.Menubar, options);
	testingElement.obj.push(menu);
	equals(menu.target, options.target, 'check target');
	menu.render(options.target);
	menu.update();
	ok(isShown(menu.getBody()), 'menu is shown');
});

test('width and height', function() {
	var options = {
		element : testingElement.dom[0],
		width : '100px',
		height : '100px',
		autoRender : true,
		data : [ {
			content : 'm11'
		} ]
	};
	var menu = baidu.ui.create(baidu.ui.Menubar, options);
	testingElement.obj.push(menu);
	menu.render(options.target);
	menu.update();
	equals(menu.width, options.width, 'check width');
	equals(menu.height, options.height, 'check height');
	equals(menu.getBody().style.width, options.width, 'menu is appended');
	equals(menu.getBody().style.height, options.height, 'menu is appended');
});

test('zindex', function() {
	var options = {
		element : testingElement.dom[0],
		zIndex : 1001,
		autoRender : true,
		data : [ {
			content : 'm11'
		} ]
	};
	var menu = baidu.ui.create(baidu.ui.Menubar, options);
	testingElement.obj.push(menu);
	equals(menu.zIndex, options.zIndex, 'check zIndex');
	menu.render(options.target), menu.update();
	equals(menu.getMain().style.zIndex, options.zIndex, 'check dom zIndex');
});

test('onitemclick', function() {
	expect(7);
	var index, options = {
		element : testingElement.dom[0],
		onitemclick : function(idx) {
			check(idx);
		},
		autoRender : true,
		data : [ {
			content : 'm11'
		}, {
			content : 'm12'
		} ]
	}, check = function(e) {
		equals(index, e.index, 'index in event');
		equals(e.value, menu.items[index], 'data in event');
		ok(!isShown(menu.getItem(index)), 'hide after on item click');
		// ok(menu.getBody().className.match('tangram-menubar-empty')
		// && !menu.getBody().className.match('tangram-menubar-open'),
		// 'hide after on item click');
	};
	var menu = baidu.ui.create(baidu.ui.Menubar, options);
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
});

test('on status', function() {
	var _index = 0, handle = function(type, index) {
		return function() {
			equals(_index++, index, 'check steps');
			/* check event */
			var event = arguments.callee.arguments[0];
			equals(event.type, type, 'check type');

		};
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
	var menu = new baidu.ui.Menubar(options);
	testingElement.obj.push(menu);
	menu.render(options.target);
	menu.open();
	menu.close(false);
});