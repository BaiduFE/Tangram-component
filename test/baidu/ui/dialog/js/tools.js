(function() {
	function mySetup() {
		/* set as false for dialog keyboard listeners */
//		baidu.ui.dialog.keyboardEventReady = false;
	}
	var s = QUnit.testStart;
	QUnit.testStart = function() {
		mySetup();
		s.apply(this, arguments);;
	}
})()