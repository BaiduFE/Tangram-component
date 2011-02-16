module('baidu.ui.Menubar.Menubar$click');

/**
 * check target
 */
test('dom', function() {
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
    UserAction.click(m1);
    ok(isShown(menu.getItem('0-0')), 'shown after click');
    
    var div = document.createElement('div');
    testingElement.dom.push(div);
    document.body.appendChild(div);
    UserAction.click(div);
    ok(!isShown(menu.getItem('0-0')), 'hide after click');
    /* could dispatch on document directly */
    
    UserAction.click(m1);
    ok(isShown(menu.getItem('0-0')), 'shown after click');
    UserAction.click(document.body);
    ok(!isShown(menu.getItem('0-0')), 'hide after click');
});
