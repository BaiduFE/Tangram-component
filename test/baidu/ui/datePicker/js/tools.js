
(function() {
	function mySetup() {
		var input = document.createElement('input');
		input.id = 'input_test';
		document.body.appendChild(input);
		testingElement.dom.push(input);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);;
		mySetup();
	}
})();