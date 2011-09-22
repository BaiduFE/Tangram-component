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
				te.mouseout(div_test);
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
	te.mouseover(div_test);
	t1 = new Date().getTime();
});

test('hover on tooltip', function() {
	expect(2);
	var div_test = testingElement.dom[0];
	var div1 = document.createElement("div");
	document.body.appendChild(div1);
	var tp = new baidu.ui.Tooltip({
		target : div_test,
		content : 'show and hide',
		type : 'hover',
		hideDelay: 50,
		onopen : function() {
			setTimeout(function(){
				te.mouseout(div_test);
				UserAction.mouseover(tp.getBody());
				setTimeout(function(){
					ok(isShown(tp.getMain().firstChild), 'still shown after mouseover on tooltip');
					UserAction.mouseout(tp.getBody());
				}, 100);
			},10);
		},
		onclose : function() {
			setTimeout(function(){
				ok(!isShown(tp.getMain().firstChild), 'close after mouseout on tooltip');
				start(); 
			},100);
		}
	});
	stop();
	tp.render(div1);
	te.mouseover(div_test);
});

test('prevent bubble', function() {
	expect(1);
	var div_test = testingElement.dom[0];
	var div_child = document.createElement("div");
	div_child.id = "div_child";
	div_child.innerHTML = "div_child";
	div_test.appendChild(div_child);
	var div1 = document.createElement("div");
	document.body.appendChild(div1);
	var num = 0;
	var tp = new baidu.ui.Tooltip({
		target : div_test,
		content : 'show and hide',
		type : 'hover',
		hideDelay: 50,
		onopen : function() {
			num ++;
			setTimeout(function(){
				te.mouseover(div_child);
				setTimeout(function(){
					equals(num , 1, "open once");
					te.obj.push(tp);
					start();
				}, 100);
			},10);
		}
	});
	stop();
	tp.render(div1);
	te.mouseover(div_test);
});