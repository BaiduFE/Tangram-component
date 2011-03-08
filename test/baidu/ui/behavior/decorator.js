module('baidu.ui.behavior.decorator');

(function() {
	te.getUI = function(options) {
//		var div = document.body.appendChild(document.createElement('div'));
//		div.id = 'id_decorator';
//		te.dom.push(div);
		
		var ui = baidu.ui.createUI(function(options) {
		}).extend({
			uiType : 'testType',
			decorator : true,
			render : function(target) {
				this.renderMain();
				this.body = target;
				this.getMain().appendChild(this.body);
				this.dispatchEvent('onload');
			}
		});
		return new ui();
	};
})();

test('base', function() {
	var ui = te.getUI();
	stop();
	ui.render(te.dom[0]);
});