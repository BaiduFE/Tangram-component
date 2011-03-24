module('baidu.ui.Slider');


(function() {
	/**
	 * create a div for test start
	 * <li>create div
	 * <li>set id <b>div_test</b>
	 * <li>set type text
	 * 
	 * @return div@type text
	 */
	function _testStart() {
		var id = "div_test";
		var div = document.createElement("div");
		div.id = id;
		$(div).css('width', '200px').css('height', '20px').css('border','solid').css('color', 'black');
		document.body.appendChild(div);
		te.dom.push(div);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);
		_testStart();
	}
})();

test('initi', function() {
	expect(5);
	stop();
	ua.loadcss(upath+'Slider/style.css',function(){
		var slider = new baidu.ui.Slider();
		var div = te.dom[0];
		slider.render(div);
		equal(slider.min, 0, 'check range min');
		equal(slider.max, 100, 'check range max');
		equal(slider.uiType, 'slider', 'check ui type');
		equal(slider.value, 0, 'check value');
		ok(!slider.disabled, 'check enable');
		start();
	}); 
})

test('update', function() {
	var v = 0;
	var first = true;
	expect(11);
	var options = {
		onslidestop : function() {
			ok(false, 'stop will not be called');
		},
		onslidestart : function() {
			ok(false, 'start will not be called');
		},
		onslide : function() {
			ok(false, 'slide will not be called');
		},
		onupdate : function() {
			if (first) {
				/* 第一次update是在render中调用 */
				equal(s.value, 0, 'check init value');
				first = false;
			} else {
				/*
				 * 在slider中点击鼠标，滑块中心位置而不是滑块最左边会滑动到鼠标的坐标处，
				 * 因此需要补足滑块的一半长度
				 */
				var left = parseInt($(s.getThumb()).css('left'));
				if (left > 190) {
					v -= s.offsetWidth;// 滑块不会超出slider外面去，left为200-滑块的宽度
				}
				
				ok(left,v,
						'check thumb position' + left);
				v += 20;
			}

		}
	}

	var s = new baidu.ui.Slider(options);
	var id = "div_test";
	var div = te.dom[0];
	s.render(div);
	var body = s.getBody();
	stop();
	var x = parseInt(baidu.dom.getPosition(body)['left']);
	v = 20-parseInt($(s.getThumb()).css('width'))/2;
	var handle = setInterval(function() {
		if (s.value == 100) {
			clearInterval(handle);
			start();
		}
		x += 20;
		ua.mousemove(body, {
			/* 一共200px，分10次拖动 */
			clientX : x
		});
		ua.mousedown(body, {
			clientX : x
		});
		ua.mouseup(body, {
			clientX : x
		});
	}, 20);
})

test('onslide', function() {
	stop();
	ua.loadcss(upath+'Slider/style.css',function(){
		var options = {
			onslidestop : function() {
				equal($(s.getThumb()).css('left'), '20px',
						'slide stop check thumb left');
			},
			onslidestart : function() {
				equal($(s.getThumb()).css('left'), '0px',
						'slide start check thumb left');
			},
			onslide : function() {
				ok(true, 'on slide');
			},
			onupdate : function() {
				ok(true, 'update');
			}
		}
		var s = new baidu.ui.Slider(options);
		var div = te.dom[0];
		s.render(div);
		var thumb = s.getThumb();
		var thumbX = parseInt(baidu.dom.getPosition(thumb)['left']);
		var thumbY = parseInt(baidu.dom.getPosition(thumb)['top']);
		ua.mousemove(thumb, {
			clientX : thumbX+3,
			clientY : thumbY
		});
		ua.mousedown(thumb, {
			clientX : thumbX+3,
			clientY : thumbY
		});
		setTimeout(function() {
			ua.mousemove(thumb, {
				clientX : thumbX + 20,
				clientY : thumbY
			});
		}, 30);
		setTimeout(function() {
			ua.mouseup(thumb, {
				clientX : thumbX + 20,
				clientY : thumbY
			});
			start();
		}, 60);
	})
})

/*
test('range', function() {
	stop();
	var options = {
		range : [ 0, 200 ]
	}
	var s = new baidu.ui.Slider(options);
	var div = te.dom[0];
	s.render(div);
	var thumb = s.getThumb();
	var thumbX = parseInt(baidu.dom.getPosition(thumb)['left']);
	var thumbY = parseInt(baidu.dom.getPosition(thumb)['top']);
	ua.mousemove(thumb, {
		clientX : thumbX,
		clientY : thumbY
	});
	ua.mousedown(thumb, {
		clientX : thumbX,
		clientY : thumbY
	});
	setTimeout(function() {
		ua.mousemove(thumb, {
			clientX : thumbX + 405,
			clientY : thumbY
		});
	}, 30);
	setTimeout(function() {
		ua.mouseup(thumb, {
			clientX : thumbX + 405,
			clientY : thumbY
		});
		equal(s.value,200,'check value');
		start();
	}, 60);
})
*/

test('set min max', function() {
	stop();
	var options = {
		min:0,
		max:300
	}
	var s = new baidu.ui.Slider(options);
	var div = te.dom[0];
	s.render(div);
	var thumb = s.getThumb();
	var body = s.getBody();
	var thumbX = parseInt(baidu.dom.getPosition(thumb)['left']);
	var thumbY = parseInt(baidu.dom.getPosition(thumb)['top']);
	var divwidth =  parseInt($(body).css('width'));
	ua.mousemove(thumb, {
		clientX : thumbX,
		clientY : thumbY
	});
	ua.mousedown(thumb, {
		clientX : thumbX,
		clientY : thumbY
	});
	setTimeout(function() {
		ua.mousemove(thumb, {
			clientX : thumbX + 405,
			clientY : thumbY
		});
	}, 30);
	setTimeout(function() {
		ua.mouseup(thumb, {
			clientX : thumbX + 405,
			clientY : thumbY
		});
		equal($(thumb).css('left'),(divwidth-parseInt($(thumb).css('width')))+'px','check thumb left');
		equal(s.getValue(),options.max,'check value');
		start();
	}, 60);
})
/**
 * 事件没有删除 ，开问题单 PUBLICGE-344
 */
test('dispose',function(){
	expect(2);
	var l1 = baidu.event._listeners.length;
	var s = new baidu.ui.Slider();
	s.render(te.dom[0]);
	ok(baidu.dom.g(s.getId()),'created');
	s.dispose();
	equal(baidu.dom.g(s.getId()),null,'disposed');
	equals(baidu.event._listeners.length, l1, 'event removed all');
});
/**
 * disable 的效果是，滑块不能滑动；
 * enable的效果是取消disable的作用；
 * 两者要组合测试
 */
test('disable enable',function(){
		var options = {};
		stop();
		var s = new baidu.ui.Slider(options);
		var div = te.dom[0];
		s.render(div);
		var body = s.getBody(),
		    thumb = s.getThumb();
		    thumbleft = thumb.style.left;
		    thumbwidth = parseInt(baidu.dom.getStyle(thumb,'width'));
		var thumbX = parseInt(baidu.dom.getPosition(thumb)['left']);
		var thumbY = parseInt(baidu.dom.getPosition(thumb)['top']);
		s.disable();
		ok(s.disabled,'set disabled');
		ua.mousemove(body, {
			clientX : thumbX+50,
			clientY : thumbY
		});
		ua.mousedown(body, {
			clientX : thumbX+50,
			clientY : thumbY
		});
		setTimeout(function(){
			ua.mouseup(body, {
				clientX : thumbX + 50,
				clientY : thumbY
			});
			equal($(s.getThumb()).css('left'), thumbleft,'after disable thumb left ');
			s.enable();
		},30);
		setTimeout(function(){
			ua.mousedown(body, {
				clientX : thumbX+50,
				clientY : thumbY
			});
			setTimeout(function(){
				ua.mouseup(body, {
					clientX : thumbX+50,
					clientY : thumbY
				});
				equal($(s.getThumb()).css('left'), (50-thumbwidth/2)+'px','slide stop check thumb left');
				start();
			},100);
		},60)

});



