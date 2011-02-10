(function() {
	function mySetup() {
		var div = document.createElement('div');
		div.id = 'div_test';
		document.body.appendChild(div);

		var link = document.createElement("style");
		link.innerHTML = ".tangram-table{border : black solid 1px;}"+
			".tangram-table-title {background:pink;}"+
			".tangram-table-title-col{padding:5px; font-weight:bold; border:blue solid 2px;}"+
			".tangram-table-row {background:#eee;}"+
			".tangram-table-row-hover{background:pink; }"+
			".tangram-table-row-press{background:red; }"+
			".tangram-table-row-disabled{background:gray; }"+
			".tangram-table-row-selected{background:lightgreen; }"+
			".tangram-table-row-col{border:green solid 1px; padding:5px;}";
		document.body.appendChild(link);

		testingElement.dom.push(div);
		testingElement.dom.push(link);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);
		mySetup();
	};
})();