module("baidu.ui.tab.hover");

test("hover", function() {
	stop();
	var div_test = document.createElement("div");
	div_test.id = "div_test";
	document.body.appendChild(div_test);
	var options = {
		content : [ {
			label : "l0",
			content : "<p>c0</p>"
		}, {
			label : "l1",
			content : "<p>c1</p>"
		} ]
	};
	var t = baidu.ui.tab.hover(div_test, options);
	var l0 = t.getLabel(0), l1 = t.getLabel(1);
	var c0 = t.getContent(l0), c1 = t.getContent(l1);
	ok(isShown(c0), 'shown after create');
	equals(t.focusDelay, 300, 'check default delay');
	UserAction.mouseover(l1);
	setTimeout(function() {
		ok(!isShown(c0), 'c0 hide after hover');
		ok(isShown(c1), 'c1 shown after hover');
		equals(l1.className, 'tangram-tab-label tangram-tab-current',
				'check class');
		equals(l0.className, 'tangram-tab-label', 'check class');
		t.dispose();
		document.body.removeChild(div_test);
		start();
	}, t.focusDelay + 10);
});

test("hover many", function() {
	stop();
	var div_test = document.createElement("div");
	div_test.id = "div_test";
	document.body.appendChild(div_test);
	var options = {
		content : []
	};
	for ( var i = 0; i < 10; i++) {
		options.content.push( {
			label : 'l' + i,
			content : '<p>c' + i + '</p>'
		});
	}
	var t = baidu.ui.tab.hover(div_test, options);
	var curClass = 'tangram-tab-label tangram-tab-current';
	var check = function(idx) {
		if (idx == 10) {
			t.dispose();
			document.body.removeChild(div_test);
			start();
		} else {
			var label = t.getLabel(idx);
			var content = t.getContent(label);
			if (idx > 0) {
				UserAction.mouseout(t.getLabel(idx-1));
			}
			UserAction.mouseover(label);
			setTimeout(function() {
				ok(isShown(content), 'content shown after hover');
				equals(label.className, curClass, 'check class');
				check(idx + 1);
			}, t.focusDelay);
		}
	}
	check(0);
});
