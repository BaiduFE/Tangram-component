module('baidu.ui.Modal');

/**
 * 校验基础属性
 */
test('default properties', function() {
	var m = new baidu.ui.Modal();
	equals(m.uiType, 'MODAL', 'check ui type');
	equals(m.styles.color, '#000000', 'check color');
	equals(m.styles.opacity, '0.6', 'check opacity');
});

/**
 * 检测render方法
 */
test('检测render方法', function() {
	var m = new baidu.ui.Modal();
	m.render();
	ok(!isShown(m.getBody()), '调用render后dom创建但是不显示');
	equals(m.getMain(), document.body.lastChild, '调用render后dom创建但是不显示');
});

test('检测show及具体属性细节',
		function() {
			var m = new baidu.ui.Modal();
			m.render();
			m.show();
			var mo = m.getMain();
			ok(isShown(mo), '调用show之后应该展示');
			equals(parseInt($(mo).css('width')), baidu.page.getViewWidth(),
					'展示后的宽度');
			equals(parseInt($(mo).css('height')), baidu.page.getViewHeight(),
					'展示后的高度');
			equals(parseInt($(mo).css('top')), baidu.page.getScrollTop(),
					'展示后的top');
			equals(parseInt($(mo).css('left')), baidu.page.getScrollLeft(),
					'展示后的left');
			equals($(mo).css('zIndex'), 1000, 'check z index');

			m.hide();
			ok(!isShown(mo), 'hide after hide');
			m.show();
			ok(isShown(mo), 'shown after show');// 这儿有问题，见问题单PUBLICGE-218
			m.hide();
		});

/**
 * 测试窗口滚动和调整大小
 */
test('窗口scroll和resize测试', function() {
	ua.frameExt(function(w, f) {
		var me = this;
		var m = new w.baidu.ui.Modal();
		m.render();
		m.show();
		mo = m.getMain();
		$(f).css('width', 100);
		equals(mo.offsetWidth, 100, '调整窗口宽度并确认Modal是否一致');

		$(f).css('width', 200);
		equals(mo.offsetWidth, 200, '调整窗口宽度并确认Modal是否一致');

		var tdiv = w.document.createElement('div');
		tdiv.style.width = 300;
		tdiv.style.height = 10;
		w.document.body.appendChild(tdiv);
		equals(mo.offsetWidth, 200, '增加滚动条并确认Modal是否一致');

		w.scrollTo(100, 0);
		equals(mo.offsetLeft, 100, '滚动并确认Modal位置');

		w.scrollTo(0, 0);
		equals(mo.offsetLeft, 0, '滚动并确认Modal位置');
		this.finish();
	});
});

test('部分遮罩', function() {
	/* 位置信息及css会引发用例情况异常，此用例在frame中运行 */
	ua.frameExt(function(w, f) {
		var tt = w.document.body.appendChild(w.document.createElement('div'));
		w.$(tt).css('width', 200).css('height', 200).css('background-color',
				'red');
		var m1 = new w.baidu.ui.Modal({
			container : tt
		});
		m1.render();
		m1.show();// 标准模式下，此处计算位置会出错 PUBLICGE-221
		equals(tt.offsetTop, m1.getMain().offsetTop, '遮罩元素top检测');// 考虑使用底层接口进行位置计算，此处不做位置信息的覆盖
		equals(tt.offsetLeft, m1.getMain().offsetLeft, '遮罩元素left检测');
		this.finish();
	});
});

test('多个遮罩依次显示即隐藏', function() {
	ua.frameExt(function(w, f) {
		var check = function(dom) {
			dom = dom || w.document.body;
			var m = new w.baidu.ui.Modal({
				container : dom
			});
			m.render();
			m.show();
			var position = w.baidu.dom.getPosition(m.getMain());
			equals(position.top, dom.offsetTop, '遮罩元素top检测');// 考虑使用底层接口进行位置计算，此处不做位置信息的覆盖
			equals(position.left, dom.offsetLeft, '遮罩元素left检测');
			return m;
		};
		var wd = w.document;
		var t1 = wd.body.appendChild(wd.createElement('div'));
		t1.id = 'div1';
		var t2 = wd.body.appendChild(wd.createElement('div'));
		t2.id = 'div2';

		w.$(t1).css('width', 20).css('height', 20).css('background-color',
				'red');
		w.$(t2).css('width', 20).css('height', 20).css('background-color',
				'blue').css('position', 'absolute').css('left', 50).css('top',
				50);
		var ms = [ check(t1), check(t2) ];
		ms[0].hide();
		ok(!isShown(ms[0].getMain()), '隐藏1');
		ok(isShown(ms[1].getMain()), '隐藏1，2不改变');
		ms[1].hide();
		ok(!isShown(ms[0].getMain()), '隐藏2，1不改变');
		ok(!isShown(ms[1].getMain()), '隐藏2');
		ms[0].show();
		ok(isShown(ms[0].getMain()), '显示1');
		ok(!isShown(ms[1].getMain()), '显示1，2不改变');
		ms[1].show();
		ok(isShown(ms[0].getMain()), '显示2，1不改变');
		ok(isShown(ms[1].getMain()), '显示2');
		te.dom.push(f);
		this.finish();
	});
});
