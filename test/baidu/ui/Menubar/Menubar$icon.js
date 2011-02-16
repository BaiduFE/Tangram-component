module("baidu.ui.Menubar.Menubar$icon");

/**
 * check target
 * <li> check target shown and hide
 * <li> check delay time
 */
test('icon', function(){
    var m1 = $('li#m1')[0], items = [{
        content: 'm11'
    }], options = {
        data: items,
        type: 'click',
        element: m1,
		autoRender : true
    };
    var menu = baidu.ui.create(baidu.ui.Menubar, options);
    testingElement.obj.push(menu);
	menu.update();
	var item = menu.getItem('0-0');
    ok(item.getElementsByTagName('span')[0].className, 'tangram-menubar-icon', 'icon init ok');
})