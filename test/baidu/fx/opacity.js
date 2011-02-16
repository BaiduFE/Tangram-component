module('baidu.fx.opacity');

test('dom', function() {
	expect(1);
	var t = te.dom[0];
	$(t).css('height', '100px');
	$(t).css('color', 'red');
	baidu.fx.opacity(t, {
		from : 0.1,
		to : 0.9,
		onafterfinish : function() {
		if (baidu.browser.ie) {
			var re = /opacity\:\d+/;
			var opacity = re.exec($(t).css('filter')).toString()
					.split(':')[1];
			ok(opacity / 100 - 0.9 < 0.01,
					'get opacity in ie after finish');
		} else {
			equal($(t).css('opacity'), '0.9');
		}
			start();
		}
	});
	stop();
});

test('id', function() {
	expect(1);
	var t = te.dom[0];
	$(t).css('height', '100px');
	$(t).css('color', 'red');
	baidu.fx.opacity('test_div', {
		from : 0.1,
		to : 0.9,
		onafterfinish : function() {
		if (baidu.browser.ie) {
			var re = /opacity\:\d+/;
			var opacity = re.exec($(t).css('filter')).toString()
					.split(':')[1];
			ok(opacity / 100 - 0.9 < 0.01,
					'get opacity in ie after finish');
		} else {
			equal($(t).css('opacity'), '0.9');
		}
			start();
		}
	});
	stop();
});

/**
 * 检查时间线的抽样点
 */
test('timeline', function() {
	// expect(25);
	var t = te.dom[0];
	$(t).css('height', '100px');
	$(t).css('color', 'red');
	var startTime;
	baidu.fx.opacity('test_div',
			{
				duration : 400,
				from : 0.1,
				to : 0.8,
				onbeforestart : function() {
					startTime = new Date().getTime();
				},
				onafterupdate : function() {
					var percent = (new Date().getTime() - startTime) / 400;
					var n = (0.8 - 0.1) * percent + 0.1;
					if (baidu.browser.ie) {
						var re = /opacity\:\d+/;
						var opacity = re.exec($(t).css('filter')).toString()
								.split(':')[1];
						ok(opacity / 100 - n < 0.01, 'get opacity in ie');
					} else {
//						alert($(t).css('opacity'))
						ok($(t).css('opacity') - n < 0.01, 'get opacity');
					}
				},
				onafterfinish : function() {
					var dura = new Date().getTime() - startTime;
					if (baidu.browser.ie) {
						var re = /opacity\:\d+/;
						var opacity = re.exec($(t).css('filter')).toString()
								.split(':')[1];
						ok(opacity / 100 - 0.8 < 0.01,
								'get opacity in ie after finish');
					} else {
						equal($(t).css('opacity'), '0.8');
					}
					ok(dura - 400 < 60, 'get duration');
					start();
				}
			});
	stop();
});