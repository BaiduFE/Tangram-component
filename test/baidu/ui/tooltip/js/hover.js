module("baidu.ui.tooltip.hover");

test('show and hide', function() {
	var div_test = testingElement.dom[0];
	var t1, t2, t3, tt;
	var tp = baidu.ui.tooltip.hover(div_test, {
		content : 'show and hide',
		onopen : function() {
			setTimeout(function(){
				t2 = new Date().getTime();
				UserAction.mouseout(div_test);
				ok(Math.abs(t2 - t1 - tp.showDelay) < 30, 'check show delay');
				ok(isShown(tp.getMain().firstChild), 'shown after hover');
				t2 = new Date().getTime();
			},10);
		},
		onclose : function() {
			setTimeout(function(){
				t3 = new Date().getTime();
				/* fx cause delay time */
				tt = (tp.hideFxOptions ? tp.hideFxOptions.duration : 0)
						+ tp.hideDelay;
				if (baidu.fx)
					ok(Math.abs(t3 - t2 - tt) < 20, 'check hide delay');
				ok(!isShown(tp.getMain().firstChild), 'hide after out');
				start();
			},600);
		}
	});
	stop();

	UserAction.mouseover(div_test);
	t1 = new Date().getTime();
});

test("element with hover", function() {
	var div_test = testingElement.dom[0];
	var tp = baidu.ui.tooltip.hover(div_test, {
		content : 'element with hover'
	});
	equals(tp.targetId, div_test.id, 'element with hover');
});

test('id with hover', function() {
	var div_test = testingElement.dom[0];
	var tp = baidu.ui.tooltip.hover(div_test.id, {
		content : 'id with hover'
	});
	/* TODO */
	equals(tp.targetId, div_test.id, 'id with hover');
});

test('resize after hover', function() {
	stop();

	/**
	 * 需要resize，在iframe中展开测试
	 */
//	var f = document.createElement('iframe');
//	document.body.appendChild(f);
//	f.src = cpath + 'test.html';
//	f.id = 'test_frame';
//	$(f).css('width', 400).css('height', 400);

	/**
	 * 
	 * <li>添加关于源码的引入依赖
	 * <li>初始化场景
	 * <li>show tooltip
	 * <li>hide tooltip
	 * <li>resize window
	 * <li>show tooltip again
	 * 
	 * @param win
	 * @param f
	 *            当前iframe，因为需要调整大小，所以必须传入
	 */
	var callback = function(win, f) {
		/* 引入源码以来 */
		var doc = win.document;
		var scripts = win.parent.document.getElementsByTagName("script");
		for ( var i = 0; i < scripts.length; i++) {
			var sc = scripts[i];
			if (sc.src && sc.src.indexOf('import.php') > 0) {
				var script = doc.createElement('script');
				script.src = sc.src;
				script.type = 'text/javascript';
				script.charset = 'utf-8';
				doc.head.appendChild(script);
			}
		}
		var scriptOk = function(win) {
			return win['baidu'];
		};

		/* 测试装载 */
		var next = function(win, f) {
			var doc = win.document;
			var div = doc.createElement('div');
			doc.body.appendChild(div);
			div.style.width = 20;
			div.style.height = 20;
			div.style.backgroundColor = '#AAA';
			var hov = win.baidu.ui.tooltip.hover;
			var tp = hov(div, {
				content : 'resize after hover',
				onopen : function() {
					ua.mouseout(div);
				},
				onclose : function() {
					/* resize and check if not shown */
					$(f).css('width', 400).css('height', 400);
					setTimeout(function() {
						ok(!isShown(tp.getMain().firstChild),
								'not shown after resize');
						win.parent.document.body.removeChild(f);
						start();
					}, (tp.showDelay || 500) + 100);
				}
			});
			ua.mouseover(div);
		};

		/* 动态加载的标签，必须等待加载完成 */
		var h1 = setInterval(function() {
			if (!scriptOk(win))
				return;
			clearInterval(h1);
			next(win, f);
		}, 20);
	};

	var check = function(fs) {
		if (fs.length == 1 && fs[0].document.readyState == 'complete') {
			var scripts = document.getElementsByTagName("script");
			for ( var i = 0; i < scripts.length; i++) {
				var sc = scripts[i];
				if (sc.src && sc.src.indexOf('import.php') > 0) {
					return sc.src;
				}
			}
		}
		return false;
	};
	stop();
	$(document.body).append('<IFRAME id="myId">');
	$('iframe#myId').attr('src', cpath + 'test.html').css('width', 200).css('height', 200);
	$('iframe#myId').load(function() {
		callback(frames[0], $('iframe#myId')[0]);
	});
});
