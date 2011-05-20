module('baidu.ui.Carousel.Carousel$btn');

test("register btn", function() {
	stop();
	ua.loadcss(upath + 'style.css', function() {
		var c = te.dom[0];
		var options = {
			target : c,
			skin : "myslide",
			contentText : [ {
				content : "item~0"
			}, {
				content : "item~1"
			}, {
				content : "item~2"
			}, {
				content : "item~3"
			}, {
				content : "item~4"
			}, {
				content : "item~5"
			} ]
		};
		var car = new baidu.ui.Carousel(options);
		car.render(c);
		equals(c.firstChild.tagName, "A", "left button is exists");
		equals(c.lastChild.tagName, "A", "right button is exists");
		start();
	});
});

test("prev button, item", function() {
	expect(6);
	var c = te.dom[0];
	var options = {
		target : c,
		skin : "myslide",
		contentText : [ {
			content : "item~0"
		}, {
			content : "item~1"
		}, {
			content : "item~2"
		}, {
			content : "item~3"
		}, {
			content : "item~4"
		}, {
			content : "item~5"
		} ]
	};
	var car = new baidu.ui.Carousel(options);
	car.render(c);
	var buttonLeft = c.firstChild;
	var buttonRight = c.lastChild;
	car.focus(5);
	car.scrollTo(5,0);
	for(var i = 4; i >= 0; i--){
		ua.click(buttonLeft);
		var itemi = car.getItem(i);
		ok(itemi.className.indexOf(car.getClass("item-focus")) > -1,
		"check prev button " + itemi.innerHTML);
	}
	ua.click(buttonLeft);
	var item0 = car.getItem(0);
	ok(item0.className.indexOf(car.getClass("item-focus")) > -1,
	"check prev button " + item0.innerHTML);
});

test("next button, item", function() {
	expect(7);
	var c = te.dom[0];
	var options = {
		target : c,
		skin : "myslide",
		contentText : [ {
			content : "item~0"
		}, {
			content : "item~1"
		}, {
			content : "item~2"
		}, {
			content : "item~3"
		}, {
			content : "item~4"
		}, {
			content : "item~5"
		} ]
	};
	var car = new baidu.ui.Carousel(options);
	car.render(c);
	var buttonLeft = c.firstChild;
	var buttonRight = c.lastChild;
	car.focus(0);
	for(var i = 0; i <= 5; i++){
		var itemi = car.getItem(i);
		ok(itemi.className.indexOf(car.getClass("item-focus")) > -1,
		"check next " + itemi.innerHTML);
		ua.click(buttonRight);
	}
	var item5 = car.getItem(5);
	ok(item5.className.indexOf(car.getClass("item-focus")) > -1,
	"check next " + item5.innerHTML);
	car.dispose();
});

test("prev and next button, page", function() {
	expect(7);
	var c = te.dom[0];
	var options = {
		target : c,
		skin : "myslide",
		flip : 'page',
		contentText : [ {
			content : "item~0"
		}, {
			content : "item~1"
		}, {
			content : "item~2"
		}, {
			content : "item~3"
		}, {
			content : "item~4"
		}, {
			content : "item~5"
		} ]
	};
	var car = new baidu.ui.Carousel(options);
	car.render(c);
	var buttonLeft = c.firstChild;
	var buttonRight = c.lastChild;
	ua.click(buttonRight);
	ok(car.getItem(3).className.indexOf(car.getClass("item-focus")) > -1,
			"check next item3");
	ua.click(buttonLeft);
	ok(car.getItem(0).className.indexOf(car.getClass("item-focus")) > -1,
	"check prev item0");
	car.scrollTo(0,2);
	ok(car.getItem(0).className.indexOf(car.getClass("item-focus")) > -1,
	"check focus afet scroll PUBLICGE-429");
	car.focus(0);
	car.next();
	ok(car.getItem(3).className.indexOf(car.getClass("item-focus")) > -1,
	"check next item1");
	car.next();
	ok(car.getItem(4).className.indexOf(car.getClass("item-focus")) > -1,
	"check next item4");
	car.scrollTo(5,0);
	car.focus(5);
	ua.click(buttonLeft);
	ok(car.getItem(2).className.indexOf(car.getClass("item-focus")) > -1,
	"check prev item4");
	ua.click(buttonLeft);
	ok(car.getItem(1).className.indexOf(car.getClass("item-focus")) > -1,
	"check prev item1");
	car.dispose();
});
