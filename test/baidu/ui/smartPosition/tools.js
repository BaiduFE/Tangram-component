function mySetup() {
	$(document.body).css('margin', '0');
	var div = document.createElement('div');
	div.id = 'div_test0';
	div.style.position = 'absolute';
	div.style.height = '20px';
	div.style.width = '20px';
	$(div).css('backgroundColor', 'yellow').css('zIndex', '1000');
	document.body.appendChild(div);
	testingElement.dom.push(div);

	var div1 = document.createElement('div');
	div1.id = 'div_test1';
	document.body.appendChild(div1);
	testingElement.dom.push(div1);
}

(function() {
	var s = QUnit.testStart, e = QUnit.testDone;
	QUnit.testStart = function() {
		s.apply(this, arguments);;
		mySetup(arguments[0]);
	};

	QUnit.testDone = function() {
		var lis = baidu.event._listeners, len = lis.length, item;
		
		while (len--) {
			item = lis[len];
			
			// listener存在时，移除element的所有以listener监听的type类型事件
			// listener不存在时，移除element的所有type类型事件
			if (item[1] === 'resize') {
				if (window.removeEventListener) {
					window.removeEventListener('resize', item[3], false);
				} else if (window.detachEvent) {
					window.detachEvent('onresize', item[3]);
				}
				lis.splice(len, 1);
			}
		}
		e.call(this, arguments);
	};
})();