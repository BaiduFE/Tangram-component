module("baidu.ui.Tab");

(function() {
	/**
	 * create a input for test start
	 * <li>create input
	 * <li>set id <b>input_test</b>
	 * <li>set type text
	 * 
	 * @return input@type text
	 */
	function _testStart() {
		var id = "div_test";
		var div = document.createElement("div");
		div.id = id;
		document.body.appendChild(div);
		te.dom.push(div);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);
		;
		_testStart();
	};

	te.getUI = function(target, op) {
		var options = op || {
			items : [ {
				head : "l1",
				body : "<p>l1</p>"
			}, {
				head : "l2",
				body : "<p>l2</p>"
			} ]
		};
		var t = new baidu.ui.Tab(options);
		if (target)
			t.render(target);
		return t;
	};
})();

/**
 * <ul>
 * check Tab method and attribute
 * <li> type : TAB
 */
test("base and render", function() {
	var t = te.getUI(te.dom[0]);
	equals("tab", t.uiType.toLowerCase(), "check object type");
	// 确认render
	ok(isShown(t.getHeads(0)), '');
	ok(isShown(t.getBodies(0)), '');
	ok(isShown(t.getHeads(1)), '');
	ok(!isShown(t.getBodies(1)), '');
});

test('dispose', function(){
	var eventLength = baidu.event._listeners.length;
	var t = te.getUI(te.dom[0]);
	te.checkUI.dispose(t, eventLength);
});

// test("focus", function() {
// var options = {
// content : [ {
// label : "label1",
// content : "<p>content1</p>"
// }, {
// label : "label1",
// content : "<p>content1</p>"
// } ]
// };
// var t = new baidu.ui.Tab(options);
// t.render(te.dom[0]);
// var l0 = t.getLabel(0), l1 = t.getLabel(1);
// t.focus(l1);
// ok(isShown(t.getContent(l1)), "focus on label 2, content 2 is shown");
// ok(!isShown(t.getContent(l0)), "focus on label 2, content 1 is hide");
// ok(/tangram-tab-current/.test(l1.className), "label 2 selected");
// ok(!/tangram-tab-current/.test(l0.className), "label 1 not selected");
// te.obj.push(t);
// });
//
// test("getLabels", function() {
// var options = {
// content : [ {
// label : "label1",
// content : "<p>content1</p>"
// }, {
// label : "label1",
// content : "<p>content1</p>"
// } ]
// };
// var t = new baidu.ui.Tab(options);
// t.render(te.dom[0]);
// var _ul = t.getLabels();
// equals(_ul.nodeType, 1, "check ul type");
// equals(_ul.nodeName, "UL", "check ul type");
// equals(_ul.className, "tangram-tab-labels", "check class");
// te.obj.push(t);
// });
//
// test("getLabel", function() {
// var options = {
// content : [ {
// label : "label1",
// content : "<p>content1</p>"
// }, {
// label : "label1",
// content : "<p>content1</p>"
// } ]
// }
// var t = new baidu.ui.Tab(options);
// t.render(te.dom[0]);
// equals(t.getLabel(0).firstChild.innerHTML, options.content[0].label,
// "check get label 0");
// equals(t.getLabel(1).firstChild.innerHTML, options.content[1].label,
// "check get label 1");
// equals(t.getAllLabelItems().length, 2, "check getAllLabelItems");
// equals(t.getAllLabelItems()[0].innerHTML, t.getLabel(0).innerHTML,
// "check getAllLabelItems");
// te.obj.push(t);
// })
//
// test("getContent", function() {
// var options = {
// content : [ {
// label : "label1",
// content : "<p>content1</p>"
// }, {
// label : "label1",
// content : "<p>content1</p>"
// } ]
// }
// var t = new baidu.ui.Tab(options);
// t.render(te.dom[0]);
// ok(t.getContent(t.getLabel(0)).innerHTML, options.content[0].content,
// "check get content 0");
// ok(t.getContent(t.getLabel(1)).innerHTML, options.content[1].content,
// "check get content 1");
// te.obj.push(t);
// })
//
// test('getProp', function() {
// var options = {
// content : [ {
// label : "label1",
// content : "<p>content1</p>"
// }, {
// label : "label1",
// content : "<p>content1</p>"
// } ]
// }
// var t = new baidu.ui.Tab(options);
// t.render(te.dom[0]);
// var l0 = t.getLabel(0), l1 = t.getLabel(1);
// equals(t.getProp(l0).name, 'tangram-TAB--' + t.guid + 'content0',
// 'check get prop from label 0');
// equals(t.getProp(l1).name, 'tangram-TAB--' + t.guid + 'content1',
// 'check get prop from label 1');
// te.obj.push(t);
// })
