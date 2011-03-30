module('baidu.ui.Carousel.Carousel$autoScroll');

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
		} , {
			content : "item-6"
		}, {
			content : "item-7"
		}, {
			content : "item-8"
		} ],
		autoScroll : {
			interval : 100,
			type : 'item'
		}
	};
	if (s === true)
		op['orientation'] = 'vertical';
	else if (s === false)
		op['orientation'] = 'horizontal';
	return new baidu.ui.Carousel(op);

}

test("autoScrollTo:H, index=1, time=4, type=item", function() {
    var cas, oitem, item, c;
    cas = createCarousel(te.dom[0], false);
	cas.render();
	item = document.getElementById(cas.getId("item" + 2));
	c = document.getElementById(cas.getId());
	cas.focus(0);
	stop();
	cas.scrollTo(1);//scrollLeft 表示滚动条向右拖动的距离 $(c).css('height')
	setTimeout(function(){
		equals(c.scrollLeft, item.offsetWidth*5,"验证滚动距离是否为五个item的width");
		cas.dispose();
		start();
	},450);
});

test("autoScrollTo:H, index=1, time=8, type=item", function() {
    var cas, oitem, item, c;
    cas = createCarousel(te.dom[0], false);
	cas.render();
	item = document.getElementById(cas.getId("item" + 2));
	c = document.getElementById(cas.getId());
	cas.focus(0);
	stop();
	cas.scrollTo(1);//scrollLeft 表示滚动条向右拖动的距离 $(c).css('height')
	setTimeout(function(){
		equals(c.scrollLeft, item.offsetWidth*6+2,"验证滚动距离是否为六个item的width+2（到最后一个item就停止）");
		equals(cas.scrollIndex, 8,"验证滚动到item8（不循环滚动）");
		cas.dispose();
		start();
	},890);
});

test("autoScrollTo:H, index=1, time=8, type=item, isCycle:true", function() {
	var cas, oitem, item, c;
	cas = createCarousel(te.dom[0], false);
	cas.isCycle = true;
	cas.render();
	item = document.getElementById(cas.getId("item" + 2));
	c = document.getElementById(cas.getId());
	cas.focus(0);
	stop();
	cas.scrollTo(1);//scrollLeft 表示滚动条向右拖动的距离 $(c).css('height')
	setTimeout(function(){
		equals(c.scrollLeft, 0,"验证滚动距离是否为0（循环滚动）");
		equals(cas.scrollIndex, 0,"验证滚动回item0（循环滚动）");
		cas.dispose();
		start();
	},890);
});

test("autoScrollTo:V, index=2, time=2, type=item", function() {
	var cas, oitem, item, c;
	cas = createCarousel(te.dom[0], true);
	cas.render();
  item = document.getElementById(cas.getId("item" + 2));
  c = document.getElementById(cas.getId());
	cas.focus(0);
	stop();
	cas.scrollTo(2);//scrollLeft 表示滚动条向右拖动的距离 $(c).css('height')
	setTimeout(function(){
		equals(c.scrollTop, item.offsetHeight*4, "验证滚动距离是否为四个item的height");
		cas.dispose();
		start();
	},250);
});

test("autoScrollTo:H, index=1, time=2, type=page", function() {
    var cas, oitem, item, c;
    cas = createCarousel(te.dom[0], false);
	cas.render();
	cas.autoScroll.type = 'page';
	item = document.getElementById(cas.getId("item" + 2));
	c = document.getElementById(cas.getId());
	cas.focus(0);
	stop();
	cas.scrollTo(1);//scrollLeft 表示滚动条向右拖动的距离 $(c).css('height')
	setTimeout(function(){
		equals(c.scrollLeft, item.offsetWidth*6,"验证滚动距离是否为两页item的width");
		equals(cas.scrollIndex, 6,"验证滚动到item6");
		cas.dispose();
		start();
	},250);
});

test("autoScrollTo:H, index=3, time=2, type=page", function() {
    var cas, oitem, item, c;
    cas = createCarousel(te.dom[0], false);
	cas.render();
	cas.autoScroll.type = 'page';
	item = document.getElementById(cas.getId("item" + 2));
	c = document.getElementById(cas.getId());
	cas.focus(0);
	stop();
	cas.scrollTo(3);//scrollLeft 表示滚动条向右拖动的距离 $(c).css('height')
	setTimeout(function(){
		equals(c.scrollLeft, item.offsetWidth*6,"验证滚动距离是否为两页item的width");
		equals(cas.scrollIndex, 6,"验证滚动到item6（不循环滚动）");
		cas.dispose();
		start();
	},250);
});

test("autoScrollTo:H, index=3, time=2, type=page", function() {
    var cas, oitem, item, c;
    cas = createCarousel(te.dom[0], false);
    cas.isCycle = true;
	cas.render();
	cas.autoScroll.type = 'page';
	item = document.getElementById(cas.getId("item" + 2));
	c = document.getElementById(cas.getId());
	cas.focus(0);
	stop();
	cas.scrollTo(3);//scrollLeft 表示滚动条向右拖动的距离 $(c).css('height')
	setTimeout(function(){
		equals(c.scrollLeft, 0,"验证滚动距离是否为0（循环滚动）");
		equals(cas.scrollIndex, 0,"验证滚动回item0（循环滚动）");
		cas.dispose();
		start();
	},250);
});

test("autoScrollTo:V, index=1, time=2, type=page", function() {
    var cas, oitem, item, c;
    cas = createCarousel(te.dom[0], true);
	cas.render();
	cas.autoScroll.type = 'page';
	item = document.getElementById(cas.getId("item" + 2));
	c = document.getElementById(cas.getId());
	cas.focus(0);
	stop();
	cas.scrollTo(1);//scrollLeft 表示滚动条向右拖动的距离 $(c).css('height')
	setTimeout(function(){
		equals(c.scrollTop, item.offsetHeight*6,"验证滚动距离是否为两页item的width");
		equals(cas.scrollIndex, 6,"验证滚动到item6");
		cas.dispose();
		start();
	},250);
});