module('baidu.ui.Carousel.Carousel$fx');

test('horizontal, in buff', function() {
	expect(18);
	stop();
	ua.loadcss(upath + 'style.css', function() {
		var step = 0;
		var carous = new baidu.ui.Carousel({
			target : te.dom[0],
			"onbeforescroll" : function(evt) {
				if(step == 0){
					equals(evt.index, 2, 'The index is right');
					equals(evt.scrollOffset, 0, 'The scrollOffset is right');
				}
				if(step == 1){
					equals(evt.index, 4, 'The index is right');
					equals(evt.scrollOffset, 0, 'The scrollOffset is right');
				}
				if(step == 2){
					equals(evt.index, 2, 'The index is right');
					equals(evt.scrollOffset, 2, 'The scrollOffset is right');
				}
				if(step == 3){
					equals(evt.index, 2, 'The index is right');
					equals(evt.scrollOffset, 0, 'The scrollOffset is right');
				}
				if(step == 4){
					equals(evt.index, 5, 'The index is right');
					equals(evt.scrollOffset, 2, 'The scrollOffset is right');
				}
				if(step == 5){
					equals(evt.index, 0, 'The index is right');
					equals(evt.scrollOffset, 2, 'The scrollOffset is right');
				}
			},
			"onafterscroll" : function() {
				var container = document.getElementById(this.getId());
				var len = baidu.dom.children(carous.getScrollContainer()).length;
				var firstItemInWindow = baidu.dom.children(carous.getScrollContainer())[len-3].innerHTML;
				if (step == 0) {
					equals(firstItemInWindow, 'item~2', 'step0');
					setTimeout(function() {
						step++;
						carous.scrollTo(4, 0);
					}, 0);
				}
				if (step == 1) {
					equals(firstItemInWindow, 'item~4', 'step1');
					setTimeout(function() {
						step++;
						carous.scrollTo(2, 2);
					}, 0);
				}
				if (step == 2) {
					equals(firstItemInWindow, 'item~0', 'step2');
					setTimeout(function() {
						step++;
						carous.scrollTo(2, -1);
					}, 0);
				}
				if (step == 3) {
					equals(firstItemInWindow, 'item~2', 'step3');
					setTimeout(function() {
						step++;
						carous.scrollTo(5, 3);
					}, 0);
				}
				if (step == 4) {
					equals(firstItemInWindow, 'item~3', 'step4');
					setTimeout(function() {
						step++;
						carous.scrollTo(0, 2);
					}, 0);
				}
				if (step == 5) {
					equals(firstItemInWindow, 'item~4', 'step5');
					setTimeout(function() {
						start();
						carous.dispose();
					}, 0);
				}
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
		carous.render(te.dom[0]);
		var item = carous.getItem(0);
		var offsetItem = item.offsetLeft;
		carous.focus(0);
		carous.scrollTo(2, 0);
	});
});

test('vertical, in buff', function() {
	expect(18);
	stop();
	ua.loadcss(upath + 'style.css', function() {
		var step = 0;
		var c = te.dom[0];
		$(c).css('width', '82').css('position','absolute');
		var carous = new baidu.ui.Carousel({
			target : c,
			orientation : 'vertical',
			"onbeforescroll" : function(evt) {
				if(step == 0){
					equals(evt.index, 2, 'The index is right');
					equals(evt.scrollOffset, 0, 'The scrollOffset is right');
				}
				if(step == 1){
					equals(evt.index, 4, 'The index is right');
					equals(evt.scrollOffset, 0, 'The scrollOffset is right');
				}
				if(step == 2){
					equals(evt.index, 2, 'The index is right');
					equals(evt.scrollOffset, 2, 'The scrollOffset is right');
				}
				if(step == 3){
					equals(evt.index, 2, 'The index is right');
					equals(evt.scrollOffset, 0, 'The scrollOffset is right');
				}
				if(step == 4){
					equals(evt.index, 5, 'The index is right');
					equals(evt.scrollOffset, 2, 'The scrollOffset is right');
				}
				if(step == 5){
					equals(evt.index, 0, 'The index is right');
					equals(evt.scrollOffset, 2, 'The scrollOffset is right');
				}
			},
			"onafterscroll" : function() {
				var container = document.getElementById(this.getId());
				var len = baidu.dom.children(carous.getScrollContainer()).length;
				var firstItemInWindow = baidu.dom.children(carous.getScrollContainer())[len-3].innerHTML;
				if (step == 0) {
					equals(firstItemInWindow, 'item~2', 'step0');
					setTimeout(function() {
						step++;
						carous.scrollTo(4, 0);
					}, 0);
				}
				if (step == 1) {
					equals(firstItemInWindow, 'item~4', 'step1');
					setTimeout(function() {
						step++;
						carous.scrollTo(2, 2);
					}, 0);
				}
				if (step == 2) {
					equals(firstItemInWindow, 'item~0', 'step2');
					setTimeout(function() {
						step++;
						carous.scrollTo(2, -1);
					}, 0);
				}
				if (step == 3) {
					equals(firstItemInWindow, 'item~2', 'step3');
					setTimeout(function() {
						step++;
						carous.scrollTo(5, 3);
					}, 0);
				}
				if (step == 4) {
					equals(firstItemInWindow, 'item~3', 'step4');
					setTimeout(function() {
						step++;
						carous.scrollTo(0, 2);
					}, 0);
				}
				if (step == 5) {
					equals(firstItemInWindow, 'item~4', 'step5');
					setTimeout(function() {
						start();
						carous.dispose();
					}, 0);
				}
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
		carous.render(te.dom[0]);
		var item = carous.getItem(0);
		var offsetItem = item.offsetLeft;
		carous.focus(0);
		carous.scrollTo(2, 0);
	});
});
