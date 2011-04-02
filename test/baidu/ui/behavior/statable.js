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

(function() {
	te.getUI = function(options) {
		var ui = baidu.ui.createUI(new Function()).extend(
				{
					uiType : 'testType',
					disabled : false,
					statable : true,
					tplBody : '<div id="#{id}" #{statable} '
							+ 'class="#{class}"></div>',
					/**
					 * 获得HTML字符串
					 * 
					 * @private
					 * @return {String} 拼接的字符串
					 */
					_getString : function() {
						var me = this;
						return baidu.format(me.tplBody, {
							id : me.getId(),
							statable : me._getStateHandlerString(),
							'class' : me.getClass()
						});
					},
					render : function(target) {
						var me = this;
						baidu.dom.insertHTML(me.renderMain(), 'beforeEnd', me
								._getString());
						this.getMain().appendChild(target);
						me.disabled && me.setState('disabled');
						me.dispatchEvent('onenable');
						me.dispatchEvent('onload');
						return me;
					}
				}).extend(options);
		var uiInstance = new ui();
		te.obj.push(uiInstance);
		return uiInstance;
	};
})();

test('set/get state', function() {
	stop();
	expect(4);
	UserAction.importsrc(
			'baidu.string.format,baidu.dom.insertHTML,baidu.ui.createUI',
			function() {
				var instance = te.getUI();
				instance.render(te.dom[0]);
				var main = instance.getMain();
				instance.setState('press', main.id);
				var main = instance.getMain();
				ok(/press/.test(main.className), 'add press className');
				var states = instance.getState(main.id);
				equal(states['press'], 1, 'check press state');
				instance.setState('hover', main.id, 'hover');
				ok(/press/.test(main.className), 'add press className');
				ok(/hover-hover/.test(main.className), 'add hover className');
				te.dom.push(main);
				start();
			}, 'baidu.ui.createUI', 'baidu.ui.behavior.statable');
});

test('add/remove state',
		function() {
			var instance = te.getUI();
			instance.render(te.dom[0]);
			instance.addState('newState');
			ok(/newState/.test(instance._allStates.join('')),
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
		});

test('enable/disable', function() {
	var instance = te.getUI({
		ondisable : function() {
			ok(true, "excute ondisable event");
		},
		onenable : function() {
			ok(true, "excute onenable event");
		}
	});
	instance.render(te.dom[0]);
	var main = instance.getMain();
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
	var ops = {
		onmouseover : function() {
			var ch = ui.getState(ui.getId())['hover'];
			equal(ch, 1, 'change status to hover');
		},
		onmouseout : function() {
			var c = main.className;
			ok(!/hover/.test(c), 'remove hover');
			ok(!/press/.test(c), 'remove press');
		},
		onmousedown : function() {
			var cp = ui.getState(ui.getId())['press'];
			equal(cp, 1, 'change status to press');
		},
		onmouseup : function() {
			var c = main.className;
			ok(!/press/.test(c), 'remove press');
		}
	};
	var ui = te.getUI(ops).render(te.dom[0]);
	var main = ui.getBody();
	// add hover
	ua.mouseover(main);
	// add press
	ua.mousedown(main);
	// remove hover and press
	ua.mouseout(main, {
		element : main
	});
	// check mouseup remove press
	ua.mousedown(main, {
		element : main
	});
	ua.mouseup(main, {
		element : main
	});
	ui.dispatchEvent('ondisable', {
		element : ui.getBody()
	});
	// check disabled
	ua.mousedown(main, {
		element : main
	});
	ua.mouseup(main, {
		element : main
	});
});

test('inner element', function() {

	var ops = {
		onmouseup : function() {
			var c = main.className;
			ok(!/press/.test(c), 'remove press');
		}
	};
	var ui = te.getUI(ops).render(te.dom[0]);
	var main = ui.getBody();
	ui.getBody().innerHTML = '<span id="test_span">test</span>';
	ua.mousedown('test_span');
	ua.mouseup('test_span');
	ui.dispatchEvent('ondisable', {
		element : ui.getBody()
	});
	ua.mousedown('test_span');
	ua.mouseup('test_span');
	expect(1);// 这个地方，应该只有一次
});