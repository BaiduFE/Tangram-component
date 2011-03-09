(function() {
	module('baidu.ui.Carousel.Carousel$scrollByPage');
	test("prevPage, nextPage", function() {
		var carousel = new baidu.ui.Carousel( {
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
	    ua.loadcss(upath+'style.css',function(){
		   setTimeout(
				function() {
					carousel.render();
					carousel.focus(0);
					var offsetItem0 = document.getElementById(carousel
							.getId("item0")).offsetLeft;
					carousel.nextPage();
					var item;
					item = document.getElementById(carousel.getId("item" + 3)),
							container = document.getElementById(carousel.getId());
					equals(container.scrollLeft, item.offsetWidth*3,
							"item 3 turn to first after call nextpage");
					carousel.prevPage();
					item = document.getElementById(carousel.getId("item" + 0));
					equals(item.offsetLeft, offsetItem0,
							"item0 turn to first after call prevPage");
					start();

				}, 20);
	    })

	});

})();
