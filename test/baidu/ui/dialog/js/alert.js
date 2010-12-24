module('baidu.ui.dialog.alert')

/**
 * check alert default
 * <li> check contents
 * <li> check accept button
 * <li> check autoopen
 */
test('alert', function() {
	expect(6);
	var cnt = 'alert', a = baidu.ui.dialog.alert(cnt, {
		modal : false
	});
	equals(a.getContent().innerHTML, cnt, 'check content');
	equals(a.uiType, 'DIALOG', 'check type');
	equals(a.type, 'alert', 'check dialog type');
	var ab = a.getFooter().firstChild;
	equals(ab.innerHTML, '确定', 'check accept button');
	ok(isShown(a.getContent()), 'autoOpen');
	UserAction.click(ab);
	/* auto dispose on close */
	ok(!a.getMain(), 'disposed on close auto');
	te.obj.push(a);
});

test('press enter key', function() {
	expect(2);
	var cnt = 'alert', a = baidu.ui.dialog.alert(cnt, {
		modal : false,
		onaccept : function() {
			ok(true, 'on accept');
		},
		autoDispose : false
	});
	a.render();
	ua.keyup(a.getBody(), {
		keyCode : 13
	});

	equal(baidu.ui.dialog.instances[a.guid], "hide", 'check dialog status');
});

test('content is dom', function() {
	var d = document.createElement('div');
	d.id = 'test_div';
	d.innerHTML = 'test div';
	document.body.appendChild(d);
	var a = baidu.ui.dialog.alert(d, {
		modal : false
	});
	equals(a.getContent().firstChild.id, d.id, 'check dom id');
	equals(a.getContent().firstChild.innerHTML, d.innerHTML,
			'check dom innerHTML');
	a.close();
	te.obj.push(a);
})

test('autoOpen', function() {
	var cnt = 'alert', a = baidu.ui.dialog.alert(cnt, {
		modal : false,
		autoOpen : false
	});
	ok(!isShown(a.getMain()) && !a.isShown(), 'autoOpen false');
	te.obj.push(a);

	var b = baidu.ui.dialog.alert(cnt, {
		modal : false,
		autoOpen : true
	});
	ok(isShown(b.getMain()) && b.isShown(), 'autoOpen true');
	b.close();
	te.obj.push(b);
})

test('autoDispose', function() {
	var cnt = 'alert', a = baidu.ui.dialog.alert(cnt, {
		modal : false,
		autoDispose : false
	});
	a.close();
	ok(!a.disposed, 'autoDispose false');
	te.obj.push(a);

	var b = baidu.ui.dialog.alert(cnt, {
		modal : false,
		autoDispose : true
	});
	b.close();
	ok(b.disposed, 'autoDispose true');
	te.obj.push(b);
})

test('dialog position', function() {
	var options = {
		width : '300px',
		height : '302px'
	};
	var cnts = 'test alert';
	var d = baidu.ui.dialog.alert(cnts, options);
	equal($(d.getBody()).css('width'), '300px', 'check dialog width');
	equal(parseInt($(d.getBody()).css('height')), 302
			+ d.getFooter().offsetHeight + d.getTitle().offsetHeight,
			'check dialog height');
	var left = (baidu.page.getViewWidth() - parseInt(d.getMain().offsetWidth))
			/ 2 + baidu.page.getScrollTop();
	var top = (baidu.page.getViewHeight() - parseInt(d.getMain().offsetHeight))
			/ 2 + baidu.page.getScrollLeft();
	equal(d.getMain().style.left, (left > 0 ? left : 0) + 'px', 'check left');
	equal(d.getMain().style.top, (top > 0 ? top : 0) + 'px', 'check top');
	equal(d.getMain().style.right, '', 'check right');
	equal(d.getMain().style.bottom, '', 'check bottom');
	te.obj.push(d);

})

test('left&top', function() {
	var options = {
		left : '120px',
		top : 100
	};
	var cnts = 'test alert';
	var d = baidu.ui.dialog.alert(cnts, options);
	stop();
	setTimeout(function() {
		equal(d.getMain().style.left, '120px');
		equal(d.getMain().style.top, '100px');
		equal(d.getMain().style.right, '', 'check right');
		equal(d.getMain().style.bottom, '', 'check bottom');
		te.obj.push(d);
		start();
	}, 100);

});

test('right&bottom', function() {
	var options = {
		bottom : '100px',
		right : 200
	};
	var cnts = 'test alert';
	var d = baidu.ui.dialog.alert(cnts, options);
	stop();
	setTimeout(function() {
		equal(d.getMain().style.left, 'auto');
		equal(d.getMain().style.top, 'auto');
		equal(d.getMain().style.right, '200px', 'check right');
		equal(d.getMain().style.bottom, '100px', 'check bottom');
		start();
	}, 100);
});
