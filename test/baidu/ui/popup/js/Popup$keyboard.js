module('baidu.ui.Popup$keyboard');

test('closeonEsc', function() {
	var options = {
		closeOnEscape : true,
		modal : false,
		zIndex : 2000,
		modal : false,
		onopen : function() {
			ok(true, 'popup is opened');
		},
		onclose : function() {
			ok(true, 'popup is closed on Esc');
		}

	};
	var popup = new baidu.ui.popup.Popup(options);
	te.obj.push(popup);
	popup.render();
	popup.open();
	 UserAction.fireKeyEvent('keypress', document, {
	 'keyCode' : 27
	 });

	// alert(baidu.ui.popup.instances.length)
});