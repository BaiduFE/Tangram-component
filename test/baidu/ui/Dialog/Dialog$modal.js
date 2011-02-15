module('baidu.ui.Dialog.Dialog$modal');

test('shown on open', function() {
	var options = {
		titleText : "title",
		contentText : "content"
	};
	var d = new baidu.ui.Dialog(options);
	d.render();
	ok(d.modal, 'check modal register');
	equals(d.modalColor, '#000000', 'check color');
	equals(d.modalOpacity, 0.4, 'check opacity');
	d.open();
	var m = d.modalInstance.getMain();
	ok(isShown(m), 'modal shown on open');
	equals($(m).css('opacity'), '0.4', 'check opacity after open');
	var c = $(m).css('color');
	ok(c == 'rgb(0, 0, 0)' || c == '#000000', 'check color after open ' + c);
	d.close();
	ok(!isShown(m), 'modal hide after close');
	te.obj.push(d);
});

test('closeing on multi instance', function() {
	var success = true, d1, d2, op;
	op = {
		titleText : "title",
		contentText : "content",
		onclose : function() {
			ok(success, 'call close');
		}
	};
	d1 = new baidu.ui.Dialog(op);
	d1.render();
	d2 = new baidu.ui.Dialog(op);
	d2.render();
	d1.open();

	ok(isShown(d1.modalInstance.getMain()),
			'modal shown after dialog open');
	d2.open();
	ok(isShown(d2.modalInstance.getMain()),
			'modal shown after dialog open');
	d2.close();
	ok(isShown(d2.modalInstance.getMain()),
			'modal shown before all dialog closed');
	d1.close();
	ok(!isShown(d2.modalInstance.getMain()),
			'modal hide after all dialog closed');
	d2.open();
	ok(isShown(d2.modalInstance.getMain()),
			'modal shown after dialog open again');

	te.obj.push(d1);
	te.obj.push(d2);
});


test('open 2 times', function() {
	expect(2);
	var options = {
		titleText : "title",
		contentText : "content"
	};
	var d = new baidu.ui.Dialog(options);
	d.render();
	d.open();
	var modalInstance = d.modalInstance;
	d.close();
	d.open();
	equal(d.modalInstance.getId(),modalInstance.getId(),'check only a modal is created');
	same(d.modalInstance.getMain(),modalInstance.getMain(),'check getMain');
	d.close();
	te.obj.push(d);
});

test('ondispose',function(){
		var success = true, d1, d2, op;
	op = {
		titleText : "title",
		contentText : "content",
		ondispose : function() {
			ok(success, 'call close');
		}
	};
	expect(6);
	d1 = new baidu.ui.Dialog(op);
	d1.render();
	d2 = new baidu.ui.Dialog(op);
	d2.render();
	d1.open();

	ok(isShown(d1.modalInstance.getMain()),
			'modal shown after dialog open');
	d2.open();
	ok(isShown(d2.modalInstance.getMain()),
			'modal shown after dialog open');
	d2.dispose();
	ok(!isShown(d2.modalInstance),
			'modal shown before all dialog disposed');
	d1.dispose();
	ok(!isShown(d2.modalInstance),
			'modal hide after all dialog disposed');
	te.obj.push(d1);
})