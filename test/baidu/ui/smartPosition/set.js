module('baidu.ui.smartPosition.set')

test('element', function() {
	var t = testingElement.dom[0];
	var sp = baidu.ui.smartPosition.set(t, [ 100, 100 ]);
	equals(t.style.left, '100px', 'check left');
	equals(t.style.top, '100px', 'check top');
})

test('id', function() {
	var t = testingElement.dom[0];
	var sp = baidu.ui.smartPosition.set(t.id, [ 100, 100 ]);
	equals(t.style.left, '100px', 'check left');
	equals(t.style.top, '100px', 'check top');
})