module('baidu.ui.Carousel.Carousel$btn');
test("register btn", function() {
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
	car.render();
	equals(c.firstChild.tagName, "A", "left button is exists");
	equals(c.lastChild.tagName, "A", "right button is exists");
});
