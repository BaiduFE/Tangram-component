module('baidu.tools.log.Dialog');

/**
 * 分别校验几种类型的数据在Dialog中的展示
 */
test('base', function() {

	ua.loadcss(upath + 'test.css', function() {
		baidu.log.enableDialog();
        var dialog = baidu.tools.log.DInstance;

		var data = [ {
			head : 'all'
		}, {
			head : 'log'
		}, {
			head : 'info'
		}, {
			head : 'warn'
		}, {
			head : 'error'
		} ];
		same(dialog.tab.items, data, '校验5个tab的head');

		for ( var i = 0; i < data.length; i++) {
			var head = data[i].head;
			data[i].data = [];
			var info = "test" + i;
			if (i != 0) {
				baidu.log[head] ? baidu.log[head](info) : baidu.log(info);
				data[i].data.push(info);
				data[0].data.push(info);
			}
		}

		// 点击tab all查看数据
		for ( var i = 4; i >= 0; i--) {
			ua.click(dialog.tab.getHeads()[i]);
			ok(isShown(dialog.tab.getBodies()[i]), 'body ' + i + ' is shown');
			// 校验值
			var dd = data[i].data;
			// 这个地方太恶心了，居然没有对外接口可以获得数据结构，只能用这种东西来校验
			$("div#" + dialog.tab.getId('body') + i + " span").each(
					function(i, span) {
						equals(span.innerHTML, "\"" + dd[i] + "\"",
								'check data');
					});
		}
		dialog.clear('log');
		dialog.clear('all');
		start();
	}, 'tangram-tab', 'height', '61px');
	stop();
});
// TODO 类似drag、resize之类的东西就跳过校验了，校验交给本类自己做吧，以后有碰到问题再补充
