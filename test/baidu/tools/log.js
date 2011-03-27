module('baidu.tools.log');
(function() {
	var s = QUnit.testStart, e = QUnit.testDone;
	QUnit.testStart = function() {
		var mydata = {
			data : null,
			logLevel : null,
			nooutput : false
		};
		/**
		 * 仅校验最后一次
		 */
		baidu.tools.log.callBack = function() {
			if (!mydata.nooutput) {
				var data = this[this.length - 1];
				/**
				 * 提示和注释 提示：请使用 isNaN() 来判断一个值是否是数字。 原因是 NaN 与所有值都不相等，包括它自己。
				 */
				if (data.data == mydata.data)
					equals(data.data, mydata.data, 'check data');
				else
					ok(isNaN(mydata.data), 'check data is NaN');
				equals(data.type, mydata.logLevel, 'check type');
			} else {
				equals(data, undefined, 'not set and no output');
			}
		};
		/**
		 * 校验log接口是否按照预期输出
		 * 
		 * @param data
		 *            输出的元数据
		 * @param logLevel
		 *            log level
		 * @param nooutput
		 *            期望没有输出，在设置level不输出时
		 */
		te.docheck = function(data, logLevel, nooutput) {
			mydata.data = data;
			mydata.logLevel = logLevel || 'log';
			mydata.nooutput = nooutput;
			logLevel ? baidu.log[logLevel](data) : baidu.log(data);
		};
		s.apply(this, arguments);
	};
	QUnit.testDone = function() {
		e.apply(this, arguments);
		// 避免相互影响，全局修改必须干掉
		baidu.log.setLogLevel('log', 'info', 'warn', 'error');
		baidu.log.callBack = new Function;
		baidu.log.setTimeStep(0);
	};

})();
test('base', function() {
	expect(4);
	baidu.log.callBack = function() {
		if (this.length == 0)
			return;
		var data = this[this.length - 1];
		equals(data.data, 'test');
		equals(data.type, 'log');
	};
	baidu.tools.log('test');
	baidu.log('test');
});

/**
 * int,float,null,undefined,NAN,object,array,string,function
 */
test('遍历数据类型', function() {
	te.docheck(0, 'warn');
	te.docheck(1.1, 'warn');
	te.docheck(null, 'warn');
	te.docheck(undefined, 'warn');
	te.docheck(parseInt('a'), 'warn');// NAN貌似有问题
	te.docheck({
		a : 'a'
	}, 'warn');
	te.docheck([ 'a', 'b' ], 'warn');
	te.docheck('abc', 'warn');
	te.docheck(new function() {
		var a = 'a';
	}, 'warn');
	te.docheck(new Function, 'warn');
});

test('log and level', function() {
	expect(8);

	te.docheck('test', 'warn');
	te.docheck('test', 'error');
	te.docheck('test', 'info');
	te.docheck('test');

});

test('setLogLevel', function() {
	baidu.tools.log.setLogLevel('warn');
	te.docheck('test', 'info', true);
	te.docheck('test', 'warn');

	baidu.tools.log.setLogLevel('log');
	te.docheck('test', 'info', true);
	te.docheck('test', 'warn', true);

	baidu.tools.log.setLogLevel('log', 'warn');
	te.docheck('test', 'info', true);
	te.docheck('test', 'warn');

	baidu.tools.log.setLogLevel('log', 'warn', 'error');
	te.docheck('test', 'info', true);
	te.docheck('test', 'warn');
	te.docheck('test', false);
	te.docheck('test', 'error');
});

/**
 * 这个地方是不是还需要在补充更多逻辑……很简单的处理啊
 */
test('timer', function() {
	// 每次都应该输出50
	var expectList = [];
	baidu.log.callBack = function() {
		var data = this[this.length - 1];
		// 接受误差10
		ok(Math.abs(data.data - expectList.shift()) < 10, '每次都是100');
		equals(data.type, 'info', '输出接口是info');
	};
	baidu.log.time('a');// 启动计时器
	var time;
	for ( var i = 1; i < 5; i++) {
		time = i * 100;
		expectList.push(time);// 将脉冲计数器加入数组用于校验
		setTimeout(function() {
			baidu.log.time('a');// 每100脉冲一次
		}, time);
	}
	setTimeout(QUnit.start, time + 10);
	stop();
});

test('timeStep', function() {
	baidu.log.setTimeStep(100);
	var dataList = [ {
		type : 'error',
		data : 'a',
		time : 20
	}, {
		type : 'warn',
		data : 'b',
		time : 30
	}, {
		type : 'error',
		data : 'c',
		time : 155
	}, {
		type : 'warn',
		data : 'd',
		time : 165
	} ];
	var start = new Date().getTime();
	// 校验整体结构
	baidu.log.callBack = function() {
		// 会有两次没有数据输出，这用例设计的，太巧妙。。。
		var now = new Date().getTime() - start;//50, 100, 150, 200
		var expList = [];
		var i = 0;
		for (; i < dataList.length; i++) {
			if (dataList[i].time < now) {
				var data = dataList[i];
				delete data.time;
				expList.push(data);
			}
		}
		same(this, expList);
//		equals(this.length, 2, '每次出来两个数据');
//		same(this.shift(), dataList.shift(), '数据校验');
//		same(this.shift(), dataList.shift(), '数据校验');
	};
	var idx = 0;
	var call = function(data){
		setTimeout(function() {
			baidu.log[data.type](data.data);
		}, data.time);		
	};
	for (; idx < dataList.length; idx++) {
		call(dataList[idx]);
	}
	stop();
	setTimeout(QUnit.start, 330);
});
