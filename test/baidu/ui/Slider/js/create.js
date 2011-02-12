module('baidu.ui.slider.create');

test('init',function(){
	var s  = baidu.ui.slider.create(te.dom[0]);
	ok(s.getBody(),'check body');
})