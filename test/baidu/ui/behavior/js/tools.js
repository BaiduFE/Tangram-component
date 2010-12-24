(function() {
	function mySetup() {
		var div = document.createElement('div');
		div.id = 'div_test';
		$(div).css('position', 'absolute').css('left', '0').css('top', '0').css(
				'backgroundColor', 'red').css('width', '100px').css('height',
				'100px');
		document.body.appendChild(div);
		testingElement.dom.push(div);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);;
		mySetup();
	};
})();