module("baidu.fx.Timeline");

// test default params
test('test default params', function(){
	var option = {};
	var timeline = new baidu.fx.Timeline(option);
	ok(true, 'tes default params');
	equals(timeline.interval, 16, 'interval = ' + timeline.interval);
	equals(timeline.duration, 500, 'duration = ' + timeline.duration);
	equals(timeline.dynamic, true, 'dynamic = ' + timeline.dynamic);
});

// test options
test('test options', function(){
	var option = {
		interval: 24,
		duration: 200,
		dynamic: false
	}
	var timeline = new baidu.fx.Timeline(option);
	equals(timeline.interval, 24, 'interval = ' + timeline.interval);
	equals(timeline.duration, 200, 'duration = ' + timeline.duration);
	equals(timeline.dynamic, false, 'dynamic = ' + timeline.dynamic);
});

// test events
test('test events', function(){
	var option = {};
	var timeline = new baidu.fx.Timeline(option);
	
	timeline.launch();
	ok(true, '');
});


/**
 * TODO : 创建一个restore方法，确认呗正确引入并能够正确触发 cancel
 * 这个用例做啥了？
 */





