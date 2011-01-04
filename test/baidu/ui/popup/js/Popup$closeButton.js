module('baidu.ui.popup.Popup$closeButton');

test('closeButton',function(){
	expect(1);
	var options = {
			contentText : "content",
			closeText : "closetext",
			width : '10px',
			modal :false
	};
	var popup = new baidu.ui.popup.Popup(options);
	te.obj.push(popup);
	popup.render();
	popup.open();
	/*closeButton insertHTML afterBefore popup.getBody()*/
	UserAction.click(popup.getBody().firstChild);
	equal(popup.isShown(),false,'popup hides after clicking close');
});