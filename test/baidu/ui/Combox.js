module('baidu.ui.Combox');

test("createMenu", function() {
	var options = {
		data : [ {
			content : 'a-content-1'
		}, {
			content : 'b-content-2'
		}, {
			content : 'c-content-3'
		} ],
		onitemclick : function(data) {
			equal(data.value.content, 'a-content-1');
		},
		onopen : function() {
			ok(true, 'open');
		},
		onclose : function() {
			ok(true, 'close');
		},
		onbeforeopen : function() {
			ok(true, 'before open');
		},
		onbeforeclose : function() {
			ok(true, 'before close');
		}

	};
    stop();
	ua.loadcss(upath+'Combox/style.css',function(){
		var div = document.body.appendChild(document.createElement("div"));
		var cb = new baidu.ui.Combox(options);
		te.obj.push(cb);
		cb.render(div);
		var input = cb.getInput();
		var arrow = cb.getArrow();
		input.focus();
		$(arrow).click();
		setTimeout(function() {
			TT.event.fire(cb.menu.getItem('0-0'), 'click');
			equal(input.value, 'a-content-1');
			start();
		}, 30);
	});

});

test("events", function() {
	var options = {
		data : [ {
			content : 'file',
			value : 'file1'
		}, {
			content : 'A-a',
			value : 'A-a'
		}, {
			content : 'close',
			value : 'close3'
		} ],
		statable: true,
		autoRender : true,
		editable : true,
		onitemclick : function(data) {
			ok(true, 'item clicked');
		},
		onmouseover : function() {
			ok(true, 'onmouseover');
			ok(cb.getBody().className.match('hover'),'mouseover body add class hover');
		},
		onmouseout : function() {
			ok(true, 'onmouseout');
			ok(!cb.getBody().className.match('hover'),'mouseout body remove class hover');
		},
		onmousedown : function() {
			ok(true, 'onmousedown');
			ok(cb.getBody().className.match('press'),'mousedown body add class press');
		},
		onmouseup : function() {
			ok(true, 'onmouseup');
			ok(!cb.getBody().className.match('press'),'mouseup body remove class press');
		},
		onkeyup : function() {
			ok(true, 'onkeyup');
		}
	};
	var div = document.body.appendChild(document.createElement("div"));
	var cb = new baidu.ui.Combox(options);
	te.obj.push(cb);
	cb.render(div);
	var input = cb.getInput();
	var arrow = cb.getArrow();
	ua.mouseover(input);
	ua.mouseout(input);
    ua.mousedown(arrow);
    ua.mouseup(arrow);
    stop();
//	ua.keydown(input, {
//		keyCode : 65
//	});
//    ua.keyup(input);
    input.value = 'A';
    $(input).focus();
	setTimeout(function() {
		TT.event.fire(cb.menu.getItem('0-0'), 'click');
		equal(input.value, 'A-a');
		start();
	}, 100);

});

test("dispose", function() {
	expect(3);
	var options = {
		data : [ {
			content : 'file',
			value : 'file1'
		}, {
			content : 'new',
			value : 'new2'
		}, {
			content : 'close',
			value : 'close3'
		} ],
		editable : true
	};
	var ie = baidu.event._listeners.length;
	var div = document.body.appendChild(document.createElement("div"));
	var cb = new baidu.ui.Combox(options);
	cb.render(div);
	te.checkUI.dispose(cb, ie);
});