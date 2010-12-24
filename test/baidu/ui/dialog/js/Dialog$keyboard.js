module('baidu.ui.dialog.Dialog$keyboard');
/**
 * <ul>
 * test for escape, need manual testing
 * <li> check send keydown and dialog closed
 */
test("Escape", function() {
	var success = true, d = new baidu.ui.dialog.Dialog( {
		titleText : "title",
		contentText : "content",
		onclose : function() {
			ok(success, 'call close by type key 27');
		},
		modal : false
	});
	d.render();
	d.open();
	UserAction.keyup(document, {
		keyCode : 27
	});
	ok(!isShown(d.getMain()) && !d.isShown(), 'hide after type escape');
	d.dispose();
});

test("multi instance", function() {
	expect(5);
	var success = true, d1, d2, op;
	op = {
		titleText : "title",
		contentText : "content",
		modal : false
	};
	d1 = new baidu.ui.dialog.Dialog(op);
	d2 = new baidu.ui.dialog.Dialog(baidu.extend(op, {
		titleText : "ttitle",
		top : 100,
		zIndex : 2000
	}));
	d1.render();
	d2.render();
	d1.open();
	d2.open();
	UserAction.keyup(document, {
		keyCode : 27
	});
	ok(!isShown(d2.getMain()) && !d2.isShown(), 'hide after type escape');
	ok(isShown(d1.getMain()) && d1.isShown(), 'not hide after type escape');
	UserAction.keyup(document, {
		keyCode : 27
	});
	ok(!isShown(d2.getMain()) && !d2.isShown(), 'hide after type escape');
	ok(!isShown(d1.getMain()) && !d1.isShown(), 'hide after second escape');
	d1.dispose();
	d2.dispose();
	equal(baidu.event._listeners.length,0);
});

test('remove listeners', function() {
	var op = {
		titleText : "title",
		contentText : "content",
		modal : false
	};
	var d1 = new baidu.ui.dialog.Dialog(op);
	d1.render();
	d1.open();
	var length = baidu.event._listeners.length;
	d1.dispose();
	equal(baidu.event._listeners.length, length - 2, 'delete listener');

});

test('remove listeners-multi dialogs', function() {
	var op = {
		titleText : "title",
		contentText : "content",
		modal : false
	};
	var d1 = new baidu.ui.dialog.Dialog(op);
	var d2 = new baidu.ui.dialog.Dialog(op);
	d1.render();
	d2.render()
	d1.open();
	d2.open();
	var length = baidu.event._listeners.length;
	d1.dispose();
	/*resize is removed in dispose*/
	equal(baidu.event._listeners.length, length-1, 'will not delete keyup listener');
	te.obj.push(d2);

});