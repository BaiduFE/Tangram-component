module('baidu.ui.Carousel.Carousel$splice');

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

test("addText",function(){
	expect(21);
	stop();
	ua.loadcss(upath+'style.css',function(){
	    var c = te.dom[0];
		var carousel = createCarousel(c);
		var step = 0;
		carousel.onaddtext = function(index){
			if(step == 0)
				equals(index.index, -1, 'The index is right');
			if(step == 1)
				equals(index.index, 7, 'The index is right');
			if(step == 2)
				equals(index.index, 0, 'The index is right');
			if(step == 3)
				equals(index.index, 9, 'The index is right');
			if(step == 4)
				equals(index.index, 3, 'The index is right');
			step ++;
		}
		carousel.render(c);
		carousel.addText('new-item--1', -1);
		carousel.addText('new-item-7', 7);
		carousel.addText('new-item-0', 0);
		carousel.addText('new-item-9', 9);
		carousel.addText('new-item-3', 3);
		equals(carousel._dataList[0].content, 'new-item-0', 'The _dataList array is right');
		equals(carousel._dataList[1].content, 'new-item--1', 'The _dataList array is right');
		equals(carousel._dataList[2].content, 'item-0', 'The _dataList array is right');
		equals(carousel._dataList[3].content, 'new-item-3', 'The _dataList array is right');
		equals(carousel._dataList[4].content, 'item-1', 'The _dataList array is right');
		equals(carousel._dataList[5].content, 'item-2', 'The _dataList array is right');
		equals(carousel._dataList[6].content, 'item-3', 'The _dataList array is right');
		equals(carousel._dataList[7].content, 'item-4', 'The _dataList array is right');
		equals(carousel._dataList[8].content, 'item-5', 'The _dataList array is right');
		equals(carousel._dataList[9].content, 'new-item-7', 'The _dataList array is right');
		equals(carousel._dataList[10].content, 'new-item-9', 'The _dataList array is right');
		equals(carousel.getItem(3).innerHTML, 'new-item-3', 'The getItem() result is right');
		carousel.scrollTo(0,0);
		equals(carousel.getItem(0).innerHTML, 'new-item-0', 'The scrollTo() result is right');
		carousel.focus(0);
		ok(carousel.getItem(0).className.indexOf(carousel.getClass("item-focus")) > -1, 'The focus() result is right');
		carousel.next();
		ok(carousel.getItem(1).className.indexOf(carousel.getClass("item-focus")) > -1, 'The next() result is right');
		carousel.prev();
		ok(carousel.getItem(0).className.indexOf(carousel.getClass("item-focus")) > -1, 'The prev() result is right');
		carousel.dispose();
		start();		
	});
});

test("addItem",function(){
	expect(21);
	stop();
	ua.loadcss(upath+'style.css',function(){
	    var c = te.dom[0];
		var carousel = createCarousel(c);
		var step = 0;
		carousel.onadditem = function(index){
			if(step == 0)
				equals(index.index, -1, 'The index is right');
			if(step == 1)
				equals(index.index, 7, 'The index is right');
			if(step == 2)
				equals(index.index, 0, 'The index is right');
			if(step == 3)
				equals(index.index, 9, 'The index is right');
			if(step == 4)
				equals(index.index, 3, 'The index is right');
			step ++;
		}
		carousel.render(c);
		var div = document.body.appendChild(document.createElement('div'));
		div.innerHTML = 'new-item--1';
		carousel.addItem(div, -1);
		div.innerHTML = 'new-item-7';
		carousel.addItem(div, 7);
		div.innerHTML = 'new-item-0';
		carousel.addItem(div, 0);
		div.innerHTML = 'new-item-9';
		carousel.addItem(div, 9);
		div.innerHTML = 'new-item-3';
		carousel.addItem(div, 3);
		equals(carousel._dataList[0].content, 'new-item-0', 'The _dataList array is right');
		equals(carousel._dataList[1].content, 'new-item--1', 'The _dataList array is right');
		equals(carousel._dataList[2].content, 'item-0', 'The _dataList array is right');
		equals(carousel._dataList[3].content, 'new-item-3', 'The _dataList array is right');
		equals(carousel._dataList[4].content, 'item-1', 'The _dataList array is right');
		equals(carousel._dataList[5].content, 'item-2', 'The _dataList array is right');
		equals(carousel._dataList[6].content, 'item-3', 'The _dataList array is right');
		equals(carousel._dataList[7].content, 'item-4', 'The _dataList array is right');
		equals(carousel._dataList[8].content, 'item-5', 'The _dataList array is right');
		equals(carousel._dataList[9].content, 'new-item-7', 'The _dataList array is right');
		equals(carousel._dataList[10].content, 'new-item-9', 'The _dataList array is right');
		equals(carousel.getItem(3).innerHTML, 'new-item-3', 'The getItem() result is right');
		carousel.scrollTo(0,0);
		equals(carousel.getItem(0).innerHTML, 'new-item-0', 'The scrollTo() result is right');
		carousel.focus(0);
		ok(carousel.getItem(0).className.indexOf(carousel.getClass("item-focus")) > -1, 'The focus() result is right');
		carousel.next();
		ok(carousel.getItem(1).className.indexOf(carousel.getClass("item-focus")) > -1, 'The next() result is right');
		carousel.prev();
		ok(carousel.getItem(0).className.indexOf(carousel.getClass("item-focus")) > -1, 'The prev() result is right');
		carousel.dispose();
		document.body.removeChild(div);
		start();		
	});
});

test("removeItem",function(){
	expect(14);
	stop();
	ua.loadcss(upath+'style.css',function(){
	    var c = te.dom[0];
		var carousel = createCarousel(c);
		var step = 0;
		carousel.onremoveitem = function(index){
			if(step == 0)
				equals(index.index, -1, 'The index is right');
			if(step == 1)
				equals(index.index, 7, 'The index is right');
			if(step == 2)
				equals(index.index, 0, 'The index is right');
			if(step == 3)
				equals(index.index, 4, 'The index is right');
			if(step == 4)
				equals(index.index, 2, 'The index is right');
			step ++;
		}
		carousel.render(c);
		carousel.removeItem(-1);
		carousel.removeItem(7);
		carousel.removeItem(0);
		carousel.removeItem(4);
		carousel.removeItem(2);
		equals(carousel._dataList[0].content, 'item-1', 'The _dataList array is right');
		equals(carousel._dataList[1].content, 'item-2', 'The _dataList array is right');
		equals(carousel._dataList[2].content, 'item-4', 'The _dataList array is right');
		equals(carousel.getScrollContainer().firstChild.innerHTML, 'item-1',"Show correctly");
		equals(carousel.getItem(0).innerHTML, 'item-1', 'The getItem() result is right');
		carousel.scrollTo(0,0);
		equals(carousel.getItem(0).innerHTML, 'item-1', 'The scrollTo() result is right');
		carousel.focus(0);
		ok(carousel.getItem(0).className.indexOf(carousel.getClass("item-focus")) > -1, 'The focus() result is right');
		carousel.next();
		ok(carousel.getItem(1).className.indexOf(carousel.getClass("item-focus")) > -1, 'The next() result is right');
		carousel.prev();
		ok(carousel.getItem(0).className.indexOf(carousel.getClass("item-focus")) > -1, 'The prev() result is right');
		carousel.dispose();
		start();		
	});
});
