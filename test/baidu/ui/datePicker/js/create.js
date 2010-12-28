module('baidu.ui.datePicker.create');

test('默认初始化', function() {
	var dp = baidu.ui.datePicker.create(te.dom[0]);
	ok(dp.popup, 'popup is created');
	equal(dp.popup.isOpen, true, 'popup is open');
	var date = new Date();
	if (!baidu.browser.ie) {
		var frame = baidu.dom.g(dp.popup.eid);
		equal(parseInt(frame.style.width), 178, 'popup width');
		equal(parseInt(frame.style.height), 164, 'popup height');
		equal(dp.g("current").innerHTML, date.getFullYear() + '年'
				+ (date.getMonth() + 1) + '月', 'get Current month');
		UserAction.click(document);
		equal(frame.style.width, '0px');
		equal(frame.style.height, '0px');
	}

	UserAction.click(document);
	equal(dp.popup, null, 'popup is hidden');
});

test('input get value', function() {
	var dp = baidu.ui.datePicker.create(te.dom[0]);
	var date = new Date();
	var input = te.dom[0];
	UserAction.click(dp.g('header'));
	equal(input.value, date.getFullYear() + '-' + (date.getMonth() + 1) + '-'
			+ ((date.getDate())>9?date.getDate():'0'+date.getDate()));
})