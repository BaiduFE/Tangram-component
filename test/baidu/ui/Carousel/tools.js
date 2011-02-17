(function() {
	function mySetup() {
		var div = document.createElement('div');
		div.id = 'div_test';
		document.body.appendChild(div);
		// div.style.position="absolute";
		var m = document.createElement('ul');
		m.className = 'menu';
		div.appendChild(m);
		var m1 = document.createElement('li');
		m1.id = 'm1';
		m1.innerHTML = 'm1';
		m.appendChild(m1);

		 var link = document.createElement("link");
		 link.setAttribute("rel", "stylesheet");
		 link.setAttribute("type", "text/css");
		 link.setAttribute("href",
		 '../../baidu/ui/Carousel/style.css');
		 document.getElementsByTagName("head")[0].appendChild(link);

//		var sheet = document.createElement("div");
//		document.getElementsByTagName("head")[0].appendChild(sheet);
//		var str = "<syle>"+
//		    ".tangram-carousel {position: relative; overflow: hidden;	border: green solid 4px;}"
//			+ ".tangram-carousel .tangram-carousel-scroll {position: absolute;border : blue solid 1px;}'"
//			+ ".tangram-carousel .tangram-carousel-scroll .tangram-carousel-item {position: relatiev;float: left;border: pink solid 1px;width: 80px;}"
//			+ ".tangram-carousel .tangram-carousel-scroll .tangram-carousel-item-focus {border: red solid 1px;background: #eee;}"
//			+ ".tangram-carousel-btn-base {float: left;}"
//			+ "td {border:solid 1px red;}"
//		    + "</style>";
//		sheet.innerHTML = str;
		testingElement.dom.push(m1);
		testingElement.dom.push(m);
		testingElement.dom.push(div);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);;
		mySetup();
	};
})();