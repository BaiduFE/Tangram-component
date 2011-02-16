
(function() {
	/**
	 * create a input for test start
	 * <li>create input
	 * <li>set id <b>input_test</b>
	 * <li>set type text
	 * 
	 * @return input@type text
	 */
	function _testStart() {
		var id = "div_test";
		var div = document.createElement("div");
		div.id = id;
		document.body.appendChild(div);
		te.dom.push(div);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);;
		_testStart();
	}
})()
