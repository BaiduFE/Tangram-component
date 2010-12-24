
(function() {
	/**
	 * create a div for test start
	 * <li>create div
	 * <li>set id <b>div_test</b>
	 * <li>set type text
	 * 
	 * @return div@type text
	 */
	function _testStart() {
		var id = "div_test";
		var div = document.createElement("div");
		div.id = id;
		$(div).css('width', '200px').css('height', '20px').css('border', 'solid')
		.css('color', 'black').css('position', 'absolute');
		var link = document.createElement('link');
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("type", "text/css");
		link.setAttribute("href",
				'../../baidu/ui/progressBar/js/style.css');
		document.getElementsByTagName("head")[0].appendChild(link);
		document.body.appendChild(div);
		div.style.position = 'absolute';
		te.dom.push(div);
		te.dom.push(link);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);;
		_testStart();
	}
})()