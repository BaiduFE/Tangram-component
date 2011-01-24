
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
		s.apply(this, arguments);;
		mySetup();
	}
})();