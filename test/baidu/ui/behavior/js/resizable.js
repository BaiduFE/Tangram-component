module("baidu.ui.behavior.resizable");
//logic of resizable should be testing in 	
test("create & events", function() {
	stop();
	$(te.dom[0]).css('top', 50).css('left', 50).css('width', 100).css('height',
			100).css('border', 1);
	ua.importsrc('baidu.ui.button.Button', function() {
		var btn = new baidu.ui.button.Button({
			resizable : true,
			onload : function() {
				this.resizeCreate({
					target : btn.getBody()
				});
			}
		});
		btn.render(te.dom[0]);

		var rzbtn = $('.tangram-button-resizable-e');
		ok(rzbtn.length = 1, 'resizable button is create');
		te.obj.push(btn);
		start();
	}, 0, 'baidu.ui.behavior.resizable');
});

test('method resizeUpdate', function(){
	//FIXME add case
//	stop();
//	$(te.dom[0]).css('top', 50).css('left', 50).css('width', 100).css('height',
//			100).css('border', 1);
//	ua.importsrc('baidu.ui.button.Button', function() {
//		var btn = new baidu.ui.button.Button({
//			resizable : true,
//			onload : function() {
//				this.resizeCreate({
//					target : btn.getBody()
//				});
//			}
//		});
//		btn.render(te.dom[0]);
//
//		var rzbtn = $('.tangram-button-resizable-e');
//		ok(rzbtn.length = 1, 'resizable button is create');
//		te.obj.push(btn);
//		start();
//	}, 0, 'baidu.ui.behavior.resizable');
});

test('method resizeCancel', function(){
	//FIXME add case
});

test('method resizeEnable', function(){
	//FIXME add case
});