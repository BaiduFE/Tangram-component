(function() {
	function createCarousel(c) {
		return carousel = new baidu.ui.Carousel(
				{
					target : c,
					// orientation:'vertical',
					"onbeforestartscroll" : function() {
						ok(true, 'onbeforescroll');
					},
					"onafterscroll" : function() {
						var container = document.getElementById(this.getId());
						var item = document.getElementById(this
								.getId("item" + 2));
						equals(item.offsetLeft, container.scrollLeft,
								'scroll to item3');
						start();
					},
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
	}
	module('baidu.ui.Carousel.Carousel$fx');

	test('horizontal', function() {
		stop();
		setTimeout(function() {
			var carous = new baidu.ui.Carousel( {
				target : te.dom[0],
				// orientation:'vertical',
				showButton : true,
				"onbeforestartscroll" : function() {
					ok(true, 'onbeforescroll');
				},
				"onafterscroll" : function() {
					var container = document.getElementById(this.getId());
					var item = document.getElementById(this.getId("item" + 2));
//					equals(item.offsetLeft, offsetItem0+container.scrollLeft,
//							'scroll to item3');
					equals(container.scrollLeft, item.offsetWidth*2,'scroll to item3');
					start();
				},
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
			carous.render();
			var offsetItem0 = document.getElementById(carous.getId("item0")).offsetLeft;
			var item = document.getElementById(carous.getId("item0"));
			carous.focus(0);
			carous.scrollTo(2);
		}, 500);

	});

	test('2 params', function() {
		stop();
		setTimeout(function() {
			var options = {
				target : te.dom[0],
				isCycle : true,
				"onbeforescroll" : function(evt) {
					equal(evt.index, 2, 'scroll to item2');
					equal(evt.scrollOffset, 1, 'offset is 1');
				},
				"onbeforestartscroll" : function() {
					ok(true, 'onbeforescroll');
				},
				"onafterscroll" : function() {
					var container = document.getElementById(this.getId());
					var item = document.getElementById(this.getId("item" + 2));
					this.focus(2);
//					equals(item.offsetLeft, container.scrollLeft + 82 + offsetItem0,'scroll to item3');
					equals(container.scrollLeft, item.offsetWidth*(2-1),'scroll to item3');
					start();
				},
				"onafterfinish" : function(evt) {
					equal(evt.index, 2, 'scroll to item2');
					equal(evt.scrollOffset, 1, 'offset is 1');

				},
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
			}
			var carous = new baidu.ui.Carousel(options);
			carous.render();
			var offsetItem0 = document.getElementById(carous.getId("item0")).offsetLeft;
			var item = document.getElementById(carous.getId("item0"));
			carous.focus(0);
			carous.scrollTo(2, 1);
		}, 100);
	})
})();
