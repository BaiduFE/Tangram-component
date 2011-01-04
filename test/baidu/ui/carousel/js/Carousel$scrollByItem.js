module('baidu.ui.carousel.Carousel$scrollByItem');
test(
		"next, prev",
		function() {
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
			// 如果不设置一段超时，给滑块container的setStyle操作来不及生效，不是默认3个滑块的宽度
			setTimeout(
					function() {
						carousel.render();
						carousel.focus(0);
						carousel.next();// 需要时间生效
						var item = document.getElementById(carousel
								.getId("item" + 1)), container = document
								.getElementById(carousel.getId());
						var offsetItem0 = document.getElementById(carousel
								.getId("item0")).offsetLeft;
						ok(item.className.indexOf(carousel
								.getClass("item-focus")) > -1,
								"item1 focus after call next");
						equals(item.offsetLeft, item.offsetWidth+offsetItem0,
								"item1 at second after call next");
						carousel.next();
						carousel.next();
						setTimeout(
								function() {
									item = document.getElementById(carousel
											.getId("item" + 3));
									equals(item.offsetLeft
											- container.scrollLeft,
											item.offsetWidth * 2+offsetItem0,
											"item3 focus after call next*2");
									carousel.prev();
									setTimeout(
											function() {
												item = document
														.getElementById(carousel
																.getId("item" + 2));
												ok(
														item.className
																.indexOf(carousel
																		.getClass("item-focus")) > -1,
														"item2 focus after call prev");
												equals(item.offsetLeft
														- container.scrollLeft,
														item.offsetWidth+offsetItem0,
														"item2 at second after call prev");
												carousel.prev();
												carousel.prev();
												setTimeout(
														function() {
															item = document
																	.getElementById(carousel
																			.getId("item" + 0));
															equals(
																	item.offsetLeft,
																	offsetItem0,
																	"item0 at first after call prev*2");
															start();
														}, 20);

											}, 20);
								}, 20);
					}, 40);

		});
