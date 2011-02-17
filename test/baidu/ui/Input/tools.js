(function() {
	function mySetup() {
		var div_test = document.createElement("div");
		div_test.id = "div_test";
		document.body.appendChild(div_test);
		testingElement.dom.push(div_test);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);;
		mySetup();
	};
})();