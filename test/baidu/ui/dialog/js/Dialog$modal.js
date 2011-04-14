module('baidu.ui.dialog.Dialog$modal');

test('shown on open and hidden on close',function() {
	stop();
	ua.loadcss(upath + 'css/style.css', function() {
			var options = {
				titleText : "title",
				contentText : "contentText"
			};

            var d = new baidu.ui.dialog.Dialog(options);
			d.render();
			ok(d.modal, 'check modal register');
			equals(d.modalColor, '#000000', 'check color');
			equals(d.modalOpacity, 0.4, 'check opacity');
			d.open();
			var m = d.modalInstance.getMain();
			ok(isShown(m), 'modal shown on open');
			equals($(m).css('opacity').substr(0, 3), '0.4',
					'check opacity after open');
			var c = $(m).css('color');
			ok(c == 'rgb(0, 0, 0)' || c == '#000000', 'check color after open '
					+ c);
			d.close();
			ok(!isShown(m), 'modal hide after close');
			te.obj.push(d);
			start();
	}, 'tangram-dialog', 'padding-bottom', '18px');
});

test('closing on multi instance', function() {
	var success = true, d1, d2, op;
	op = {
		titleText : "title",
		contentText : "content",
		onclose : function() {
			ok(success, 'call close');
		}
	};
	d1 = new baidu.ui.dialog.Dialog(op);
	d1.render();
	d2 = new baidu.ui.dialog.Dialog(op);
	d2.render();
	d1.open();

	ok(isShown(d1.modalInstance.getMain()), 'modal shown after dialog open');
	d2.open();
	ok(isShown(d2.modalInstance.getMain()), 'modal shown after dialog open');
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

test('open twice', function() {
	expect(2);
	var options = {
		titleText : "title",
		contentText : "content"
	};
	var d = new baidu.ui.dialog.Dialog(options);
	d.render();
	d.open();
	var modalInstance = d.modalInstance;
	d.close();
	d.open();
	equal(d.modalInstance.getId(), modalInstance.getId(),
			'check only a modal is created');
	same(d.modalInstance.getMain(), modalInstance.getMain(), 'check getMain');
	d.close();
	te.obj.push(d);
});

test('ondispose', function() {
	var success = true, d1, d2, op;
	op = {
		titleText : "title",
		contentText : "content",
		ondispose : function() {
			ok(success, 'call close');
		}
	};
	expect(6);
	d1 = new baidu.ui.dialog.Dialog(op);
	d1.render();
	d2 = new baidu.ui.dialog.Dialog(op);
	d2.render();
	d1.open();

	ok(isShown(d1.modalInstance.getMain()), 'modal shown after dialog open');
	d2.open();
	ok(isShown(d2.modalInstance.getMain()), 'modal shown after dialog open');
	d2.dispose();
	ok(!isShown(d2.modalInstance), 'modal shown before all dialog disposed');
	d1.dispose();
	ok(!isShown(d2.modalInstance), 'modal hide after all dialog disposed');
	te.obj.push(d1);
});

test('hide two-layer flash',function() {
	stop();
	var check = function(){
		ua.loadcss(upath + 'css/style.css', function() {
				var options = {
					titleText : "title",
					contentText : '<object width="695" height="90" align="middle" id="flash4" style=""><embed width="695" height="90" align="middle" pluginspage="http://www.macromedia.com/go/getflashplayer" name="flash4" src=' + upath + "flash/test_flash.swf" + ' wmode="window"></object>'
				};
				var div1 = document.createElement('div');
				div1.id = 'flashContainer1';
				document.body.appendChild(div1);
				baidu.swf.create({
			        id: "flash1",
			        url: upath + 'flash/test_flash.swf',
			        width:695,
			        height:90,
			        wmode:'transparent'
			    }, "flashContainer1");
				var div2 = document.createElement('div');
				div2.id = 'flashContainer2';
				document.body.appendChild(div2);
				baidu.swf.create({
			        id: "flash2",
			        url: upath + 'flash/test_flash.swf',
			        width:695,
			        height:90,
			        wmode:'window'
			    }, "flashContainer2");
				var div3 = document.createElement('div');
				div3.id = 'flashContainer3';
				document.body.appendChild(div3);
				baidu.swf.create({
			        id: "flash3",
			        url: upath + 'flash/test_flash.swf',
			        width:695,
			        height:90,
			        wmode:'opaque'
			    }, "flashContainer3");
				//第一个Dialog start
	            var d = new baidu.ui.dialog.Dialog(options);
				d.render();
				ok(d.modal, 'check modal register');
				equals(d.modalColor, '#000000', 'check color');
				equals(d.modalOpacity, 0.4, 'check opacity');
				d.open();
				var m = d.modalInstance.getMain();
				ok(isShown(m), 'modal shown on 1 dialog open');
				equals($(m).css('opacity').substr(0, 3), '0.4',
						'check opacity after open');
				var c = $(m).css('color');
				ok(c == 'rgb(0, 0, 0)' || c == '#000000', 'check color after open '
						+ c);
				equals(baidu.g("flashContainer2").firstChild.style.visibility, "hidden", "The window flash is hidden PUBLICGE-383");
				//第二个Dialog start
				var options_new = {
						titleText : "title",
						contentText : "contentText",
						zIndex : d.getMain().style["zIndex"] +1
					};
				var d_new= new baidu.ui.dialog.Dialog(options_new);
				d_new.render();
				d_new.open();
				var m_new = d_new.modalInstance.getMain();
				ok(isShown(m_new), 'modal shown on all dialogs open');
				equals(baidu.g("flash4").style.visibility, "hidden", "The window flash is hidden");
				d_new.close();
				ok(isShown(m_new), 'modal shown after 1 dialog close');
				ok(baidu.g("flash4").style.visibility == "visible" || baidu.g("flash4").style.visibility == "inherit", "The window flash is shown");
				//第二个Dialog end
				d.close();
				ok(!isShown(m), 'modal hide after all dialogs close');
				ok(baidu.g("flashContainer2").style.visibility == "visible" || baidu.g("flashContainer2").style.visibility == "", "The window flash is shown");
				//第一个Dialog end
				te.obj.push(d);
				te.obj.push(d_new);
				document.body.removeChild(div1);
			    document.body.removeChild(div2);
			    document.body.removeChild(div3);
				start();
		}, 'tangram-dialog', 'padding-bottom', '18px');
	}
	ua.importsrc('baidu.swf.create', 
			check ,'baidu.swf.create', 'baidu.ui.Suggestion.Suggestion$coverable');
});