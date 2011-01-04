(function() {
	// create element
	function mySetup() {
		/* div */
		var div = document.createElement('div');
		div.id = 'test_div';
		document.body.appendChild(div);
		te.dom.push(div);

		/* div - img */
		var div2 = document.createElement('div');
		div2.id = 'img_div';
		var img = document.createElement('img');
		img.id = 'img_id';
		img.src = (upath || '') + 'Coffee_Bean.bmp';
		div2.appendChild(img);
		document.body.appendChild(div2);
		$(img).css('position', 'absolute');
		te.dom.push(div2);

		te.obj.push( {
			check : function(d, i, max, info, _check, c) {
				var c = c || this.check;
				if (i == max) {
					start();
				} else {
					_check(i, max, info);

					setTimeout(function() {
						c(d, i + 1, max, info, _check, c);
					}, d / max);
				}
			}
		});
		/**
		 * 校验的对象方法，校验的运行方法 记录起始事件
		 */
		te.checkfx = te.checkfx
				|| {
					create : function(element, options) {
						stop();
						var me = this;
						me.element = element;
						me.options = options;
						me.starttime = new Date().getTime();
						return this;
					},
					checkbase : function() {
						var me = this;
						me.options.beforestart && me.options.beforestart();
						return me.options
								.method(me.element, me.options.options);
					},
					/**
					 * 校验时间点附近的期望值和实际值，时间点采用等分切割方式
					 * <li>getexpect : 方法，获取每个时间点期望值
					 * <li>getvalue : 方法，获取每个时间点实际值
					 * <li>timelinepoint : 整形，定制检查的时间点，默认4
					 * <li>threshold : 整形，期望值与实际值之间的运行误差，默认为5
					 */
					checktimeline : function(getexpect, getvalue,
							timelinepoint, threshold) {
						var me = this;
						var timelinepoint = timelinepoint || 4;
						var threshold = threshold === 0 ? 0
								: threshold ? threshold : 5;
						var actuallist = [];
						var c = me.checkbase();
						var timeline = function() {
							setTimeout(
									function() {
										actuallist[actuallist.length] = getvalue();
										if (new Date().getTime() < me.starttime
												+ c.duration) {
											timeline();
										} else {
											for ( var i = 0; i < actuallist.length; i++) {
												var a = actuallist[i];
												var e = getexpect(i + 1);/* 第一个抽样点不是0，而是1 */
												ok(
														Math.abs(a - e) < threshold,
														'检测抽样点数值' + i + ' : e['
																+ e + '] a['
																+ a + ']');
											}
											expect(timelinepoint);
											start();
										}
									}, c.duration / timelinepoint);
						};
						starttime = new Date().getTime();
						timeline();
					},
					/**
					 * 校验事件序列，默认仅判定是否事件被正确触发，特定事件需要额外校验通过evcallbacks传入
					 */
					checkevents : function(evcallbacks, expectchecked) {
						var me = this;
						var checkedlist = [];
						var checkevent = function(type) {
							return function() {
								/* 貌似显示过多，过滤一下重复的…… */
								if (checkedlist.join(" ").indexOf(type) == -1) {
									checkedlist.push(type);
									ok(true, '事件类型被触发 : ' + type);
								}
								if (evcallbacks && evcallbacks[type])
									evcallbacks[type]();
							};
						};
						var op = me.options.options = me.options.options || {};
						var eventlist = [ 'onbeforestart', 'onbeforeupdate',
								'onafterupdate', 'onafterfinish', 'oncancel' ];
						for ( var i in eventlist) {
							var evtype = eventlist[i];
							op[evtype] = checkevent(evtype);
						}
						if (typeof expectchecked != 'undefine')
							expect(expectchecked);
						me.checkbase();
					},
					/**
					 * 在时间线一半时撤销效果
					 */
					checkcancel : function(aftercancel) {
						var me = this;
						me.options.options = me.options.options || {};
						me.options.options.oncancel = function() {
							ok(true, 'fx is cancel');
							aftercancel && aftercancel();
							setTimeout(function() {
								ok(c.disposed, 'fx disposed after cancel');
								expect(2);
								start();
							}, 1);
						};
						var c = me.checkbase();
						setTimeout(function() {
							c.cancel();
						}, c.duration / 2);
					}
				};
	}

	// initial function
	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);
		mySetup();
	};
})();