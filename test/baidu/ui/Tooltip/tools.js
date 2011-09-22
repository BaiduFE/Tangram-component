(function() {
	function mySetup() {
		for ( var i = 0; i < 3; i++) {
			var div = document.createElement('div');
			div.id = "div_test" + i;
			div.innerHTML = "div_test" + i;
			document.body.appendChild(div);
			te.dom.push(div);
		}
		
		te.mouseover = function(target){
			if(ua.browser.ie || ua.browser.opera)
				ua.simulateMouseEvent(target, 'mouseenter', 0, 0, window, 1, 0, 0, 0, 0,
						false, false, false, false, 0, document.documentElement);
			else
				UserAction.mouseover(target);
		}
		te.mouseout = function(target){
			if(ua.browser.ie || ua.browser.opera)
				ua.simulateMouseEvent(target, 'mouseleave', 0, 0, window, 1, 0, 0, 0, 0,
						false, false, false, false, 0, document.documentElement);
			else
				UserAction.mouseout(target);
		}
	}
	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);;
		mySetup();
	}
})();