module('baidu.ui.dialog.Dialog$alert');

test('button', function() {
	var options = {
		'type' : 'alert',
		onopen : function() {
			equal(baidu.ui.dialog.instances[da.guid], "show", 'open dialog');
		},
		onclose : function() {
			equal(baidu.ui.dialog.instances[da.guid], "hide", 'close dialog');
		}
	};
	var da = new baidu.ui.dialog.Dialog(options);
	da.render();
	da.open();
	var button = baidu.g(da.getId("footer")).lastChild;
	equal(button.className, da.getClass('ok'), 'check class');
	equal(button.innerHTML, da["okText"], 'check content');
	ua.click(button);
})