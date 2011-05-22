module('baidu.ui.Decorator');
(function() {
	te.getUI = function(opt) {
		var div = document.body.appendChild(document.createElement('div'));
		div.id = 'id_decorator';
		te.dom.push(div);
		$(div).css('width', 100).css('height', 100).css('background-color',
				'gray');

		div = document.body.appendChild(document.createElement('div'));
		div.id = 'id_decorator1';
		te.dom.push(div);
		$(div).css('width', 40).css('height', 40).css('background-color',
				'blue');

		var ui = baidu.ui.createUI(new Function).extend(opt);
		ui.extend({
			uiType : 'testType',
			render : function(target) {
				var me = this;
				me.main = me.renderMain();
				target && me.main.appendChild(target);
				me.body = target;
				me.dispatchEvent('onload');
			}
		});
		return new ui();
	};
})();
/**
 * 装饰器，校验的核心内容应该是位置相关
 */
test('base', function() {
	// 基础部分校验是否四边元素正确添加，并常规参数正确设置
	// FIXME 没有可测接口，这个问题真头疼
	var d = new baidu.ui.Decorator({
		ui : te.getUI(),
		skin : 'test',
		type : 'box'
	});
	d.ui.render(te.dom[0]);
	// 基础属性校验
	equals(d.uiType, 'decorator', 'check ui type');
	d.render();
//	equals(d.getMain().id, 'tangram-decorator--TANGRAM__2-main',
//			'check main id');//id随实际情况变化，忽略校验
	equals(d.getMain().className,
			'tangram-decorator-box-main test-box-main',
			'check class name');
//	ok(false, 'PUBLICGE-278');

	// check fn list
	var tbl = d.getBox();
	equals(tbl.tagName, 'TABLE', 'check getBox');
	var tgt = d.getInner();
	equals(tgt.id, d.ui.getMain().id, 'check getInner');

	te.dom.push(d.main);
	te.obj.push(d);
});
