module('baidu.ui.DatePicker');
// 逻辑在Calendar中测完，此处仅需考虑输入框内容即可
(function() {

	function mySetup() {
		var input = document.createElement('input');
		input.id = 'input_test';
		document.body.appendChild(input);
		te.dom.push(input);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);// te系列初始化操作，参见tools.js
		mySetup();
	};
	te._weekShot = 'sun,mon,tue,wed,thu,fri,sat';
	te._monthName = [ '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一',
			'十二' ];
	te.getUI = function(target) {
		var ui = new baidu.ui.DatePicker({});
		target && ui.render(target);
		te.obj.push(ui);
		return ui;
	};

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

	te.getDates = function(date, weekStart) {
		var arr = [], d = te.getDate(date, 0),
		// 判断日期是否启动周
		c0 = function(d) {
			return te._weekShot.indexOf(weekStart) / 4 == d.getDay();
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

	te.getDateString = function(date) {
		return date.getFullYear() + '-' + (date.getMonth() + 1) + '-'
				+ date.getDate();
	};

	te.simplecheck = function(de, ui) {
		ui = (ui || te.obj[0])._calendar;
		var label = $('.' + ui.getClass('label'));
		ok(label.html().indexOf(de.getFullYear() + '年') >= 0,
				'check label year in title : ' + de.getFullYear());
		ok(label.html().indexOf(te._monthName[de.getMonth()] + '月') >= 0,
				'check label month in title : ' + (de.getMonth() + 1));
	};

	te.getDoms = function(ui) {
		ui = (ui || te.obj[0])._calendar;//ui指向calendar
		return {
			label : $('.' + ui.getClass('label')),
			prev : $('.' + ui.getId('prev') + ' div'),
			next : $('.' + ui.getId('next') + ' div'),
			items : $('.' + ui.getClass('date') + ' td')
		};
	};
})();
/**
 * <li>prev
 * <li>now
 * <li>next
 * <li>startPrev,stopPrev
 * <li>startNext,stopNext
 * <li>click
 * 
 */

test('基础用例，确认属性、展示等', function() {
	stop();
	ua.importsrc('baidu.i18n.cultures.zh-CN', function() {// 必须载入i18n
		var ui = te.getUI();
		equals(ui.uiType, 'datePicker', 'check uitype');
		start();
	});
});

test('select date', function() {
	var input = te.dom[0], ui = te.getUI(input), d = new Date(), items, ds;

	input.focus();
//	items = $('.' + ui._calendar.getClass('date') + ' td'),

	// 计算出来的时间
	de = te.getDates(d, 'sun')[0];
	ua.click(te.getDoms().items[0]);
	equals(input.value, baidu.date.format(de, ui.format));
	$(input).blur();	
	input.focus();
	stop();
	setTimeout(function(){
		// 显示出来的时间是变更后的
		te.simplecheck(de);
		ua.click(te.getDoms().items[0]);
		de = te.getDates(de, 'sun')[0];
		equals(input.value, baidu.date.format(de, ui.format));
		start();
	}, 10);
	// ua.click(document);
	// input.focus();
	// ua.click($('#' + ui._calendar.getId('next'))[0]);
	// items = $('.' + ui._calendar.getClass('date') + ' td'),
	// // 计算出来的时间
	// ds = te.getDates(ui._calendar.getDate(), 'sun');
	// ua.click(items[0]);
	// equals(input.value, baidu.date.format(ds[0], ui.format));
	// start();
});

test('dispose', function() {
	var ui = te.getUI(te.dom[0]);
	te.checkUI.dispose(ui);
});
