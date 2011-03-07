module('baidu.ui.behavior.statable');
/**
 * Need create need time to load create.js
 * <li>setState
 * <li>getState
 * <li>addState
 * <li>removeState
 * <li>enable
 * <li>disable
 */

test('set/get state', function() {
	stop();
	expect(4);
	UserAction.importsrc('baidu.ui.createUI,baidu.dom.insertHTML,'
			+ 'baidu.ui.button.Button', function() {
		var ui = new baidu.ui.button.Button();
		$(te.dom[0]).css('width', 40).css('height', 40).css('background-color',
				'red');
		ui.render(te.dom[0]);
		var main = ui.getMain();
		ui.setState('press', ui.getMain().id);
		// var main = instance.getMain();
		ok(/press/.test(main.className), 'add press className');
		var states = ui.getState(main.id);
		equal(states['press'], 1, 'check press state');
		ui.setState('hover', main.id, 'hover');
		ok(/press/.test(main.className), 'add press className');
		ok(/hover-hover/.test(main.className), 'add hover className');
		te.dom.push(main);
		start();
	}, 'baidu.ui.button.Button', 'baidu.ui.behavior.statable');
});

test('toggle state',
		function() {
			stop();
			expect(7);
			var instance = new baidu.ui.button.Button();
			instance.render(te.dom[0]);
			instance.addState('newState');
			ok(/newState/.test(instance._allStates.join(' ')),
					'add newState className');
			var main = instance.getMain();
			instance.setState('disabled', main.id);
			instance.setState('newState', main.id);
			ok(/newState/.test(main.className), 'set newState className');
			ok(/disabled/.test(main.className), 'set newState className');
			var states = instance.getState(main.id);
			equal(states['newState'], 1, 'check newState state');
			equal(states['disabled'], 1, 'check disabled state');
			instance.removeState('press', main.id);
			instance.removeState('newState', main.id);
			ok(!/newState/.test(main.className), 'set newState className');
			ok(!/press/.test(main.className), 'set newState className');
			te.dom.push(main);
			start();
		});

test('enable/disable', function() {
	var instance = new baidu.ui.button.Button({
		ondisable : function() {
			ok(true, "excute ondisable event");
		},
		onenable : function() {
			ok(true, "excute onenable event");
		}
	});
	instance.render(te.dom[0]);
	var dom = instance.getBody();
	instance.disable();
	ok(/disabled/.test(dom.className), 'disable');
	ok(!/press/.test(dom.className), 'press is deleted');
	ok(!/hover/.test(dom.className), 'hover is deleted');
	equal((instance.getState(dom.id))['disabled'], 1, 'disaled status');
	instance.enable();
	ok(!/disabled/.test(dom.className), 'disable');
	te.dom.push(dom);
	te.obj.push(instance);
});

test('events', function() {
	expect(6);
	var instance = new baidu.ui.button.Button({
		onmouseover : function() {
			equal(instance.getState(instance.getId())['hover'], 1,
					'change status to hover');
		},
		onmouseout : function() {
			ok(!/hover/.test(dom.className), 'remove hover');
			ok(!/press/.test(dom.className), 'remove press');
		},
		onmousedown : function() {
			equal(instance.getState(instance.getId())['press'], 1,
					'change status to press');
		},
		onmouseup : function() {
			ok(!/press/.test(dom.className), 'remove press');
		}
	});
	instance.render(te.dom[0]);
	var dom = instance.getBody();
	// add hover
	ua.mouseover(instance.getId());
	// add press
	ua.mousedown(instance.getId());
	// remove hover and press
	ua.mouseout(instance.getId());
	// check mouseup remove press
	ua.mousedown(instance.getId());
	ua.mouseup(instance.getId());
	te.dom.push(dom);
});

/* disable & enable 后事件能不能正常触发或者不触发 */
//
test('enable/disable--events', function() {
	expect(1);
	var instance = new baidu.ui.button.Button({
		onmouseover : function() {
			ok(false, 'onmouseover should not be called');
		},
		onmouseout : function() {
			ok(false, 'onmouseout should not be called');
		},
		onmousedown : function() {
			ok(false, 'onmousedown should not be called');
		},
		onmouseup : function() {
			ok(false, 'onmouseup should not be called');
		}
	});
	instance.render(te.dom[0]);
	instance.disable();
	var main = instance.getBody();
	ok(/disabled/.test(main.className), 'disabled');
	ua.mouseover(instance.getId());
	ua.mousedown(instance.getId());
	ua.mouseout(instance.getId());
	ua.mousedown(instance.getId());
	ua.mouseup(instance.getId());

	// te.dom.push(main);
});
