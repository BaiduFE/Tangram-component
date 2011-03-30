

/*******************************************************************************
 * <li>getString
 * <li>dispose
 * <li>update
 * 
 ******************************************************************************/
(function(){
  module('baidu.ui.Pager');

	function _testStart() {
		var id = "div_test";
		var div = document.createElement("div");
		div.id = id;
		document.body.appendChild(div);
		div.style.position = 'absolute';
		te.dom.push(div);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);;
		_testStart();
	};

	function getSpec(spec,page) {
		return $('.tangram-pager-' + spec, page.getMain())[0];
	}

	test('初始化参数', function() {
		expect(5);
		var page = new baidu.ui.Pager();
		page.render(te.dom[0]);
		// page.render();
		equal(page.beginPage, 1, 'default beginPage is 1');
		equal(page.endPage, 100, 'default endPage is 100');
		equal(page.itemCount, 10, 'default itemcount is 10');
		equal(page.leftItemCount, 4, 'default leftItemCount is 4');
		ok(page.getMain(), 'get main');

	})

	test('update', function() {
		var options = {
			beginPage : 1,
			endPage : 20,
			currentPage : 3,
			itemCount : 5,
			leftItemCount : 2
		}
		var page = new baidu.ui.Pager(options);
		page.render();
		equal(page.beginPage, 1, 'current beginPage is 1');
		equal(page.endPage, 20, 'current endPage is 20');
		equal(page.currentPage, 3, 'current page is 3')
		equal(page.itemCount, 5, 'current itemcount is 5');
		equal(page.leftItemCount, 2, 'current leftItemCount is 2');
		page.update( {
			beginPage : 2,
			endPage : 19,
			itemCount : 6,
			currentPage : 5
		});
		equal(parseInt($('.tangram-pager-current')[0].getAttribute("page")),
				page.currentPage, "当前页跳转链接正常");
		ok(getSpec('first',page), "tangram-pager-first存在");
		ok(getSpec('previous',page), "tangram-pager-previous存在");
		ok(getSpec('next',page), "tangram-pager-next存在");
		ok(getSpec('last',page), "tangram-pager-last存在");
		ok(getSpec('current',page), "tangram-pager-current存在");
	})

	test("常规链接功能是否正常", function() {
			var page = new baidu.ui.Pager();
			page.render();
			page.update( {
			beginPage : 10,
			endPage : 50,
			itemCount : 10,
			currentPage : 25
		});
		function randomGet(a) {
			var l = a.length;
			var i = Math.floor(Math.random() * l);
			return a[i];
		}
		// 10次随机测试
		var r = true;
		for ( var i = 0; i < 10; i++) {
			var a = randomGet($('#' + page.getId() + ' a:not([class^="t"])'));
			UserAction.click(a);
			r = r && page.currentPage == parseInt(a.getAttribute("page"));
		}
		ok(r, "10次随机点击常规链接, 功能正常");
	});


	test("特殊链接功能是否正常", 4, function (){
		var p = new baidu.ui.Pager();
		p.render();
		p.update({
			beginPage: 10,
			endPage: 50,
			itemCount: 10,
			currentPage: 25
		});
		function testSpec(spec, t){
			p.update({ currentPage: 25 });
			UserAction.click($('#'+p.getId()+' a[class$="-'+spec+'"]')[0]);
			ok(p.currentPage == t, "特殊链接"+ spec +"正常");
		}
		testSpec('first', 10);
		testSpec('previous', 24);
		testSpec('next', 26);
		testSpec('last', 49);
	});

	test("特殊链接自动隐藏规则", 4, function (){
		var p = new baidu.ui.Pager();
		p.render();
		p.update({
			beginPage: 1,
			endPage: 20,
			itemCount: 10,
			leftItemCount: 7
		});
		p.update({
			currentPage: 8
		});
		ok(!getSpec('first',p), "当首页在常规链接中时, 不显示特殊链接first");
		p.update({
			currentPage: 20
		});
		p.update({
			currentPage: 16
		});
		ok(!getSpec('',p), "当尾页在常规链接中时, 不显示特殊链接last");
		p.update({
			currentPage: 1
		});
		ok(!getSpec('previous',p), "当上一页超出范围时, 不显示特殊链接previous");

		p.update({
			currentPage: 19
		});
		ok(!getSpec('last',p), "当尾页在常规链接中时, 不显示特殊链接last");
	});

	test("update beginPage, endPage", function (){
		var p = new baidu.ui.Pager();
		p.render();
		p.update({
			beginPage: 1,
			endPage: 200,
			currentPage: 1
		});
		p.update({
			beginPage: 10,
			endPage: 50
		});
		ok(p.beginPage == 10 && p.endPage == 50, "更新beginPage,endPage成功");
		ok(p.currentPage == 10, "更新beginPage时若大于之前的currentPage则会修改currentPage");
		var r = p.update({
			beginPage: 10,
			endPage: 10
		});
		ok(r === false && p.beginPage == 10 && p.endPage == 50, "错误的beginPage和endPage参数会更新失败");
	});

	test("update currentPage", 3, function (){
		var p = new baidu.ui.Pager();
		p.render();
		p.update({
			beginPage: 101,
			endPage: 200
		});
		var r1 = p.update({ currentPage: 100 });
		var r2 = p.update({ currentPage: 200 });
		ok(r1 === false && r2 === false, "update currentPage超出范围 则返回false");
		ok(p.currentPage == 101, "update失败则不进行更新.");
		
		ok((function (a){
			var r = true;
			for (var i = 0; i < a.length; i++) {
				r = r && p.update({ currentPage: a[i] } && p.currentPage == a[i]);
			}
			return r;
		})([ 101, 199, 105 ]), "update currentPage成功");
	});

	test("ongotopage事件", 3, function (){
		var p = new baidu.ui.Pager();
		p.render();
		p.update({
			beginPage: 101,
			endPage: 200,
			currentPage: 150
		});
		var N = 0;
		function ongotopage(evt){
			if (N == 1){
				evt.returnValue = false;
			}
			N ++;
		}
		p.addEventListener("ongotopage", ongotopage);
		UserAction.click($('#'+p.getId()+' a[class$="-first"]')[0]);
// clickSpec('first');
		ok(N == 1, "点击链接触发了ongotopage事件");
		p.update({ currentPage: 152 });
		ok(N == 2, "使用update currentPage触发了ongotopage事件");
		ok(p.currentPage == 101, "使用returnValue阻止了跳转页面, 触发了事件");
		p.removeEventListener("ongotopage", ongotopage);
	});
	
	
	test("模板配置功能", 5, function (){
		var p = new baidu.ui.Pager();
		p.render();
		p.update({
			beginPage: 1,
			endPage: 20,
			currentPage: 10,
			tplLabel: "{#{page}}",
			specialLabelMap: {
				first: 'first',
				last: 'last',
				previous: 'previous',
				next: 'next'
			},
			tplItem: '<a test="test" class="#{class}" page="#{page}" target="_self" href="#{href}">#{label}</a>',
			tplBody: '<div test="test" #{eventbinding} id="#{id}" class="#{class}">#{items}</div>',
			tplCurrentLabel: '#'
		});
		ok(/{(.*)}/.test($(p.getMain()).find('a:not([class^="t"]):nth(0)').text()), " tplLabel生效");
		ok($(p.getMain()).find('a[class$="current"]').text() == '#', "tplCurrentLabel生效");
		ok($(getSpec('first',p)).text() == 'first'
		&& $(getSpec('previous',p)).text() == 'previous'
		&& $(getSpec('next',p)).text() == 'next'
		&& $(getSpec('last',p)).text() == 'last', "specialLabelMap生效");
		ok(getSpec('first',p).getAttribute('test') == "test", "tplItem生效");
		ok(p.getBody().getAttribute('test') == "test", "tplBody生效");
	});
	
	test("dispose方法", 2, function (){
		var p = new baidu.ui.Pager();
		p.render();
		p.addEventListener('ondispose', function (){
			ok(true, "ondispose事件成功触发");
		});
		p.dispose();
		ok(baidu.g(p.getId()) == null, "脱离dom树");
	});
})();

