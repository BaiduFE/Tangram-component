
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
		var id = "input_test";
		var input = document.createElement("input");
		input.id = id;
		input.type = "text";
		document.body.appendChild(input);
		te.dom.push(input);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);;
		_testStart();
	}
})()
