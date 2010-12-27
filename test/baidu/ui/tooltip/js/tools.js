(function() {
	function mySetup() {
		for ( var i = 0; i < 3; i++) {
			var div = document.createElement('div');
			div.id = "div_test" + i;
			div.innerHTML = "div_test" + i;
			document.body.appendChild(div);
			te.dom.push(div);
		}
	}
	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);;
		mySetup();
	}
})();