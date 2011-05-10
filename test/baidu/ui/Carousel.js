module('baidu.ui.Carousel');


(function() {
	function mySetup() {
		var div = document.createElement('div');
		div.id = 'div_test';
		document.body.appendChild(div);
		// div.style.position="absolute";
//		var m = document.createElement('ul');
//		m.className = 'menu';
//		div.appendChild(m);
//		var m1 = document.createElement('li');
//		m1.id = 'm1';
//		m1.innerHTML = 'm1';
//		m.appendChild(m1);

//		var sheet = document.createElement("div");
//		document.getElementsByTagName("head")[0].appendChild(sheet);
//		var str = "<syle>"+
//		    ".tangram-carousel {position: relative; overflow: hidden;	border: green solid 4px;}"
//			+ ".tangram-carousel .tangram-carousel-scroll {position: absolute;border : blue solid 1px;}'"
//			+ ".tangram-carousel .tangram-carousel-scroll .tangram-carousel-item {position: relatiev;float: left;border: pink solid 1px;width: 80px;}"
//			+ ".tangram-carousel .tangram-carousel-scroll .tangram-carousel-item-focus {border: red solid 1px;background: #eee;}"
//			+ ".tangram-carousel-btn-base {float: left;}"
//			+ "td {border:solid 1px red;}"
//		    + "</style>";
//		sheet.innerHTML = str;
//		testingElement.dom.push(m1);
//		testingElement.dom.push(m);
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
	expect(6);
	var c = te.dom[0];
	var carousel = createCarousel(c);
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
	expect(7);
	var c = te.dom[0];
	var carousel = createCarousel(c);
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
    var cas, oitem, item;
    var c = te.dom[0];
    cas = createCarousel(te.dom[0]);
	cas.render(c);
	item = cas.getItem(0), c = document.getElementById(cas.getId());
	cas.focus(0);
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
	var cas, oitem, item;
	var c = te.dom[0];
	cas = createCarousel(te.dom[0], true);
	cas.render(c);
	cas.focus(0);
	item = cas.getItem(0);
	c = document.getElementById(cas.getId());
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
