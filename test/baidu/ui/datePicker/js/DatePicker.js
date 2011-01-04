/**
 * <li>prev
 * <li>now
 * <li>next
 * <li>startPrev,stopPrev
 * <li>startNext,stopNext
 * <li>click
 * 
 */

(function() {
	module('baidu.ui.datePicker.DatePicker');
//	ua.importsrc('baidu.browser.ie');
	var check = function(datePicker, direc) {
		var coe;
		var action = function(direc) {
			if (direc == 'prev') {
				coe = -1;
				return datePicker.prev();
			} else {
				coe = 1;
				return datePicker.next();
			}
		};
		action(direc);
		var date = new Date();
		
		var layer = datePicker.currentWorkLayerName;
		switch (layer) {
		case 'date':
			equal(datePicker.currentDate.getMonth(), (12+date.getMonth() + coe)%12,direc + ' month');// normal
			// prev
			datePicker.currentDate = new Date(2000, 0, 01);
			action(direc);
			equal(datePicker.currentDate.getFullYear(), (coe == -1) ? 1999
					: 2000, direc + ' month in 2000');// current
			// month
			// is
			// Jan
			equal(datePicker.currentDate.getMonth(), (coe == -1) ? 11 : 1,
					direc + ' month of Jan');
			datePicker.currentDate = new Date(2001, 11, 01);
			action(direc);
			equal(datePicker.currentDate.getMonth(), (coe == -1) ? 10 : 0,
					direc + ' month of Dec');
			break;
		case 'month':
			equal(datePicker.currentDate.getFullYear(), (coe == -1) ? 2000
					: 2003, 'current layer is month');
			equal(datePicker.currentDate.getMonth(), (coe == -1) ? 10 : 0,
					'current month is Jan');
			break;
		case 'year':
			equal(datePicker.currentDate.getFullYear(), (coe == -1) ? 1990
					: 2013, 'current layer is year');
			equal(datePicker.currentDate.getMonth(), (coe == -1) ? 10 : 0,
					'current month is Jan');
			break;
		case 'multiyear':
			equal(datePicker.currentDate.getFullYear(), (coe == -1) ? 1890
					: 2113, 'current layer is multiyear');
			equal(datePicker.currentDate.getMonth(), (coe == -1) ? 10 : 0,
					'current month is Jan');
			break;
		}
	}

	var getEleByClass = function(className, tagName, parent) {
		parent = parent || document;
		var eles = parent.getElementsByTagName(tagName);
		var results = new Array();
		for ( var index in eles) {
//		for(var index = 0; index <eles.length; index++){
			if(eles[index].className && eles[index].className.indexOf(className) != -1){
				results.push(eles[index]);
			}
		}
		return results;
	}

	var clickObj = function(target) {
		if ($.browser.msie)
			return target.click();
		else
			return ua.click(target);
	}
	test('click', function() {
		stop();
		var datePicker = new baidu.ui.datePicker.DatePicker();
		var input = te.dom[0];
		datePicker.trigger = input;
		datePicker.popup = baidu.ui.datePicker.DatePicker.popup;
		datePicker.render();
		datePicker.show();
		var date = new Date();
		$(datePicker.g('current')).click();
		equal(datePicker.g('current').innerHTML, date.getFullYear() + '年');
		var currentTd = getEleByClass('current', "td",
				datePicker.popup.document)[0];
		clickObj(currentTd);// click当前焦点的单元格
		var y = date.getFullYear();
		var m = date.getMonth();
		//alert(document.body.outerHTML);
		setTimeout(function() {// 等待动画结束
			equal(datePicker.g('current').innerHTML, y + '年' + ((m + 1)/10<1?('0'+(m + 1)):(m + 1)) + '月');// date层
//			clickObj(datePicker.g('current'))// month层
//			clickObj(datePicker.g('current'))// year层
			$(datePicker.g('current')).click();
			$(datePicker.g('current')).click();
			equal(datePicker.g('current').innerHTML, (y - y % 10) + '-'
					+ (y - y % 10 + 9), 'year');
//			clickObj(datePicker.g('current'))// multi year层
			$(datePicker.g('current')).click();
			equal(datePicker.g('current').innerHTML, (y - y % 100) + '-'
					+ (y - y % 100 + 99), 'multi year');
			var table = datePicker.g('year2');
			currentTd = getEleByClass('current', "td", table.firstChild)[0];
			equal(currentTd.innerHTML.toLowerCase(), (y - y % 10) + '-<wbr>'
					+ (y - y % 10 + 9));// 当前被选中单元格内容

			var table = datePicker.g('year1');
			currentTd = getEleByClass('current', "td", table.firstChild)[0];
//			clickObj(currentTd);// 回到year层
			$(datePicker.g('current')).click();
			equal(currentTd.innerHTML, y, 'year');// 当前被选中单元格内容

			var table = datePicker.g('month1');
			currentTd = getEleByClass('current', "td", table.firstChild)[0];
//			clickObj(currentTd);// 回到month层
			$(datePicker.g('current')).click();
			equal(currentTd.innerHTML,
					datePicker.lang[baidu.ui.datePicker.DatePicker.monthes[date
							.getMonth()]], 'month');// 当前被选中单元格内容
			datePicker.dispose();
			start();
		}, datePicker.duration + datePicker.pauseTime + 1);
	})
	
	test('prev',function() {
				stop();
				setTimeout(function() {
					var datePicker = new baidu.ui.datePicker.DatePicker();
					datePicker.popup = baidu.ui.datePicker.DatePicker.popup;
					datePicker.trigger = te.dom[0];
					datePicker.render();
					datePicker.show();
					var date = new Date();
					equal(datePicker.g("header").innerHTML, '今天是'
							+ date.getFullYear() + '年' + ((date.getMonth() + 1)/10<1?('0'+(date.getMonth() + 1)):(date.getMonth() + 1))
							+ '月' + ((date.getDate())>9?date.getDate():'0'+date.getDate()) + '日');
					equal(datePicker.currentWorkLayerName, 'date',
							'current layer is date');// date
					check(datePicker, 'prev');
					datePicker.currentWorkLayerName = 'month';
					check(datePicker, 'prev');
					datePicker.currentWorkLayerName = 'year';
					check(datePicker, 'prev');
					datePicker.currentWorkLayerName = 'multiyear';
					check(datePicker, 'prev');
					datePicker.dispose();
					start();
				},100);
				
			});

	test('now', function() {
		stop();
		setTimeout(function() {
			var datePicker = new baidu.ui.datePicker.DatePicker();
			datePicker.popup = baidu.ui.datePicker.DatePicker.popup;
			datePicker.trigger = te.dom[0];
			datePicker.render();
			datePicker.show();
			var date = new Date();
			var y = date.getFullYear();
			datePicker.now();
			equal(datePicker.g("current").innerHTML, y + '年');
	
			datePicker.now();
			equal(datePicker.g("current").innerHTML, (y - y % 10) + '-'
					+ (y - y % 10 + 9));
			datePicker.now();
			equal(datePicker.g("current").innerHTML, (y - y % 100) + '-'
					+ (y - y % 100 + 99));
			datePicker.dispose();
			start();
		},100);
	})

	test('next', function() {
		stop();
		setTimeout(function() {
			var datePicker = new baidu.ui.datePicker.DatePicker();
			datePicker.popup = baidu.ui.datePicker.DatePicker.popup;
			datePicker.trigger = te.dom[0];
			datePicker.render();
			datePicker.show();
			check(datePicker, 'next');
			datePicker.currentWorkLayerName = 'month';
			check(datePicker, 'next');
			datePicker.currentWorkLayerName = 'year';
			check(datePicker, 'next');
			datePicker.currentWorkLayerName = 'multiyear';
			check(datePicker, 'next');
			datePicker.dispose();
			start();
		},100)
	})

	test('startPrev-stop', function() {
		stop();
		expect(3);
		setTimeout(function() {
			var datePicker = new baidu.ui.datePicker.DatePicker();
			datePicker.popup = baidu.ui.datePicker.DatePicker.popup;
			datePicker.trigger = te.dom[0];
			datePicker.render();
			datePicker.show();
			var date = new Date(2010, 08, 11);// Sep
			var month = date.getMonth();
			datePicker.currentDate = date;
			datePicker.startPrev();
			var count = 0;
			var handle = setInterval(function() {
				equal(datePicker.g('current').innerHTML, date.getFullYear() + '年0'
						+ (month - count) + '月', 'prev month');
				count++;
				if (count == 3) {
					clearInterval(handle);
					datePicker.stopPrev();
					start();
				}
			}, (datePicker.duration + datePicker.pauseTime + 1));
		},100);
	})

	test('startNext-stop', function() {
		stop();
		expect(3);
		setTimeout(function() {
			var datePicker = new baidu.ui.datePicker.DatePicker();
			var date = new Date();
			datePicker.popup = baidu.ui.datePicker.DatePicker.popup;
			datePicker.trigger = te.dom[0];
			datePicker.render();
			datePicker.show();
			var date = new Date(2010, 05, 11);
			var month = date.getMonth();
			datePicker.currentDate = new Date(2010, 05, 11);// Jun,11
			datePicker.startNext();
			var count = 0;
			var handle = setInterval(function() {
				equal(datePicker.g('current').innerHTML, date.getFullYear() + '年0'
						+ (month + count + 2) + '月', 'prev month');
				count++;
				if (count == 3) {
					clearInterval(handle);
					datePicker.stopNext();
					te.obj.push(datePicker);
					start();
				}
			}, (datePicker.duration + datePicker.pauseTime + 1));
		},100);
	})

	test('today', function() {
		stop();
		expect(4);
		setTimeout(function() {
			var date = new Date();
			var options = {
				onpick : function(opts) {//onpick
					equal(opts.target.getFullYear(), date.getFullYear());
					equal(opts.target.getMonth(), date.getMonth());
					equal(opts.target.getDate(), date.getDate());
				}
			};
			var datePicker = new baidu.ui.datePicker.DatePicker(options);
			datePicker.popup = baidu.ui.datePicker.DatePicker.popup;
			var input = te.dom[0];
			datePicker.trigger = input;
			datePicker.render();
			datePicker.show();
			datePicker.today();
			equal(input.value, date.getFullYear() + '-' + ((date.getMonth() + 1)/10<1?('0'+(date.getMonth() + 1)):(date.getMonth() + 1))
					+ '-' + ((date.getDate())>9?date.getDate():'0'+date.getDate()));
			start();
		},100);
	});

	test('mouse action', function() {
		stop();
		setTimeout(function() {
			var datePicker = new baidu.ui.datePicker.DatePicker();
			var input = te.dom[0];
			datePicker.trigger = input;
			datePicker.popup = baidu.ui.datePicker.DatePicker.popup;
			datePicker.render();
			datePicker.show();
			var date = new Date();
			// clickObj(datePicker.g('current'));
			$(datePicker.g('current')).click();
			equal(datePicker.g('current').innerHTML, date.getFullYear() + '年');
			if (!$.browser.msie) {
				var currentTd = getEleByClass('current', "td",
						datePicker.popup.document)[0];
				ua.mouseover(currentTd);
				equal(currentTd.className, ' current mover');
				ua.mouseout(currentTd);
				equal(currentTd.className, ' current');
			}
	
			// $(currentTd).mouseover();
			// equal(currentTd.className,' current mover');
	//		datePicker.popup.hide();
			te.obj.push(datePicker);
			start();
		},100);
	})

	test('options', function() {
		expect(9);
		stop();
		setTimeout(function() {
			var options = {
					format :"yy-MM-dd"
					,minDate : new Date(-1000000000000)
					,maxDate  : new Date(1000000000000)
					,duration :	300
					,appointedDate : new Date(2010,09,2)
					,dateList : [new Date(2010,09,1),new Date(2010,09,4)]
			}
			var dp = new baidu.ui.datePicker.DatePicker(options);
			var input = te.dom[0];
			dp.trigger = input;
			dp.popup = baidu.ui.datePicker.DatePicker.popup;
			dp.render();
			dp.show();
			equal(dp.appointedDate.getDate(),2,'set appointed date');
			equal(dp.duration,300,'check duration');
			equal(dp.minDate.getTime(),-1000000000000,'check minDate');
			equal(dp.maxDate.getTime(),1000000000000,'check minDate');
			equal(dp.appointedDate.getFullYear(),2010,'set appointed year');
			equal(dp.appointedDate.getMonth(),9,'set appointed month');
			var appointeds = getEleByClass('appointed','td',dp.popup.document);
			equal(appointeds.length,2,'get 2 appointed');
			equal(appointeds[0].innerHTML,'1','datelist 1');
			equal(appointeds[1].innerHTML,4,'datelist 4');
			dp.popup.hide();
			start()
		},300);
	})

})()
