module('baidu.ui.combox.Combox');

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
		oninit : function() {
			ok(true, 'init');
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
	var cb = new baidu.ui.combox.Combox(options);
	cb.render();
	var input = cb.getInput();
	var arrow = cb.getArrow();
	input.focus();
	$(arrow).click();
	setTimeout(function() {
		$(cb.menu.getItem('0-0')).click();
		equal(input.value, 'a-content-1');
		start();
	}, 30);

});

test("events", function() {
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
		onitemclick : function(data) {
			ok(true, 'item clicked');
		}
	};
	var cb = new baidu.ui.combox.Combox();
	cb.render();

});

test("dispose", function() {
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
		} ]
	};
	var cb = new baidu.ui.combox.Combox();
	cb.render();

})