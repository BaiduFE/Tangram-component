module('baidu.ui.Menubar.click');

/**
 * check target
 */
test('dom', function() {
	var m1 = $('li#m1')[0], items = [ {
		content : 'm11'
	} ];
	var menu = baidu.ui.Menubar.click(m1, items);
	testingElement.obj.push(menu);
	UserAction.click(m1);
	ok(isShown(menu.getItem('0-0')), 'shown after click');
	
	var div = document.createElement('div');
	testingElement.dom.push(div);
	document.body.appendChild(div);
	UserAction.click(menu.getItem('0-0'));//在crateUI里引入了插件，会执行Menubar$click里的bodyClick
	//ok(!isShown(menu.getItem('0-0')), 'hide after click');
	ok(menu.getBody().className.match('tangram-menubar-empty')&&!menu.getBody().className.match('tangram-menubar-open'),'hide after click ');
	/* could dispatch on document directly */
	
	UserAction.click(m1);
	ok(isShown(menu.getItem('0-0')), 'shown after click');
	UserAction.click(document.body);
//	ok(!isShown(menu.getItem('0-0')), 'hide after click');
	ok(menu.getBody().className.match('tangram-menubar-empty')&&!menu.getBody().className.match('tangram-menubar-open'),'hide after click ');
});
