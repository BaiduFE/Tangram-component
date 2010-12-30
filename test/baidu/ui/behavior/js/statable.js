(function() {
	UserAction.importsrc('baidu.ui.create');
	UserAction.importsrc('baidu.dom.insertHTML');
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

	/**
	 * 模拟组件的初始化流程,可用于测试行为
	 * 
	 * @param {}
	 *            instance
	 */
	function initializeUI(instance) {
		// 渲染main
		instance.renderMain();
		// instance.render();
		// 渲染body
		instance.getMain().innerHTML = '<div id="' + instance.getId()
				+ '"></div>';
		// 撑开body
		instance.getBody().innerHTML = '<div style="width:200px;height:200px;border:1px solid red;"></div>';
		// 发送onload事件
		instance.dispatchEvent("onload");
	}
	
	
	test('set/get state', function() {
		stop();
		expect(4);
		setTimeout(function() {
			var DraggableUI = baidu.ui.create(new Function).extend( {
				statable : true
			});
			var instance = new DraggableUI();
			initializeUI(instance);
			var main = instance.getMain();
			instance.setState('press',main.id);
			var main = instance.getMain();
			ok(/press/.test(main.className), 'add press className');
			var states = instance.getState(main.id);
			equal(states['press'], 1, 'check press state');
			instance.setState('hover', main.id, 'hover');
			ok(/press/.test(main.className), 'add press className');
			ok(/hover-hover/.test(main.className), 'add hover className');
			te.dom.push(main);
			start();
		}, 100);
	});

	test('add/remove state', function() {
		stop();
		expect(7);
		var DraggableUI = baidu.ui.create(new Function).extend( {
			statable : true
		});
		var instance = new DraggableUI();
		initializeUI(instance);
		instance.addState('newState');
		ok(/newState/.test(instance._allStates.join('')),
				'add newState className');
		var main = instance.getMain();
		instance.setState('disabled',main.id);
		instance.setState('newState',main.id);
		ok(/newState/.test(main.className), 'set newState className');
		ok(/disabled/.test(main.className), 'set newState className');
		var states = instance.getState(main.id);
		equal(states['newState'], 1, 'check newState state');
		equal(states['disabled'], 1, 'check disabled state');
		instance.removeState('press',main.id);
		instance.removeState('newState',main.id);
		ok(!/newState/.test(main.className), 'set newState className');
		ok(!/press/.test(main.className), 'set newState className');
		te.dom.push(main);
		start();
	});

	test('enable/disable', function() {
		var DraggableUI = baidu.ui.create(new Function).extend( {
			statable : true
		});
		expect(5);
		var instance = new DraggableUI( {
			ondisable : function() {
				ok(/disabled/.test(main.className), 'disable');
				ok(!/press/.test(main.className), 'press is deleted');
				ok(!/hover/.test(main.className), 'hover is deleted');
				equal((instance.getState(main.id))['disabled'], 1, 'disaled status');

			},
			onenable : function() {
				ok(!/disabled/.test(main.className), 'enable');
			}
		});
		initializeUI(instance);
		var main = instance.getMain();
		instance.disable();
		instance.enable();
		te.dom.push(main);
		te.obj.push(instance);
	});

	test('events', function() {
		expect(6);
		var DraggableUI = baidu.ui.create(new Function).extend( {
			statable : true
		});
		var instance = new DraggableUI(
				{
					onmouseover : function() {
						equal(instance.getState(main.id)['hover'], 1,
								'change status to hover');
					},
					onmouseout : function() {
						ok(!/hover/.test(main.className), 'remove hover');
						ok(!/press/.test(main.className), 'remove press');
					},
					onmousedown : function() {
						equal(instance.getState(main.id)['press'], 1,
								'change status to press');
					},
					onmouseup : function() {
						ok(!/press/.test(main.className), 'remove press');
					}
				}

		);
		initializeUI(instance);
		var main = instance.getMain();
		instance._setStateHandler(main, "", "main");
		/* add hover */
		ua.mouseover(main);
		/* add press */
		ua.mousedown(main);
		/* remove hover and press */
		ua.mouseout(main);
		/* check mouseup remove press */
		ua.mousedown(main);
		ua.mouseup(main);
		te.dom.push(main);
	});

	/* disable & enable 后事件能不能正常触发或者不触发 */

	test('enable/disable--events', function() {
		var DraggableUI = baidu.ui.create(new Function).extend( {
			statable : true
		});
		expect(1);
		var instance = new DraggableUI( {
			ondisable : function() {
				ua.mouseover(main);
				ua.mousedown(main);
				ua.mouseout(main);
				ua.mousedown(main);
				ua.mouseup(main);

				te.dom.push(main);
			},
			onenable : function() {
				ok(!/disabled/.test(main.className), 'enable');
			},

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
		initializeUI(instance);
		var main = instance.getMain();
		instance._setStateHandler(main, "", "main");
		instance.disable();
		instance.enable();
		te.dom.push(main);
	});

})();