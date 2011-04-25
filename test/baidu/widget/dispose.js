module('baidu.widget.dispose');

test('base', function() {
	expect(4);
	stop();
	baidu.widget._basePath = upath;
	ua.importsrc('baidu.widget.create', function() {
		var w = baidu.widget.create('c', function(r, e) {
			this.dispose = function() {// 自定义dispose方法
				ok(true, 'dispose is called self defined');
			};

			// 确认加载成功
			var b = r('b');
			b.dispose = function() {
				baidu.widget.dispose('a');
			};
			equals(r('b').b(), 'b', 'b is loaded');
			baidu.widget.dispose('b');// 这种情况下，是否应该带a一起干掉……
			equals(baidu.widget.get('b'), undefined, 'b is disposed');
			baidu.widget.dispose('a');// 重复dispose不应出错
			equals(baidu.widget.get('a'), undefined, 'a is disposed');
			setTimeout(function() {
				baidu.widget.dispose('c');
				start();
			}, 0);
		}, {
			depends : 'a,b'
		});
	}, null, 'baidu.widget.dispose');
});