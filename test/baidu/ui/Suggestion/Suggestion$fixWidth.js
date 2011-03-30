module("baidu.ui.Suggestion$fixWidth");
test("position", function() {
	stop();
	var input = testingElement.dom[0], sugg, options = {
		onshow : function() {
			var xySuggestion = baidu.dom.getPosition(document.body.lastChild);
			var xyInput = baidu.dom.getPosition(input);
			equals(xySuggestion.left, xyInput.left, "check left");
			equals(xySuggestion.top, xyInput.top + input.offsetHeight - 1,
					"check top");
			equals(document.body.lastChild.offsetWidth, input.offsetWidth,
					"check width");
                start();
		}
	};
	input.style.borderStyle = 'solid';
	input.style.borderWidth = '2px';
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	testingElement.obj.push(sugg);
	sugg.show('a', [ 'ab', 'ac' ]);
});

test("position - absolute", function() {
	stop();
	var input = testingElement.dom[0], sugg, options = {
		onshow : function() {
			var xySuggestion = baidu.dom.getPosition(document.body.lastChild);
			var xyInput = baidu.dom.getPosition(input);
			equals(xySuggestion.left, xyInput.left, "check left");
			equals(xySuggestion.top, xyInput.top + input.offsetHeight - 1,
					"check top");
			equals(document.body.lastChild.offsetWidth, input.offsetWidth,
					"check width");
			sugg.hide();
		},
		onhide : function() {
			start();
		}
	};
	input.style.position = 'absolute';
	input.style.borderStyle = 'solid';
	input.style.borderWidth = '2px';
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	testingElement.obj.push(sugg);
	sugg.show('a', [ 'ab', 'ac' ]);
});

/**
 * set top and left, check suggestion position
 */
test("position - relative", function() {
	stop();
	var input = testingElement.dom[0], sugg, options = {
		onshow : function() {
			var xySuggestion = baidu.dom.getPosition(document.body.lastChild);
			var xyInput = baidu.dom.getPosition(input);
			// top需要－1 berg
		equals(xySuggestion.left, xyInput.left, "check left");
		equals(xySuggestion.top, xyInput.top + input.offsetHeight - 1,
				"check top");
		sugg.hide();
	},
	onhide : function() {
		start();
	}
	};
	input.style.position = 'relative';
	input.style.borderStyle = 'solid';
	input.style.top = '100px';
	input.style.left = '100px';
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	testingElement.obj.push(sugg);
	document.body.lastChild.style.borderStyle = 'solid';
	document.body.lastChild.style.borderWidth = '2px';
	sugg.show('a', [ 'ab', 'ac' ]);
});

/**
 * put input in div, insert a button or span before input, check left
 */
test("position - left", function() {
	stop();
	var input = testingElement.dom[0], sugg, div, options = {
		onshow : function() {
			var xySuggestion = baidu.dom.getPosition(document.body.lastChild);
			var xyInput = baidu.dom.getPosition(input);
			equals(xySuggestion.left, xyInput.left, "check left");
			start();
		}
	};
	div = document.createElement('div');
	document.body.appendChild(div);
	div.appendChild(input);
	var tmp = document.createElement('span'); /* button will cause bug too */
	tmp.innerHTML = 'aaaaaaaaaaaaaaaa';
	tmp.style.borderStyle = 'solid';
	div.insertBefore(tmp, input);
	testingElement.dom.push(div);
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	testingElement.obj.push(sugg);
	document.body.lastChild.style.borderStyle = 'solid';
	sugg.show('a', [ 'ab', 'ac' ]);
});

/**
 * put input in div, insert a button before input, check left
 */
test("position - top", function() {
	stop();
	var input = testingElement.dom[0], sugg, div, options = {
		onshow : function() {
			var xySuggestion = baidu.dom.getPosition(document.body.lastChild);
			var xyInput = baidu.dom.getPosition(input);

			equals(xySuggestion.top, xyInput.top + input.offsetHeight - 1,
					"check top");
			start();
		}
	};
	div = document.createElement('div');
	document.body.appendChild(div);
	div.appendChild(input);
	var tmp = document.createElement('div');
	tmp.style.borderStyle = 'solid';
	div.insertBefore(tmp, input);
	testingElement.dom.push(div);
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	testingElement.obj.push(sugg);
	sugg.show('a', [ 'ab', 'ac' ]);
});

/**
 * check position while input in div and div has border width
 */
test("position - in container", function() {
	stop();
	var input = testingElement.dom[0], sugg, div, options = {
		onshow : function() {
			var xySuggestion = baidu.dom.getPosition(document.body.lastChild);
			var xyInput = baidu.dom.getPosition(input);
			equals(xySuggestion.left, xyInput.left, "check left");
			equals(xySuggestion.top, xyInput.top + input.offsetHeight - 1,
					"check top");
			equals(document.body.lastChild.offsetWidth, input.offsetWidth,
					"check width");
			start();
		}
	};
	div = document.createElement("div");
	div.style.position = 'absolute';
	div.style.borderStyle = 'solid';
	div.style.borderWidth = '2px';
	div.style.top = baidu.page.getViewHeight() - 40 + "px";
	div.appendChild(input);
	document.body.appendChild(div);
	testingElement.dom.push(div);
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	testingElement.obj.push(sugg);
	sugg.show('a', [ 'ab', 'ac' ]);
});
//
// /**
// * create a input and set suggestion
// * <li>change x by insert div in input's container before input
// * <li>change y by insert button in input's container before input
// */
// test("postion - modify input's location", function() {
// stop();
// var input = testingElement.dom[0];
// var sugg, div, tmp, msg, options = {
// onshow : function() {
// msg = msg || '';
// var xySuggestion = baidu.dom.getPosition(document.body.lastChild);
// var xyInput = baidu.dom.getPosition(input);
// equals(xySuggestion.left, xyInput.left, "check left " + msg);
// var y = xyInput.top + input.offsetHeight;
// equals(xySuggestion.top, xyInput.top + input.offsetHeight - 1,
// "check top " + msg);
// sugg.hide();
// },
// onhide : function() {
// if (!tmp) {
// tmp = document.createElement('input');
// tmp.type = 'button';
// tmp.value = 'test';
// div.insertBefore(tmp, input);
// msg = ' if insert button before';
// sugg.show('b');
// } else if (!tmp.previousSibling) {
// var tmp1 = document.createElement('div');
// tmp1.style.borderStyle = 'solid';
// div.insertBefore(tmp1, tmp);
// msg = ' if insert div before';
// sugg.show('a');
// } else {
// start();
// }
// }
// };
// div = document.createElement("div");
// div.style.borderStyle = 'solid';
// div.appendChild(input);
// document.body.appendChild(div);
// testingElement.dom.push(div);
// sugg = new baidu.ui.Suggestion(options);
// sugg.render(input);
// testingElement.obj.push(sugg);
// input.style.borderStyle = 'solid';
// document.body.lastChild.style.borderStyle = 'solid';
// sugg.show('b', [ 'ba', 'bb' ], true);
// sugg.show('a', [ 'aa', 'ab' ]);
// });
