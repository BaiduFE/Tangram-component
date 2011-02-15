
(function() {
	function mySetup() {
		var div = document.createElement('div');
		div.id = 'div_test';
		document.body.appendChild(div);
		var m = document.createElement('ul');
		m.className = 'menu';
		div.appendChild(m);
		var m1 = document.createElement('li');
		m1.id = 'm1';
		m1.innerHTML = 'm1';
		m.appendChild(m1);
		testingElement.dom.push(m1);
		testingElement.dom.push(m);
		testingElement.dom.push(div);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);;
		mySetup();
	}
})();