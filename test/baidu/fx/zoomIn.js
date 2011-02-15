module("baidu.fx.zoomIn");

// test id
test('test id', function(){
	
	stop();
	var c = baidu.fx.zoomIn('img_div', {
		onafterfinish: function(){
			ok(true, 'test id');
			equals(this.interval, 16, 'interval = ' + this.interval);
			equals(this.duration, 500, 'duration = ' + this.duration);
			equals(this.dynamic, true, 'dynamic = ' + this.dynamic);
			equals(this.percent, 1, 'percent = ' + this.percent);
			equals(this.to, 1, 'default: this.to = ' + this.to);
			equals(this.from, 0.1, 'default: this.from = ' + this.from);
			equals(this.restoreAfterFinish, true, 'default: this.restoreAfterFinish = ' + this.restoreAfterFinish);
			equals(this.transition(2), 4, 'default: this.transition(2) = ' + this.transition(2));
			start();
		}
	});
});

// test dom
test('test dom', function(){
	stop();
	var c = baidu.fx.zoomIn('img_div', {
		onafterfinish: function(){
			ok(true, 'test dom');
			equals(this.interval, 16, 'interval = ' + this.interval);
			equals(this.duration, 500, 'duration = ' + this.duration);
			equals(this.dynamic, true, 'dynamic = ' + this.dynamic);
			equals(this.percent, 1, 'percent = ' + this.percent);
			equals(this.to, 1, 'default: this.to = ' + this.to);
			equals(this.from, 0.1, 'default: this.from = ' + this.from);
			equals(this.restoreAfterFinish, true, 'default: this.restoreAfterFinish = ' + this.restoreAfterFinish);
			equals(this.transition(2), 4, 'default: this.transition(2) = ' + this.transition(2));
			start();
		}
	})
});

// test from
test('test from', function(){
	var c, f = 0.5;
	var img = document.getElementById('img_id');
	c = baidu.fx.zoomIn('img_div', {
		from: f,
		onafterfinish: function(){
			equals(img.height*f, 128*f, 'from img height = ' + img.height*f); // img height=128px;
			start();
		}
	});
	stop();
});

// test to
test('test to', function(){
	var c, t = 0.5;
	var img = document.getElementById('img_id');
	c = baidu.fx.zoomIn('img_div', {
		to: t,
		onafterfinish: function(){
			equals(img.height*t, 128*t, 'to img height = ' + img.height*t); // img width=128px;start();
			start();
		}
	});
	stop();
});

// test duraton
test('test duration', function(){
	var c, stime, dtime;
	c = baidu.fx.zoomIn('img_div', {
		onafterfinish: function(){
			dtime = new Date().getTime() - stime;
			ok(dtime - 800 < 20, 'duration: ' + dtime + 'ms');
			start();
		}
	});
	stime = new Date().getTime();
	stop();
});

// test interval
test('test interval', function(){
	var c, itime;
	c = baidu.fx.zoomIn('img_div', {
		onafterfinish: function(){
			equals(this.interval, 16, 'interval default 16ms');
			start();
		}
	});
	stop();
});

/* Events将在Timeline用例中被测试，此处忽略 */
//// test transition
//test('test transition 时间线', function(){
//	var c, img, timeline;
//	c = baidu.fx.zoomIn('img_div', {
//		onbeforestart: function(){
//			ok(this.transition>0, '');
//			start();
//		}
//	});
//	stop();
//});

// test onbeforestart
test('test onbeforestart', function(){
	var c, bu = false, au = false; // bool 控制一次
	c = baidu.fx.zoomIn('img_div', {
		onbeforestart: function(){
			ok(true, 'before start');
		},
		onbeforeupdate: function(){
			if(!bu)
			{
				ok(true, 'before update');
				bu = true;
			}
		},
		onafterupdate: function(){
			if(!au)
			{
				ok(true, 'after update');
				au = true;
			}
		},
		// later will not be showed
		onafterfinish: function(){ 
			ok(true, 'after finish');
			this.cancel();
		},
		oncancel : function() {
			ok(true, 'oncancel called');
			start();
		},
		restore : function() {
			ok(true, 'restore called');
		}
	});
	stop();
});