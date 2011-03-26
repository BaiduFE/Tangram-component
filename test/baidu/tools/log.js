module('baidu.tools.log');
(function() {
	var s = QUnit.testStart, e = QUnit.testDone;
	QUnit.testStart = function() {
		var mydata = {
			data : null,
			type : null,
			nooutput : false
		};
		baidu.tools.log.callBack = function() {
			if (!mydata.nooutput) {
				var data = this[this.length - 1];
				equals(data.data, mydata.data, 'check data');
				equals(data.type, mydata.type, 'check type');
			} else {
				equals(data, undefined, 'not set and no output');
			}
		};
		te.docheck = function(data, type, nooutput) {
			mydata.data = data;
			mydata.type = type || 'log';
			mydata.nooutput = nooutput;
			type ? baidu.log[type](data) : baidu.log(data);
		};
		s.apply(this, arguments);
	};
	QUnit.testDone = function() {
		e.apply(this, arguments);// 避免相互影响，全局修改必须干掉
		baidu.log.setLogLevel('log', 'info', 'warn', 'error');
		baidu.log.callBack = new Function;
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

test('timer', function() {
	//TODO
});