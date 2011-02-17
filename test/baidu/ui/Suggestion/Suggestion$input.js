module("baidu.ui.Suggestion$input");

/**
 * <li>在第一条时上
 * <li>在最后一条下
 * <li>其他情况上下
 */
test('key down', function() {
	stop();
	var te = testingElement, input = te.dom[0], sugg, step = 0;
	var options = {
		onshow : function() {
			UserAction.keydown(input, {
				keyCode : 40
			});
		},
		onpick : function() {
			setTimeout(function() {
				if (step == 3) {

					start();
					return;
				}
				equals(sugg.getHighlightIndex(), step + 1 == 3 ? -1 : step,
						'check index when type down');
				step++;
				UserAction.keydown(input, {
					keyCode : 40
				});
			}, 0);
		}
	};
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	te.obj.push(sugg);
	input.focus();
	sugg.show('a', [ 'ab', 'ac' ]);
});

test('key up', function() {
	stop();
	var te = testingElement, input = te.dom[0], sugg, step = 0;
	var options = {
		onshow : function() {
			UserAction.keydown(input, {
				keyCode : 38
			});
		},
		onpick : function() {
			setTimeout(function() {
				if (step == 3) {

					start();
					return;
				}
				equals(sugg.getHighlightIndex(), step + 1 == 3 ? -1 : 1 - step,
						'check index when type up');
				step++;
				UserAction.keydown(input, {
					keyCode : 38
				});
			}, 0);
		}
	};
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	te.obj.push(sugg);
	input.focus();
	sugg.show('a', [ 'ab', 'ac' ]);
});

test('type enter', function() {
	stop();
	var te = testingElement, input = te.dom[0], sugg, step = 0;
	var check = function(callback) {
		setTimeout(callback, 0);
	};
	var options = {
		onshow : function() {
			if (step++ == 0) {
				/* keydown with selected -1 */
				UserAction.keydown(input, {
					keyCode : 13
				});
			} else {
				/* keydown with selected 0 */
				this.pick(step - 2);
				UserAction.keydown(input, {
					keyCode : 13
				});
			}
		},
		onhide : function() {
			if (step == 2) {
				setTimeout(function() {
					equals(input.value, 'aa', 'type enter with select 0');
					sugg.show('a', [ 'aa', 'ab' ]);
				}, 0);
			} else if (step == 1) {
				setTimeout(function() {
					equals(input.value, 'a', 'type enter with no select');
					sugg.show('a', [ 'aa', 'ab' ]);
				}, 0);
			} else {
				setTimeout(function() {
					equals(input.value, 'ab', 'type enter with select 1');
					start();
				}, 0);
			}
		}
	};
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	te.obj.push(sugg);
	input.focus();
	input.value = 'a';
	sugg.show('a', [ 'aa', 'ab' ]);
});

test('type tab and esc', function() {
	stop();
	var te = testingElement, input = te.dom[0], sugg, handle, step = 0;
	var options = {
		onshow : function() {
			if (step++ == 0) {
				/* type tab */
				UserAction.keydown(input, {
					keyCode : 9
				});
			} else {
				/* type esc */
				UserAction.keydown(input, {
					keyCode : 27
				});
			}
		},
		onhide : function() {
			ok(true, 'hide in type ' + (step == 1 ? 'tab' : 'esc'));
			if (step == 1) {
				sugg.show('b', [ 'ba', 'bb' ]);
			} else {
				clearTimeout(handle);
				start();
			}
		}
	};
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	te.obj.push(sugg);
	input.focus();
	handle = setTimeout(function() {
		ok(false, 'false in type tab or esc');
		start();
	}, 1000);
	input.value = 'a';
	sugg.show('a', [ 'aa', 'ab' ]);
});

// TODO 输入法相关的测试，依然需要一组手工用例
