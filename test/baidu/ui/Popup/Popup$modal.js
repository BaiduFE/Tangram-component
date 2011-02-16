module('baidu.ui.popup.Popup$modal');

test('modal',function(){
	var options = {
		modal :true,
		modalZIndex :1000
	};
	var popup = new baidu.ui.popup.Popup(options);
	te.obj.push(popup);
	popup.render();
	popup.open();
	equal(popup.modalColor,'#000000');
	equal(popup.modalOpacity,0.4);
	equal(popup.modalZIndex,1000);
	var m = popup.modalInstance.getMain();
	ok(popup.isShown(m),'modal is shown');
	equals($(m).css('opacity'), '0.4', 'check opacity after open');
	var c = $(m).css('backgroundColor');
	ok(c == 'rgb(0, 0, 0)' || c == '#000000', 'check color after open ' + c);
	popup.close();
	ok(!popup.isShown(m), 'modal hide after close');
});

test('change para',function(){
	var options = {
		zIndex : 1200,
		modal :true,
		modalColor : "#ff0000",
		modalOpacity : 0.7
	};
	var popup = new baidu.ui.popup.Popup(options);
	te.obj.push(popup);
	popup.render();
	popup.open();
	equal(popup.modalColor,'#ff0000');
	equal(popup.modalOpacity,0.7);
	
	var m = popup.modalInstance.getMain();
	equal($(m).css('zIndex'),popup.zIndex - 1);
	ok(popup.isShown(m),'modal is shown');
	equals($(m).css('opacity'), 0.7, 'check opacity after open');
	var c = $(m).css('backgroundColor');
	ok(c == 'rgb(255, 0, 0)' || c == '#ff0000', 'check color after open ' + c);
	popup.close();
	ok(!popup.isShown(m), 'modal hide after close');
});