module("baidu.ui.tooltip.click");

test('click触发显示隐藏', function() {
	var div_test = testingElement.dom[0];
	var tp = baidu.ui.tooltip.click(div_test, {
		content : 'div_test_tooltip'
	});
	ok(!isShown(tp.getMain().firstChild), 'hide before click');
	UserAction.click(div_test);
	ok(isShown(tp.getMain().firstChild), 'shown after click');
	tp.close();
	te.obj.push(tp);
})

test("给定单element的click", function() {
	var div_test = testingElement.dom[0];
	var tp = baidu.ui.tooltip.click(div_test, {
		content : 'div_test_tooltip'
	});
	equals(tp.targetId, div_test.id, 'check element array');
	tp.close();
	te.obj.push(tp);
});

test("给定单id的click", function() {
	var div_test = testingElement.dom[0];
	var tp = baidu.ui.tooltip.click(div_test.id, {
		content : 'div_test_tooltip'
	});
	equals(tp.targetId, div_test.id, 'check element array');
	tp.close();
	te.obj.push(tp);
});

test('多实例', function() {
	var div_test = testingElement.dom;
	var tp = baidu.ui.tooltip.click(div_test, {
		content : 'test'
	});
	for ( var i = 0; i < div_test.length; i++) {
		UserAction.click(div_test[i]);
		ok(isShown(tp[i].getMain().firstChild), 'shown after click');
		equals(tp[i].targetId, div_test[i].id, 'check target');
		te.obj.push(tp[i]);
	}
});

// TODO
// test("多种元素类型遍历上的click", function() {
// var div_test = testingElement.dom[0];
// var typelist = [ 'a', 'span', 'img', 'h1', 'b', 'input' ];
// baidu.array.each(typelist, function(tag, i) {
// var ele_test = document.createElement(tag[i]);
// ele_test.id = 'test_' + [ i ];
// div_test.appendChild(ele_test);
// var tp = baidu.ui.tooltip.click(ele_test, {
// content : 'div_test_tooltip'
// });
//		
// ok(!isShown(tp.getMain().firstChild), 'hide default');
// UserAction.click(ele_test);
// ok(isShown(tp.getMain().firstChild), 'shown after click');
//		
// })
// });
