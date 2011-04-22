module('baidu.ui.behavior.setPositionByElement');

(function() {
	te.getUI = function(options, w) {
		var ui = baidu.ui.createUI.call(w, function(options) {
		}).extend(
				{
					uiType : 'test',
					posable : true,
					position : 'bottomright',
					render : function() {
						this.renderMain();
						if (options && options.mainStyle) {
							for ( var key in options.mainStyle)
								$(this.getMain()).css(key,
										options.mainStyle[key]);
						}
						$(this.getMain()).css('width', 10).css('height', 10)
								.css('background-color', 'blue');
						this.dispatchEvent('onload');
					},
					open : function(element, op) {
						op = op || {};
						op.position = this.position;
						this.setPositionByElement(element, this.getMain(), op);
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
		te.dom.push(document.body.appendChild(document.createElement('div')));
		var ui = te.getUI(), m = ui.getMain();
		$(te.dom[0]).css('position', 'absolute').css('left', 10).css('top', 10)
				.css('width', 10).css('height', 10).css('background-color',
						'red');
		ui.open(te.dom[0]);
		equals(parseInt($(m).css('left')), 20);
		equals(parseInt($(m).css('top')), 20);

		start();
	}, 0, 'baidu.ui.behavior.posable.setPositionByElement');
});

/**
 * 考虑场景包括offsetParent是body和不是body两种情况 杯具的，用iframe实现这个用例难度太大……
 */
test('options', function() {
	// 弄个小点的iframe便于解决要求在屏幕内的问题
	ua.frameExt(function(w, f) {
		$(f).css('width', 100).css('height', 100);
		var doc = w.document, div0 = doc.body.appendChild(doc
				.createElement('div')), div1 = doc.body.appendChild(doc
				.createElement('div')), ui = {
			dispatchEvent : function(type) {
			}
		};
		$(doc.body).css('margin', 0).css('padding', 0).css('borderWidth', 0);// 这个必须
		$(div0).css('position', 'absolute').css('left', 10).css('top', 10).css(
				'width', 10).css('height', 10)
				.css('background-color', 'yellow').attr('id', 'div0');
		$(div1).css('width', 10).css('height', 10).css('background-color',
				'blue').attr('id', 'div1');
		for ( var key in w.baidu.ui.behavior.posable)
			// ui extend posable
			ui[key] = w.baidu.ui.behavior.posable[key];
		ui.setPositionByElement(div0, div1, {
			once : true,
			position : 'bottomright'
		});
		equals(parseInt(div1.style.left), parseInt(div0.offsetLeft)
				+ parseInt(div0.style.left), 'check left');
		equals(parseInt(div1.style.top), 20, 'check top');

		this.finish();
	});
});

test('options.position, lefttop', function() {
	var div0 = document.body.appendChild(document.createElement('div')), 
	div1 = document.body.appendChild(document.createElement('div')),
	ui = {
		dispatchEvent : function(type) {
		}
	};
	$(document.body).css('margin', 0).css('padding', 0).css('borderWidth', 0);// 这个必须
	$(div0).css('position', 'absolute').css('left', 20).css('top', 20).css(
			'width', 20).css('height', 20)
			.css('background-color', 'yellow').attr('id', 'div0');
	$(div1).css('width', 10).css('height', 10).css('background-color',
			'blue').css('position', 'absolute').attr('id', 'div1');
	for ( var key in baidu.ui.behavior.posable)
		// ui extend posable
		ui[key] = baidu.ui.behavior.posable[key];
	ui.setPositionByElement(div0, div1, {
		once : true,
		position : ''
	});
	equals(parseInt(div1.style.left), parseInt(div0.style.left), 'check left');
	equals(parseInt(div1.style.top), parseInt(div0.style.top), 'check top');
	document.body.removeChild(div0);
	document.body.removeChild(div1);
});

test('options.position, rightbottom', function() {
	var div0 = document.body.appendChild(document.createElement('div')), 
	div1 = document.body.appendChild(document.createElement('div')),
	ui = {
		dispatchEvent : function(type) {
		}
	};
	$(document.body).css('margin', 0).css('padding', 0).css('borderWidth', 0);// 这个必须
	$(div0).css('position', 'absolute').css('left', 20).css('top', 20).css(
			'width', 20).css('height', 20)
			.css('background-color', 'yellow').attr('id', 'div0');
	$(div1).css('width', 10).css('height', 10).css('background-color',
			'blue').css('position', 'absolute').attr('id', 'div1');
	for ( var key in baidu.ui.behavior.posable)
		// ui extend posable
		ui[key] = baidu.ui.behavior.posable[key];
	ui.setPositionByElement(div0, div1, {
		once : true,
		position : 'rightbottom'
	});
	equals(parseInt(div1.style.left), parseInt(div0.style.left) + parseInt(div0.style.width), 'check left');
	equals(parseInt(div1.style.top), parseInt(div0.style.top)+ parseInt(div0.style.height), 'check top');
	document.body.removeChild(div0);
	document.body.removeChild(div1);
});

test('test in a small iframe, lefttop, small element', function() {
	ua.frameExt(function(w, f) {
		$(f).css('width', 100).css('height', 100);
		var doc = w.document, div0 = doc.body.appendChild(doc
				.createElement('div')), div1 = doc.body.appendChild(doc
				.createElement('div')), ui = {
			dispatchEvent : function(type) {
			}
		};
		$(doc.body).css('margin', 0).css('padding', 0).css('borderWidth', 0);// 这个必须
		$(div0).css('position', 'absolute').css('left', 100).css('top', 100).css(
				'width', 20).css('height', 20)
				.css('background-color', 'yellow').attr('id', 'div0');
		$(div1).css('width', 10).css('height', 10).css('position', 'absolute').css('background-color',
				'blue').attr('id', 'div1');
		for ( var key in w.baidu.ui.behavior.posable)
			// ui extend posable
			ui[key] = w.baidu.ui.behavior.posable[key];
//		w.scrollTo(100,100);
		ui.setPositionByElement(div0, div1, {
			once : true,
			position : ''
		});
		equals(parseInt(div1.style.left), parseInt(div0.style.left), 'check left');
		equals(parseInt(div1.style.top), parseInt(div0.style.top), 'check top');
		doc.body.removeChild(div0);
		doc.body.removeChild(div1);
		te.obj.push(f);
		this.finish();
	});
});

test('test in a small iframe, lefttop, big element', function() {
	ua.frameExt(function(w, f) {
		$(f).css('width', 100).css('height', 100);
		var doc = w.document, div0 = doc.body.appendChild(doc
				.createElement('div')), div1 = doc.body.appendChild(doc
				.createElement('div')), ui = {
			dispatchEvent : function(type) {
			}
		};
		$(doc.body).css('margin', 0).css('padding', 0).css('borderWidth', 0);// 这个必须
		$(div0).css('position', 'absolute').css('left', 10).css('top', 10).css(
				'width', 100).css('height', 100)
				.css('background-color', 'yellow').attr('id', 'div0');
		$(div1).css('width', 10).css('height', 10).css('position', 'absolute').css('background-color',
				'blue').attr('id', 'div1');
		for ( var key in w.baidu.ui.behavior.posable)
			// ui extend posable
			ui[key] = w.baidu.ui.behavior.posable[key];
		w.scrollTo(100,100);
		ui.setPositionByElement(div0, div1, {
			once : true,
			position : ''
		});
		equals(parseInt(div1.style.left), parseInt(div0.style.left), 'check left');
		equals(parseInt(div1.style.top), parseInt(div0.style.top), 'check top');
		doc.body.removeChild(div0);
		doc.body.removeChild(div1);
		te.obj.push(f);
		this.finish();
	});
});

test('test in a small iframe, bottomright, small element', function() {
	ua.frameExt(function(w, f) {
		$(f).css('width', 100).css('height', 100);
		var doc = w.document, div0 = doc.body.appendChild(doc
				.createElement('div')), div1 = doc.body.appendChild(doc
				.createElement('div')), ui = {
			dispatchEvent : function(type) {
			}
		};
		$(doc.body).css('margin', 0).css('padding', 0).css('borderWidth', 0);// 这个必须
		$(div0).css('position', 'absolute').css('left', 100).css('top', 100).css(
				'width', 20).css('height', 20)
				.css('background-color', 'yellow').attr('id', 'div0');
		$(div1).css('width', 10).css('height', 10).css('position', 'absolute').css('background-color',
				'blue').attr('id', 'div1');
		for ( var key in w.baidu.ui.behavior.posable)
			// ui extend posable
			ui[key] = w.baidu.ui.behavior.posable[key];
		w.scrollTo(100,100);
		ui.setPositionByElement(div0, div1, {
			once : true,
			position : 'bottomright'
		});
		equals(parseInt(div1.style.left), parseInt(div0.style.left) + parseInt(div0.style.width), 'check left');
		equals(parseInt(div1.style.top), parseInt(div0.style.top)+ parseInt(div0.style.height), 'check top');
		doc.body.removeChild(div0);
		doc.body.removeChild(div1);
		te.obj.push(f);
		this.finish();
	});
});

test('test in a small iframe, bottomright, big element', function() {
	ua.frameExt(function(w, f) {
		$(f).css('width', 100).css('height', 100);
		var doc = w.document, div0 = doc.body.appendChild(doc
				.createElement('div')), div1 = doc.body.appendChild(doc
				.createElement('div')), ui = {
			dispatchEvent : function(type) {
			}
		};
		$(doc.body).css('margin', 0).css('padding', 0).css('borderWidth', 0);// 这个必须
		$(div0).css('position', 'absolute').css('left', 10).css('top', 10).css(
				'width', 100).css('height', 100)
				.css('background-color', 'yellow').attr('id', 'div0');
		$(div1).css('width', 10).css('height', 10).css('position', 'absolute').css('background-color',
				'blue').attr('id', 'div1');
		for ( var key in w.baidu.ui.behavior.posable)
			// ui extend posable
			ui[key] = w.baidu.ui.behavior.posable[key];
		w.scrollTo(100,100);
		ui.setPositionByElement(div0, div1, {
			once : true,
			position : 'bottomright'
		});
		equals(parseInt(div1.style.left), parseInt(div0.style.left) + parseInt(div0.style.width), 'check left');
		equals(parseInt(div1.style.top), parseInt(div0.style.top)+ parseInt(div0.style.height), 'check top');
		doc.body.removeChild(div0);
		doc.body.removeChild(div1);
		te.obj.push(f);
		this.finish();
	});
});