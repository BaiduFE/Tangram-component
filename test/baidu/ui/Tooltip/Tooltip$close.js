module('baidu.ui.Tooltip.Tooltip$close');

test('Close a common tooltip', function() {
	var div = testingElement.dom[0];
	var div1 = document.createElement("div");
	document.body.appendChild(div1);
    var tp = new baidu.ui.Tooltip({
    	target : div1,
    	content:'tooltip_1',
    	onclose:function(){
    		ok(true, 'The tooltip is closed');
    	}
    });
	tp.render(div);
    tp.open(div1);
    ok(isShown(tp.getBody()),
    		'The tooltip is created in the page');
    ua.click(baidu.g(tp.getId('head')).firstChild);
});