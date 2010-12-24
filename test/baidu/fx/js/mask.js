module('baidu.fx.mask');

test('dom', function() {
	var t, h;
	t = te.dom[1];
	$(t).css('height', '100px');
	$(t).css('width', '100px');
	$(t).css('background-color', 'red');
//	$(te.dom[1]).css('display', 'none');
	equals(baidu.fx.mask(t), null, 'none of position not absolute');

	$(t).css('position', 'absolute');
	h = baidu.fx.mask(t, {
		onafterfinish : function() {
			equals(this._className, 'baidu.fx.mask');
			start();
		}
	});
	stop();
});

test('id', function() {
	var t, h;
	t = te.dom[1];
	$(t).css('height', '100px');
	$(t).css('width', '100px');
	$(t).css('background-color', 'red');
	$(t).css('position', 'absolute');
	h = baidu.fx.mask(t, {
		onafterfinish : function() {
			equals(this._className, 'baidu.fx.mask');
			start();
		}
	});
	stop();
});

test('properties', function() {
	var t, h;
	t = te.dom[1];
	$(t).css('height', '100px');
	$(t).css('width', '100px');
	$(t).css('background-color', 'red');
	$(t).css('position', 'absolute');
	h = baidu.fx.mask(t, {
		startOrigin : '50px 50px',
		onafterfinish : function() {
			start();
		}
	});
	equals(h.startOrigin, '50px 50px', 'default start origin');
	equals(h.from, 0, 'default from');
	equals(h.to, 1, 'default to');
	stop();
});

/**
 * 根据时间线校验具体值
 */
test('timeline', function() {
	var t, h, i;
	t = te.dom[1];
	$(t).css('height', '100px');
	$(t).css('width', '100px');
	$(t).css('background-color', 'red');
	$(t).css('position', 'absolute');
	h = baidu.fx.mask(t);

	var cc = function(i, max, info) {
		var m = h.element.style.clip.match(/(\d+(\.\d+)?)/g);
		equals(m[0], 0, info);
		ok(Math.abs((100 * i / max) - m[1]) < 5, info + m[1]);
		ok(Math.abs((100 * i / max) - m[2]) < 5, info + m[2]);
		equals(m[3], 0, info);
	};
	te.obj[0].check(h.duration, 0, 3, 'check point at 抽样点', cc);
	stop();
});
