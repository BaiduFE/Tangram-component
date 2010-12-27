module('baidu.ui.smartPosition.mouse');
//Include('baidu.dom.getPosition');
test('dom', function() {	
	var xy, t;
	t = testingElement.dom[0];
	UserAction.mousemove(document, {
		clientX : 20,
		clientY : 20
	});
	baidu.ui.smartPosition.mouse(t);
	xy = baidu.dom.getPosition(t);
	equals(xy.left, 20, 'check left');
	equals(xy.top, 20, 'check top');
})
//
//test('id', function() {
//	var xy, t;
//	t = testingElement.dom[0];
//	UserAction.mousemove(document, {
//		clientX : 20,
//		clientY : 20
//	});
//	baidu.ui.smartPosition.mouse(t.id);
//	xy = baidu.dom.getPosition(t);
//	equals(xy.left, 20, 'check left');
//	equals(xy.top, 20, 'check top');
//})