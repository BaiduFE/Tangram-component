module("baidu.fx.Timeline");

(function(){
	baidu.lang.Class.prototype.un =
		baidu.lang.Class.prototype.removeEventListener = function (type, handler) {
		    var i,
		        t = this.__listeners;
		    if (!t) return;

		    // remove all event listener
		    if (typeof type == "undefined") {
		        for (i in t) {
		            delete t[i];
		        }
		        return;
		    }

		    type.indexOf("on") && (type = "on" + type);

		    // 移除某类事件监听
		    if (typeof handler == "undefined") {
		        delete t[type];
		    } else if (t[type]) {
		        // [TODO delete 2013] 支持按 key 删除注册的函数
		        typeof handler=="string" && (handler=t[type][handler]) && delete t[type][handler];

		        for (i = t[type].length - 1; i >= 0; i--) {
		            if (t[type][i] === handler) {
		                t[type].splice(i, 1);
		            }
		        }
		    }
		};
})();

// test default params
test('test default params', function() {
	var option = {};
	var timeline = new baidu.fx.Timeline(option);
	ok(true, 'tes default params');
	equals(timeline.interval, 16, 'interval = ' + timeline.interval);
	equals(timeline.duration, 500, 'duration = ' + timeline.duration);
	equals(timeline.dynamic, true, 'dynamic = ' + timeline.dynamic);
});

// test options
test('test options', function() {
	var option = {
		interval : 24,
		duration : 200,
		dynamic : false
	};
	var timeline = new baidu.fx.Timeline(option);
	equals(timeline.interval, 24, 'interval = ' + timeline.interval);
	equals(timeline.duration, 200, 'duration = ' + timeline.duration);
	equals(timeline.dynamic, false, 'dynamic = ' + timeline.dynamic);
});

/**
 * 事件校验，onbeforestart，onbeforeupdate，onafterupdate，oncancel，onafterfinish
 */
test('test events', function() {
	stop();
	var timeline = new baidu.fx.Timeline();
	var es = 'onbeforestart,onbeforeupdate,'
			+ 'onafterupdate,oncancel,onafterfinish'.split(',');
	var checkEvent = function(timeline, en, callAfterTrigger) {
		timeline.addEventListener(en, function() {
			setTimeout(function() {
				ok(true, 'event ' + en + ' is triggered');
				if (timeline && !timeline.disposed)
					timeline.removeEventListener(en);// 保障仅触发一次
				callAfterTrigger && callAfterTrigger.call(timeline);
			}, 0);
		});
		// callAfterRegister && callAfterRegister();
	};
	checkEvent(timeline, 'onbeforestart');
	checkEvent(timeline, 'onbeforeupdate');
	checkEvent(timeline, 'onafterupdate', timeline.cancel);
	checkEvent(timeline, 'oncancel', function() {
		// 再次启动并测试onafterfinish
		var timeline = new baidu.fx.Timeline();
		checkEvent(timeline, 'onafterfinish', QUnit.start);
		timeline.launch();
	});
	timeline.launch();
});