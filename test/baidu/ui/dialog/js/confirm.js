module("confirm");

/**
 * <ul>
 * check confirm
 * <li> check title
 * <li> check content
 * <li> check accept
 * <li> check cancel
 */
test('confirm',
		function() {
			expect(4);
			var options = {
				modal : false,
				ondispose : function() {
					ok(true, 'auto dispose');
				}
			};
			var cnts = "test confirm1";
			d = baidu.ui.dialog.confirm(cnts, options);
			equals(d.getFooter().firstChild.innerHTML, "确定", "check accept");
			equals(d.getFooter().firstChild.nextSibling.innerHTML, "取消",
					"check cancel");
			ok(d.isShown() && isShown(d.getMain()), "auto open");
			d.close();
		});

/**
 * <ul>
 * check confirm autoOpen
 * <li> check autoOpen
 * <li> check on open
 */
test("autoOpen", function() {
	expect(1);
	var ele, cnts = 'test confirm2', d, options = {
		autoOpen : false
	};
	var d = baidu.ui.dialog.confirm(cnts, options);
	ok(!d.isShown() && !isShown(d.getContent()),
			'dialog not shown if set autoOpen false');
	te.obj.push(d);
});

/**
 * <ul>
 * check confirm on accept
 * <li> check on accept
 */
test("accept", function() {
	expect(2);
	var cnts = 'test confirm3', d, options = {
		onaccept : function() {
			ok(true, 'onaccept dispatched');
		},
		oncancel : function() {
			ok(false, 'oncancel should not dispatched');
		},
		modal : false
	};
	var d = baidu.ui.dialog.confirm(cnts, options);
	var b = d.getFooter().firstChild;
	equals(b.innerHTML, "确定", 'check accept button text');
	UserAction.click(b);
	te.obj.push(d);
});

/**
 * <ul>
 * check confirm on cancel
 * <li> check on cancel
 */
test("cancel", function() {
	expect(2);
	var cnts = 'test confirm3', d, options = {
		onaccept : function() {
		/*检验事件是否相互影响*/
			ok(false, 'onaccept should not be dispatched');
		},
		oncancel : function() {
			ok(true, 'oncancel dispatched');
		},
		modal : false
	};
	var d = baidu.ui.dialog.confirm(cnts, options);
	var b = d.getFooter().firstChild.nextSibling;
	equals(b.innerHTML, "取消", 'check cancel button text');
	UserAction.click(b);
	te.obj.push(d);
});

test('content is dom', function() {
	var d = document.createElement('div');
	d.id = 'test_div';
	d.innerHTML = 'test div';
	document.body.appendChild(d);
	var c = baidu.ui.dialog.confirm(d, {
		modal : false
	});
	equals(c.getContent().firstChild.id, d.id, 'check dom id');
	equals(c.getContent().firstChild.innerHTML, d.innerHTML,
			'check dom innerHTML');
	c.close();
	te.obj.push(c);
})

test('autoOpen', function() {
	var cnt = 'test confirm3', c = baidu.ui.dialog.confirm(cnt, {
		modal : false,
		autoOpen : false
	});
	ok(!isShown(c.getMain()) && !c.isShown(), 'autoOpen false');
	te.obj.push(c);

	var b = baidu.ui.dialog.confirm(cnt, {
		modal : false,
		autoOpen : true
	});
	ok(isShown(b.getMain()) && b.isShown(), 'autoOpen true');
	b.close();
	te.obj.push(b);
})

test('autoDispose', function() {
	var cnt = 'test confirm3', c = baidu.ui.dialog.confirm(cnt, {
		modal : false,
		autoDispose : false
	});
	c.close();
	ok(!c.disposed, 'autoDispose false');
	te.obj.push(c);

	var b = baidu.ui.dialog.confirm(cnt, {
		modal : false,
		autoDispose : true
	});
	b.close();
	ok(b.disposed, 'autoDispose true');
	te.obj.push(b);
});

test('press enter key', function() {
	expect(2);
	var cnt = 'alert', c = baidu.ui.dialog.confirm(cnt, {
		modal : false,
		onaccept : function() {
			ok(true, 'on accept');
		},
		oncancel : function() {
			ok(false, "oncancel shouldn't be called");
		},
		autoDispose : false
	});
	c.render();
	ua.keyup(c.getBody(), {
		keyCode : 13
	});

	equal(baidu.ui.dialog.instances[c.guid], "hide", 'check dialog status');
});

test('dialog position', function() {
	var options = {
		width : '300px',
		height : '302px'
	};
	var cnts = 'test confirm3';
	var d = baidu.ui.dialog.confirm(cnts, options);
	equal($(d.getBody()).css('width'), '300px', 'check dialog width');
	/* 确定和取消2个按钮的高度 */
	equal(parseInt($(d.getBody()).css('height')),
			302 + d.getFooter().offsetHeight, 'check dialog height');
	var left = (baidu.page.getViewWidth() - parseInt(d.getMain().offsetWidth))
			/ 2 + baidu.page.getScrollTop();
	var top = (baidu.page.getViewHeight() - parseInt(d.getMain().offsetHeight))
			/ 2 + baidu.page.getScrollLeft();
	equal(parseInt(d.getMain().style.left), Math.floor(left > 0 ? left : 0),
			'check left');
	/* ie中会自动将0.5去掉 */
	equal(parseInt(d.getMain().style.top), parseInt(top > 0 ? top : 0),
			'check top');
	equal(d.getMain().style.right, '', 'check right');
	equal(d.getMain().style.bottom, '', 'check bottom');
	te.obj.push(d);

})
