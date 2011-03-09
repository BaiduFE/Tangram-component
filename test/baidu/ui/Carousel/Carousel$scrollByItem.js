module('baidu.ui.Carousel.Carousel$scrollByItem');
test(
		"next, prev",
		function() {
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
			// 如果不设置一段超时，给滑块container的setStyle操作来不及生效，不是默认3个滑块的宽度
			ua.loadcss(upath+'style.css',function(){
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
						var c = document.getElementById(carousel.getId());
						ok(item.className.indexOf(carousel.getClass("item-focus")) > -1,
								"item1 focus after call next");
//						equals(carousel.getBody().scrollLeft, item.offsetWidth,
//								"item1 at second after call next");
						carousel.next();
						carousel.next();
						setTimeout(
								function() {
									item = document.getElementById(carousel.getId("item" + 3));
									//比对body的scrollLeft值，向前或向后focus，到pagesize后，滚动
									equals(c.scrollLeft,item.offsetWidth*1,"item3 focus after call next*2");
									carousel.prev();
									setTimeout(
											function() {
												item = document.getElementById(carousel.getId("item" + 2));
												ok(item.className.indexOf(carousel.getClass("item-focus")) > -1,
														"item2 focus after call prev");
//												equals(item.offsetLeft - container.scrollLeft,
//														item.offsetWidth+offsetItem0,
//														"item2 at second after call prev");
												carousel.prev();
												carousel.prev();
												setTimeout(
														function() {
															item = document.getElementById(carousel.getId("item" + 0));
															equals(c.scrollLeft,item.offsetWidth*0,
																	"item0 at first after call prev*2");
															start();
														}, 20);

											}, 20);
								}, 20);
					}, 40);
			})

		});
