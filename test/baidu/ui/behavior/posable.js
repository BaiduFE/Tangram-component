module('baidu.ui.behavior.posable');

(function() {
	te.getUI = function(options) {
		var ui = baidu.ui.createUI(new Function()).extend(
				{
					uiType : 'test',
					disabled : false,
					posable : true,
					tplBody : '<div id="#{id}" ' + 'class="#{class}"></div>',
					/**
					 * 获得HTML字符串
					 * 
					 * @private
					 * @return {String} 拼接的字符串
					 */
					_getString : function() {
						var me = this;
						return baidu.format(me.tplBody, {
							id : me.getId(),
							'class' : me.getClass()
						});
					},
					render : function(target) {
						var me = this;
						baidu.dom.insertHTML(me.renderMain(), 'beforeEnd', me
								._getString());
						if (target)
							me.getMain().appendChild(target);
						var main = me.getMain();
						$(main).css('width', 20).css('height', 20).css(
								'background-color', 'yellow');
						return me;
					},
					update : function(op) {
						for ( var i in op)
							this[i] = op[i];
					},
					dispose : function() {
						$(this.getMain()).remove();
					}
				}).extend(options);
		var uiInstance = new ui();
		te.obj.push(uiInstance);
		if (!uiInstance.norender)
			uiInstance.render();
		uiInstance.dispatchEvent('onload');
		return uiInstance;
	};

	te.checkPosition = function(ele, left, top, info) {
		info = info || '';
		equals(parseInt($(ele).css('left')), left, info + ' - left');
		equals(parseInt($(ele).css('top')), top, info + ' - top');
	};
})();

/**
 * 关于position的设置校验
 */
test('setPosition - base', function() {
	stop();
	ua.importsrc('baidu.string.format,baidu.dom.insertHtml'
			+ ',baidu.ui.createUI',
			function() {
				var ui = te.getUI(), m = ui.getMain();
				equals(typeof ui.setPosition, 'function',
						'ui had function setPosition');
				ui.setPosition([ -10, -10 ], m, {
					once : true
				});
				te.checkPosition(m, -10, -10);
				ui.setPosition([ 81, 82 ], m, {
					once : true
				});
				te.checkPosition(m, 81, 82);
				var eventLen = baidu.event._listeners.length;
				// none once, position should be set
				ui.setPosition([ 50, 50 ]);// 这个貌似是注册事件。。。
				te.checkPosition(m, 50, 50);
				// 检查事件添加
				equals(baidu.event._listeners.length, eventLen + 1,
						'event added');
				var e = baidu.event._listeners.pop();
				equals(e[0], window, 'event on window');
				equals(e[1], 'resize', 'event type is resize');

				ui.setPosition([ 20, 20 ], te.dom[0], {
					once : true
				});// 必须调用once，不带元素时默认为main
				te.checkPosition(te.dom[0], 20, 20);
				start();
			}, 'baidu.ui.createUI', 'baidu.ui.behavior.posable');
});

test('options - offset', function() {
	// offset
	var ui = te.getUI(), m = ui.getMain();
	var op = {
		once : true,
		offset : [ 10, 10 ]
	// 偏移量
	};
	ui.setPosition([ 100, 100 ], m, op);
	te.checkPosition(m, 110, 110, 'check offset as array ');
	equals(op.position, 'bottomright', 'set position as default');

	op.offset = {
		left : 10,
		top : 10
	};
	ui.setPosition([ 100, 100 ], m, op);
	te.checkPosition(m, 110, 110, 'check offset as left-top');
	equals(op.position, 'bottomright', 'set position as default');
});

// -- 这个结合鼠标和元素测试才有意义
test('options - insideScreen', function() {
	// offset
	var ui = te.getUI(), m = ui.getMain();
	var op = {
		once : true,
		insideScreen : true
	};
	ui.setPosition([ 2000, 10 ], m, op);
	te.checkPosition(m, 2000, 10);
	ui.setPosition([ -10, -10 ], m, op);
	te.checkPosition(m, -10, -10);
});