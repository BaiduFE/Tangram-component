module("baidu.data.storage");
(function() {
	te.frameExt = function(op, id) {
//		stop();
		op = typeof op == 'function' ? {
			ontest : op
		} : op;
		var pw = op.win || window, w, f, url = '', fid = 'iframe#' + id;

		op.finish = function(callback) {
//			pw.$(fid).unbind();
			setTimeout(function() {
//				pw.$('div#d').remove();
//				start();
				callback.apply(this, arguments);
			}, 20);
		};

		if (pw.$(fid).length == 0) {
			/* 添加frame，部分情况下，iframe没有边框，为了可以看到效果，添加一个带边框的div */
			pw.$(pw.document.body).append('<div id="div' + id + '"></div>');
			pw.$('div#div' + id).append('<iframe id="' + id + '"></iframe>');
		}
		op.onafterstart && op.onafterstart($('iframe#f')[0]);
		pw.$('script').each(function() {
			if (this.src && this.src.indexOf('import.php') >= 0) {
				url = this.src.split('import.php')[1];
			}
		});
		pw.$(fid).one('load', function(e) {
			var w = e.target.contentWindow;
			var h = setInterval(function() {
				if (w.baidu) {// 等待加载完成，IE6下这地方总出问题
					clearInterval(h);
					op.ontest(w, w.frameElement);
				}
			}, 20);
			// 找到当前操作的iframe，然后call ontest
		}).attr('src', cpath + 'frame.php' + url);
	};
})();

test("set,get,remove", function() {
	expect(9);
	var storage = baidu.data.storage;
	storage.set('key1', 'value1',function(status, value){
		equals(status, 0, 'set successfully');
		equals(value, 'value1', 'set successfully');
	});
	storage.get('key1', function(status, value){
		equals(status, 0, 'get successfully');
		equals(value, 'value1', 'get successfully');
	});
	storage.get('key2', function(status, value){
		equals(value, null, 'get unsuccessfully');
	});
	storage.remove('key1', function(status, value){
		equals(status, 0, 'remove successfully');
		equals(value, 'value1', 'remove successfully');
	});
	storage.get('key1', function(status, value){
		equals(value, null, 'remove unsuccessfully');
	});
	storage.get('key1', function(status, value){
		equals(value, null, 'remove successfully');
	});
});

test("set,get,remove between iframes", function() {
	expect(7);
	stop();
	te.frameExt(function(w, f) {
		var storage = w.baidu.data.storage;
		storage.set('key1', 'value1',function(status, value){
			equals(status, 0, 'set successfully');
			equals(value, 'value1', 'set successfully');
		});
	    this.finish(callback1);
	}, 'f1');
	var callback1 = function(){
		te.frameExt(function(w, f) {
			var storage = w.baidu.data.storage;
			storage.get('key1', function(status, value){
				equals(status, 0, 'get successfully');
				equals(value, 'value1', 'get successfully');
			});
		    this.finish(callback2);
		}, 'f2');
	};
	var callback2 = function(){
		te.frameExt(function(w, f) {
			var storage = w.baidu.data.storage;
			storage.remove('key1', function(status, value){
				equals(status, 0, 'remove successfully');
				equals(value, 'value1', 'remove successfully');
			});
		    this.finish(callback3);
		}, 'f3');
	};
	var callback3 = function(){
		te.frameExt(function(w, f) {
			var storage = w.baidu.data.storage;
			storage.get('key1', function(status, value){
				equals(value, null, 'check remove successfully');
			});
			document.body.removeChild(baidu.g('divf1'));
			document.body.removeChild(baidu.g('divf2'));
			document.body.removeChild(baidu.g('divf3'));
			document.body.removeChild(baidu.g('divf4'));
			start();
		}, 'f4');
	};
});

test("set,get,remove a lot of data", function() {
	expect(6);
	stop();
	var check = function(){
		var storage = baidu.data.storage;
		var flag = 0;
		var value_flag = 0;
		var times = 50;
		if(baidu.browser.firefox)
			times = 10;
		for(var i = 0; i < times; i++){
			storage.set('key' + i, 'value' + i, function(status, value){
				if(status != 0)
					flag = status;
				if(value != 'value' + i)
					value_flag = value;
			});
			if(flag != 0 || value_flag != 0)
				break;
		}
		if(flag == 0){
		    ok(true, 'set successfully');
		}
		else{
			ok(false, 'set unsuccessfully, the status is ' + flag);
		}
		if(value_flag == 0){
		    ok(true, 'set successfully');
		}
		else{
			ok(false, 'set unsuccessfully, the value is ' + value_flag);
		}
	
		flag = 0;
		value_flag = 0;
		for(var i = 0; i < times; i++){
			storage.get('key' + i, function(status, value){
				if(status != 0)
					flag = status;
				if(value != 'value' + i)
					value_flag = value;
			});
			if(flag != 0 || value_flag != 0)
				break;
		}
		if(flag == 0){
		    ok(true, 'get successfully');
		}
		else{
			ok(false, 'get unsuccessfully, the status is ' + flag);
		}
		if(value_flag == 0){
		    ok(true, 'get successfully');
		}
		else{
			ok(false, 'get unsuccessfully, the value is ' + value_flag);
		}
		
		flag = 0;
		value_flag = 0;
		for(var i = 0; i < times; i++){
			storage.remove('key' + i, function(status, value){
				if(status != 0)
					flag = status;
				if(value != 'value' + i)
					value_flag = value;
			});
			if(flag != 0 || value_flag != 0)
				break;
		}
		if(flag == 0){
		    ok(true, 'remove successfully');
		}
		else{
			ok(false, 'remove unsuccessfully, the status is ' + flag);
		}
		if(value_flag == 0){
		    ok(true, 'remove successfully');
		}
		else{
			ok(false, 'remove unsuccessfully, the value is ' + value_flag);
		}
		start();
	};
	ua.importsrc('baidu.browser,baidu.browser.chrome,baidu.browser.opera,baidu.browser.firefox,baidu.browser.maxthon,baidu.browser.safari', 
			check ,'baidu.browser', 'baidu.data.storage');
});

test("overflow", function() {
	expect(1);
	var storage = baidu.data.storage;
	var flag = 0;
	var value_flag = 0;
	var key = '';
	var value = '';
	for(var i = 0; i < 3000; i++)
		key += 'key';
	for(var i = 0; i < 3000; i++)
		value += 'value';
	var times = 5;
	if(baidu.browser.chrome || baidu.browser.maxthon || baidu.browser.safari)
		times = 300;
	if(baidu.browser.firefox)//FF太慢，所以不测overflow
		times = 1;
	for(var i = 0; i < times; i++){
		storage.set(key + i, value + i, function(status, value){
			if(status == 2)
				flag = status;
		});
		if(flag == 2)
			break;
	}
	if(baidu.browser.opera ||baidu.browser.firefox){
		if(flag == 0){
		    ok(true, 'check overflow successfully');
		}
		else{
			ok(false, 'check overflow unsuccessfully, the status is ' + flag);
		}
	}
	else{
		if(flag == 2){
		    ok(true, 'check overflow successfully');
		}
		else{
			ok(false, 'check overflow unsuccessfully, the status is ' + flag);
		}
	}

	for(var i = 0; i < times; i++){
		storage.remove(key + i, function(status, value){
		});
	}
});