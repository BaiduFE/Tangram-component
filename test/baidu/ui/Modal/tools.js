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
		var count = 0;
		while (count++ < 2) {
			var id = "div_test"+count;
			var div = document.createElement("div");
			div.id = id;
			document.body.appendChild(div);
			te.dom.push(div);
		}
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);
		_testStart();
	};
})();
