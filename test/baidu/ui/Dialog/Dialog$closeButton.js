module('baidu.ui.Dialog.Dialog$closeButton')

/**
 * <ul>
 * test for close button
 * <li> check click and close
 */
test("close button", function() {
	expect(1);
	var d, updated = false, options = {
		titleText : "title",
		contentText : "content",
		modal : false
	};
	d = new baidu.ui.Dialog(options);
	d.render();
	d.open();

	/**
	 * <li> check id
	 * <li> check class
	 * <li> check event
	 */

	/* click close button, 默认close在title右侧 */
	UserAction.click(d.getTitleInner().nextSibling);
	ok(!isShown(d.getContent()) && !d.isShown(), 'hide after click close');
	te.obj.push(d);
});