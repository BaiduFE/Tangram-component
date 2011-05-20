module('baidu.ui.Carousel');


(function() {
	function mySetup() {
		var div = document.createElement('div');
		div.id = 'div_test';
		document.body.appendChild(div);
		testingElement.dom.push(div);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);;
		mySetup();
	};
})();

function createCarousel(c, s) {
	var op = {
		target : c,
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
		}]
	};
	if (s === true)
		op['orientation'] = 'vertical';
	else if (s === false)
		op['orientation'] = 'horizontal';
	return new baidu.ui.Carousel(op);
}

var step =0;
var afterstep = 0;

function check(evtindex, evtscrollOffset, evtscrollUnit, evtdirection, index, scrollOffset, scrollUnit, direction){
	equals(evtindex, index, 'onbeforescroll-check index');
	equals(evtscrollOffset, scrollOffset, 'onbeforescroll-check scrollOffset');
	equals(evtscrollUnit, scrollUnit, 'onbeforescroll-check scrollUnit:');
	equals(evtdirection, direction, 'onbeforescroll-check direction');
};
function check_onbeforescroll(evt){
	step ++;
	if(step == 1)
		check(evt.index, evt.scrollOffset, evt.scrollUnit, evt.direction, 2, 0, 2, 'next');
	if(step == 2)
		check(evt.index, evt.scrollOffset, evt.scrollUnit, evt.direction, 4, 0, 2, 'next');
	if(step == 3)
		check(evt.index, evt.scrollOffset, evt.scrollUnit, evt.direction, 0, 2, 3, 'prev');
	if(step == 4)
		check(evt.index, evt.scrollOffset, evt.scrollUnit, evt.direction, 3, 1, 3, 'next');
	if(step == 5)
		check(evt.index, evt.scrollOffset, evt.scrollUnit, evt.direction, 5, 1, 2, 'next');
	if(step == 6)
		check(evt.index, evt.scrollOffset, evt.scrollUnit, evt.direction, 2, 2, 3, 'prev');
	if(step == 7)
		check(evt.index, evt.scrollOffset, evt.scrollUnit, evt.direction, 2, 0, 2, 'next');//，因为scrollTo(2,6)不会触发滚动，这一步算scrollTo(2,-1)

};
function check_onafterscroll(evt){
	afterstep ++;
	if(afterstep == 1)
		check(evt.index, evt.scrollOffset, evt.scrollUnit, evt.direction, 2, 0, 2, 'next');
	if(afterstep == 2)
		check(evt.index, evt.scrollOffset, evt.scrollUnit, evt.direction, 4, 0, 2, 'next');
	if(afterstep == 3)
		check(evt.index, evt.scrollOffset, evt.scrollUnit, evt.direction, 0, 2, 3, 'prev');
	if(afterstep == 4)
		check(evt.index, evt.scrollOffset, evt.scrollUnit, evt.direction, 3, 1, 3, 'next');
	if(afterstep == 5)
		check(evt.index, evt.scrollOffset, evt.scrollUnit, evt.direction, 5, 1, 2, 'next');
	if(afterstep == 6)
		check(evt.index, evt.scrollOffset, evt.scrollUnit, evt.direction, 2, 2, 3, 'prev');
	if(afterstep == 7)
		check(evt.index, evt.scrollOffset, evt.scrollUnit, evt.direction, 2, 0, 2, 'next');//，因为scrollTo(2,6)不会触发滚动，这一步算scrollTo(2,-1)	
};

test("carousel width and height",function(){
	expect(4);
	stop();
	ua.loadcss(upath+'Carousel/style.css',function(){
	    var c = te.dom[0];
		var carousel = createCarousel(c);
		carousel.render(c);
		var item = carousel.getItem(0);
		equals(carousel.getBody().style.width, (item.offsetWidth + 2 )*(carousel.pageSize)+'px',
				"check carousel width");
		equals(carousel.getScrollContainer().clientHeight, item.offsetHeight + 2, "check carousel offsetHeight PUBLICGE-419");
		
		var c1 = document.body.appendChild(document.createElement('div'));
		$(c1).css('width', '82').css('position','absolute');
		var carousel1 = createCarousel(c1, true);
		carousel1.render(c1);
		var item1 = carousel1.getItem(0);
		equals(carousel1.getBody().style.height, (item1.offsetHeight + 2)*(carousel.pageSize) - (carousel.pageSize - 1)+'px',
				"check carousel height");
		equals(Math.floor(carousel.getScrollContainer().clientWidth / carousel1.pageSize), item.offsetWidth + 2, "check carousel offsetWidth PUBLICGE-419");
		carousel.dispose();
		carousel1.dispose();
		start();		
	});
});

test("check options",function(){
	expect(6);
    var c = te.dom[0];
    var carousel = createCarousel(c);
    carousel.pageSize = 4;
    carousel.scrollIndex = 2;
	carousel.render(c);
	var item = carousel.getItem(0);
	var item2 = carousel.getItem(2);
	ok(item2.className.indexOf(carousel.getClass("item-focus")) > -1,
	"check scrollIndex");
	equals(carousel.getBody().style.width, (item.offsetWidth + 2)*(carousel.pageSize)+'px',
			"check carousel offsetWidth PUBLICGE-419 PUBLICGE-427");
	equals(carousel.getScrollContainer().clientHeight, item.offsetHeight + 2, "check carousel offsetHeight PUBLICGE-419");
	
	var c1 = document.body.appendChild(document.createElement('div'));
	$(c1).css('width', '82').css('position','absolute');
	var carousel1 = createCarousel(c1, true);
    carousel1.pageSize = 4;
    carousel1.scrollIndex = 2;
    carousel1.offsetWidth = 60;
    carousel1.offsetHeight = 30;
	carousel1.render(c1);
	var item = carousel1.getItem(0);
	var item2 = carousel1.getItem(2);
	ok(item2.className.indexOf(carousel1.getClass("item-focus")) > -1,
	"check scrollIndex");
	equals(carousel1.getBody().style.height, (item.offsetHeight + 2)*(carousel1.pageSize) - (carousel.pageSize - 1)+'px',
			"check carousel offsetHeight PUBLICGE-419");
	equals(Math.floor(carousel.getScrollContainer().clientWidth / carousel1.pageSize), item.offsetWidth + 2, "check carousel offsetWidth PUBLICGE-419");
	carousel.dispose();
	carousel1.dispose();
});

test("render", function() {
	expect(6);
	var c = te.dom[0];
	var carousel = createCarousel(c);
	carousel.render(c);
	equals(c.firstChild.id, carousel.getId(),
			"carousel container exists");
	equals(c.firstChild.firstChild.id, carousel.getId("scroll"),
			"carousel scrollContainer exists");
	equals(baidu.dom.children(c.firstChild.firstChild).length, 
			3, "carousel itemContainer exists");
	for(var i = 0; i < 3; i++)
		equals(baidu.dom.children(c.firstChild.firstChild)[i].innerHTML, 
				'item-' + i, "carousel itemContainer exists");
	carousel.dispose();
});

test("getItem", function() {
	expect(5);
	var c = te.dom[0];
	var carousel = createCarousel(c);
	carousel.render(c);
	for (var i = 0; i < 3; i++){
		var item = carousel.getItem(i);
		equals(item.innerHTML, 'item-' + i, "it's item-" + i);
	}
	var item = carousel.getItem(-1);
	equals(item, null, "get item--1 null");
	var item = carousel.getItem(3);
	equals(item, null, "get item-3 null");
	carousel.dispose();
});

test("getCurrentIndex", function() {
	expect(2);
	var c = te.dom[0];
	var carousel = createCarousel(c);
	carousel.render(c);
	var currentIndex = carousel.getCurrentIndex();
	equals(currentIndex, 0, "it's item-0");
	carousel.focus(4);
	var currentIndex = carousel.getCurrentIndex();
	equals(currentIndex, 4, "it's item-4");
	carousel.dispose();
});

test("getTotalCount", function() {
	expect(1);
	var c = te.dom[0];
	var carousel = createCarousel(c);
	carousel.render(c);
	var totalCount = carousel.getTotalCount();
	equals(totalCount, 6, "There are 6 items");
	carousel.dispose();
});

test("prev, item, PUBLICGE-418", function() {
	expect(12);
	var c = te.dom[0];
	var carousel = createCarousel(c);
	carousel.onprev = function(){
		ok(true, 'onpre is dispatched');
	}
	carousel.render(c);
	carousel.focus(5);
	carousel.scrollTo(5,0);
	for(var i = 4; i >= 0; i--){
		carousel.prev();
		var itemi = carousel.getItem(i);
		ok(itemi.className.indexOf(carousel.getClass("item-focus")) > -1,
		"check prev " + itemi.innerHTML);
	}
	carousel.prev();
	var item0 = carousel.getItem(0);
	ok(item0.className.indexOf(carousel.getClass("item-focus")) > -1,
	"check prev " + item0.innerHTML);
	carousel.dispose();
});

test("next, item, PUBLICGE-418", function() {
	expect(13);
	var c = te.dom[0];
	var carousel = createCarousel(c);
	carousel.onnext = function(){
		ok(true, 'onnext is dispatched');
	}
	carousel.render(c);
	carousel.focus(0);
	for(var i = 0; i <= 5; i++){
		var itemi = carousel.getItem(i);
		ok(itemi.className.indexOf(carousel.getClass("item-focus")) > -1,
		"check next " + itemi.innerHTML);
		carousel.next();
	}
	var item5 = carousel.getItem(5);
	ok(item5.className.indexOf(carousel.getClass("item-focus")) > -1,
	"check next " + item5.innerHTML);
	carousel.dispose();
});

test("prev and next, page", function() {
	expect(7);
	var c = te.dom[0];
	var carousel = createCarousel(c);
	var item;
	carousel.render(c);
	carousel.flip = 'page';
	carousel.next();
	ok(carousel.getItem(3).className.indexOf(carousel.getClass("item-focus")) > -1,
			"check next item3");
	carousel.prev();
	ok(carousel.getItem(0).className.indexOf(carousel.getClass("item-focus")) > -1,
	"check prev item0");
	carousel.scrollTo(0,2);
	ok(carousel.getItem(0).className.indexOf(carousel.getClass("item-focus")) > -1,
	"check focus afet scroll PUBLICGE-429");
	carousel.focus(0);
	carousel.next();
	ok(carousel.getItem(3).className.indexOf(carousel.getClass("item-focus")) > -1,
	"check next item1");
	carousel.next();
	ok(carousel.getItem(4).className.indexOf(carousel.getClass("item-focus")) > -1,
	"check next item4");
	carousel.scrollTo(5,0);
	carousel.focus(5);
	carousel.prev();
	ok(carousel.getItem(2).className.indexOf(carousel.getClass("item-focus")) > -1,
	"check prev item4");
	carousel.prev();
	ok(carousel.getItem(1).className.indexOf(carousel.getClass("item-focus")) > -1,
	"check prev item1");
	carousel.dispose();
});

test("isFirst", function() {
	expect(4);
	var c = te.dom[0];
	var carousel = createCarousel(c);
	carousel.render(c);
	ok(carousel.isFirst(), "it's first item");
	carousel.focus(4);
	ok(!carousel.isFirst(), "it's not first item");
	carousel.flip = 'page';
	carousel.focus(4);
	ok(!carousel.isFirst(), "it's not first page");
	carousel.focus(0);
	ok(carousel.isFirst(), "it's first page");
	carousel.dispose();
});

test("isLast", function() {
	expect(4);
	var c = te.dom[0];
	var carousel = createCarousel(te.dom[0]);
	carousel.render(c);
	ok(!carousel.isLast(), "it's not last");
	carousel.focus(5);
	ok(carousel.isLast(), "it's last");
	carousel.flip = 'page';
	carousel.focus(2);
	ok(!carousel.isLast(), "it's not last page");
	carousel.focus(4);
	ok(carousel.isLast(), "it's last page");
	carousel.dispose();
});

test("focus", function() {
	expect(4);
	var c = te.dom[0];
	var carousel = createCarousel(te.dom[0]);
	carousel.render(c);
	var item = carousel.getItem(0);
	ok(item.className.indexOf(carousel.getClass("item-focus")) > -1,
	"item0 is focus");
	carousel.focus(1);
	var item = carousel.getItem(1);
	ok(item.className.indexOf(carousel.getClass("item-focus")) > -1,
			"item1 is focus");
	carousel.focus(-1);
	ok(item.className.indexOf(carousel.getClass("item-focus")) > -1,
			"item-1 is not focus, item1 is focus");
	carousel.focus(7);
	ok(item.className.indexOf(carousel.getClass("item-focus")) > -1,
			"item7 is not focus, item1 is focus");
	carousel.dispose();
});

test("getScrollContainer", function() {
	expect(1);
	var c = te.dom[0];
	var carousel = createCarousel(c);
	carousel.render(c);
	var container = carousel.getScrollContainer();
	equals(container.id, carousel.getId('scroll'), "There container is right");
	carousel.dispose();
});

test("dispose", function() {
	expect(2);
	var ie = baidu.event._listeners.length;
	var c = te.dom[0];
	var carousel = createCarousel(c);
	carousel.render(c);
	carousel.dispose();
	var ll = baidu.event._listeners.length;
	equals(carousel.getMain(), null,"Check element exists or not");
	equals(ll, ie,"Check event exists or not");
});

test("scrollTo H", function() {
	expect(64);
    var cas, oitem, item;
    var c = te.dom[0];
    cas = createCarousel(te.dom[0]);
    cas.onbeforescroll = check_onbeforescroll;
    cas.onafterscroll = check_onafterscroll;
	cas.render(c);
	cas.scrollTo(2, 0);
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-2',"验证滚动");
    cas.scrollTo(4, 0);
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-4',"验证滚动");
    cas.scrollTo(0, 2);
    equals(cas.getScrollContainer().firstChild.nextSibling.nextSibling.innerHTML, 'item-0',"验证滚动");
    cas.scrollTo(3, 1);
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-2',"验证滚动");
    cas.scrollTo(5, 1);
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-4',"验证滚动");
    cas.scrollTo(2, 2);
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-0',"验证滚动");
    cas.scrollTo(2, 6);
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-0',"验证滚动");
    cas.scrollTo(2, -1);
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-2',"验证滚动");
    cas.dispose();
});

test("scrollTo V", function() {
	expect(64);
	var cas, oitem, item;
	var c = te.dom[0];
	cas = createCarousel(te.dom[0], true);
	step =0;
	afterstep = 0;
    cas.onbeforescroll = check_onbeforescroll;
    cas.onafterscroll = check_onafterscroll;
	cas.render(c);
	cas.scrollTo(2, 0);
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-2',"验证滚动");
    cas.scrollTo(4, 0);
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-4',"验证滚动");
    cas.scrollTo(0, 2);
    equals(cas.getScrollContainer().firstChild.nextSibling.nextSibling.innerHTML, 'item-0',"验证滚动");
    cas.scrollTo(3, 1);
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-2',"验证滚动");
    cas.scrollTo(5, 1);
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-4',"验证滚动");
    cas.scrollTo(2, 2);
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-0',"验证滚动");
    cas.scrollTo(2, 6);
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-0',"验证滚动");
    cas.scrollTo(2, -1);
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-2',"验证滚动");
	cas.dispose();
});

test("scrollTo, without scrollOffset", function() {
	var cas, oitem, item;
	var c = te.dom[0];
	cas = createCarousel(te.dom[0], true);
	cas.render(c);
	cas.scrollTo(2);
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-2',"验证滚动");
    cas.scrollTo(4);
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-4',"验证滚动");
    cas.scrollTo(0);
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-0',"验证滚动");
	cas.dispose();
});

test("scrollTo H, with direction", function() {
	expect(65);
	var cas, oitem, item;
	var c = te.dom[0];
	cas = createCarousel(te.dom[0], true);
	step =0;
	afterstep = 0;
    cas.onbeforescroll = check_onbeforescroll;
    cas.onafterscroll = check_onafterscroll;
	cas.render(c);
	cas.scrollTo(2, 0, 'next');
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-2',"验证滚动");
    cas.scrollTo(4, 0, 'next');
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-4',"验证滚动");
    cas.scrollTo(0, 2, 'prev');
    equals(cas.getScrollContainer().firstChild.innerHTML, '',"验证滚动");
    equals(cas.getScrollContainer().firstChild.nextSibling.nextSibling.innerHTML, 'item-0',"验证滚动");
    cas.scrollTo(3, 1, 'next');
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-2',"验证滚动");
    cas.scrollTo(5, 1, 'next');
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-4',"验证滚动");
    cas.scrollTo(2, 2, 'prev');
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-0',"验证滚动");
    cas.scrollTo(2, 6, 'prev');
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-0',"验证滚动");
    cas.scrollTo(2, -1, 'next');
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-2',"验证滚动");
	cas.dispose();
});

test("scrollTo V, with direction", function() {
	expect(65);
	var cas, oitem, item;
	var c = te.dom[0];
	cas = createCarousel(te.dom[0], true);
	step =0;
	afterstep = 0;
    cas.onbeforescroll = check_onbeforescroll;
    cas.onafterscroll = check_onafterscroll;
	cas.render(c);
	cas.scrollTo(2, 0, 'next');
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-2',"验证滚动");
    cas.scrollTo(4, 0, 'next');
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-4',"验证滚动");
    cas.scrollTo(0, 2, 'prev');
    equals(cas.getScrollContainer().firstChild.innerHTML, '',"验证滚动");
    equals(cas.getScrollContainer().firstChild.nextSibling.nextSibling.innerHTML, 'item-0',"验证滚动");
    cas.scrollTo(3, 1, 'next');
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-2',"验证滚动");
    cas.scrollTo(5, 1, 'next');
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-4',"验证滚动");
    cas.scrollTo(2, 2, 'prev');
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-0',"验证滚动");
    cas.scrollTo(2, 6, 'prev');
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-0',"验证滚动");
    cas.scrollTo(2, -1, 'next');
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-2',"验证滚动");
	cas.dispose();
});

test("large quantity", function() {
	expect(12);
	var cas, oitem, item;
	var c = te.dom[0];
	var data = new Array();
	for(var i = 0; i < 1000; i++)
		data.push({content : 'item-' + i});
	var op = {
			target : c,
			contentText : data
		};
	var cas = new baidu.ui.Carousel(op);
	cas.render(c);
	ok(cas.getItem(0).className.indexOf(cas.getClass("item-focus")) > -1,
	"item0 is focus");
	cas.scrollTo(100, 0);
	cas.focus(100);
	ok(cas.getItem(100).className.indexOf(cas.getClass("item-focus")) > -1,
	"item100 is focus");
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-100',"验证滚动");
    cas.scrollTo(200, 0);
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-200',"验证滚动");
    cas.scrollTo(0, 2);
    equals(cas.getScrollContainer().firstChild.innerHTML, '',"验证滚动");
    equals(cas.getScrollContainer().firstChild.nextSibling.nextSibling.innerHTML, 'item-0',"验证滚动");
    cas.scrollTo(500, 1, 'next');
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-499',"验证滚动");
    cas.scrollTo(999, 1, 'next');
    cas.focus(999);
	ok(cas.getItem(999).className.indexOf(cas.getClass("item-focus")) > -1,
	"item999 is focus");
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-998',"验证滚动");
    cas.scrollTo(200, 2, 'prev');
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-198',"验证滚动");
    cas.scrollTo(200, 6);
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-198',"验证滚动");
    cas.scrollTo(2, -1, 'next');
    equals(cas.getScrollContainer().firstChild.innerHTML, 'item-2',"验证滚动");
	cas.dispose();
});
