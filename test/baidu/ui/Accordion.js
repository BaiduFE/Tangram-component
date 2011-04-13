module('baidu.ui.Accordion');

(function() {
	function mySetup() {
		var div = document.createElement('div');
		div.id = 'div_test';
		document.body.appendChild(div);
		te.dom.push(div);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);
		mySetup();
	};

	te.getUI = function(op) {
		var ui = new baidu.ui.Accordion(op || {
			items : [ {
				head : 'H0',
				body : 'BODY-0-0<br/>BODY-0-1'
			}, {
				head : 'H1',
				body : 'BODY-1-0<br/>BODY-1-1'
			} ]
		});
		te.obj.push(ui);
		return ui;
	};
})();

test('base', function() {
	var ui = te.getUI();
	// 检测类型
	equals(ui.uiType, 'accordion', 'check ui type');
	ui.render("div_test");
	// 检测子元素，方法来自ItemSet，校验以ItemSet为准，此处仅基本校验
	equals($(te.dom[0].firstChild).children().length, 4,
			'check sub items length');
	equals($(ui.getBody()).children().length, 4, 'check sub items length');
	equals(ui.getHeads().length, 2, 'check sub items length');
	equals(ui.getBodies().length, 2, 'check sub items length');
});

test('function - insertItemHTML', function() {
	var ui = te.getUI();
	ui.render("div_test");
	ui.insertItemHTML({
		head : 'H4',
		body : 'body4-0<div>body4-1</div>'
	}, 1);
	equals(ui.getHeads().length, 3, 'check sub items length');
	equals(ui.getHeads()[1].innerHTML, 'H4', 'check inserted item');
	equals(ui.getBodies()[1].innerHTML, 'body4-0<div>body4-1</div>',
			'check inserted item');
	equals(ui.getHeads()[2].innerHTML, 'H1', 'check inserted item');

	ui.insertItemHTML({
		head : 'H5',
		body : 'body4-0<div>body4-1</div>'
	});
	equals(ui.getHeads()[3].innerHTML, 'H5', 'check inserted item');
});

test('collapse switchByHead onbeforecollapse onbeforeswitchhead', function() {
	var ui = te.getUI({
		items : [ {
			head : 'H0',
			body : 'BODY-0-0<br/>BODY-0-1'
		}, {
			head : 'H1',
			body : 'BODY-1-0<br/>BODY-1-1'
		} ],
		onbeforecollapse : function(e) {
			equals(e.target.guid, ui.guid, 'check event');
			ok(true, 'event onbeforecollapse dispatched');
			ok(isShown(ui.getBodies()[0]), 'item 0 shown before collapse');
			return true;
		},
		onbeforeswitchbyhead : function(e) {
			ok(true, 'event onbeforeswitchbyhead dispatch');
			return true;
		}
	});
	ui.render("div_test");
	ui.collapse();
	ok(!isShown(ui.getBodies()[0]), 'item 0 hide after collapse');
	equals(ui.getCurrentHead(), null, 'current head is null');
	ui.switchByHead(ui.getHeads()[0]);
	ok(isShown(ui.getBodies()[0]), 'item 0 shown after switch');
	equals(ui.getCurrentHead().innerHTML, 'H0', 'current head is H0');
	ui.switchByHead(ui.getHeads()[1]);
	equals(ui.getCurrentHead().innerHTML, 'H1', 'current head is H1');
	// switch by click
	ua.click(ui.getHeads()[0]);
	ok(isShown(ui.getBodies()[0]), 'item 0 shown after switch');
	equals(ui.getCurrentHead().innerHTML, 'H0', 'current head is H0');
});

// ItemSet测试在此处进行
test('get items', function() {
	var ui = te.getUI({
		items : [ {
			head : 'H0',
			body : '<div>B0</div>'
		}, {
			head : 'H1',
			body : '<div>B1</div>'
		} ],
		beforecollapse : function() {
			ok(true, 'beforecollapse dispatched');
			ok(isShown(ui.getBodies()[0]), 'item 0 shown before collapse');
		}
	});
	ui.render(te.dom[0]);
	// get head get body get item
	var hs = ui.getHeads();
	equals(hs.length, 2, 'get heads');
	equals(hs[0].innerHTML, 'H0', 'head 0');
	equals(hs[1].innerHTML, 'H1', 'head 1');

	var bs = ui.getBodies();
	equals(bs.length, 2, 'get bodies');
	equals(bs[0].innerHTML, '<div>B0</div>', 'body 0');
	equals(bs[1].innerHTML, '<div>B1</div>', 'body 1');

	var is = ui.items;
	equals(is.length, 2, 'get items');
	equals(is[0].head, 'H0', 'get head from item 0');
	equals(is[0].body, '<div>B0</div>', 'get body from item 0');
});

test('add remove items', function() {
	var ui = te.getUI();
	ui.render("div_test");

	equals(ui.getHeads().length, 2, 'get items before remove');
	// remove item
	ui.removeItem(0);
	equals(ui.getHeads().length, 1, 'get items after remove');
	equals(ui.getCurrentHead(), null, 'remove current head');
	ui.addItem({
		head : 'H0',
		body : '<div>B0</div>'
	});
	equals(ui.getHeads().length, 2, 'get items after add');
	equals(ui.getHeads()[0].innerHTML, 'H1', 'get items after add');
	equals(ui.getHeads()[1].innerHTML, 'H0', 'get items after add');

	ui.removeItem(0);
	ui.removeItem(0);
	equals(ui.getHeads().length, 0, 'get items after add');
	equals(ui.getCurrentHead(), null, 'remove current head');

	ui.addItem({
		head : 'H0',
		body : '<div>B0</div>'
	});
	equals(ui.getHeads().length, 1, 'get items after add');
	equals(ui.getHeads()[0].innerHTML, 'H0', 'get items after add');
});
