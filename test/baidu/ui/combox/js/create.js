module('baidu.ui.combox.create')
/**  combox在用例结束以前一定要调用dispose，否则会对下面的用例产生影响 **/

test('tip mode-all hint', function() {
	stop();
	expect(8);
	var data = [ {
		content : 'a-content-1'
	}, {
		content : 'b-content-2'
	}, {
		content : 'c-content-3'
	} ];
	var cb = baidu.ui.combox.create(data);
	// cb.render();
	var input = cb.getInput();
	var menubar = cb.menu;
	ok(menubar, 'menubar is created');
	equal(cb.uiType, 'COMBOX', 'ui type');
	input.focus();
	setTimeout(function() {
		var first = cb.menu.getBody().firstChild;
		equal(cb.menu.getBody().childNodes.length, 3, 'total 3 results');
		equal(first.innerHTML, 'a-content-1');
		equal(cb.menu.getBody().childNodes[1].innerHTML, 'b-content-2')
		equal(first.nextSibling.innerHTML, 'b-content-2');
		equal(cb.menu.getBody().lastChild.innerHTML, 'c-content-3');
		input.value = 'a';
		input.focus();
		equal(cb.menu.getBody().firstChild.innerHTML, 'a-content-1',
				'hint is a');//		filter
		te.dom.push(menubar.getBody());
		te.dom.push(input);
		cb.dispose();
		start();
	}, 20);

});

	test('tip mode-filter number', function() {// 多次模拟输入，第二次很奇怪，提示不生效
		stop();
		expect(3);
		var data = [ {
			content : 'a-content-1'
		}, {
			content : 'b-content-2'
		}, {
			content : 'c-content-3'
		} ];
		var cb = baidu.ui.combox.create(data);
		var input = cb.getInput();
		var menubar = cb.menu;
		input.value = '2';
		input.focus();
		setTimeout(function() {
			equal(input.value, cb.getInput().value);
			equal(cb.menu.getBody().childNodes.length, 1, 'get one hint');
			equal(cb.menu.getBody().firstChild.innerHTML, 'b-content-2',
					'hint is 2');// filter
			te.dom.push(menubar.getBody());
			te.dom.push(input);
			cb.dispose();
			start();
		}, 20);
	});
	
	test('tip mode-filter multi chars', function() {// 多次模拟输入，第二次很奇怪，提示不生效
		stop();
		expect(2);
		var data = [ {
			content : 'a-content-1'
		}, {
			content : 'b-content-2'
		}, {
			content : 'c-content-3'
		} ];
		var cb = baidu.ui.combox.create(data);
		var input = cb.getInput();
		var menubar = cb.menu;
		input.value = 'content-3';
		input.focus();
		setTimeout(function() {
			equal(cb.menu.getBody().childNodes.length, 1, 'get one hint');
			equal(cb.menu.getBody().firstChild.innerHTML, 'c-content-3',
					'hint is content-3');// filter
			te.dom.push(menubar.getBody());
			te.dom.push(input);
			cb.dispose();
			start();
		}, 20);
	});
		test('tip mode-filter no matches', function() {// 多次模拟输入，第二次很奇怪，提示不生效
			stop();
			expect(2);
			var data = [ {
				content : 'a-content-1'
			}, {
				content : 'b-content-2'
			}, {
				content : 'c-content-3'
			} ];
			var cb = baidu.ui.combox.create(data);
			var input = cb.getInput();
			var menubar = cb.menu;
			input.value = 'content-6';
			input.focus();
			setTimeout(function() {
				equal(cb.menu.getBody().childNodes.length, 0, 'get one hint');
				equal(cb.menu.getBody().innerHTML, '',
						'hint is content-6');// filter
				te.dom.push(menubar.getBody());
				te.dom.push(input);
				cb.dispose();
				start();
			}, 20);
});