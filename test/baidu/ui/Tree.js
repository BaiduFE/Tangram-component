/**
 * check Button properties, methods and events
 */
module("baidu.ui.Tree");

(function() {
	function mySetup() {
		var div = document.createElement('div');
		div.id = 'div_test';
		document.body.appendChild(div);
		testingElement.dom.push(div);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);;
		mySetup();
	};
})();

//getString函数被取消
/*test("getString", function() {
	var options = {
		content : "按钮"
	};
	var button = new baidu.ui.Button(options);
	ok(button.getString().indexOf("按钮") > 0, "button string");
});*/

test("render--no argument", function() {
	var options = {
		data: {
            id: '01',
            text: '根节点'
        }
	};
	var tree = new baidu.ui.Tree(options);
	var div = document.createElement('div');
	document.body.appendChild(div);
	tree.render(div);
	ok(isShown(tree.getBody()), 'tree has been shown');
	te.dom.push(tree.getMain());
});


	
