module('baidu.ui.smartPosition.element');
// Include('baidu.dom.getPosition');

/**
 * 校验元素位置，使用t0和t1
 * 
 * @param msg
 * @param t0
 * @param t1
 * @param offsetleft
 *            目标元素针对定位元素的偏移量
 * @param offsettop
 *            目标元素针对定位元素的偏移量
 * @param absx
 *            可能需要减
 * @param absy
 *            可能需要减
 * @return
 */
function check(msg, t0, t1, offsetleft, offsettop, absx, absy) {
	// var left = parseInt(t0.style.left);
	// var top = parseInt(t0.style.top);
	var xy = baidu.dom.getPosition(t0);
	var xy1 = baidu.dom.getPosition(t1 || testingElement.dom[1]);
	offsetleft = offsetleft ? parseInt(offsetleft) : 0;
	offsettop = offsettop ? parseInt(offsettop) : 0;
	equals(xy.left, xy1.left + (offsetleft * (absx == 0 ? 0 : 1)),
			'check left : ' + msg);
	equals(xy.top, xy1.top + (offsettop * (absy || 1)), 'check top : ' + msg);
}

/**
 * position : "bottomRight"
 */
test('dom', function() {
	var t = testingElement.dom;
	t[1].style.height = '20px';
	t[1].style.width = '20px';
	t[1].style.backgroundColor = '#AAA';

	var sp = baidu.ui.smartPosition.element(t[0], t[1], {
		insideScreen : "surround"
	});
	check('position default', t[0], t[1], t[1].clientWidth, t[1].clientHeight);

	sp.update( {
		position : 'right'
	});
	check('position right', t[0], t[1], t[1].clientWidth);

	sp.update( {
		position : 'left'
	});
	check('position left', t[0], t[1], t[1].clientWidth, 0, 0);

	sp.update( {
		position : 'top'
	});
	check('position top', t[0], t[1], 0, t[1].clientHeight, 0, -1);

	sp.update( {
		position : 'bottom'
	});
	check('position bottom', t[0], t[1], 0, t[1].clientHeight);

	sp.update( {
		position : 'leftTop'
	});
	check('position leftTop', t[0], t[1], t[1].clientWidth, t[1].clientHeight,
			0, -1);
});

test('id', function() {
	var t = testingElement.dom;
	t[1].style.height = '20px';
	t[1].style.width = '20px';// 需要设定target的宽度，否则会默认为当前页面宽度
	var sp = baidu.ui.smartPosition.element(t[0].id, t[1].id);
	var xy = baidu.dom.getPosition(t[1]);
	check('target is id', t[0], t[1], t[1].clientWidth, t[1].clientHeight);
});

test(
		'surround boundary  test-bottomright',
		function() {
			var t = testingElement.dom;
			/* 右边放不下，自动向左边放置source */
			var cw = baidu.page.getViewWidth();
			var ch = baidu.page.getViewHeight();
			$(t[1]).css('left', cw - 30).css('top', ch - 20).css('width',
					'15px').css('height', '20px').css('position', 'absolute');
			var sp = baidu.ui.smartPosition.element(t[0], t[1], {
				position : 'bottomright',
				insideScreen : "surround"
			});
			var xy = baidu.dom.getPosition(t[1]);
			equals(
					parseInt(t[0].style.left),
					(cw - 30 + parseInt($(t[1]).css('width')) - parseInt(t[0].offsetWidth)),
					'check left : boundary-surround');
			equals(
					parseInt(t[0].style.top),
					(ch - 20 + parseInt($(t[1]).css('height')) - parseInt(t[0].offsetHeight)),
					'check top : boundary-surround');
		});

test('surround boundary test-lefttop', function() {
	var t = testingElement.dom;
	/* 左边放不下，自动向右边放置source */
	$(t[1]).css('left', '10px').css('top', '15px').css('width', '30px').css(
			'height', '30px').css('position', 'absolute');
	var sp = baidu.ui.smartPosition.element(t[0].id, t[1], {
		position : "lefttop",
		insideScreen : "surround"
	});
	var xy = baidu.dom.getPosition(t[1]);
	equals(t[0].style.left, '10px', 'check left : boundary-surround');
	equal(t[0].style.top, '15px', 'check top : boundary-surround');
});

test('surround boundary test-righttop', function() {
	var t = testingElement.dom;
	/* 上面放不下，右边可以放 */
	$(t[1]).css('left', '10px').css('top', '10px').css('width', '30px').css(
			'height', '30px').css('position', 'absolute');
	var sp = baidu.ui.smartPosition.element(t[0].id, t[1], {
		position : "righttop",
		insideScreen : "surround"
	});
	var xy = baidu.dom.getPosition(t[1]);
	equals(parseInt(t[0].style.left), 40, 'check left : boundary-surround');
	equals(parseInt(t[0].style.top), 10, 'check top : boundary-surround');
});

test('surround boundary test-bottomleft', function() {
	var t = testingElement.dom;
	/* 下边放不下，自动向上边放置source */
	$(t[1]).css('left', '10px').css('top', '10px').css('width', '30px').css(
			'height', '30px').css('position', 'absolute');
	var sp = baidu.ui.smartPosition.element(t[0].id, t[1], {
		position : "bottomleft",
		insideScreen : "surround"
	});
	var xy = baidu.dom.getPosition(t[1]);
	equals(t[0].style.left, '10px', 'check left : boundary-surround');
	equals(t[0].style.top, '40px', 'check top : boundary-surround');
});

test('fix boundary test-lefttop', function() {
	var t = testingElement.dom;
	/* 左边放不下，则source左边与边界对齐 */
	$(t[1]).css('left', '10px').css('top', '10px').css('width', '30px').css(
			'height', '30px').css('position', 'absolute');
	var sp = baidu.ui.smartPosition.element(t[0].id, t[1], {
		position : "lefttop",
		insideScreen : 'fix'
	});
	var xy = baidu.dom.getPosition(t[1]);
	equals(t[0].style.left, '0px', 'check left : boundary-surround');
	equals(t[0].style.top, '0px', 'check top : boundary-surround');
});

test('fix boundary test-rightbottom',
		function() {
			var t = testingElement.dom;
			/* 右边放不下，则source右边与边界对齐 */
			var cw = baidu.page.getViewWidth();
			$(t[1]).css('left', cw - 30).css('top', '50px')
					.css('width', '30px').css('height', '30px').css('position',
							'absolute');
			var sp = baidu.ui.smartPosition.element(t[0], t[1], {
				insideScreen : 'fix'
			});
			var xy = baidu.dom.getPosition(t[1]);
			equals(parseInt(t[0].style.left), cw - 20,
					'check left : boundary-surround');
			equals(t[0].style.top, '80px', 'check top : boundary-surround');
		});

/* TODO options checked in SmartPosition */

test('absolute', function() {
	var t = testingElement.dom;
	t[1].style.position = 'absolute';
	t[1].style.left = '100px';
	t[1].style.top = '100px';
	t[1].style.width = '100px';
	t[1].style.height = '100px';
	t[1].style.backgroundColor = '#FF0000';
	var sp = baidu.ui.smartPosition.element(t[0], t[1]);
	check('element absolute', t[0], t[1], t[1].clientWidth, t[1].clientHeight);
});

test('border', function() {
	var t = testingElement.dom;
	t[1].style.position = 'absolute';
	t[1].style.left = '100px';
	t[1].style.top = '100px';
	t[1].style.width = '100px';
	t[1].style.height = '100px';
	t[1].style.borderWidth = '10px';
	t[1].style.backgroundColor = '#FF0000';
	var sp = baidu.ui.smartPosition.element(t[0], t[1]);
	check('element with border', t[0], t[1], 100, 100);
});

test('padding', function() {
	var t = testingElement.dom;
	t[1].style.position = 'absolute';
	t[1].style.left = '100px';
	t[1].style.top = '100px';
	t[1].style.width = '100px';
	t[1].style.height = '100px';
	t[1].style.padding = '10px';
	t[1].style.backgroundColor = '#FF0000';
	var sp = baidu.ui.smartPosition.element(t[0], t[1]);
	check('element with padding', t[0], t[1], 120, 120);
});

test('margin', function() {
	var t = testingElement.dom;
	t[1].style.position = 'absolute';
	t[1].style.left = '100px';
	t[1].style.top = '100px';
	t[1].style.width = '100px';
	t[1].style.height = '100px';
	t[1].style.margin = '10px';
	t[1].style.backgroundColor = '#FF0000';
	var sp = baidu.ui.smartPosition.element(t[0], t[1]);
	check('target with margin', t[0], t[1], 100, 100);
});

test('target parent', function() {
	var t = testingElement.dom;
	var div = document.createElement('div');
	t[1].appendChild(div);
	$(div).css('width', '20px').css('height', '20px').css('backgroundColor',
			'red');
	div.style.backgroundColor = 'red';
	var sp = baidu.ui.smartPosition.element(t[0], div);
	var xy = baidu.dom.getPosition(div);
	check('target with parent', t[0], div, 20, 20);
	stop();
	/* 加入延迟方便观察效果 */
	setTimeout(function() {
		start();
	}, 200);
});

/**
 * 测试用例考察offsetParent不是body的情况
 */
test('target parent absolute', function() {
	var t = testingElement.dom;
	t[1].style.position = 'absolute';
	t[1].style.left = '10px';
	t[1].style.top = '10px';
	t[1].style.width = '100px';
	t[1].style.height = '100px';
	t[1].style.backgroundColor = '#FF0000';
	var div = document.createElement('div');
	t[1].appendChild(div);
	div.id = 'test_div_child';
	div.style.width = '20px';
	div.style.height = '20px';
	div.style.backgroundColor = '#00FF00';
	t[0].style.height = '10px';
	t[0].style.width = '10px';
	/* t[0]是期望被调整位置的对象，参照系是包含在t[1]中的div对象 */
	var sp = baidu.ui.smartPosition.element(t[0], div);
	/* 元素应该是偏移20，因为宽度20 */
	/* 定位元素有父元素，并且父元素absolute */
	check('target position relative', t[0], div, 20, 20);
	stop();

	setTimeout(function() {

		/* 定位元素有父元素，并且父元素relative */
		t[1].style.position = 'relative';
		var sp = baidu.ui.smartPosition.element(t[0], div);
		equal(baidu.dom.getPosition(t[0]).top,
				baidu.dom.getPosition(div).top + 20);
		check('target position relative', t[0], div, 20, 20);
		setTimeout(function() {
			start();
		}, 100);
	}, 200);
});

/* float */
test('element float', function() {
	var sp, d1, d2, d3, t = testingElement.dom;
	d1 = document.createElement('div');
	d1.id = 'd1';
	d1.style.height = '20px';
	d1.style.width = '20px';
	d1.style.backgroundColor = '#FF0000';
	d1.style.float = 'right';
	d1.style.left = '100px';
	d1.style.top = '100px';

	t[1].appendChild(d1);
	d2 = document.createElement('div');
	d2.id = 'd2';
	d2.style.height = '20px';
	d2.style.width = '20px';
	d2.style.backgroundColor = '#00FF00';
	d2.style.left = '300px';
	d2.style.top = '300px';
	t[1].appendChild(d2);
	d3 = document.createElement('div');
	d3.id = 'd3';
	d3.style.height = '20px';
	d3.style.width = '20px';
	d3.style.backgroundColor = '#0000FF';
	d3.style.clear = 'both';

	t[1].appendChild(d3);
	sp = baidu.ui.smartPosition.element(t[0], d1, {
		position : 'left'
	});
	check('target position float', t[0], d1, -20, 0);
	sp = baidu.ui.smartPosition.element(t[0], d2, {
		position : 'right'
	});
	check('target position float', t[0], d2, 20, 0);
	sp = baidu.ui.smartPosition.element(t[0], d3, {
		position : 'lefttop',
		insideScreen : "surround"
	});
	check('target position float', t[0], d3, 0, -20);
});