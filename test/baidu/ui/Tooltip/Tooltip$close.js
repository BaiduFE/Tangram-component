module('baidu.ui.Tooltip.Tooltip$close');

test('Close a common tooltip', function() {
	var div = testingElement.dom[0];
    var tp = new baidu.ui.Tooltip({
    	content:'tooltip_1',
    	onclose:function(){
    		ok(true, 'The tooltip is closed');
    	}
    });
	tp.render(div);
    tp.open();
    ok(isShown(tp.getMain().firstChild),
    		'The tooltip is created in the page');
    var closetp = $("div[class$=close]");
    closetp.click();
});