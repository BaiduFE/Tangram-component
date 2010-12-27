module('baidu.ui.tab.create');

/**
 * 
 * @seealso click.js
 */
test('create', function(){
	var div_test = document.createElement("div");
	div_test.id = "div_test";
	document.body.appendChild(div_test);
	var options = {
		content : [ {
			label : "l0",
			content : "<p>c0</p>"
		}, {
			label : "l1",
			content : "<p>c1</p>"
		} ]
	};
	var t = baidu.ui.tab.create(div_test,options);
	var check = function(element, innerHTML, isshown, msg) {
		msg = msg || '';
		equals(isShown(element), isshown, 'check shown ' + msg);
		equals(element.innerHTML.toLowerCase(), innerHTML.toLowerCase(), 'check value' + msg);
	}
	var l0 = t.getLabel(0), l1 = t.getLabel(1);
	var c0 = t.getContent(l0), c1 = t.getContent(l1);
	check(l0.firstChild, options.content[0].label, true, 'for label 0');
	check(l1.firstChild, options.content[1].label, true, 'for label 1');
	check(c0, options.content[0].content, true, 'for content 0');
	check(c1, options.content[1].content, false, 'for content 1');
	t.dispose();
	document.body.removeChild(div_test);
})