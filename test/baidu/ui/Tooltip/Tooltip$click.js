module("baidu.ui.Tooltip.Tooltip$click");

test('click触发显示隐藏', function() {
	expect(2);
	var div = te.dom[0];
	var div1 = document.createElement("div");
	document.body.appendChild(div1);
	var tp = new baidu.ui.Tooltip({
		target : div1,
		content : 'div_test_tooltip'
	});
	tp.render(div);
	ok(!isShown(tp.getBody()), 'hide before click');
	ua.click(div1);
	ok(isShown(tp.getBody()), 'shown after click');
	tp.close();
	te.obj.push(tp);
});

test('多个target', function() {
	expect(9);
	var div= te.dom;
	var div1 = document.createElement("div");
	document.body.appendChild(div1);
	var tp = new baidu.ui.Tooltip({
		target : div,
		content : 'div_test_tooltip'
	});
	tp.render(div1);
	for ( var i = 0; i < div.length; i++) {
		ua.click(div[i]);
		ok(isShown(tp.getBody()), 'shown after click');
		equals(tp.target[i].id, div[i].id, 'check target');
		tp.close();
		ok(!isShown(tp.getBody()), 'hide after close');
	}
	te.obj.push(tp);
});
 
 test("多种元素类型遍历上的click", function() {
	 expect(18);
	 var div = te.dom[0];
	 var typelist = [ 'a', 'span', 'img', 'h1', 'b', 'input' ];
	 var ele_list = [];
	 baidu.array.each(typelist, function(tag, i) {
		 var ele_test = document.createElement(tag[i]);
		 ele_test.id = 'test_' + [ i ];
		 div.appendChild(ele_test);
		 ele_list[i] = ele_test;
	 });
	 var tp = new baidu.ui.Tooltip({
		 target : ele_list,
		 content : 'div_test_tooltip'
	 });
	 tp.render(div);
	 for ( var i = 0; i < ele_list.length; i++) {
			ua.click(ele_list[i]);
			ok(isShown(tp.getBody()), 'shown after click');
			equals(tp.target[i].id, ele_list[i].id, 'check target');
			tp.close();
			ok(!isShown(tp.getBody()), 'hide after close');
		}
	te.obj.push(tp);
 });

 test('open之后，click触发显示隐藏', function() {
		expect(4);
		var div = te.dom[0];
		var div1 = document.createElement("div");
		document.body.appendChild(div1);
		var tp = new baidu.ui.Tooltip({
			target : div1,
			content : 'div_test_tooltip'
		});
		tp.render(div);
		tp.open(div1);
		ok(isShown(tp.getBody()), 'shown after open');
		ua.click(div1);
		ok(!isShown(tp.getBody()), 'hide before click');
		tp.open(div1);
		ok(isShown(tp.getBody()), 'shown after open');
		ua.click(document.body);
		ok(!isShown(tp.getBody()), 'hide before click');
		tp.close();
		te.obj.push(tp);
});
 
 test('dispose', function() {
		expect(1);
		var ie = baidu.event._listeners.length;
		var div= te.dom;
		var div1 = document.createElement("div");
		document.body.appendChild(div1);
		var tp = new baidu.ui.Tooltip({
			target : div,
			content : 'div_test_tooltip'
		});
		tp.render(div1);
		for ( var i = 0; i < div.length; i++) {
			ua.click(div[i]);
			tp.close();
		}
		tp.open(div[0]);
		ua.click(document.body);
		tp.dispose();
		var ic = baidu.event._listeners.length;
		equals(ie, ic, 'events are un');
	});