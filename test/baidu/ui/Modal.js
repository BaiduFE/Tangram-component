module('baidu.ui.Modal');

/**
 * 校验基础属性
 */
test('default properties', function() {
	expect(3);
	var m = new baidu.ui.Modal();
	m.render();
	equals(m.uiType, 'modal', 'check ui type');
	equals(m.styles.color, '#000000', 'check color');
	equals(m.styles.opacity, '0.6', 'check opacity');
    m.dispose();
});

/**
 * 检测render方法
 */
test('检测render方法', function() {
	expect(2);
	var m = new baidu.ui.Modal();
	m.render();
	ok(!isShown(m.getBody()), '调用render后dom创建但是不显示');
	equals(m.getMain(), document.body.lastChild, '调用render后dom创建但是不显示');
    m.dispose();
});

test('检测show及具体属性细节',function() {
    expect(8);
	var m = new baidu.ui.Modal();
	m.render();
	m.show();
	var mo = m.getMain();
	ok(isShown(mo), '调用show之后应该展示');
	equals(mo.offsetWidth, baidu.page.getViewWidth(),
			'展示后的宽度');
	equals(mo.offsetHeight, baidu.page.getViewHeight(),
			'展示后的高度');
	equals(mo.offsetTop, baidu.page.getScrollTop(),
			'展示后的top');
	equals(mo.offsetLeft, baidu.page.getScrollLeft(),
			'展示后的left');
	equals($(mo).css('zIndex'), 1000, 'check z index');

	m.hide();
	ok(!isShown(mo), 'hide after hide');
	m.show();
	ok(isShown(mo), 'shown after show');// 这儿有问题，见问题单PUBLICGE-218
	m.hide();
    m.dispose();
});

/**
 * 测试窗口滚动和调整大小
 */
test('窗口resize测试（缩小）', function() {
	expect(4);
	stop();
	ua.frameExt(function(w, f) {
	    f.style.borderWidth = f.style.margin = f.style.padding = 0;
		var me = this;
		var m = new w.baidu.ui.Modal();
		var flag = false;
		m.getContainer().style.padding= 0;
		m.render();
		m.show();
		mo = m.getMain();
		mo.style.margin =0;
		mo.style.padding= 0;
		ok(Math.abs(mo.offsetWidth - f.offsetWidth) < 5, "The offsetWidth of modal is the same with the offsetWidth of frame PUBLICGE-381");
		ok(Math.abs(mo.offsetHeight - f.offsetHeight) < 5, "The offsetHeight of modal is the same with the offsetHeight of frame");
		baidu.on(w, 'resize', function() {
			setTimeout(function() {//某些浏览器在调整高宽大小后需要时间来同步。
				ok(Math.abs(mo.offsetHeight - 100) < 5, 'height change on window resize PUBLICGE-381');
				ok(Math.abs(mo.offsetWidth - 100) < 5, 'width change on window resize PUBLICGE-381');
				m.dispose();
				baidu.un(w,'resize');
				me.finish();
			}, 100);
		});
		$(f).css('height', "100px").css('width', "100px");
	});
});

test('窗口resize测试(放大)', function() {
	expect(4);
	stop();
	ua.frameExt(function(w, f) {
	    var _s = function(dom){
	    	dom.style.borderWidth = dom.style.margin = dom.style.padding = 0;
	    }
	    _s(f);
	    _s(w.document.body);
		var me = this;
		var m = new w.baidu.ui.Modal();
		var flag = false;
		m.render();
		m.show();
		mo = m.getMain();
		ok(Math.abs(mo.offsetWidth - f.offsetWidth) < 5, "The offsetWidth of modal is the same with the offsetWidth of frame PUBLICGE-381");
		ok(Math.abs(mo.offsetHeight - f.offsetHeight) < 5, "The offsetHeight of modal is the same with the offsetHeight of frame");
		baidu.on(w, 'resize', function() {
			setTimeout(function() {//某些浏览器在调整高宽大小后需要时间来同步。
				ok(Math.abs(mo.offsetHeight - 500) < 5, 'height change on window resize');
				ok(Math.abs(mo.offsetWidth - 500) < 5, 'width change on window resize');
                baidu.un(w,'resize');
				m.dispose();
				me.finish();
			}, 100);
		});
		$(f).css('height', "500px").css('width', "500px");
	});
});

test('部分遮罩（在iframe中）', function() {
	/* 位置信息及css会引发用例情况异常，此用例在frame中运行 */
	expect(4);
	ua.frameExt(function(w, f) {
	    var _s = function(dom){
	    	dom.style.borderWidth = dom.style.margin = dom.style.padding = 0;
	    }
	    _s(f);
	    _s(w.document.body);
		var tt = w.document.body.appendChild(w.document.createElement('div'));
		w.$(tt).css('width', 200).css('height', 200).css('background-color',
				'red');
		var m1 = new w.baidu.ui.Modal({
			container : tt
		});
		m1.render();
		m1.show();// 标准模式下，此处计算位置会出错 PUBLICGE-221
		equals(tt.offsetTop, m1.getMain().offsetTop, '遮罩元素top检测(在IE下不通过)');// 考虑使用底层接口进行位置计算，此处不做位置信息的覆盖
		equals(tt.offsetLeft, m1.getMain().offsetLeft, '遮罩元素left检测(在IE下不通过)');
        equals(tt.offsetWidth, m1.getMain().offsetWidth, '遮罩元素width检测');
        equals(tt.offsetHeight, m1.getMain().offsetHeight, '遮罩元素height检测');
        m1.dispose();
        w.document.body.removeChild(tt);
		this.finish();
	});
});


test('部分遮罩（在windows中）', function() {
	expect(4);
	/* 位置信息及css会引发用例情况异常，此用例在frame中运行 */
	var tt = document.body.appendChild(document.createElement('div'));
	$(tt).css('width', 200).css('height', 200).css('background-color',
			'red');
	var m1 = new baidu.ui.Modal({
		container : tt
	});
	m1.render();
	m1.show();// 标准模式下，此处计算位置会出错 PUBLICGE-221
	equals(baidu.dom.getPosition(m1.getMain()).top, baidu.dom.getPosition(tt).top, '遮罩元素top检测()');
	equals(baidu.dom.getPosition(m1.getMain()).left, baidu.dom.getPosition(tt).left, '遮罩元素left检测()');
    equals(tt.offsetWidth, m1.getMain().offsetWidth, '遮罩元素width检测');
    equals(tt.offsetHeight, m1.getMain().offsetHeight, '遮罩元素height检测');
    m1.dispose();
    document.body.removeChild(tt);
});
test('多个遮罩依次显示及隐藏', function() {
	expect(12);
	var check = function(dom) {
		dom = dom || document.body;
		var m = new baidu.ui.Modal({
			container : dom
		});
		m.render();
		m.show();
		var position = baidu.dom.getPosition(m.getMain());
		equals(position.top, baidu.dom.getPosition(dom).top, '遮罩元素top检测');// 考虑使用底层接口进行位置计算，此处不做位置信息的覆盖
		equals(position.left, baidu.dom.getPosition(dom).left, '遮罩元素left检测');
		return m;
	};
	var wd = document;
	var t1 = wd.body.appendChild(wd.createElement('div'));
	t1.id = 'div1';
	var t2 = wd.body.appendChild(wd.createElement('div'));
	t2.id = 'div2';

	$(t1).css('width', 20).css('height', 20).css('background-color',
			'red');
	$(t2).css('width', 20).css('height', 20).css('background-color',
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
	ms[0].dispose();
	ms[1].dispose();
	document.body.removeChild(t1);
	document.body.removeChild(t2);
});

test('hide flash', function() {
    expect(16);
    stop();
	var check = function(){
	    var div1 = document.createElement('div');
		div1.id = 'flashContainer1';
		document.body.appendChild(div1);
		baidu.swf.create({
	        id: "flash1",
	        url: upath + 'Modal/flash/test_flash.swf',
	        width:695,
	        height:90,
	        wmode:'transparent'
	    }, "flashContainer1");
		var div2 = document.createElement('div');
		div2.id = 'flashContainer2';
		document.body.appendChild(div2);
		baidu.swf.create({
	        id: "flash2",
	        url: upath + 'Modal/flash/test_flash.swf',
	        width:695,
	        height:90,
	        wmode:'window'
	    }, "flashContainer2");
		var div3 = document.createElement('div');
		div3.id = 'flashContainer3';
		document.body.appendChild(div3);
		baidu.swf.create({
	        id: "flash3",
	        url: upath + 'Modal/flash/test_flash.swf',
	        width:695,
	        height:90,
	        wmode:'opaque'
	    }, "flashContainer3");
	    var m = new baidu.ui.Modal();
	    m.render();
	    m.show();
		equals(m.uiType, 'modal', 'check ui type');
		equals(m.styles.backgroundColor, '#000000', 'check color');
		equals(m.styles.opacity, '0.6', 'check opacity');
		equals(m.styles.zIndex, 1000, 'check z-index');
		equals(m.getMain().offsetWidth, baidu.page.getViewWidth(), 'check width after shown');
		equals(m.getMain().offsetHeight, baidu.page.getViewHeight(), 'check height after shown');
		equals(baidu.g("flashContainer1").firstChild.style.visibility, "", "The transparent flash is not hidden");
		equals(baidu.g("flashContainer2").firstChild.style.visibility, "hidden", "The window flash is hidden PUBLICGE-383");
		equals(baidu.g("flashContainer3").firstChild.style.visibility, "", "The opaque flash is not hidden");
		m.hide();
		ok(!isShown(m), "modal isn't shown after hide");
		equals(m.styles.color, undefined, 'check color  after hidden');
		equals(m.getMain().offsetWidth, 0, 'check width after hidden');
		equals(m.getMain().offsetHeight, 0, 'check height after hidden');
		equals(baidu.g("flashContainer1").firstChild.style.visibility, "", "The transparent flash is not hidden");
		ok(baidu.g("flashContainer2").firstChild.style.visibility ==  "visible" 
			|| baidu.g("flashContainer2").firstChild.style.visibility == "inherit", 
			"The window flash isn't hidden PUBLICGE-383");
		equals(baidu.g("flashContainer3").firstChild.style.visibility, "", "The opaque flash is not hidden");
	    document.body.removeChild(div1);
	    document.body.removeChild(div2);
	    document.body.removeChild(div3);
	    m.dispose();
	    start();
	};
    ua.importsrc('baidu.swf.create', 
			check ,'baidu.swf.create', 'baidu.ui.Modal');
});

test('Check update', function() {
	expect(6);
	ua.frameExt(function(w, f) {
	    f.style.borderWidth = f.style.margin = f.style.padding = 0;
		var me = this;
		var m = new w.baidu.ui.Modal();
		m.render();
		m.show();
		mo = m.getMain();
		ok(Math.abs(mo.offsetWidth - f.offsetWidth) < 5, "check offsetWidth PUBLICGE-381");
		ok(Math.abs(mo.offsetHeight - f.offsetHeight) < 5, "check offsetHeight");
		equals(m.styles.backgroundColor, '#000000', 'check color');
		equals(m.styles.opacity, '0.6', 'check opacity');
		var tt = w.document.body.appendChild(w.document.createElement('div'));
		w.$(tt).css('width', 200).css('height', 100).css('background-color',
				'black');
		var options = {
				styles:{color: '#FF0000',
						opacity : '0.3',
						width : 100,
				        height : 50,
				        top : 50,
				        left : 50
		        }
		}
		m.update(options);
		equals(m.styles.backgroundColor, '#FF0000', 'check color');
		equals(m.styles.opacity, '0.3', 'check opacity');
		m.dispose();
		w.document.body.removeChild(tt);
		this.finish();
	});
});

test('hide select', function() {
    expect(10);
    stop();
	var check = function(){
		var select = document.createElement('select');
		var select_a = document.createElement('select');
		select_a.options[select_a.options.length] = new Option('content_a', 'value_a');
		document.body.appendChild(select_a);
		var select_b = document.createElement('select');
		select_b.options[select_b.options.length] = new Option('content_a', 'value_a');
		document.body.appendChild(select_b);

	    var m = new baidu.ui.Modal();
	    m.render();
	    m.show();
		equals(m.uiType, 'modal', 'check ui type');
		equals(m.styles.backgroundColor, '#000000', 'check color');
		equals(m.styles.opacity, '0.6', 'check opacity');
		equals(m.styles.zIndex, 1000, 'check z-index');
		equals(m.getMain().offsetWidth, baidu.page.getViewWidth(), 'check width after shown');
		equals(m.getMain().offsetHeight, baidu.page.getViewHeight(), 'check height after shown');
		m.hide();
		ok(!isShown(m), "modal isn't shown after hide");
		equals(m.styles.color, undefined, 'check color  after hidden');
		equals(m.getMain().offsetWidth, 0, 'check width after hidden');
		equals(m.getMain().offsetHeight, 0, 'check height after hidden');
	    document.body.removeChild(select_a);
	    document.body.removeChild(select_b);
	    m.dispose();
	    start();
	}
	ua.importsrc('baidu.page.getViewWidth,baidu.page.getViewHeight,baidu.page.getScrollTop,baidu.page.getScrollLeft', 
			check ,'baidu.page.getViewWidth', 'baidu.ui.Modal');
});

test('窗口scroll测试', function() {
	expect(4);
	ua.frameExt({
		onafterstart : function(f) {
			$(f).css('width', 300).css('height', 300);
		},
		ontest : function(w, f) {
			w.$(w.document.body).css('border', 0);
			w.$(w.document.body).css('margin', 0);
			w.$(w.document.body).css('padding', 0);
			w.$(w.document.body).append('<div id="test1"></div>');
			w.$('div#test1').css('width', 600).css('height', 600);
		    f.style.borderWidth = f.style.margin = f.style.padding = 0;
			var me = this;
			var m = new w.baidu.ui.Modal();
			m.render();
			m.show();
			mo = m.getMain();
			baidu.on(w, 'scroll', function() {
				setTimeout(function() {//某些浏览器在调整高宽大小后需要时间来同步。
					ok(Math.abs(mo.offsetWidth - w.baidu.page.getViewWidth()) < 5, 'width change on window scroll');
					ok(Math.abs(mo.offsetHeight - w.baidu.page.getViewHeight()) < 5, 'height change on window scroll');
					if($(mo).css('position') == 'fixed') {
						equals($(mo).css('position'),'fixed' , "window scrolled");	
					} else {
						equals(mo.offsetTop , 50, "top isn't changed on window scroll");
					}
					ok(mo.offsetLeft==0, "left isn't changed on window scroll");
					m.dispose();
					me.finish();
				}, 50);
				baidu.un(w, 'scroll');
			});
			w.scrollTo(0, 50);
	}
	});
});
