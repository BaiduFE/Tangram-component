module('baidu.ui.Dialog.Dialog$button');

/**
 * <li>createButtons
 * <li>removeButtons
 */
test('create/remove buttons', function() {
	expect(4);
	var dialog = new baidu.ui.Dialog( {
		buttons : {
			"testButton" : {
				"content" : "OK"
			}
		}
	});
	dialog.render();
	ok(dialog.buttonInstances['testButton'], 'button is created');
	equal(dialog.getFooter().lastChild.innerHTML, 'OK',
			'check button description');
	equal(dialog.getFooter().lastChild.className,
			dialog.buttonInstances['testButton'].getClass(),
			'check button className');
	dialog.dispose();
	equal(dialog.buttonInstances, null, 'remove buttonInstances');
});

test('multi buttons', function() {
	expect(7);
	var d1 = new baidu.ui.Dialog( {
		buttons : {
			"okButton" : {
				"content" : "OK"
			},
			"cancelButton" : {
				"content" : "Cancel"
			}
		}
	});
	d1.render();
	ok(d1.buttonInstances['okButton'], 'OK button is created');
	ok(d1.buttonInstances['cancelButton'], 'cancel Button is created');
	
	equal(d1.getFooter().lastChild.innerHTML, 'Cancel',
			'check second button description');
	equal(d1.getFooter().firstChild.innerHTML, 'OK',
			'check first Button description');
	
	equal(d1.getFooter().firstChild.className,
			d1.buttonInstances['okButton'].getClass(),
			'check button className');
	equal(d1.getFooter().lastChild.className,
			d1.buttonInstances['cancelButton'].getClass(),
			'check button className');
	
	d1.dispose();
	equal(d1.buttonInstances, null, 'remove buttonInstances');
});