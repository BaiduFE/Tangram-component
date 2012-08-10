module("baidu.ui.Suggestion.Suggestion$data");

/**
 * check set data
 * <li> check setData with onshow
 * <li> check setData with no onshow and show with set input value
 */
test("setData", function() {
	stop();
	var te = testingElement, input = te.dom[0], sugg, options = {
		onshow : function() {
			ok(true, 'onshow is call after setData');
			sugg.hide();
			start();
		}
	};
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	te.obj.push(sugg);
	input.value = "a";
	sugg.setData('a', [ 'ab', 'ac' ]);
})

/**
 * check chinese data
 * <li> onshow check item
 * <li> onhide call another check
 * <li> change value
 */
test("support chinese", function() {
	stop();
	var te = testingElement, input = te.dom[0], sugg, options = {
		onshow : function() {
			equals(sugg._getItem(0).innerHTML, '无我相');
			equals(sugg._getItem(1).innerHTML, '无他相');
			equals(sugg._getItem(2).innerHTML, '无众生相');
			sugg.hide();
			start();
		}
	};
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	te.obj.push(sugg);
	input.value = "无";
	sugg.setData("无", [ "无我相", "无他相", "无众生相" ]);
});

/**
 * set many data and check item shown
 */
test("10 item", function() {
	stop();
	var te = testingElement, input = te.dom[0];
	var datas = new Array(), sugg = new baidu.ui.Suggestion( {
		onshow : function() {
			for ( var i = 0; i < 10; i++) {
				equals(sugg._getItem(i).innerHTML, 'a' + i, 'check many item');
			}
			sugg.hide();
			start();
		}
	});
	sugg.render(input);
	te.obj.push(sugg);
	for ( var i = 0; i < 10; i++)
		datas.push('a' + i);
	input.value = "a";
	sugg.setData('a', datas);
})

/**
 * check overwrite data by set data continously
 */
test("overwrite data", function() {
	stop();
	var input = testingElement.dom[0], datas = new Array(), step = 0;
	var sugg = new baidu.ui.Suggestion( {
		onshow : function() {
			equals(sugg._getItem(0).innerHTML, 'a' + step, 'check overwrite');
			sugg.hide();
		},
		onhide : function() {
			if (step == datas.length - 1) {
				start();
			} else {
				/* change data and show again */
				sugg.setData('a', datas[++step])
				input.value = 'a';
			}
		}
	});
	sugg.render(input);
	te.obj.push(sugg);
	for ( var i = 0; i < 3; i++)
		datas.push( [ 'a' + i, 'a' + (i + 1) ]);
	input.value = "a";
	sugg.setData('a', datas[0]);
})

test('coninuously input', function() {
	stop();
	var input = testingElement.dom[0], word = 'a', data = [ 'aa', 'ab' ];
	var sugg = new baidu.ui.Suggestion( {
		onshow : function() {
			equals(sugg._getItem(0).innerHTML, word + 'a', 'coninuously input');
			sugg.hide();
		},
		onhide : function() {
			if (word == 'aaaaa') {
				start();
			} else {
				/* change data and show again */
				word += 'a';
				data[0] = 'a' + data[0];
				data[1] = 'a' + data[1];
				input.value = word;
				sugg.setData(word, data);
			}
		}
	});
	sugg.render(input);
	te.obj.push(sugg);
	input.value = "a";
	sugg.setData('a', [ 'aa', 'ab' ]);
})

/**
 * simulate get data by ajax
 */
test('delay in get data', function() {
	stop();
	var input = testingElement.dom[0], time1, time2, word = 'a';
	var sugg = new baidu.ui.Suggestion( {
		onshow : function() {
			time2 = new Date().getTime();
			this.hide();
		},
		onhide : function() {
			ok(Math.abs(time1 + 200 - time2) < 20, 'get data delay');
			start();
		},
		getData : function(word) {
			time1 = new Date().getTime();
			var word = word;
			setTimeout(function() {
				input.value = word;
				sugg.setData(word, [ 'aa', 'ab' ])
			}, 200);
		}
	});
	sugg.render(input);
	te.obj.push(sugg);
	sugg.dataCache = {};
	sugg.getData(word);
})

/**
 * <li>create two suggestions
 * <li>set data for two suggestions
 * <li>set suggestion 1's input value
 * <li>in suggestion 1's onshow, check suggestion 1's item
 * <li>in suggestion 1's onshow, set suggestion 2's input value and hide
 * suggestion 1
 * <li>in suggestion 1's onhide, check suggestion 2's item
 */
test('multi instance', function() {
	stop();
	var div, input1, input2, sugg1, sugg2;
	div = document.createElement('div');
	input1 = document.createElement('input');
	input1.type = 'text';
	input1.id = 'test_input1';
	div.appendChild(input1);
	input2 = document.createElement('input');
	input2.type = 'text';
	input2.id = 'test_input2';
	div.appendChild(input2);
	document.body.appendChild(div);
	testingElement.dom.push(div);
	sugg1 = new baidu.ui.Suggestion({
		onshow : function() {
			equals(sugg1._getItem(0).innerHTML, 'aa',
					'check data in multi instance');
			this.hide();
			input2.value = "a";
			sugg2.setData('a', [ 'ab', 'ac' ]);
		}
	});
	sugg2 = new baidu.ui.Suggestion({
		onshow : function() {
			equals(sugg2._getItem(0).innerHTML, 'ab',
					'check data in multi instance');
			this.hide();
			start();
		}
	});
	sugg1.render(input1);
	sugg2.render(input2);
	testingElement.obj.push(sugg1);
	testingElement.obj.push(sugg2);
	input1.value = "a";
	sugg1.setData('a', [ 'aa', 'ab' ]);
})

/**
 * check no data for suggestion
 */
test('no data', function() {
	stop();
	var input = testingElement.dom[0];
	var sugg = new baidu.ui.Suggestion( {
		onshow : function() {
			ok(false, 'no data, no shown!');
		}
	});
	sugg.render(input);
	testingElement.obj.push(sugg);
	sugg.dataCache = {};
	input.value = 'a';
	setTimeout(function() {
		ok(true, 'no data, no shown!');
		start();
	}, 200);
})