module('baidu.ui.Carousel.Carousel$autoScroll');

function createCarousel(s, f, d, c) {

	var op = {
		// target : c,
		orientation : s,
		contentText : [ {
			content : "item-0"
		}, {
			content : "item-1"
		}, {
			content : "item-2"
		}, {
			content : "item-3"
		}, {
			content : "item-4"
		}, {
			content : "item-5"
		}, {
			content : "item-6"
		}, {
			content : "item-7"
		}, {
			content : "item-8"
		} ],
		isCycle : c,
		flip : f,
		direction : d,
		scrollInterval: 100
	};
	return new baidu.ui.Carousel(op);
}

function createCarousel_8items(s, f, d, c) {

	var op = {
		// target : c,
		orientation : s,
		contentText : [ {
			content : "item-0"
		}, {
			content : "item-1"
		}, {
			content : "item-2"
		}, {
			content : "item-3"
		}, {
			content : "item-4"
		}, {
			content : "item-5"
		}, {
			content : "item-6"
		}, {
			content : "item-7"
		} ],
		isCycle : c,
		flip : f,
		direction : d,
		scrollInterval: 100
	};
	return new baidu.ui.Carousel(op);
}

function createCarousel_4items(s, f, d, c) {

	var op = {
		// target : c,
		orientation : s,
		contentText : [ {
			content : "item-0"
		}, {
			content : "item-1"
		}, {
			content : "item-2"
		}, {
			content : "item-3"
		} ],
		isCycle : c,
		flip : f,
		direction : d,
		scrollInterval: 100
	};
	return new baidu.ui.Carousel(op);
}

test("autoScroll, left", function() {
	stop();
	ua.loadcss(upath + 'style.css', function() {
		var cas, oitem, item, c;
		cas = createCarousel('horizontal', 'item', 'left', false);
		cas.render(te.dom[0]);
		setTimeout(function() {
			cas.stopAutoScroll();
			ok(cas.getItem(0).className.indexOf(cas.getClass("item-focus")) > -1,
					"no scroll");
			cas.dispose();
			start();
		}, 400);
	});
});

test("autoScroll, right", function() {
	stop();
	ua.loadcss(upath + 'style.css', function() {
		var cas, oitem, item, c;
		cas = createCarousel('horizontal', 'item', 'right', false);
		cas.render(te.dom[0]);
		setTimeout(function() {
			cas.stopAutoScroll();
			ok(cas.getItem(4).className.indexOf(cas.getClass("item-focus")) > -1,
					"scroll to item4");
			cas.startAutoScroll();
			setTimeout(function() {
				cas.stopAutoScroll();
				ok(cas.getItem(8).className.indexOf(cas.getClass("item-focus")) > -1,
						"scroll to item8");
				cas.dispose();
				start();
			}, 450);
		}, 450);
	});
});

test("autoScroll, up", function() {
	stop();
	ua.loadcss(upath + 'style.css', function() {
		var cas, oitem, item, c;
		cas = createCarousel('vertical', 'item', 'up', false);
		cas.render(te.dom[0]);
		setTimeout(function() {
			cas.stopAutoScroll();
			ok(cas.getItem(0).className.indexOf(cas.getClass("item-focus")) > -1,
					"no scroll");
			cas.dispose();
			start();
		}, 450);
	});
});

test("autoScroll, down", function() {
	stop();
	ua.loadcss(upath + 'style.css', function() {
		var cas, oitem, item, c;
		cas = createCarousel('vertical', 'item', 'down', false);
		cas.render(te.dom[0]);
		setTimeout(function() {
			cas.stopAutoScroll();
			ok(cas.getItem(4).className.indexOf(cas.getClass("item-focus")) > -1,
					"scroll to item4");
			cas.startAutoScroll();
			setTimeout(function() {
				cas.stopAutoScroll();
				ok(cas.getItem(8).className.indexOf(cas.getClass("item-focus")) > -1,
						"scroll to item8");
				cas.dispose();
				start();
			}, 450);
		}, 450);
	});
});

test("autoScroll, page, once", function() {
	expect(1);
	stop();
	ua.loadcss(upath + 'style.css', function() {
		var cas, oitem, item, c, step = 0;
		cas = createCarousel('horizontal', 'page', 'right', false);
		cas.render(te.dom[0]);
		setTimeout(function() {
			cas.stopAutoScroll();
			ok(cas.getItem(3).className.indexOf(cas.getClass("item-focus")) > -1,
					"scroll to item3");
			cas.dispose();
			start();
		}, 150);
	});
});

test("autoScroll, no cycle, page", function() {
	expect(1);
	stop();
	ua.loadcss(upath + 'style.css', function() {
		var cas, oitem, item, c, step = 0;
		cas = createCarousel_8items('horizontal', 'page', 'right', false);
		cas.render(te.dom[0]);
		cas.focus(2);
		setTimeout(function() {
			cas.stopAutoScroll();
			ok(cas.getItem(6).className.indexOf(cas.getClass("item-focus")) > -1,
					"scroll to item6");
			cas.dispose();
			start();
		}, 1000);
	});
});

test("autoScroll, no cycle, item", function() {
	expect(1);
	stop();
	ua.loadcss(upath + 'style.css', function() {
		var cas, oitem, item, c, step = 0;
		cas = createCarousel('horizontal', 'item', 'right', false);
		cas.render(te.dom[0]);
		setTimeout(function() {
			cas.stopAutoScroll();
			ok(cas.getItem(8).className.indexOf(cas.getClass("item-focus")) > -1,
					"scroll to item8");
			cas.dispose();
			start();
		}, 1000);
	});
});

test("autoScroll, cycle, item, right", function() {
	expect(1);
	stop();
	ua.loadcss(upath + 'style.css', function() {
		var cas, oitem, item, c, step = 0;
		cas = createCarousel_4items('horizontal', 'item', 'right', true);
		cas.render(te.dom[0]);
		setTimeout(function() {
			cas.stopAutoScroll();
			ok(cas.getItem(1).className.indexOf(cas.getClass("item-focus")) > -1,
					"scroll to item1");
			cas.dispose();
			start();
		}, 590);
	});
});

test("autoScroll, cycle, item, left", function() {
	expect(1);
	stop();
	ua.loadcss(upath + 'style.css', function() {
		var cas, oitem, item, c, step = 0;
		cas = createCarousel_4items('horizontal', 'item', 'left', true);
		cas.render(te.dom[0]);
		setTimeout(function() {
			cas.stopAutoScroll();
			ok(cas.getItem(3).className.indexOf(cas.getClass("item-focus")) > -1,
					"scroll to item3");
			cas.dispose();
			start();
		}, 590);
	});
});

test("autoScroll, cycle, page, right", function() {
	expect(5);
	stop();
	ua.loadcss(upath + 'style.css', function() {
		var cas, oitem, item, c, step = 0;
		cas = createCarousel_8items('horizontal', 'page', 'right', true);
		cas.onafterscroll = function(){
			if(step == 0)
				ok(cas.getItem(2).className.indexOf(cas.getClass("item-focus")) > -1,
				"scroll to item2");
			if(step == 1)
				ok(cas.getItem(5).className.indexOf(cas.getClass("item-focus")) > -1,
				"scroll to item5");
			if(step == 2)
				ok(cas.getItem(0).className.indexOf(cas.getClass("item-focus")) > -1,
				"scroll to item0");
			if(step == 3)
				ok(cas.getItem(3).className.indexOf(cas.getClass("item-focus")) > -1,
				"scroll to item3");
			step ++;
		}
		cas.render(te.dom[0]);
		cas.focus(2);
		setTimeout(function() {
			cas.stopAutoScroll();
			ok(cas.getItem(6).className.indexOf(cas.getClass("item-focus")) > -1,
					"scroll to item6");
			cas.dispose();
			start();
		}, 490);
	});
});

test("autoScroll, cycle, page, left", function() {
	expect(5);
	stop();
	ua.loadcss(upath + 'style.css', function() {
		var cas, oitem, item, c, step = 0;
		cas = createCarousel_8items('horizontal', 'page', 'left', true);
		cas.onafterscroll = function(){
			if(step == 0)
				ok(cas.getItem(2).className.indexOf(cas.getClass("item-focus")) > -1,
				"scroll to item2");
			if(step == 1)
				ok(cas.getItem(7).className.indexOf(cas.getClass("item-focus")) > -1,
				"scroll to item7");
			if(step == 2)
				ok(cas.getItem(4).className.indexOf(cas.getClass("item-focus")) > -1,
				"scroll to item4");
			if(step == 3)
				ok(cas.getItem(1).className.indexOf(cas.getClass("item-focus")) > -1,
				"scroll to item1");
			step ++;
		}
		cas.render(te.dom[0]);
		cas.focus(2);
		setTimeout(function() {
			cas.stopAutoScroll();
			ok(cas.getItem(6).className.indexOf(cas.getClass("item-focus")) > -1,
					"scroll to item6");
			cas.dispose();
			start();
		}, 490);
	});
});

test("autoScroll, onautoscroll, left", function() {
	expect(5);
	stop();
	ua.loadcss(upath + 'style.css', function() {
		var cas, oitem, item, c;
		cas = createCarousel('horizontal', 'item', 'left', false);
		cas.onautoscroll = function(evt){
			equals(evt.direction, 'prev', 'The direction is right');
		}
		cas.render(te.dom[0]);
		setTimeout(function() {
			cas.stopAutoScroll();
			ok(cas.getItem(0).className.indexOf(cas.getClass("item-focus")) > -1,
					"no scroll");
			cas.dispose();
			start();
		}, 490);
	});
});

test("autoScroll, onautoscroll, right", function() {
	expect(11);
	stop();
	ua.loadcss(upath + 'style.css', function() {
		var cas, oitem, item, c;
		cas = createCarousel('horizontal', 'item', 'right', false);
		cas.onautoscroll = function(evt){
			equals(evt.direction, 'next', 'The direction is right');
		}
		cas.render(te.dom[0]);
		setTimeout(function() {
			cas.stopAutoScroll();
			ok(cas.getItem(4).className.indexOf(cas.getClass("item-focus")) > -1,
					"scroll to item4");
			cas.startAutoScroll();
			setTimeout(function() {
				cas.stopAutoScroll();
				ok(cas.getItem(8).className.indexOf(cas.getClass("item-focus")) > -1,
						"scroll to item8");
				cas.dispose();
				start();
			}, 490);
		}, 490);
	});
});