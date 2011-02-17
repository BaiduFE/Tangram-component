module("baidu.ui.Menubar.Menubar$hover");

/**
 * check target
 * <li> check target shown and hide
 * <li> check delay time
 */
test('dom', function(){
    stop();
//    ua.importsrc('baidu.ui.Menubar',function(){
	    var m1 = $('li#m1')[0], items = [{
	        content: 'm11'
	    }], options = {
	        data: items,
	        triggerType: 'hover',
	        element: m1,
			autoRender : true
	    };
	    var menu = new baidu.ui.Menubar(options);//baidu.ui.create(baidu.ui.Menubar, options);
	    testingElement.obj.push(menu);
	    var check = function(){
	     //   ok(isShown(menu.getItem('0-0')), 'shown after hover');
	        ok(menu.getBody().className.match('tangram-menubar-open')&&!menu.getBody().className.match('tangram-menubar-empty'),'mouseover class open is add and class empty is remove ');
	        UserAction.mouseout(m1);
	        setTimeout(function(){
	          //  ok(!isShown(menu.getItem('0-0')), 'hide after out');
	            ok(menu.getBody().className.match('tangram-menubar-empty')&&!menu.getBody().className.match('tangram-menubar-open'),'mouseover class empty is add and class open is remove ');
	            start();
	        }, menu.hideDelay);
	    }
	    UserAction.mouseover(m1);
	    setTimeout(check, menu.showDelay);
//   });

})
