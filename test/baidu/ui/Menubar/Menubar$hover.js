module("baidu.ui.Menubar.Menubar$hover");

/**
 * check target
 * <li> check target shown and hide
 * <li> check delay time
 */
test('dom', function(){
    stop();
    ua.importsrc('baidu.ui.Menubar',function(){
	    var m1 = $('li#m1')[0], items = [{
	        content: 'm11'
	    }], options = {
	        data: items,
	        triggerType: 'hover',
	        element: m1,
			autoRender : true
	    };
	    var menu = baidu.ui.create(baidu.ui.Menubar, options);
	    testingElement.obj.push(menu);
	    var check = function(){
	        ok(isShown(menu.getItem('0-0')), 'shown after hover');
	        UserAction.mouseout(m1);
	        setTimeout(function(){
	            ok(!isShown(menu.getItem('0-0')), 'hide after out');
	            start();
	        }, menu.hideDelay);
	    }
	    UserAction.mouseover(m1);
	    setTimeout(check, menu.showDelay);
    });

})
