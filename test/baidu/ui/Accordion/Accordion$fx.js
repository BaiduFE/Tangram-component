module('baidu.ui.Accordion$fx');

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
	// 默认折叠操作500ms完成，300时提取确认
	// TODO fx相关的校验应该在fx自身完成，此处仅做简单校验
	setTimeout(function() {
		ok(isShown(ui.getBodies()[0]), 'item 0 shown before collapse finish');
		var height_cur = parseInt($(ui.getBodies()[0]).css('height'));
		ok(height_cur > 0 && height_cur < height, '折叠中的高度【' + height_cur
				+ '】小于起始高度【' + height + '】');
		start();
	}, 200);
	ui.render("div_test");
	var height = parseInt($(ui.getBodies()[0]).css('height'));
	ui.collapse();
	stop();
});
