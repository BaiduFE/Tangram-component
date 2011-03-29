module('baidu.ui.Menubar.Menubar$fx');

test(
		'Open a common Menubar(fadeIn) '
				+ 'and close a common Menubar(fadeOut)',
		function() {
			expect(6);
			stop();
			var check = function() {
				var options = {
					data : [ {
						content : 'm11'
					}, {
						content : 'm12'
					} ],
					target : testingElement.dom[0],
					showFx : baidu.fx.fadeIn,
					hideFx : baidu.fx.fadeOut,
					showFxOptions : {
						onbeforestart : function() {
							ok(true, 'The manubar fadeIn with '
									+ 'a custom onbeforestart function');
						},
						onafterfinish : function() {
							ok(true, 'The manubar fadeIn with '
									+ 'a custom onafterfinish function');
							var len = baidu.fx.current(menu.getBody()).length;
							equal(
									baidu.fx.current(menu.getBody())[len - 1]['_className'],
									'baidu.fx.fadeIn', 'The menubar fadeIn');
							menu.close();
						}
					},
					hideFxOptions : {
						onbeforestart : function() {
							ok(true, 'The manubar fadeOut with '
									+ 'a custom onbeforestart function');
						},
						onafterfinish : function() {
							ok(true, 'The manubar fadeOut with '
									+ 'a custom onafterfinish function');
							var len = baidu.fx.current(menu.getBody()).length;
							equal(
									baidu.fx.current(menu.getBody())[len - 1]['_className'],
									'baidu.fx.fadeOut', 'The menubar fadeOut');
							start();
						}
					}
				};
				var menu = new baidu.ui.Menubar(options);
				testingElement.obj.push(menu);
				menu.render(menu.target);
				menu.open();
			};
			ua.importsrc('baidu.fx.fadeIn,baidu.fx.fadeOut,baidu.fx.current',
					check, 'baidu.fx.fadeIn', 'baidu.ui.Menubar.Menubar$fx');
		});

test(
		'Open a common Menubar(expand) and'
				+ ' close a common Menubar(collapse)',
		function() {
			expect(2);
			stop();
			var check = function() {
				var options = {
					data : [ {
						content : 'm11'
					}, {
						content : 'm12'
					} ],
					target : te.dom[0],
					showFx : baidu.fx.expand,
					hideFx : baidu.fx.collapse
				};
				var menu = new baidu.ui.Menubar(options);
				testingElement.obj.push(menu);
				menu
						.addEventListener(
								'onopen',
								function() {
									var len = baidu.fx.current(menu.getBody()).length;
									var fx = baidu.fx.current(menu.getBody())[len - 1]['_className'];
									var guid = baidu.fx.current(menu.getBody())[len - 1]['guid'];
									ok(fx == 'baidu.fx.expand_collapse',
											'The menubar expand');
									menu.close();
								});
				menu
						.addEventListener(
								'beforeclose',
								function() {
									var len = baidu.fx.current(menu.getBody()).length;
									var fx = baidu.fx.current(menu.getBody())[len - 1]['_className'];
									var guid = baidu.fx.current(menu.getBody())[len - 1]['guid'];
									ok(
											(fx == 'baidu.fx.expand_collapse')
													&& guid != baidu.fx
															.current(menu
																	.getBody())[len - 1]['_guid'],
											'The menubar collapse');
									setTimeout(start, 500);
								});
				menu.render(menu.target);
				menu.open();
			};
			ua.importsrc('baidu.fx.current', check, 'baidu.fx.current',
					'baidu.ui.Menubar.Menubar$fx');
		});
