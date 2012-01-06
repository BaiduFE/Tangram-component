module('baidu.ui.Calendar');

/**
 * 
 */
(function() {
	// 月份信息
	te._monthDay = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
	te._weekShot = 'sun,mon,tue,wed,thu,fri,sat';
	te._language = ['zh-CN','zh-CN','zh-CN','zh-CN','zh-CN', 'en-US', 'en-US', 'zh-CN', 'en-US'];
	te._language_count = 0;
	te.getDate = function(date, day) {
		var d = new Date();
		if (typeof date == 'string') {
			if (/(\d{1,4})-(\d{1,2})-(\d{1,2})/.test(date)) {
				d.setFullYear(parseInt(RegExp.$1));
				d.setMonth(parseInt(RegExp.$2) - 1);
				d.setDate(parseInt(RegExp.$3));
			}
			return d;
		}
		d.setFullYear(date.getFullYear());
		d.setMonth(date.getMonth());
		d.setDate(date.getDate() + day);
		return d;
	};

	te.getDates = function(date, ui) {
		var arr = [], ui = ui || te.obj[0], d = te.getDate(date, 0),
		// 判断日期是否启动周
		c0 = function(d) {
			return te._weekShot.indexOf(ui.weekStart) / 4 == d.getDay();
		},
		// 判断日期是否启动周结尾
		c1 = function(d) {
			return (d.getMonth() > date.getMonth() || d.getFullYear() > date
					.getFullYear())
					&& c0(d);
		};
		d.setDate(1);
		while (!c0(d))
			d = te.getDate(d, -1);// 前移一天
		do {
			arr.push(d);
			d = te.getDate(d, 1);
		} while (!c1(d));
		return arr;
	};

	/**
	 * 校验calender，支持简单模式，仅校验日期，复杂模式校验界面元素
	 */
	te.check = function(cal, date, nostart) {
		// 存在很多翻页的情况，主动update
		var cal = cal || te.getUI(),

		// 默认直接取当前时间
		de = date || new Date(),
		// 常规情况仅需要校验开头、结尾、具体日期数据即可
		da = cal.getDate(), ds = te.getDates(de);
		te.update();
		// te.checkDate(de, da);
		// check title
		ok(te.doms.title.label.html().indexOf(de.getFullYear() + '年') >= 0 ||
				te.doms.title.label.html().indexOf(de.getFullYear()) > 0,
				'check label year in title : ' + de.getFullYear());
		ok(te.doms.title.label.html().indexOf(
				te.doms._monthName[de.getMonth()] + '月') >= 0 ||
				te.doms.title.label.html().indexOf(
						te.translate_month(te.doms._monthName[de.getMonth()])) >= 0,
						'check label month in title : ' + de.getMonth());
		// check date
		$(te.doms.content.dates).each(
				function(idx, item) {
					equals(item.innerHTML, ds[idx].getDate(),
							'check date cell ' + idx);
				});
		// check current
		equals(te.doms.content.current.html(), de.getDate(), 'check current');
		!nostart && start();
		// 校验星期和日期
		// var tds = $('td'),
	};
	
	te.check_en = function(cal, date, nostart) {
		// 存在很多翻页的情况，主动update
		var cal = cal || te.getUI(),

		// 默认直接取当前时间
		de = date || new Date(),
		// 常规情况仅需要校验开头、结尾、具体日期数据即可
		da = cal.getDate(), ds = te.getDates(de);
		te.update();
		// te.checkDate(de, da);
		// check title
		ok(te.doms.title.label.html().indexOf(de.getFullYear()) > 0,
				'check label year in title : ' + de.getFullYear());
		ok(te.doms.title.label.html().indexOf(
						te.translate_month(te.doms._monthName[de.getMonth()])) >= 0,
						'check label month in title : ' + de.getMonth());
		// check date
		$(te.doms.content.dates).each(
				function(idx, item) {
					equals(item.innerHTML, ds[idx].getDate(),
							'check date cell ' + idx);
				});
		// check current
		if(de.getHours() >= 13)
		    equals(te.doms.content.current.html(), de.getDate(), 'check current');
		else{
			equals(te.doms.content.current.html(), de.getDate() - 1, 'check current');//有一天的时差
		}
		!nostart && start();
		// 校验星期和日期
		// var tds = $('td'),
	};

	te.simplecheck = function(de) {
		te.update();
		ok(te.doms.title.label.html().indexOf(de.getFullYear() + '年') >= 0
				|| te.doms.title.label.html().indexOf(de.getFullYear()) >= 0,
				'check label year in title : ' + de.getFullYear());
		ok(te.doms.title.label.html().indexOf(
				te.doms._monthName[de.getMonth()] + '月') >= 0 
				|| te.doms.title.label.html().indexOf(
						te.translate_month(te.doms._monthName[de.getMonth()])) >= 0,
				'check label month in title : ' + de.getMonth());
	};

	te.checkEvent = function(ui, type, de) {
		var de = de;
		ui.addEventListener(type, function(event) {
			ok(event.target === ui, 'event dispatch to ui');
			// 实际结果
			da = event['date'];
			te.checkDate(da, de);
			ui.removeEventListener(type);
		});
	};

	te.checkDate = function(da, de) {
		// 方法列表
		var checkDateFns = [ 'getFullYear', 'getMonth', 'getDate', 'getDay' ],
		// 当前校验项
		cur, i = 0;
		for (; i < checkDateFns.length, cur = checkDateFns[i]; i++)
			equals(da[cur](), de[cur](), 'check ' + cur);
	};

	te.getUI = function(norender, target, op) {
		te.now = new Date();// 避免时间误差，此处直接纪录时间
		op = op || {};
		op.language = te._language[te._language_count++];
		var ui = new baidu.ui.Calendar(op || {});
		te.obj.push(ui);
		te.dom.push(ui.getMain());
		if (!norender) {
			ui.render(target || te.dom[0]);
			var _date = ui.getDate();
			te.update();
		}
		return ui;
	};

	te.translate_month = function(ch_month) {
		switch(ch_month){
		case '一': 
			return 'January';
		case '二': 
			return 'February';
		case '三': 
			return 'March';
		case '四': 
			return 'April';
		case '五': 
			return 'May';
		case '六': 
			return 'June';
		case '七': 
			return 'July';
		case '八': 
			return 'August';
		case '九': 
			return 'September';
		case '十': 
			return 'October';
		case '十一': 
			return 'November';
		case '十二': 
			return 'December';
			break;
		}
	};
	
	te.translate_week = function(ch_week) {
		switch(ch_week){
		case '一': 
			return 'Mon';
		case '二': 
			return 'Tue';
		case '三': 
			return 'Wed';
		case '四': 
			return 'Thu';
		case '五': 
			return 'Fri';
		case '六': 
			return 'Sat';
		case '日': 
			return 'Sun';
			break;
		}
	};
	
	te.update = function() {
		var ui = te.obj[te.obj.length - 1];
		var g = function(id, child) {
			var _id = '';
			if (id.charAt(0) == '#')
				_id = '#' + ui.getId(id.substr(1)).replace("$", "\\$");
			else if (id.charAt(0) == '.')
				_id = '.' + ui.getClass(id.substr(1));
			child && (_id += ' ' + child);
			return $(_id);
		};
		// 渲染出来就给doms赋值，方便测试
		/**
		 * 
		 */
		te.doms = {
			main : g('#main'),
			body : ui.getBody(),
			title : {
				label : g('#label'),
				prev : g('#prev', 'div'),
				next : g('#next', 'div')
			},
			content : {
				weeks : g('.week', 'td'),
				dates : g('.date', 'td'),
				current : g('.date-current'),
				highlight : g('.date-highlight'),
				disable : g('.disabled')
			},
			_monthName : [ '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
					'十一', '十二' ],
			// 周
			_weekName : [ '日', '一', '二', '三', '四', '五', '六' ]
		};
	};
	var ts = QUnit.testStart, td = QUnit.testDone;
	QUnit.testStart = function() {
		ts.apply(this, arguments);
		te.dom.push(document.body.appendChild(document.createElement('div')));
	};
	QUnit.testDone = function() {
		delete te.doms;
		td.apply(this, arguments);
	};

})();

test('base', function() {
	stop();
	// 默认值取当前日期
	ua.importsrc('baidu.lang.Class.$removeEventListener,baidu.dom.getStyle', te.check, 'baidu.lang.Class.$removeEventListener', 'baidu.ui.Calendar');
});

test('界面操作', function() {
	var ui = te.getUI(false, null, {
		initDate : te.getDate('2000-1-1'),
		onclickdate : function(date) {
			ok('onclickdate', 'click date');
		}
	});
	equals(ui.uiType, 'calendar', 'check ui type');
	equals(ui.weekStart, 'sun', 'check week start');

	// 默认星期，第一排是周
	for (i = 0; i < 7; i++)
		ok(
				te.doms.content.weeks[i].innerHTML
						.indexOf(te.doms._weekName[i]) >= 0,
				'check week head : ' + te.doms._weekName[i]);

	// 悬停所有日期
	var _c = ui.getClass('hover');
	$(te.doms.content.dates).each(function() {
		ua.mouseover(this);
		!($(this).hasClass(_c)) && fail('should have class hover');
	});

	// 上翻一页
	ua.click(te.doms.title.prev[0]);
	te.check(ui, te.getDate('1999-12-1'), true);
	ua.click(te.doms.title.prev[0]);
	te.simplecheck(te.getDate('1999-11-1'));
	// te.checkDate(ui.getDate(), te.getDate('1999-11-1'), true);

	// 下翻一页
	ua.click(te.doms.title.next[0]);
	// te.checkDate(ui.getDate(), te.getDate('1999-12-1'), true);
	te.simplecheck(te.getDate('1999-12-1'));
	ua.click(te.doms.title.next[0]);
	// te.checkDate(ui.getDate(), te.getDate('2000-1-1'), true);
	te.simplecheck(te.getDate('2000-1-1'));

	// 点击一个日期，翻页后需要update
	te.update();
//	item = te.doms.content.dates[15];// 需要计算时间
	var d = te.getDates(te.getDate('2000-1-1'))[15];// 这个是当前第15个日期
	te.checkEvent(ui, 'onclickdate', d);
	ua.click(te.doms.content.dates[15]);

	// 下翻一页
	ua.click(te.doms.title.next[0]);// 实际1月10日，显示2月
	d.setMonth(d.getMonth() + 1);
	// te.checkDate(ui.getDate(), d, true);
	te.simplecheck(d);
	// console.log(d);

	ua.click(te.doms.title.prev[0]);// 实际1月10日，显示1月
	d.setMonth(d.getMonth() - 1);
	// te.checkDate(ui.getDate(), d, true);
	te.simplecheck(d);
	// console.log(d);

	ua.click(te.doms.title.prev[0]);// 实际1月10日，显示12月
	d.setMonth(d.getMonth() - 1);
	// te.checkDate(ui.getDate(), d, true);
	te.simplecheck(d);

	te.update();
	// 点到第一个元素是什么情况。。。
//	item = te.doms.content.dates[0];// 需要计算时间
	te.checkEvent(ui, 'onclickdate', te.getDates(d)[0]);
	ua.click(te.doms.content.dates[0]);// 实际11月，显示11月
});

test('开放参数', function() {
	var d = te.getDate('2012-12-21');
	var ui = te.getUI(false, null, {
		initDate : te.getDate('2012-12-21'),
		weekStart : 'mon',
		highlightDates : [ {
			start : te.getDate('2012-7-1'),// 都应该是包含
			end : te.getDate('2012-7-6')
		}, {
			start : te.getDate('2012-8-1'),
			end : te.getDate('2012-8-2')
		} ],
		disableDates : [ {
			start : te.getDate('2012-7-7'),
			end : te.getDate('2012-7-10')
		} ],
		flipContent : {
			prev : '<p>prev</p>'// 就设定一个肯定会有问题。。。
		}
	// 可能是一个日期
	});
	equals(ui.weekStart, 'mon');
	equals(te.doms.title.prev.html().toLowerCase(), '<p>prev</p>', 'prev set');
	equals(te.doms.title.next.html(), '&gt;', 'next not set');
	te.check(ui, te.getDate('2012-12-21'), true);
	// te.simplecheck(te.getDate('2012-12-21'));
	// 向前翻10页。。。确认元素被正确highlight
	// var page = 10,
	// 检测highlight
	// checkHighlight = function() {
	// current应该是21
	ui.gotoMonth(6);

//	equals(te.doms.content.current.html(), 21, 'check current');
	te.update();
	// 从1到6被高亮
	var index = 0;
	te.doms.content.highlight.each(function(idx, item) {
		equals(item.innerHTML, index < 6 ? index + 1 : index - 5,
				'day should be highlight');
		index++;
	});
	equals(index, 8, '高亮的元素有8个，加入了2个2月份的元素');
	index = 0;
	// 7-10被禁止
	te.doms.content.disable.each(function(idx, item) {
		equals(item.innerHTML, index++ + 7);
		ua.click(item);
		//点击四个按钮，日期应该不变
		te.checkDate(ui.getDate(), te.getDate('2012-12-21'), 'check disable');
	});
	equals(index, 4, '禁止的元素有4个');

	// weekStart貌似需要考虑大小写？
	ui = te.getUI(false, null, {
		weekStart : 'Mon'
	});
	equals(ui.weekStart, 'mon', '大写开头的Mon');
});

test('开放API', function() {
	// update
	var ui = te.getUI(false, null, {
		weekStart : 'Mon'
	});
	var e = function(type, checkargs) {
		return function() {
			ok(true, 'event dispatch : ' + type);
			es[type] = es[type] == undefined ? 1 : es[type] + 1;
			if (checkargs)
				checkargs.apply(null, arguments);
		};
	}, es = {};
	ui.update({
		weekStart : 'Sun',
		// onload : e('load'),
		onupdate : e('update'),
		ongotomonth : e('gotomonth'
		// , function(date){
		// ok(date.getDate()== 28 || date.getDate()== 1, 'date from goto date');
		// }
		),
		ongotoyear : e('gotoyear'),
		ongotodate : e('gotodate'),
		onprevmonth : e('prevmonth'
		// , function(event) {
		// equals(event.date.getMonth(), 1, 'date from goto date');
		// }
		),
		onnextmonth : e('nextmonth'
		// , function(event) {
		// equals(event.date.getMonth(), 1, 'date from goto date');
		// }
		),
		ondispose : e('dispose', function() {
			// 校验event数据
			// equals(es.load, 2, 'load event');
			equals(es.update, 1, 'update event');
			equals(es.gotomonth, 3, 'gotomonth event');
			equals(es.gotoyear, 1, 'gotoyear event');
			equals(es.gotodate, 2, 'gotodate event');
			equals(es.prevmonth, 1, 'prevmonth event');
			equals(es.nextmonth, 1, 'nextmonth event');
		})
	});
	te.update();
	te.check(ui, null, true);

	// gotoDate
	var d = te.getDate('1999-1-1');
	ui.gotoDate(d);
	te.update();
	te.check(ui, te.getDate('1999-1-1'), true);
	// te.simplecheck(d);

	d.setDate(28);
	ui.gotoDate(d);
	// te.check(ui, d, false);
	te.simplecheck(d);

	// gotoYear
	d.setFullYear(2012);
	ui.gotoYear(2012);
	// te.update();
	// te.check(ui, d, false);
	te.simplecheck(d);

	// gotoMonth
	d.setMonth(2);
	ui.gotoMonth(2);
	// te.update();
	// te.check(ui, d, false);
	te.simplecheck(d);

	// prevMonth
	d.setMonth(1);
	ui.prevMonth();
	// te.update();
	// te.check(ui, d, false);
	te.simplecheck(d);

	// nextMonth
	d.setMonth(2);
	ui.nextMonth();
	// te.update();
	// te.check(ui, d, false);
	te.simplecheck(d);

	// dispose
	te.checkUI.dispose(ui);
	te.obj.shift();
});

// test('开放事件', function() {//混api中测试
// var ui = te.getUI(false, null);
//	
// });

// FIXME 关于按钮不松就一直换月，这个就不测了，以后再补

test('en-US', function() {
	stop();
	// 默认值取当前日期
	ua.importsrc('baidu.i18n.cultures.en-US', te.check_en);
});

test('英文版界面操作', function() {
	var date = new Date();
	if(date.getHours() >= 13){//因为中美时差13个小时，当时间晚于13点时，不会因时差导致日期不同
		var set_date = te.getDate('2000-1-1');
	}
	else{
	    var set_date = te.getDate('2000-1-2');
	}
	var ui = te.getUI(false, null, {
		initDate : set_date,
		onclickdate : function(date) {
			ok('onclickdate', 'click date');
		}
	});
	equals(ui.uiType, 'calendar', 'check ui type');
	equals(ui.weekStart, 'sun', 'check week start');

	// 默认星期，第一排是周
	for (i = 0; i < 7; i++)
		ok(
				te.doms.content.weeks[i].innerHTML
						.indexOf(te.translate_week(te.doms._weekName[i])) >= 0,
				'check week head : ' + te.translate_week(te.doms._weekName[i]));

	// 悬停所有日期
	var _c = ui.getClass('hover');
	$(te.doms.content.dates).each(function() {
		ua.mouseover(this);
		!($(this).hasClass(_c)) && fail('should have class hover');
	});

	// 上翻一页
	ua.click(te.doms.title.prev[0]);
	te.check(ui, te.getDate('1999-12-1'), true);
	ua.click(te.doms.title.prev[0]);
	te.simplecheck(te.getDate('1999-11-1'));
	// te.checkDate(ui.getDate(), te.getDate('1999-11-1'), true);

	// 下翻一页
	ua.click(te.doms.title.next[0]);
	// te.checkDate(ui.getDate(), te.getDate('1999-12-1'), true);
	te.simplecheck(te.getDate('1999-12-1'));
	ua.click(te.doms.title.next[0]);
	// te.checkDate(ui.getDate(), te.getDate('2000-1-1'), true);
	te.simplecheck(te.getDate('2000-1-1'));

	// 点击一个日期，翻页后需要update
	te.update();
//	item = te.doms.content.dates[15];// 需要计算时间
	var d = te.getDates(te.getDate('2000-1-1'))[15];// 这个是当前第15个日期
	te.checkEvent(ui, 'onclickdate', d);
	ua.click(te.doms.content.dates[15]);

	// 下翻一页
	ua.click(te.doms.title.next[0]);// 实际1月10日，显示2月
	d.setMonth(d.getMonth() + 1);
	// te.checkDate(ui.getDate(), d, true);
	te.simplecheck(d);
	// console.log(d);

	ua.click(te.doms.title.prev[0]);// 实际1月10日，显示1月
	d.setMonth(d.getMonth() - 1);
	// te.checkDate(ui.getDate(), d, true);
	te.simplecheck(d);
	// console.log(d);

	ua.click(te.doms.title.prev[0]);// 实际1月10日，显示12月
	d.setMonth(d.getMonth() - 1);
	// te.checkDate(ui.getDate(), d, true);
	te.simplecheck(d);

	te.update();
	// 点到第一个元素是什么情况。。。
//	item = te.doms.content.dates[0];// 需要计算时间
	te.checkEvent(ui, 'onclickdate', te.getDates(d)[0]);
	ua.click(te.doms.content.dates[0]);// 实际11月，显示11月
});

test('getToday()', function(){
	expect(2);
	var ui = te.getUI();
	var ui_us = te.getUI();
	var date = new Date();
	
	localTime = date.getTime();
	localOffset=date.getTimezoneOffset()*60000; //获得当地时间偏移的毫秒数
	utc = localTime + localOffset; //utc即GMT时间
	offset = -5; //-5区 美国时间
	us = utc + (3600000*offset);
	var date_us = new Date(us); 
	
	equals(ui.getToday().toString(), date.toString(), 'The CN Time is right');
	equals(ui_us.getToday().toString(), date_us.toString(), 'The US Time is right');
});