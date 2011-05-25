module('baidu.ui.Carousel.Carousle$table');

/**
 * <li>addTableItem
 * <li>removeTableItem
 * 
 * **/
function createCarousel(s, supportTable) {
	var op = {
		// target : c,
	    supportTable : supportTable ,
		orientation : s,
		contentText : [ {
			content : "data-0"
		}, {
			content : "data-1"
		}, {
			content : "data-2"
		}, {
			content : "data-3"
		}, {
			content : "data-4"
		}, {
			content : "data-5"
		}, {
			content : "data-6"
		}, {
			content : "data-7"
		}, {
			content : "data-8"
		} ],
		gridLayout : {row:3, col:2}
	};
	return new baidu.ui.Carousel(op);
};


test("diasble", function() {
	expect(3);
	var cas, oitem, item, c;
	cas = createCarousel('horizontal', false);
	cas.render(te.dom[0]);
	var items = baidu.dom.children(cas.getScrollContainer());
	equals(items[0].innerHTML, 'data-0', "check first item");
	equals(items[1].innerHTML, 'data-1', "check second item");
	equals(items[2].innerHTML, 'data-2', "check third item");
	
});

test("basic", function() {
	expect(14);
	var cas, oitem, item, c;
	cas = createCarousel('horizontal', true);
	cas.render(te.dom[0]);
	var items = baidu.dom.children(cas.getScrollContainer());
	equals(items.length, 3, '3 items');
	ok(items[0].className.indexOf(cas.getClass("item-focus")) > -1, 'focus to item0');
	var trs = baidu.dom.children(items[0].firstChild.firstChild.firstChild);
	equals(trs.length, 3, '3 rows in item 0');
	equals(trs[0].firstChild.innerHTML, 'data-0', 'data-0');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-1', 'data-1');
	equals(trs[1].firstChild.innerHTML, 'data-2', 'data-2');
	equals(trs[1].firstChild.nextSibling.innerHTML, 'data-3', 'data-3');
	equals(trs[2].firstChild.innerHTML, 'data-4', 'data-4');
	equals(trs[2].firstChild.nextSibling.innerHTML, 'data-5', 'data-5');
	var trs = baidu.dom.children(items[1].firstChild.firstChild.firstChild);
	equals(trs.length, 2, '2 rows in item 1');
	equals(trs[0].firstChild.innerHTML, 'data-6', 'data-6');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-7', 'data-7');
	equals(trs[1].firstChild.innerHTML, 'data-8', 'data-8');
	equals(items[2].innerHTML, '', 'The last empty item');
});

test("addTableItem, index = -1", function() {
	var cas, oitem, item, c;
	cas = createCarousel('horizontal', true);
	cas.render(te.dom[0]);
	var contentText =[ {
		content : "data-a"
	}, {
		content : "data-b"
	}, {
		content : "data-c"
	}, {
		content : "data-d"
	}, {
		content : "data-e"
	}, {
		content : "data-f"
	}, {
		content : "data-g"
	} ];
	cas.addTableItem(contentText, -1);
	cas.scrollTo(0,0);
	var items = baidu.dom.children(cas.getScrollContainer());
	equals(items.length, 3, '3 items');
	ok(items[1].className.indexOf(cas.getClass("item-focus")) > -1, 'focus to item1');
	var trs = baidu.dom.children(items[0].firstChild.firstChild.firstChild);
	equals(trs.length, 3, '3 rows in item 0');
	equals(trs[0].firstChild.innerHTML, 'data-a', 'data-a');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-b', 'data-b');
	equals(trs[1].firstChild.innerHTML, 'data-c', 'data-c');
	equals(trs[1].firstChild.nextSibling.innerHTML, 'data-d', 'data-d');
	equals(trs[2].firstChild.innerHTML, 'data-e', 'data-e');
	equals(trs[2].firstChild.nextSibling.innerHTML, 'data-f', 'data-f');
	var trs = baidu.dom.children(items[1].firstChild.firstChild.firstChild);
	equals(trs.length, 3, '3 rows in item 0');
	equals(trs[0].firstChild.innerHTML, 'data-0', 'data-0');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-1', 'data-1');
	equals(trs[1].firstChild.innerHTML, 'data-2', 'data-2');
	equals(trs[1].firstChild.nextSibling.innerHTML, 'data-3', 'data-3');
	equals(trs[2].firstChild.innerHTML, 'data-4', 'data-4');
	equals(trs[2].firstChild.nextSibling.innerHTML, 'data-5', 'data-5');
	var trs = baidu.dom.children(items[2].firstChild.firstChild.firstChild);
	equals(trs.length, 2, '2 rows in item 1');
	equals(trs[0].firstChild.innerHTML, 'data-6', 'data-6');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-7', 'data-7');
	equals(trs[1].firstChild.innerHTML, 'data-8', 'data-8');
});

test("addTableItem, index = 0", function() {
	var cas, oitem, item, c;
	cas = createCarousel('horizontal', true);
	cas.render(te.dom[0]);
	var contentText =[ {
		content : "data-a"
	}, {
		content : "data-b"
	}, {
		content : "data-c"
	}, {
		content : "data-d"
	}, {
		content : "data-e"
	}, {
		content : "data-f"
	}, {
		content : "data-g"
	} ];
	cas.addTableItem(contentText, 0);
	cas.scrollTo(0,0);
	var items = baidu.dom.children(cas.getScrollContainer());
	equals(items.length, 3, '3 items');
	ok(items[1].className.indexOf(cas.getClass("item-focus")) > -1, 'focus to item1');
	var trs = baidu.dom.children(items[0].firstChild.firstChild.firstChild);
	equals(trs.length, 3, '3 rows in item 0');
	equals(trs[0].firstChild.innerHTML, 'data-a', 'data-a');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-b', 'data-b');
	equals(trs[1].firstChild.innerHTML, 'data-c', 'data-c');
	equals(trs[1].firstChild.nextSibling.innerHTML, 'data-d', 'data-d');
	equals(trs[2].firstChild.innerHTML, 'data-e', 'data-e');
	equals(trs[2].firstChild.nextSibling.innerHTML, 'data-f', 'data-f');
	var trs = baidu.dom.children(items[1].firstChild.firstChild.firstChild);
	equals(trs.length, 3, '3 rows in item 0');
	equals(trs[0].firstChild.innerHTML, 'data-0', 'data-0');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-1', 'data-1');
	equals(trs[1].firstChild.innerHTML, 'data-2', 'data-2');
	equals(trs[1].firstChild.nextSibling.innerHTML, 'data-3', 'data-3');
	equals(trs[2].firstChild.innerHTML, 'data-4', 'data-4');
	equals(trs[2].firstChild.nextSibling.innerHTML, 'data-5', 'data-5');
	var trs = baidu.dom.children(items[2].firstChild.firstChild.firstChild);
	equals(trs.length, 2, '2 rows in item 1');
	equals(trs[0].firstChild.innerHTML, 'data-6', 'data-6');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-7', 'data-7');
	equals(trs[1].firstChild.innerHTML, 'data-8', 'data-8');
});

test("addTableItem, index = null", function() {
	var cas, oitem, item, c;
	cas = createCarousel('horizontal', true);
	cas.render(te.dom[0]);
	var contentText =[ {
		content : "data-a"
	}, {
		content : "data-b"
	}, {
		content : "data-c"
	}, {
		content : "data-d"
	}, {
		content : "data-e"
	}, {
		content : "data-f"
	}, {
		content : "data-g"
	} ];
	cas.addTableItem(contentText);
	var items = baidu.dom.children(cas.getScrollContainer());
	equals(items.length, 3, '3 items');
	ok(items[0].className.indexOf(cas.getClass("item-focus")) > -1, 'focus to item0');
	var trs = baidu.dom.children(items[0].firstChild.firstChild.firstChild);
	equals(trs.length, 3, '3 rows in item 0');
	equals(trs[0].firstChild.innerHTML, 'data-0', 'data-0');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-1', 'data-1');
	equals(trs[1].firstChild.innerHTML, 'data-2', 'data-2');
	equals(trs[1].firstChild.nextSibling.innerHTML, 'data-3', 'data-3');
	equals(trs[2].firstChild.innerHTML, 'data-4', 'data-4');
	equals(trs[2].firstChild.nextSibling.innerHTML, 'data-5', 'data-5');
	var trs = baidu.dom.children(items[1].firstChild.firstChild.firstChild);
	equals(trs.length, 2, '2 rows in item 1');
	equals(trs[0].firstChild.innerHTML, 'data-6', 'data-6');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-7', 'data-7');
	equals(trs[1].firstChild.innerHTML, 'data-8', 'data-8');
	var trs = baidu.dom.children(items[2].firstChild.firstChild.firstChild);
	equals(trs.length, 3, '3 rows in item 0');
	equals(trs[0].firstChild.innerHTML, 'data-a', 'data-a');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-b', 'data-b');
	equals(trs[1].firstChild.innerHTML, 'data-c', 'data-c');
	equals(trs[1].firstChild.nextSibling.innerHTML, 'data-d', 'data-d');
	equals(trs[2].firstChild.innerHTML, 'data-e', 'data-e');
	equals(trs[2].firstChild.nextSibling.innerHTML, 'data-f', 'data-f');
});

test("addTableItem, index = null, less data", function() {
	var cas, oitem, item, c;
	cas = createCarousel('horizontal', true);
	cas.render(te.dom[0]);
	var contentText =[ {
		content : "data-a"
	}, {
		content : "data-b"
	}, {
		content : "data-c"
	}, {
		content : "data-d"
	} ];
	cas.addTableItem(contentText);
	var items = baidu.dom.children(cas.getScrollContainer());
	equals(items.length, 3, '3 items');
	ok(items[0].className.indexOf(cas.getClass("item-focus")) > -1, 'focus to item0');
	var trs = baidu.dom.children(items[0].firstChild.firstChild.firstChild);
	equals(trs.length, 3, '3 rows in item 0');
	equals(trs[0].firstChild.innerHTML, 'data-0', 'data-0');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-1', 'data-1');
	equals(trs[1].firstChild.innerHTML, 'data-2', 'data-2');
	equals(trs[1].firstChild.nextSibling.innerHTML, 'data-3', 'data-3');
	equals(trs[2].firstChild.innerHTML, 'data-4', 'data-4');
	equals(trs[2].firstChild.nextSibling.innerHTML, 'data-5', 'data-5');
	var trs = baidu.dom.children(items[1].firstChild.firstChild.firstChild);
	equals(trs.length, 2, '2 rows in item 1');
	equals(trs[0].firstChild.innerHTML, 'data-6', 'data-6');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-7', 'data-7');
	equals(trs[1].firstChild.innerHTML, 'data-8', 'data-8');
	var trs = baidu.dom.children(items[2].firstChild.firstChild.firstChild);
	equals(trs.length, 2, '2 rows in item 0');
	equals(trs[0].firstChild.innerHTML, 'data-a', 'data-a');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-b', 'data-b');
	equals(trs[1].firstChild.innerHTML, 'data-c', 'data-c');
	equals(trs[1].firstChild.nextSibling.innerHTML, 'data-d', 'data-d');
	
	var getitem = cas.getItem(0);
	var trs = baidu.dom.children(getitem.firstChild.firstChild.firstChild);
    ok(trs.length == 3, 'getItem(0)');
    
	cas.focus(1);
	ok(items[1].className.indexOf(cas.getClass("item-focus")) > -1, 'focus to item1');
	
	cas.prev();
	ok(items[0].className.indexOf(cas.getClass("item-focus")) > -1, 'prev');
	
	cas.next();
	ok(items[1].className.indexOf(cas.getClass("item-focus")) > -1, 'next');
	
	cas.scrollTo(0,2);
    var items = baidu.dom.children(cas.getScrollContainer());
    equals(items[0].innerHTML, '', 'The first item is empty');
    equals(items[1].innerHTML, '', 'The second item is empty');
    var trs = baidu.dom.children(items[2].firstChild.firstChild.firstChild);
    equals(trs.length, 3, '3 rows in item 0');
    equals(trs[0].firstChild.innerHTML, 'data-0', 'data-0');
    equals(trs[0].firstChild.nextSibling.innerHTML, 'data-1', 'data-1');
    equals(trs[1].firstChild.innerHTML, 'data-2', 'data-2');
    equals(trs[1].firstChild.nextSibling.innerHTML, 'data-3', 'data-3');
    equals(trs[2].firstChild.innerHTML, 'data-4', 'data-4');
    equals(trs[2].firstChild.nextSibling.innerHTML, 'data-5', 'data-5');
});

test("removeTableItem, index = -1", function() {//设计规定removeItem和removeTableItem传入的index是-1时，不做处理
	var cas, oitem, item, c;
	cas = createCarousel('horizontal', true);
	cas.render(te.dom[0]);
	cas.removeTableItem(-1);
	var items = baidu.dom.children(cas.getScrollContainer());
	equals(items.length, 3, '3 items');
	ok(items[0].className.indexOf(cas.getClass("item-focus")) > -1, 'focus to item0');
	var trs = baidu.dom.children(items[0].firstChild.firstChild.firstChild);
	equals(trs.length, 3, '3 rows in item 0');
	equals(trs[0].firstChild.innerHTML, 'data-0', 'data-0');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-1', 'data-1');
	equals(trs[1].firstChild.innerHTML, 'data-2', 'data-2');
	equals(trs[1].firstChild.nextSibling.innerHTML, 'data-3', 'data-3');
	equals(trs[2].firstChild.innerHTML, 'data-4', 'data-4');
	equals(trs[2].firstChild.nextSibling.innerHTML, 'data-5', 'data-5');
	var trs = baidu.dom.children(items[1].firstChild.firstChild.firstChild);
	equals(trs.length, 2, '2 rows in item 1');
	equals(trs[0].firstChild.innerHTML, 'data-6', 'data-6');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-7', 'data-7');
	equals(trs[1].firstChild.innerHTML, 'data-8', 'data-8');
	equals(items[2].innerHTML, '', 'The last empty item');
});

test("removeTableItem, index = 0", function() {
	var cas, oitem, item, c;
	cas = createCarousel('horizontal', true);
	cas.render(te.dom[0]);
	cas.removeTableItem(0);
	var items = baidu.dom.children(cas.getScrollContainer());
	equals(items.length, 3, '3 items');
	ok(items[0].className.indexOf(cas.getClass("item-focus")) > -1, 'focus to item0');
	var trs = baidu.dom.children(items[0].firstChild.firstChild.firstChild);
	equals(trs.length, 2, '2 rows in item 1');
	equals(trs[0].firstChild.innerHTML, 'data-6', 'data-6');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-7', 'data-7');
	equals(trs[1].firstChild.innerHTML, 'data-8', 'data-8');
	equals(items[1].innerHTML, '', 'The second item is empty');
	equals(items[2].innerHTML, '', 'The last item is empty');
});

test("removeTableItem, index = 1", function() {
	var cas, oitem, item, c;
	cas = createCarousel('horizontal', true);
	cas.render(te.dom[0]);
	var contentText =[ {
		content : "data-a"
	}, {
		content : "data-b"
	}, {
		content : "data-c"
	}, {
		content : "data-d"
	}, {
		content : "data-e"
	}, {
		content : "data-f"
	}, {
		content : "data-g"
	} ];
	cas.addTableItem(contentText);
	cas.removeTableItem(1);
	var items = baidu.dom.children(cas.getScrollContainer());
	equals(items.length, 3, '3 items');
	ok(items[0].className.indexOf(cas.getClass("item-focus")) > -1, 'focus to item0');
	var trs = baidu.dom.children(items[0].firstChild.firstChild.firstChild);
	equals(trs.length, 3, '3 rows in item 0');
	equals(trs[0].firstChild.innerHTML, 'data-0', 'data-0');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-1', 'data-1');
	equals(trs[1].firstChild.innerHTML, 'data-2', 'data-2');
	equals(trs[1].firstChild.nextSibling.innerHTML, 'data-3', 'data-3');
	equals(trs[2].firstChild.innerHTML, 'data-4', 'data-4');
	equals(trs[2].firstChild.nextSibling.innerHTML, 'data-5', 'data-5');
	var trs = baidu.dom.children(items[1].firstChild.firstChild.firstChild);
	equals(trs.length, 3, '3 rows in item 0');
	equals(trs[0].firstChild.innerHTML, 'data-a', 'data-a');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-b', 'data-b');
	equals(trs[1].firstChild.innerHTML, 'data-c', 'data-c');
	equals(trs[1].firstChild.nextSibling.innerHTML, 'data-d', 'data-d');
	equals(trs[2].firstChild.innerHTML, 'data-e', 'data-e');
	equals(trs[2].firstChild.nextSibling.innerHTML, 'data-f', 'data-f');
	equals(items[2].innerHTML, '', 'The last item is empty');
	
	cas.focus(1);
	ok(items[1].className.indexOf(cas.getClass("item-focus")) > -1, 'focus to item1');
	
	cas.prev();
	ok(items[0].className.indexOf(cas.getClass("item-focus")) > -1, 'prev');
	
	cas.next();
	ok(items[1].className.indexOf(cas.getClass("item-focus")) > -1, 'next');
	
	cas.scrollTo(1,0);
    var items = baidu.dom.children(cas.getScrollContainer());
    var trs = baidu.dom.children(items[0].firstChild.firstChild.firstChild);
    equals(trs.length, 3, '3 rows in item 0');
	equals(trs[0].firstChild.innerHTML, 'data-a', 'data-a');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-b', 'data-b');
	equals(trs[1].firstChild.innerHTML, 'data-c', 'data-c');
	equals(trs[1].firstChild.nextSibling.innerHTML, 'data-d', 'data-d');
	equals(trs[2].firstChild.innerHTML, 'data-e', 'data-e');
	equals(trs[2].firstChild.nextSibling.innerHTML, 'data-f', 'data-f');
    equals(items[1].innerHTML, '', 'The second item is empty');
    equals(items[2].innerHTML, '', 'The last item is empty');
});

test("getTable", function() {
	var cas, oitem, item, c;
	cas = createCarousel('horizontal', true);
	cas.render(te.dom[0]);
	var table = cas.getTable(-1);
	equals(table, null, 'get null');
	table = cas.getTable(3);
	equals(table, null, 'get null');
	table = cas.getTable(0);
	var trs = baidu.dom.children(table.getBody().firstChild);
	equals(trs.length, 3, '3 rows in table');
	equals(trs[0].firstChild.innerHTML, 'data-0', 'data-0');
	equals(trs[0].firstChild.nextSibling.innerHTML, 'data-1', 'data-1');
	equals(trs[1].firstChild.innerHTML, 'data-2', 'data-2');
	equals(trs[1].firstChild.nextSibling.innerHTML, 'data-3', 'data-3');
	equals(trs[2].firstChild.innerHTML, 'data-4', 'data-4');
	equals(trs[2].firstChild.nextSibling.innerHTML, 'data-5', 'data-5');
	equals(table.data[0].content[0], 'data-0', 'data-0');
	equals(table.data[0].content[1], 'data-1', 'data-1');
	equals(table.data[1].content[0], 'data-2', 'data-2');
	equals(table.data[1].content[1], 'data-3', 'data-3');
	equals(table.data[2].content[0], 'data-4', 'data-4');
	equals(table.data[2].content[1], 'data-5', 'data-5');
});


//
//
//test('addTableItem',function(){
//	stop();
//	setTimeout(function(){
//		var data = new Array(1,2,3,4,5,6,7,8,89,66,555,'ee','r');
//		var options = {
//			data : data,
//			target : te.dom[0]
////			layout : {row:2,col:4}
//		}
//		var car = new baidu.ui.Carousel(options);
//		
//		car.render(te.dom[0]);	
//		var count = car.totalCount;
//		var addData = new Array(30,50,55,88,555,7777);
//		car.addTableItem(addData);
//		equal(car.totalCount,count+1,'add tableItem');
//		car.addTableItem([3,46,77,88,99]);
//		equal(car.totalCount,count+2,'add tableItem');
//		car.addTableItem(['ggg','ttt',477,'d',799]);
//		equal(car.totalCount,count+3,'add tableItem');
//		start();
//	},100);
//	
//});
//
//
//test('addTableItem with index',function(){
//	stop();
//	setTimeout(function(){
//		var data = new Array(1,2,3,4,5,6,7,8,89,0,555,'ee','r');
//		var options = {
//			data : data,
//			target : te.dom[2],
//			contentText : [ {
//				content : "item-0"
//			}, {
//				content : "item-1"
//			}, {
//				content : "item-2"
//			}, {
//				content : "item-3"
//			}, {
//				content : "item-4"
//			}, {
//				content : "item-5"
//			} ]
//		}
//		var car = new baidu.ui.Carousel(options);
//		car.render(te.dom[2]);
//		var count = car.totalCount;
//		var addData = new Array('add','add2');
//		car.addTableItem(addData,1);
//		same(car.getTable(1).data[0].content,['add','add2','&nbsp;'] );//在index=1处检查插入的元素是否正确
//		equal(car.totalCount,count+1,'add tableItems');
//		start();
//	},100);
//	});
//
//test('removeTableItem',function(){
//	stop();
//	setTimeout(function(){
//		var data = new Array(1,2,3,4,5,6,7,8,89,0,555,'ee','r');
//		var options = {
//			data : data,
//			gridLayout : {row:2,col:4},
//			target : te.dom[2],
//			contentText : [ {
//				content : "item-0"
//			}, {
//				content : "item-1"
//			}, {
//				content : "item-2"
//			}, {
//				content : "item-3"
//			}, {
//				content : "item-4"
//			}, {
//				content : "item-5"
//			} ]
//		}
//		var car = new baidu.ui.Carousel(options);
//		car.render(te.dom[2]);
//		var count = car.totalCount;
//		car.removeTableItem(1);
//		equal(car.totalCount,count-1,'remove tableItems');
//		same(car.getTable(1),undefined );
//		equal(car.getTable(0).data.length,2);//2行4列，则一共2个data，每个大小为4
//		equal(car.getTable(0).data[0].content[0],1,'first element is 1');
//		equal(car.getTable(0).data[1].content[0],5,'second row is 5');
//		start();
//	},100);
//		
//});
