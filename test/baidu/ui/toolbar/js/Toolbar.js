/**
 * check Toolbar properties, methods and events
 */
module("baidu.ui.toolbar.Toolbar");

test("render--no argument", function() {
    //如果不写width和height的话，至少写一个title元素保证div元素的显示
    //使isShown函数通过
    var options = {title:"title"};
    var toolbar = new baidu.ui.toolbar.Toolbar(options);
    var div = document.createElement('div');
    document.body.appendChild(div);
    toolbar.render(div);
    ok(isShown(toolbar.getBody()), 'toolbar has been shown');
    te.dom.push(toolbar.getMain());
});

