module("baidu.ui.menubar.hover");

/**
 * check target
 * <li> check target shown and hide
 * <li> check delay time
 */
test('dom', function() {
	stop();
	var m1 = $('li#m1')[0], items = [ {
		content : 'm11'
	} ];
	var menu = baidu.ui.menubar.hover(m1, items);
	testingElement.obj.push(menu);
	var check = function() {
		ok(isShown(menu.getItem('0-0')), 'shown after hover');
		UserAction.mouseout(m1);
		setTimeout(function(){
			//ok(!isShown(menu.getItem('0-0')), 'hide after out');	
			ok(menu.getBody().className.match('tangram-menubar-empty')&&!menu.getBody().className.match('tangram-menubar-open'),'hide after click ');
			start();
		}, menu.hideDelay);
	}
	UserAction.mouseover(m1);
	setTimeout(check, menu.showDelay);
})
