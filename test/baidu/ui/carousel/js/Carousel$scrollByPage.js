(function() {
	module('baidu.ui.carousel.Carousel$scrollByPage');
	test("prevPage, nextPage", function() {
		var carousel = new baidu.ui.carousel.Carousel( {
			target : te.dom[0],
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
		});
		stop();

		setTimeout(
				function() {
					carousel.render();
					carousel.focus(0);
					var offsetItem0 = document.getElementById(carousel
							.getId("item0")).offsetLeft;
					carousel.nextPage();
					var item;
					item = document.getElementById(carousel.getId("item" + 3)),
							container = document.getElementById(carousel
									.getId());
					equals(item.offsetLeft - container.scrollLeft, offsetItem0,
							"item 3 turn to first after call nextpage");
					carousel.prevPage();
					item = document.getElementById(carousel.getId("item" + 0));
					equals(item.offsetLeft, offsetItem0,
							"item0 turn to first after call prevPage");
					start();

				}, 20);

	});

})();
