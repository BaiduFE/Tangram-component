module("baidu.ui.Suggestion$input");

(function() {
	/**
	 * create a input for test start
	 * <li>create input
	 * <li>set id <b>input_test</b>
	 * <li>set type text
	 * 
	 * @return input@type text
	 */
	function _testStart() {
		
		te.defaultData = [ {
	        "content":"ab",
	        "value":"ab",
	        "disable": true
	    }, {
	        "content":"ac",
	        "value":"ac",
	        "disable": false
	    },{
	        "content":"ad",
	        "value":"ad",
	        "disable": true
	    },{
	        "content":"ae",
	        "value":"ae",
	        "disable": true
	    },{
	        "content":"af",
	        "value":"af",
	        "disable": false
	    },{
	        "content":"ag",
	        "value":"ag",
	        "disable": true
	    }];
		
		te.getHighlightIndex = function(sugg){
			var me = sugg,
            len = me.currentData.length,
            i = 0;
	        if (len && me._isShowing()) {
	            for (; i < len; i++) {
	                if (me._getItem(i).className == me.getClass('current'))
	                    return i;
	            }
	        }        
	        return -1;
			};
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);
		_testStart();
	};
})();

/**
 * <li>在第一条时上
 * <li>在最后一条下
 * <li>其他情况上下
 */
test('key down', function() {
	expect(15);
	var te = testingElement, input = te.dom[0], sugg, step = 0;
	var options = {
		onpick : function(eventData) {
			equals(eventData.data.index, step == 0 ? '0' : step == 1 ? '1' : '',
					'check pick index when type down');
			equals(eventData.data.item.content, step == 0 ? 'aa' : step == 1 ? 'ab' : '',
					'check pick content when type down');
			step++;
		},
		onhighlight : function(eventData) {
			equals(te.getHighlightIndex(sugg), step - 1 == 0 ? '0' : '1',
					'check hightlight index when type down');
			equals(eventData.data.item.content, step - 1 == 0 ? 'aa' : 'ab',
			'check hightlight content when type down');
		},
		onclearhighlight : function(eventData) {
			equals(eventData.index, 1,
					'check clearhighlight index when type down');
			equals(eventData.data.item.content, 'ab',
			'check clearhighlight content when type down');
		}
	};
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	te.obj.push(sugg);
	input.focus();
	sugg.show('a',  [ 'aa', 'ab' ]);
	UserAction.keydown(input, {
		keyCode : 40
	});
	equals(sugg.currentIndex, 0, 'check currentIndex index when type down');
	UserAction.keydown(input, {
		keyCode : 40
	});
	equals(sugg.currentIndex, 1, 'check currentIndex index when type down');
	UserAction.keydown(input, {
		keyCode : 40
	});
	equals(sugg.currentIndex, -1, 'check currentIndex index when type down');
	sugg.dispose();
});

test('key down with disable item', function() {
	expect(15);
	var te = testingElement, input = te.dom[0], sugg, step = 0;
	var options = {
		onpick : function(eventData) {
			equals(eventData.data.index, step == 0 ? '1' : step == 1 ? '4' : '',
					'check pick index when type down');
			equals(eventData.data.item.content, step == 0 ? 'ac' : step == 1 ? 'af' : '',
					'check pick content when type down');
			step++;
		},
		onhighlight : function(eventData) {
			equals(te.getHighlightIndex(sugg), step - 1 == 0 ? '1' : '4',
					'check hightlight index when type down');
			equals(eventData.data.item.content, step - 1 == 0 ? 'ac' : 'af',
			'check hightlight content when type down');
		},
		onclearhighlight : function(eventData) {
			equals(eventData.index, 4,
					'check clearhighlight index when type down');
			equals(eventData.data.item.content, 'af',
			'check clearhighlight content when type down');
		}
	};
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	te.obj.push(sugg);
	input.focus();
	sugg.show('a', te.defaultData);
	UserAction.keydown(input, {
		keyCode : 40
	});
	equals(sugg.currentIndex, 0, 'check currentIndex index when type down');
	UserAction.keydown(input, {
		keyCode : 40
	});
	equals(sugg.currentIndex, 1, 'check currentIndex index when type down');
	UserAction.keydown(input, {
		keyCode : 40
	});
	equals(sugg.currentIndex, -1, 'check currentIndex index when type down');
	sugg.dispose();
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

test('type enter with disable item', function() {
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
				UserAction.keydown(input, {
					keyCode : 40
				});
				if(step == 3){
					UserAction.keydown(input, {
						keyCode : 40
					});
				}
				UserAction.keydown(input, {
					keyCode : 13
				});
			}
		},
		onhide : function() {
			if (step == 2) {
				setTimeout(function() {
					equals(input.value, 'ac', 'type enter with key down once');
					sugg.show('a', te.defaultData);
				}, 0);
			} else if (step == 1) {
				setTimeout(function() {
					equals(input.value, 'a', 'type enter with no select');
					sugg.show('a', te.defaultData);
				}, 0);
			} else {
				setTimeout(function() {
					equals(input.value, 'af', 'type enter with with key down twice');
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
	sugg.show('a', te.defaultData);
});

test('problem', function() {
	stop();
	var te = testingElement, input = te.dom[0], sugg, step = 0;
	var check = function(callback) {
		setTimeout(callback, 0);
	};
	var options = {
		onshow : function() {
			if (step++ == 0) {
				/* keydown with selected 0 */
				UserAction.keydown(input, {
					keyCode : 40
				});
				UserAction.keydown(input, {
					keyCode : 13
				});
			} else {
				UserAction.keydown(input, {
					keyCode : 13
				});
			}
		},
		onhide : function() {
			if (step == 1) {
				setTimeout(function() {
					equals(input.value, 'aa', 'type enter with select');
					input.value = 'a';
					sugg.show('a', ['aa', 'ab']);
				}, 0);
			} else if (step == 2) {
				setTimeout(function() {
					equals(input.value, 'a', 'type enter with no select');
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
	sugg.show('a', ['aa', 'ab']);
});

test('test problem with disabled item', function() {
	stop();
	var te = testingElement, input = te.dom[0], sugg, step = 0;
	var check = function(callback) {
		setTimeout(callback, 0);
	};
	var options = {
		onshow : function() {
			if (step++ == 0) {
				/* keydown with selected 0 */
				UserAction.keydown(input, {
					keyCode : 40
				});
				UserAction.keydown(input, {
					keyCode : 13
				});
			} else {
				UserAction.keydown(input, {
					keyCode : 13
				});
			}
		},
		onhide : function() {
			if (step == 1) {
				setTimeout(function() {
					equals(input.value, 'ac', 'type enter with select');
					input.value = 'a';
					sugg.show('a', te.defaultData);
				}, 0);
			} else if (step == 2) {
				setTimeout(function() {
					equals(input.value, 'a', 'type enter with no select');
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
	sugg.show('a', te.defaultData);
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

test("suggestion in dialog, key options", function() {
	stop();
	var input = te.dom[0];
	ua.importsrc('baidu.ui.Dialog',function(){
		var d_options = {
				titleText : "title",
				content : input
			};
		d = new baidu.ui.Dialog(d_options);
		d.render();
		d.open();
		var s_options = {
				onshow : function() {
					UserAction.keydown(input, {
						keyCode : 40
					});
					UserAction.keydown(input, {
						keyCode : 13
					});
				},
				onhide : function() {
					setTimeout(function() {
						equals(input.value, 'ab', 'select ab');
						d.close();
						d.dispose();
						sugg.dispose();
						start();
					}, 0);
				}
			};
		sugg = new baidu.ui.Suggestion(s_options);
		sugg.render(input);
		sugg.show('a', [ 'ab', 'ac' ]);
	},'baidu.ui.Dialog','baidu.ui.Suggestion.Suggestion$input' );
});

test("suggestion in dialog, mouse options", function() {
	stop();
	var input = te.dom[0];
		var d_options = {
				titleText : "title",
				content : input
			};
		d = new baidu.ui.Dialog(d_options);
		d.render();
		d.open();
		var s_options = {
				onshow : function() {
					ua.click(sugg._getItem(0));
				},
				onhide : function() {
					setTimeout(function() {
						equals(input.value, 'ab', 'select ab');
						d.close();
						d.dispose();
						sugg.dispose();
						start();
					}, 0);
				}
			};
		sugg = new baidu.ui.Suggestion(s_options);
		sugg.render(input);
		sugg.show('a', [ 'ab', 'ac' ]);
});

test("suggestion in dialog, hide", function() {
	stop();
	var input = te.dom[0];
		var d_options = {
				titleText : "title",
				content : input
			};
		d = new baidu.ui.Dialog(d_options);
		d.render();
		d.open();
		var s_options = {
				onshow : function() {
					ua.click(d.getTitle());
				},
				onhide : function() {
					setTimeout(function() {
						equals(input.value, '', 'select nothing');
						d.close();
						d.dispose();
						sugg.dispose();
						start();
					}, 0);
				}
			};
		sugg = new baidu.ui.Suggestion(s_options);
		sugg.render(input);
		sugg.show('a', [ 'ab', 'ac' ]);
});
// TODO 输入法相关的测试，依然需要一组手工用例
