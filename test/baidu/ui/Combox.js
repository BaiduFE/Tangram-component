
module('baidu.ui.Combox');

function mySetup() {
	testingElement = {};
	testingElement.dom = [];
	testingElement.obj = [];
	testingElement.evt = [];

	var select = document.createElement('select');
	select.id = "select_test";
	document.body.appendChild(select);
	testingElement.dom.push(select);

//	testingElement.dom.push(link);
	for ( var i = 0; i < baidu.event._listeners; i++)
		testingElement.evt.push(baidu.event._listeners[i]);
}

function myTeardown() {
	if (testingElement) {
		if (testingElement.dom && testingElement.dom.length) {
			for ( var i = 0; i < testingElement.dom.length; i++)
				if (testingElement.dom[i] && testingElement.dom[i].parentNode)
					testingElement.dom[i].parentNode
							.removeChild(testingElement.dom[i]);
		}
		if (testingElement.obj && testingElement.obj.length) {
			for ( var i = 0; i < testingElement.obj.length; i++) {
				console.log(typeof testingElement.obj[i]);
				if (testingElement.obj[i] && testingElement.obj[i].dispose)
					testingElement.obj[i].dispose();
			}
		}

		var indexof = function(array, item) {
			for ( var i = 0; i < array.length; i++)
				if (array[i] == item)
					return i;
			return -1;
		}
		if (testingElement.evt.length < baidu.event._listeners.length)
			for ( var i = 0; i < baidu.event._listeners.length; i++) {
				var evt = baidu.event._listeners[i];
				if (indexof(testingElement.evt, evt) != -1)
					continue;
				baidu.event.un(evt[0], evt[1], evt[2]);
			}
	}
}


(function() {
	var s = QUnit.testStart, e = QUnit.testDone, ms = QUnit.moduleStart, me = QUnit.moduleEnd, d = QUnit.done;
	QUnit.testStart = function() {
		mySetup(arguments[0]);
		s.apply(this, arguments);;
	}
	QUnit.testDone = function() {
		e.call(this, arguments);
		myTeardown();
	}
})();

test("createMenu", function() {
	var options = {
		data : [ {
			content : 'a-content-1'
		}, {
			content : 'b-content-2'
		}, {
			content : 'c-content-3'
		} ],
		onitemclick : function(data) {
			equal(data.value.content, 'a-content-1');
		},
		onopen : function() {
			ok(true, 'open');
		},
		onclose : function() {
			ok(true, 'close');
		},
		onbeforeopen : function() {
			ok(true, 'before open');
		},
		onbeforeclose : function() {
			ok(true, 'before close');
		}

	};
    stop();
	ua.loadcss(upath+'Combox/style.css',function(){
		var div = document.body.appendChild(document.createElement("div"));
		var cb = new baidu.ui.Combox(options);
		cb.render(div);
		var input = cb.getInput();
		var arrow = cb.getArrow();
		input.focus();
		$(arrow).click();
		setTimeout(function() {
			$(cb.menu.getItem('0-0')).click();
			equal(input.value, 'a-content-1');
			start();
		}, 30);
	})

});

test("events", function() {
	var options = {
		data : [ {
			content : 'file',
			value : 'file1'
		}, {
			content : 'A-a',
			value : 'A-a'
		}, {
			content : 'close',
			value : 'close3'
		} ],
		statable: true,
		autoRender : true,
		editable : true,
		onitemclick : function(data) {
			ok(true, 'item clicked');
		},
		onmouseover : function() {
			ok(true, 'onmouseover');
			ok(cb.getBody().className.match('hover'),'mouseover body add class hover');
		},
		onmouseout : function() {
			ok(true, 'onmouseout');
			ok(!cb.getBody().className.match('hover'),'mouseout body remove class hover');
		},
		onmousedown : function() {
			ok(true, 'onmousedown');
			ok(cb.getBody().className.match('press'),'mousedown body add class press');
		},
		onmouseup : function() {
			ok(true, 'onmouseup');
			ok(!cb.getBody().className.match('press'),'mouseup body remove class press');
		},
		onkeyup : function() {
			ok(true, 'onkeyup');
		}
	};
	var div = document.body.appendChild(document.createElement("div"));
	var cb = new baidu.ui.Combox(options);
	cb.render(div);
	var input = cb.getInput();
	var arrow = cb.getArrow();
	ua.mouseover(input);
	ua.mouseout(input);
    ua.mousedown(arrow);
    ua.mouseup(arrow);
    stop();
//	ua.keydown(input, {
//		keyCode : 65
//	});
//    ua.keyup(input);
    input.value = 'A';
    $(input).focus();
	setTimeout(function() {
		$(cb.menu.getItem('0-0')).click();
		equal(input.value, 'A-a');
		start();
	}, 100);

});

test("dispose", function() {
	expect(5);
	var options = {
		data : [ {
			content : 'file',
			value : 'file1'
		}, {
			content : 'new',
			value : 'new2'
		}, {
			content : 'close',
			value : 'close3'
		} ],
		editable : true,
		onopen : function() {
			ok(true, 'open');
		}
	};
	var div = document.body.appendChild(document.createElement("div"));
	var cb = new baidu.ui.Combox(options);
	cb.render(div);
    var input = cb.getInput();
	var arrow = cb.getArrow();
	$(input).focus();
	ua.keyup(input);
    ua.click(arrow);
    cb.dispose();
    ok(cb.getBody()==null,"element is removed");
    $(input).focus();
	ua.keyup(input);
    ua.click(arrow);
    ok(true,'event is lose');
})