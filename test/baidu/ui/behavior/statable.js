(function() {
//	UserAction.importsrc('baidu.ui.createUI,baidu.dom.insertHTML,baidu.ui.button.Button');
//	UserAction.importsrc('baidu.dom.insertHTML');
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
		instance.getMain().innerHTML = '<div id="' + instance.getId()+ '"></div>';
		// 撑开body
		instance.getBody().innerHTML = '<div style="width:200px;height:200px;border:1px solid red;"></div>';
		// 发送onload事件
		instance.dispatchEvent("onload");
	}
	

	test('set/get state', function() {
		stop();
		expect(4);
		UserAction.importsrc('baidu.ui.createUI,baidu.dom.insertHTML,baidu.ui.button.Button',function(){
		setTimeout(function() {
			var DraggableUI = baidu.ui.createUI(new Function).extend( {
				statable : true
			});
			var instance = new baidu.ui.button.Button();
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
	});

	test('add/remove state', function() {
		stop();
		expect(7);
		var DraggableUI = baidu.ui.createUI(new Function).extend( {
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
		var DraggableUI = baidu.ui.createUI(new Function).extend( {
			statable : true
		});
//		expect(5);
		var instance = new DraggableUI( {
			ondisable : function() {
                ok(true,"excute ondisable event");
			},
			onenable : function() {
				ok(true,"excute onenable event");
			}
		});
		initializeUI(instance);
		var main = instance.getMain();
//		instance.disable();
//		instance.enable();
        instance.dispatchEvent("ondisable");
        ok(/disabled/.test(main.className), 'disable');
		ok(!/press/.test(main.className), 'press is deleted');
		ok(!/hover/.test(main.className), 'hover is deleted');
		equal((instance.getState(main.id))['disabled'], 1, 'disaled status');
        instance.dispatchEvent("onenable");
        ok(!/disabled/.test(main.className), 'disable');
		te.dom.push(main);
		te.obj.push(instance);
	});
	

	test('events', function() {
		expect(6);

		var DraggableUI = baidu.ui.createUI(new Function).extend( {
			statable : true
		});
		var instance = new DraggableUI(
				    {
					onmouseover : function() {
						equal(instance.getState(instance.getId())['hover'], 1,
								'change status to hover');
					},
					onmouseout : function() {
						ok(!/hover/.test(main.className), 'remove hover');
						ok(!/press/.test(main.className), 'remove press');
					},
					onmousedown : function() {
						equal(instance.getState(instance.getId())['press'], 1,
								'change status to press');
					},
					onmouseup : function() {
						ok(!/press/.test(main.className), 'remove press');
					}
				}

		);
		initializeUI(instance);
		var main = instance.getMain();
		main.innerHTML = '<div id="' + instance.getId()+ '" '+instance._getStateHandlerString()+' ></div>';
		// add hover
		ua.mouseover(instance.getId());
		// add press 
		ua.mousedown(instance.getId());
		// remove hover and press 
		ua.mouseout(instance.getId());
		// check mouseup remove press 
		ua.mousedown(instance.getId());
		ua.mouseup(instance.getId());
		te.dom.push(main);
	});

	/* disable & enable 后事件能不能正常触发或者不触发 */

	test('enable/disable--events', function() {
		var DraggableUI = baidu.ui.createUI(new Function).extend( {
			statable : true
		});
		expect(1);
		var instance = new DraggableUI( {
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
		//initializeUI(instance);
		instance.renderMain();
		var main = instance.getMain();
		main.innerHTML = '<div id="' + instance.getId()+ '" '+instance._getStateHandlerString()+' ></div>';
		instance.getBody().innerHTML = '<div style="width:200px;height:200px;border:1px solid red;"></div>';
		instance.dispatchEvent("onload");
        instance.dispatchEvent("ondisable");
        ok(/disabled/.test(main.className), 'disabled');
      	ua.mouseover(instance.getId());
		ua.mousedown(instance.getId());
		ua.mouseout(instance.getId());
		ua.mousedown(instance.getId());
		ua.mouseup(instance.getId());

		te.dom.push(main);
	});

})();
