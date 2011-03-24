module('baidu.ui.behavior.posable.setPositionByMouse');
(function() {
	te.getUI = function(options, w) {
		var ui = baidu.ui.createUI.call(w, function(options) {
		}).extend({
			uiType : 'test',
			posable : true,
			render : function() {
				this.renderMain();
				if (options && options.mainStyle) {
					for ( var key in options.mainStyle)
						$(this.getMain()).css(key, options.mainStyle[key]);
				}
				this.dispatchEvent('onload');
			},
			open : function(op) {
				op = op || {};
				this.setPositionByMouse(this.getMain(), op);
			},
			dispose : function() {
				$(this.getMain()).remove();
			}
		});
		var uiInstance = new ui();
		if (!w) {
			te.obj.push(uiInstance);
		}
		uiInstance.render();
		return uiInstance;
	};
})();

test('base', function() {
	stop();
	ua.importsrc('baidu.ui.createUI', function() {
		ua.mousemove(document.body, {
			clientX : 10,
			clientY : 10
		});
		var ui = te.getUI(), m = ui.getMain();
		ui.open({
			once : true
		});
		equals(parseInt($(m).css('left')), 10);
		equals(parseInt($(m).css('top')), 10);

		ua.mousemove(document.body, {
			clientX : 20,
			clientY : 20
		});
		ui.open({
			once : true
		});
		equals(parseInt($(m).css('left')), 20);
		equals(parseInt($(m).css('top')), 20);

		start();
	}, 0, 'baidu.ui.behavior.posable.setPositionByMouse');
});

/**
 * 考虑场景包括offsetParent是body和不是body两种情况
 * 杯具的，用iframe实现这个用例难度太大……
 */
test('options', function() {
	// 弄个小点的iframe便于解决要求在屏幕内的问题
	ua.frameExt(function(w, f) {
		$(f).css('width', 100).css('height', 100);
		var doc = w.document, div = doc.body.appendChild(doc
				.createElement('div')), ui = {
			dispatchEvent : function(type) {
			}
		};
		$(div).css('position', 'absolute').css('width', 20).css('height', 20)
				.css('background-color', 'yellow');
		for ( var key in w.baidu.ui.behavior.posable)
			ui[key] = w.baidu.ui.behavior.posable[key];
		ua.mousemove(doc.body, {
			clientX : 10,
			clientY : 10
		});
		ui.setPositionByMouse(div, {
			once : true
		});
		equals(parseInt(w.$(div).css('left')), 10);
		equals(parseInt(w.$(div).css('top')), 10);

		ua.mousemove(doc.body, {
			clientX : 90,
			clientY : 90
		});
		ui.setPositionByMouse(div, {
			once : true
		});
		equals(parseInt(w.$(div).css('left')), 90);
		equals(parseInt(w.$(div).css('top')), 90);

		ui.setPositionByMouse(div, {
			once : true,
			insideScreen : 'fix'
		});
		equals(parseInt(w.$(div).css('left')), 90);
		equals(parseInt(w.$(div).css('top')), 90);
		ui.setPositionByMouse(div, {
			once : true,
			insideScreen : 'surround'
		});
		equals(parseInt(w.$(div).css('left')), 90);
		equals(parseInt(w.$(div).css('top')), 90);

		this.finish();
	});
});