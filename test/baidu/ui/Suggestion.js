/**
 * check Suggestion properties, methods and events
 */
module("baidu.ui.Suggestion");

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
		var id = "input_test";
		var input = document.createElement("input");
		input.id = id;
		input.type = "text";
		document.body.appendChild(input);
		te.dom.push(input);
		
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
	    }];
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);
		_testStart();
	};
})();

test('构造函数同时支持id和dom', function(){
	var sugg = new baidu.ui.Suggestion();
	te.obj.push(sugg);
	sugg.render(te.dom[0]);
	equals(sugg.getTarget().id, te.dom[0].id, 'create by dom');
});

test('构造函数同时支持id和dom', function(){
	var sugg = new baidu.ui.Suggestion();
	te.obj.push(sugg);
	sugg.render(te.dom[0].id);
	equals(sugg.getTarget().id, te.dom[0].id, 'create by id');
});

/**
 * check events list and event arguments and event queue
 * <li> on show
 * <li> on highlight
 * <li> on beforepick
 * <li> on pick
 * <li> on cofirm
 * <li> on hide
 */
test("event list", function() {
	stop();
	var te = testingElement, input = te.dom[0];
	var ua = UserAction, step = 0, sugg;
	var onHandle = function(type, _step, callback) {
		return function() {
			/* skip check step, suggesion ignore */
			// equals(_step, step++, "check step on " + type);
			if (callback && typeof callback == "function")
				callback.apply(this, arguments);
		};
	};
	var check = function(event, index, value, content, msg) {
		msg = msg || "";
		equals(event.data.index, index, "check event index " + msg);
		equals(event.data.item.value, value, "check event value " + msg);
		equals(event.data.item.content, content, "check event content " + msg);
	};

	var options = {
		onshow : onHandle("show", 0, function() {
			/* call mouse over for highlight on item 0 when shown */
			// ua.click(sugg.getItem(0));
			ua.mouseover(sugg._getItem(0));
		}),
		onhighlight : onHandle("highlight", 1, function(event) {
			check(event, 0, "ab", "ab", "at highlight");
			/* call mouse down for select item */
			// ua.click(sugg.getItem(0));
			sugg.confirm(0);
		}),
		onbeforepick : onHandle("beforepick", 2, function(event) {
			/* check highlight */
			equals(sugg._getItem(0).className, "tangram-suggestion-current",
					"check highlight class name");
		}),
		onpick : onHandle("pick", 3, function(event) {
			check(event, 0, "ab", "ab", "at pick");
		}),
		onconfirm : onHandle("confirm", 4, function(event) {
			check(event, 0, "ab", "ab", "at confirm");
		}),
		onhide : onHandle("hide", 5, function() {
			setTimeout(function() {
				start();
			}, 0);
		})
	};
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	te.obj.push(sugg);
	sugg.show('a', [ 'ab', 'ac' ]);
});

test("confirm", function() {
	stop();
	var te = testingElement, input = te.dom[0], sugg;
	var options = {
		onshow : function() {
			sugg.confirm(0);
		},
		onconfirm : function(e) {
			equals(e.data.index, 0, 'check index');
			equals(e.data.item.content, 'ab', 'check content');
			equals(e.data.item.value, 'ab', 'check value');
		},
		onhide : function() {
			setTimeout(function() {
				ok(true, 'hide after confirm');
				start();
			}, 0);
		}
	};
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	te.obj.push(sugg);
	sugg.show('a', [ 'ab', 'ac' ]);
});

/**
 * check suggestion dispose
 * <li> check ondispose
 * <li> check click on document not cause suggestion onhide
 * <li> check blur not cuase suggestion onhide
 * <li> check Element removed after dispose
 */
test("dispose", function() {
	var l1 = baidu.event._listeners.length;
	var te = testingElement, input = te.dom[0], sugg, ua = UserAction;
	sugg = new baidu.ui.Suggestion({});
	sugg.render(input);
	sugg.dispose();
	equals(baidu.event._listeners.length, l1, 'event removed all');
});

test("getTargetValue", function() {
	var te = testingElement, input = te.dom[0], sugg;
	sugg = new baidu.ui.Suggestion();
	sugg.render(input);
	input.value = 'test';
	equals(sugg.getTargetValue(), input.value);
	te.obj.push(sugg);
});

test("hide", function() {
	stop();
	var te = testingElement, input = te.dom[0], sugg, options = {
		onshow : function() {
			sugg.hide();
		},
		onhide : function() {
			ok(!isShown(document.body.lastChild), 'element hide');
			start();
		}
	};
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	te.obj.push(sugg);
	sugg.show('a', [ 'ab', 'ac' ]);
});

/**
 * check highlight method
 */
test("highlight", function() {
	stop();
	var te = testingElement, input = te.dom[0], sugg, options = {
		onshow : function() {
			equals(sugg._getItem(0).className, '',
					'check class name before highlight');
			sugg.highLight(0);
			equals(sugg._getItem(0).className, 'tangram-suggestion-current',
					'check class name after highlight');
			start();
		}
	};
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	te.obj.push(sugg);
	sugg.show('a', [ 'ab', 'ac' ]);
});

/**
 * pick used at set highlight by put key down or key up
 */
test("pick", function() {
	stop();
	var te = testingElement, input = te.dom[0], step = 0;
	var is = [ 0, 1, 'ab', 'ac' ], vs = [ 'ab', 'ac', 'ab', 'ac' ];
	var sugg, noFireEvent = 0, options = {
		onshow : function() {
			var suggElement = document.body.lastChild;
			sugg.pick(0);
			sugg.pick(1);
			sugg.pick('ab');
			sugg.pick('ac');
			start();
		},
		onpick : function(e) {
			equals(e.data.index, is[step]);
			equals(e.data.item.content, vs[step]);
			equals(e.data.item.value, vs[step++]);
		}
	};
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	te.obj.push(sugg);
	sugg.show('a', [ 'ab', 'ac' ]);
});

/**
 * check show method
 * <li> check onshow
 * <li> check is shown
 * <li> check item shown
 */
test("show", function() {
	stop();
	var te = testingElement, input = te.dom[0], sugg, options = {
		onshow : function() {
			ok(isShown(sugg.getMain()), 'element shown');
			equals(sugg._getItem(0).innerHTML, 'ab', 'check shown item');
			equals(sugg._getItem(1).innerHTML, 'ac', 'check shown item');
			start();
		}
	};
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	te.obj.push(sugg);
	sugg.show('a', [ 'ab', 'ac' ]);
});

test(
		'mouse down and up on item',
		function() {
			stop();
			var te = testingElement, input = te.dom[0], sugg, count = 0, options = {
				onshow : function() {
					var me = this, item = me._getItem(0);
					ok(/_itemOver\(event, 0\)/.test(item.onmouseover),
							'check mouse over event');
					ok(/_itemOut\(event, 0\)/.test(item.onmouseout),
							'check mouse out event');
					/* PUBLICGE-102 */
					ok(/_itemDown\(event, 0\)/.test(item.onmousedown),
							'check mouse down event : ' + item.onmousedown);
					ok(/_itemClick\(event, 0\)/.test(item.onclick),
							'check mouse click event');
					item = me._getItem(1);
					ok(/_itemOver\(event, 1\)/.test(item.onmouseover),
							'check mouse over event');
					ok(/_itemOut\(event, 1\)/.test(item.onmouseout),
							'check mouse out event');
					/* PUBLICGE-102 */
					ok(/_itemDown\(event, 1\)/.test(item.onmousedown),
							'check mouse down event');
					ok(/_itemClick\(event, 1\)/.test(item.onclick),
							'check mouse click event');
					me.hide();
				},
				onhide : function() {
					start();
				}
			};
			sugg = new baidu.ui.Suggestion(options);
			sugg.render(input);
			te.obj.push(sugg);
			sugg.show('a', [ 'ab', 'ac' ]);
		});

test("highlight with disabled items", function() {
	stop();
	var te = testingElement, input = te.dom[0], sugg, options = {
		onshow : function() {
			equals(sugg._getItem(0).className, 'tangram-suggestion-disable',
					'check class name before highlight');
			sugg.highLight(0);
			equals(sugg._getItem(0).className, 'tangram-suggestion-disable',
					'check class name after highlight');
			
			equals(sugg._getItem(1).className, '',
			'check class name before highlight');
	        sugg.highLight(1);
	        equals(sugg._getItem(1).className, 'tangram-suggestion-current',
			'check class name after highlight');
	        
	        equals(sugg._getItem(3).className, 'tangram-suggestion-disable',
			'check class name before highlight');
	        sugg.highLight(3);
	        equals(sugg._getItem(3).className, 'tangram-suggestion-disable',
			'check class name after highlight');
		},
	    onhighlight : function(index, data) {
	    	equals(index.index, 1,
				'Only item1 is highlight');
			start();
		}
	};
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	te.obj.push(sugg);
	sugg.show('a', te.defaultData);
});

test("show with disabled item", function() {
	stop();
	var te = testingElement, input = te.dom[0], sugg, options = {
		onshow : function() {
			ok(isShown(sugg.getMain()), 'element shown');
			equals(sugg._getItem(0).innerHTML, 'ab', 'check shown item');
			equals(sugg._getItem(1).innerHTML, 'ac', 'check shown item');
			equals(sugg.enableIndex[0], 1, 'check enableIndex');
			equals(sugg.enableIndex[1], 4, 'check enableIndex');
			start();
		}
	};
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	te.obj.push(sugg);
	sugg.show('a', te.defaultData);
});

test("clearhighlight with disabled items", function() {
	stop();
	var te = testingElement, input = te.dom[0], sugg, options = {
		onshow : function() {
			equals(sugg._getItem(4).className, '',
			'check class name before highlight');
	        sugg.highLight(4);
		},
	    onhighlight : function(index, data) {
	        equals(sugg._getItem(4).className, 'tangram-suggestion-current',
			'check class name after highlight');
	    	equals(index.index, 4,
				'item4 is highlight');
	    	equals(sugg.currentIndex, 1,
			'check currentIndex after highlight');
	    	sugg.clearHighLight();
		},
		onclearhighlight : function(index, data){
			 equals(sugg._getItem(4).className, '',
				'check class name after clearhighlight');
			 equals(index.index, 4,
				'item4 is clearhighlight');
			 equals(sugg.currentIndex, -1,
				'check currentIndex after clearhighlight');
			 start();
		}
	};
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	te.obj.push(sugg);
	sugg.show('a', te.defaultData);
});