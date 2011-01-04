module('baidu.fx.collapse');

var op = {/* fx效果方法依赖参数 */
	onbeforestart : function() {/* 初始设置启动高度为100 */
		$(te.dom[0]).css('height', 100).css('background-color', 'red');
	},
	onbeforeupdate : function() {
		if (!this.checked) {
			this.checked = true;
			equals(parseInt($(te.dom[0]).css('height')), 100, '校验对象高度在开始时是否为1');/* 校验对象最后高度是否为100 */
		}
	},
	onafterfinish : function() {
		equals(parseInt($(te.dom[0]).css('height')), 0, '校验对象高度在结束时是否为100');/* 校验对象最后高度是否为0 */
		start();
	}
};

test('校验元素类型为id', function() {
	te.checkfx.create(te.dom[0].id, {
		method : baidu.fx.collapse,
		options : op
	}).checkbase();
});

test('校验元素类型为dom', function() {
	te.checkfx.create(te.dom[0], {
		method : baidu.fx.collapse,
		options : op
	}).checkbase();
});

test('校验事件序列', function() {
	te.checkfx.create(te.dom[0], {
		method : baidu.fx.collapse,
		beforestart : function() {/* 初始设置启动高度为100 */
			$(te.dom[0]).css('height', 100).css('background-color', 'red');
		}
	}).checkevents( {
		onafterfinish : start
	}, 4);
});

test('校验时间序列', function() {
	te.checkfx.create(te.dom[0], {
		method : baidu.fx.collapse,
		options : {
			onbeforestart : function() {
				$(te.dom[0]).css('height', 100).css('background-color', 'red');
			}
		}
	}).checktimeline(function(point) {
		return Math.round(Math.pow(point - 4, 2) * 25 / 4);
	}, function() {
		return parseInt($(te.dom[0]).css('height'));
	});
});

test('校验cancel', function() {
	te.checkfx.create(te.dom[0], {
		method : baidu.fx.collapse,
		options : {
			onbeforestart : function() {
				$(te.dom[0]).css('height', 100).css('background-color', 'red');
			}
		}
	}).checkcancel();
});
