module('baidu.ui.Dialog.Dialog$smartCover');

test('onopen/update',function(){
	var d = new baidu.ui.Dialog();
	d.render();
	var flash = document.createElement('object');
	var select = document.createElement('select');
	document.body.appendChild(flash);
	document.body.appendChild(select);
	d.open();
	if (baidu.browser.ie) {
		// update
		expect(3);
		equal(d.getMain().lastChild.offsetWidth,
				d.getMain().offsetWidth);
		equal(d.getMain().lastChild.offsetHeight,
				d.getMain().offsetHeight);
	}
	else expect(1);
	equal($(flash).css('visibility'), 'hidden','flash is hidden by smartCover');
	document.body.removeChild(flash);
	document.body.removeChild(select);
});


test('onclose',function(){
	var d = new baidu.ui.Dialog();
	d.render();
	var flash = document.createElement('object');
	var select = document.createElement('select');
	document.body.appendChild(flash);
	document.body.appendChild(select);
	d.open();
	d.close();
	equal(flash.style.visibility, '','flash shows by closing smartCover');
	document.body.removeChild(flash);
	document.body.removeChild(select);
});