module("baidu.ui.StarRate")

/*******************************************************************************
 * <li>starAt
 * <li>hoverAt
 * <li>clickAt
 * <li>disable
 * <li>enable
 ******************************************************************************/

test('StarRate', function() {
	expect(40);
	var div = document.createElement('div');
	document.body.appendChild(div);
	te.obj.push(div);
	var i = 0;
	var options = {
		total : 10,
		current : 3,
		onhover : function(num) {
			equal(num.data.index, i + 1,'hover');
		},
		onclick : function(num) {
			// baidu.g('c').innerHTML = 'clicked on ' +event.data.index;
			equal(num.data.index, i + 1, 'click on ' + num.data.index);
		},
		onleave : function() {
			// baidu.g('o').innerHTML = rate.current;
			ok(true,'leave');
		}
	};
	var sRate = new baidu.ui.StarRate(options);
	sRate.render(div);
	var spans = div.childNodes;
	for (; i < spans.length; i++) {
		var span = spans[i];
		UserAction.mouseover(span);// hoverAt
		UserAction.mouseout(span);// onleave
		UserAction.click(span);

	}
});


test('disable & enable', function() {
	expect(25);
	var div = document.createElement('div');
	document.body.appendChild(div);
	te.obj.push(div);
	var i = 0;
	var options = {
		current : 3,
		onhover : function(num) {
			equal(num.data.index, i + 1,'hover');
		},
		onclick : function(num) {
			equal(num.data.index, i + 1, 'click on ' + num.data.index);
		},
		onleave : function() {
			ok(true,'leave');
		}
	};
	var sRate = new baidu.ui.StarRate(options);
	sRate.render(div);
	var spans = div.childNodes;
	/*disable*/
	sRate.disable();
	for (; i < spans.length; i++) {
		var span = spans[i];
		UserAction.mouseover(span);// hoverAt
		UserAction.mouseout(span);// onleave
		UserAction.click(span);
	}
	sRate.enable();
	i = 0;
	for (; i < spans.length; i++) {
		var span = spans[i];
		UserAction.mouseover(span);// hoverAt
		UserAction.mouseout(span);// onleave
		/*因为UserAction中模拟click事件分为3步，mousemove，mousedown，mouseup，因此mousemove会被触发，从而hover又被触发一次*/
		UserAction.click(span);
	}
});