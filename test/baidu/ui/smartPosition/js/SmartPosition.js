module('baidu.ui.smartPosition.SmartPosition');

test('udpate coordinate', function() {
	var t, sp, xy;
	t = testingElement.dom[0];
	var options = {
		source : t,
		coordinate : [ 100, 100 ]
	};
	sp = new baidu.ui.smartPosition.SmartPosition(options);
	sp.update();
	xy = baidu.dom.getPosition(t);
	equals(xy.left, 100, 'check left');
	equals(xy.top, 100, 'check top');

	sp.update( {
		coordinate : [ 99, 99 ]
	});
	xy = baidu.dom.getPosition(t);
	equals(xy.left, 99, 'check left');
	equals(xy.top, 99, 'check top');

	sp.update( {
		coordinate : {
			x : 100,
			y : 100
		}
	});
	xy = baidu.dom.getPosition(t);
	equals(xy.left, 100, 'check left');
	equals(xy.top, 100, 'check top');
});

test('update insideScreen', function() {
	var t, sp, xy;

	t = testingElement.dom[0];
	t.style.backgroundColor = '#AAA';
	var options = {
		source : t,
		coordinate : [ 100, 100 ]
	};
	sp = new baidu.ui.smartPosition.SmartPosition(options);
	sp.update();
	xy = baidu.dom.getPosition(t);
	equals(xy.left, 100, 'check left');
	equals(xy.top, 100, 'check top');

	sp.update( {
		coordinate : {
			x : -100,
			y : -100
		},
		insideScreen : 'fix'
	});
	xy = baidu.dom.getPosition(t);
	equals(xy.left, 0, 'check left');
	equals(xy.top, 0, 'check top');

	document.body.style.margin = '0';
	document.body.style.border = '0';
	document.body.style.padding = '0';
	sp.update( {
		coordinate : {
			x : 3000,
			y : 3000
		}
//		insideScreen : 'surround'
	});
	xy = baidu.dom.getPosition(t);	
	equals(xy.left, baidu.page.getViewWidth() - t.clientWidth, 'check left');
	equals(xy.top, baidu.page.getViewHeight() - t.clientHeight, 'check top');
});

test('update event', function() {
	var t, sp, xy, step = 0;
	t = testingElement.dom[0];
	var options = {
		source : t,
		coordinate : [ 100, 100 ]
	};
	sp = new baidu.ui.smartPosition.SmartPosition(options);
	sp.update();
	sp.update( {
		onupdate : function() {
			ok(true, 'on update');
			ok(step == 1, 'update after before update');
		},
		onbeforeupdate : function() {
			ok(true, 'on before update');
			ok(step++ == 0, 'before update');
		}
	});
});

/**
 * 貌似必须使用弹出窗口来验证，
 * <li>标签式浏览器对于resize都默认不支持
 */
test(
		'update once',
		function() {
			stop();
			expect(1);
			var w, t, sp, xy, step = 0;
			w = window
					.open(upath+'data/blank.html', '',
							'width=200,height=200,menubar=no,toolbar=no,titlebar=no,status=no');
			var waitingHandle = setInterval(function() {
				if (w && w.document && w.document.body) {
					clearInterval(waitingHandle);
					t = w.document.createElement('div');
					t.id = 'div_test';
					t.style.backgroundColor = '#AAA';
					w.document.body.appendChild(t);
					var options = {
						source : t,
						coordinate : [ 100, 100 ],
						once : true
					};
					sp = new baidu.ui.smartPosition.SmartPosition(options);
					sp.update();
					sp.onupdate = function() {
						ok(false, 'once set, should not call on update');
					};
					w.resizeTo(300, 300);
					w.close();
					ok(true, 'success on set once');
					start();
				}
			}, 20);
		});
test("offset",function(){
	ok(false, "TODO: options.offset test case needed.")
});
test("insideScreen",function(){
	ok(false, "TODO: options.insideScreen test case needed.")
});