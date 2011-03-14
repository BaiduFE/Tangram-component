module('baidu.ui.Accordion');

(function() {
	function mySetup() {
		var div = document.createElement('div');
		div.id = 'div_test';
		document.body.appendChild(div);
		testingElement.dom.push(div);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);
		;
		mySetup();
	};

	te.getUI = function(op) {
		var ui = new baidu.ui.Accordion(op || {});
		te.obj.push(ui);
		return ui;
	};
})();

test('base', function() {
	var ui = te.getUI({
		items : [ {
			head : 'H0',
			body : 'BODY-0-0<br/>BODY-0-1'
		}, {
			head : 'H1',
			body : 'BODY-1-0<br/>BODY-1-1'
		} ]
	});
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
	var ui = te.getUI({
		items : [ {
			head : 'H0',
			body : 'BODY-0-0<br/>BODY-0-1'
		}, {
			head : 'H1',
			body : 'BODY-1-0<br/>BODY-1-1'
		} ]
	});
	ui.render("div_test");
	ui.insertItemHTML({
		head : 'H4',
		body : 'body4-0<br/>body4-1'
	}, 1);
	equals(ui.getHeads().length, 3, 'check sub items length');
	equals(ui.getHeads()[1].innerHTML, 'H4', 'check inserted item');
	equals(ui.getBodies()[1].innerHTML, 'body4-0<br/>body4-1',
			'check inserted item');
});

test('function - collapse & event beforecollapse', function() {
	var ui = te.getUI({
		items : [ {
			head : 'H0',
			body : 'BODY-0-0<br/>BODY-0-1'
		}, {
			head : 'H1',
			body : 'BODY-1-0<br/>BODY-1-1'
		} ],beforecollapse:function(){
			ok(true, 'beforecollapse dispatched');
			ok(isShown(ui.getBodies()[0]), 'item 0 shown before collapse');
		}
	});
	ui.render("div_test");
	ui.collapse();
	ok(!isShown(ui.getBodies()[0]), 'item 0 hide after collapse');
	expect(3);
});
