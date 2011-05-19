module('baidu.ui.behavior.decorator');

(function() {
	te.getUI = function(options) {
		var ui = baidu.ui.createUI(function(options) {
		}).extend({
			uiType : 'testType',
			decorator : [],
			render : function(target) {
				if (target) {
					this.renderMain();
					this.body = target;
					this.getMain().appendChild(this.body);
				}
				this.dispatchEvent('onload');
			}
		});
		var uiInstance = new ui();
		te.obj.push(uiInstance);
		return uiInstance;
	};
})();

/**
 * Decorator具体实现测试参见本类测试用例，此处仅确认是否正确添加
 */
test('base', function() {
	var ui = te.getUI();
	var dec = baidu.ui.behavior.decorator;

	ui.render(te.dom[0]);
	equal(dec.getDecorator(), undefined, 'none decorator');
//	equals(dec.getDecorator().length, 0, 'none decorator added');
	ui.decorator.push(ui);
	ui.render();
	equals(dec.getDecorator().length, 1, '1 decorator addedh');
	var decIns = dec.getDecorator()[0];
	equals(decIns.uiType, 'decorator');
});