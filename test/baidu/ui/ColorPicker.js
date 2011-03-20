module('baidu.ui.ColorPicker');
(function() {
	function mySetup() {
		var div = document.createElement('div');
		div.id = 'div_test';
		document.body.appendChild(div);
		var b1 = document.createElement('input');
		b1.id = 'b1';
		b1.type = "button";
		b1.value = "test";
		div.appendChild(b1);
		testingElement.dom.push(b1);
		testingElement.dom.push(div);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);
		mySetup();
	};
})();

function createColorPicker(options) {
	options = options || {};
	options.autoRender = true;
	options.element = te.dom[0];
	var colorPicker = baidu.ui.create(baidu.ui.ColorPicker, options);
	te.obj.push(colorPicker);
	return colorPicker;
}

test("create colorPicker and open", function() {
	stop();
	ua.loadcss(upath + 'ColorPicker/css/colorpicker.css', function() {
		var colorPicker = createColorPicker();
		equal(colorPicker.uiType, 'colorpicker', 'check uitype');
		colorPicker.open();
		ok(isShown(colorPicker.getBody()), 'colorPicker is shown');
		start();
	}, 'tangram-dialog-cancel', 'height', '20px');
});

test("onchosen", function() {
	var colorPicker = createColorPicker({
		onchosen : function(colorObj) {
			ok(!isShown(colorPicker.getBody()), 'colorPicker closed');
			equal('#B22222', colorObj.color);
		}
	});
	colorPicker.open();
	$('#' + colorPicker.getId('B22222')).click();
});

test("dispose", function() {
	var colorPicker = createColorPicker(), colorPickerId = colorPicker.getId();
	colorPicker.open();
	colorPicker.dispose();
	equals(baidu.g(colorPickerId), null,
			"Check colorPicker element exists or not");
});
