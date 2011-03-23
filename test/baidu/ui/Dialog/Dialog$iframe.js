module("baidu.ui.Dialog.Dialog$iframe");

test('iframe', function() {
	var div = te.dom[0];
	var d, options = {
	    type: 'iframe',
		titleText : "title",
		contentText : "content",
		modal : false,
		iframeSrc : 'http://localhost/Tangram-component/test/tools/br'
	};
	d = new baidu.ui.Dialog(options);
	var id = d.getId('iframe');
	ok(!!id, 'The iframe is created');
	d.render(div);
	ok(d.contentText.indexOf(id) > 0, 'The parameter "contentText" of the dialog is set with the innerHTML of iframe');
	ok(d.getContent().innerHTML.indexOf(id) > 0, 'The iframe is put into the content of the dialog');
	equal(baidu.g(id).src, d.iframeSrc, "The src of the iframe is set");
	d.open();
	d.close();
	d.dispose();
	ok(false, 'TODO 校验iframe的位置和大小');
});
