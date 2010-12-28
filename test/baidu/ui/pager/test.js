/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: baidu/ui/pager/Pager.js
 * author: wenyuxiang
 * version: 1.0.5
 * date: 2010/07/28
 */
(function (){
	module("Pager");
	
	var b = baidu.g('box');
	var p = new baidu.ui.pager.Pager({
		beginPage: 7,
		endPage: 1000
	});
	p.addEventListener("onload", function (){
		test("onload事件", 1, function (){
			ok(true, "onload事件成功触发");
		});
		function getSpec(spec){
			return $('.tangram-pager-'+spec, p.getMain())[0];
		}
		function clickSpec(spec){
			clickObj($('#'+p.getId()+' a[class$="-'+spec+'"]')[0]);
		}
		test("初始化参数 ", 2, function (){ 
			ok(p.beginPage == 7 && p.endPage == 1000, "初始化参数正常"); 
			ok(p.currentPage == 7, "初始化时未指定currentPage,则currentPage为beginPage");
			test("是否给链接添加了正确的css-class", function (){
				p.update({
					beginPage: 10,
					endPage: 50,
					itemCount: 10,
					currentPage: 25
				});
				ok(parseInt($('.tangram-pager-current')[0].getAttribute("page")) == p.currentPage, "当前页跳转链接正常");
				ok(getSpec('first'), "tangram-pager-first存在");
				ok(getSpec('previous'), "tangram-pager-previous存在");
				ok(getSpec('next'), "tangram-pager-next存在");
				ok(getSpec('last'), "tangram-pager-last存在");
				ok(getSpec('current'), "tangram-pager-current存在");
			});
			test("常规链接功能是否正常", function (){
				p.update({
					beginPage: 10,
					endPage: 50,
					itemCount: 10,
					currentPage: 25
				});
				function randomGet(a){
					var l = a.length;
					var i = Math.floor(Math.random() * l);
					return a[i];
				}
				// 10次随机测试
				var r = true;
				for (var i = 0; i < 10; i ++) {
					var a = randomGet($('#'+p.getId()+' a:not([class^="t"])'));
					clickObj(a);
					r = r && p.currentPage == parseInt(a.getAttribute("page"));
				}
				ok(r, "10次随机点击常规链接, 功能正常");
			});
			test("特殊链接功能是否正常", 4, function (){
				p.update({
					beginPage: 10,
					endPage: 50,
					itemCount: 10,
					currentPage: 25
				});
				function testSpec(spec, t){
					p.update({ currentPage: 25 });
					clickSpec(spec);
					ok(p.currentPage == t, "特殊链接"+ spec +"正常");
				}
				testSpec('first', 10);
				testSpec('previous', 24);
				testSpec('next', 26);
				testSpec('last', 49);
			});
			test("特殊链接自动隐藏规则", 4, function (){
				p.update({
					beginPage: 1,
					endPage: 20,
					itemCount: 10,
					leftItemCount: 7
				});
				p.update({
					currentPage: 8
				});
				ok(!getSpec('first'), "当首页在常规链接中时, 不显示特殊链接first");
				
				p.update({
					currentPage: 20
				});
				
				p.update({
					currentPage: 16
				});
				ok(!getSpec(''), "当尾页在常规链接中时, 不显示特殊链接last");
				
				p.update({
					currentPage: 1
				});
				ok(!getSpec('previous'), "当上一页超出范围时, 不显示特殊链接previous");

				p.update({
					currentPage: 19
				});
				ok(!getSpec('last'), "当尾页在常规链接中时, 不显示特殊链接last");
			});
			test("update beginPage, endPage", function (){
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
				clickSpec('first');
				ok(N == 1, "点击链接触发了ongotopage事件");
				p.update({ currentPage: 152 });
				ok(N == 2, "使用update currentPage触发了ongotopage事件");
				ok(p.currentPage == 101, "使用returnValue阻止了跳转页面, 触发了事件");
				p.removeEventListener("ongotopage", ongotopage);
			});
			test("模板配置功能", 5, function (){
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
				ok($(getSpec('first')).text() == 'first'
				&& $(getSpec('previous')).text() == 'previous'
				&& $(getSpec('next')).text() == 'next'
				&& $(getSpec('last')).text() == 'last', "specialLabelMap生效");
				ok(getSpec('first').getAttribute('test') == "test", "tplItem生效");
				ok(p.getBody().getAttribute('test') == "test", "tplBody生效");
			});
			test("dispose方法", 2, function (){
				p.addEventListener('ondispose', function (){
					ok(true, "ondispose事件成功触发");
				});
				p.dispose();
				ok(baidu.g(p.getId()) == null, "脱离dom树");
			});
		});
	});
	p.render(baidu.g('box'));
})();