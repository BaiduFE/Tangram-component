module("baidu.ui.Dialog.Dialog$autoDispose");

test('When the paremeter "autoDispose" is true or undefined', function() {
	var d, evtlist, updated = false, options = {
		titleText : "title",
		contentText : "content",
		modal : false
	}
	var ie = baidu.event._listeners.length;
	d = new baidu.ui.Dialog(options);
	d.render();
	d.close();
	var ic = baidu.event._listeners.length;
	equals(ic, ie, 'after close, event is un');
	ok(!isShown(d.getMain()), 'hide after dispose');
})

test('When the paremeter "autoDispose" is false', function() {
	var d, evtlist, updated = false, options = {
		titleText : "title",
		contentText : "content",
		modal : false,
		autoDispose : false
	}
	var ie = baidu.event._listeners.length;
	d = new baidu.ui.Dialog(options);
	d.render();
	d.close();
	var ic = baidu.event._listeners.length;
	equals(ic, ie+1, 'after close, event is not un');
	d.dispose();
	var ia = baidu.event._listeners.length;
	equals(ia, ie, 'after dispose, event is un');
	ok(!isShown(d.getMain()), 'hide after dispose');
})