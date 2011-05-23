module("baidu.ui.Tooltip.Tooltip$hover");

test('show and hide', function() {
	expect(2);
	var div_test = testingElement.dom[0];
	var t1, t2, t3, tt;
	var div1 = document.createElement("div");
	document.body.appendChild(div1);
	var tp = new baidu.ui.Tooltip({
		target : div_test,
		content : 'show and hide',
		type : 'hover',
		onopen : function() {
			setTimeout(function(){
				t2 = new Date().getTime();
				UserAction.mouseout(div_test);
				ok(isShown(tp.getMain().firstChild), 'shown after hover');
				t2 = new Date().getTime();
			},10);
		},
		onclose : function() {
			setTimeout(function(){
				t3 = new Date().getTime();
				/* fx cause delay time */
				tt = (tp.hideFxOptions ? tp.hideFxOptions.duration : 0)
						+ tp.hideDelay;
				if (baidu.fx)
					ok(Math.abs(t3 - t2 - tt) < 20, 'check hide delay');
				ok(!isShown(tp.getMain().firstChild), 'hide after out');
				start(); 
			},600);
		}
	});
	stop();
	tp.render(div1);
	UserAction.mouseover(div_test);
	t1 = new Date().getTime();
});
