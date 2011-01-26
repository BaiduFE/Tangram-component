(function() {
//	UserAction.importsrc('baidu.ui.createUI');
	module("baidu.ui.behavior.draggable");
	/**
	 * Need draggable and create need time to load create.js and draggable.js
	 */

	/**
	 * 模拟组件的初始化流程,可用于测试行为
	 * 
	 * @param {}
	 *            instance
	 */
	function initializeUI(instance) {
		// 渲染main
		instance.renderMain();
		// instance.render();
		// 渲染body
		instance.getMain().innerHTML = '<div id="' + instance.getId()
				+ '"></div>';
		// 撑开body
		instance.getBody().innerHTML = '<div style="width:200px;height:200px;border:1px solid red;"></div>';
		// 发送onload事件
		instance.dispatchEvent("onload");
	}

	test("function test", function() {
		stop();
		/** need time to load create.js and draggable.js */
		UserAction.importsrc('baidu.ui.createUI', function() {
		setTimeout(function() {
			var DraggableUI = baidu.ui.createUI(new Function).extend( {
				draggable : true
			});
			var instance = new DraggableUI( {
				ondragstart : function() {
					equal(parseInt($(main).css('left')), 0, 'start left');
					equal(parseInt($(main).css('top')), 0, 'start top');
				},
				ondrag : function() {
					ok(true, 'drag');
				},
				ondragend : function() {
					setTimeout(function() {
						equal(parseInt($(main).css('left')), 20, 'stop left');
						equal(parseInt($(main).css('top')), 20, 'stop top');
						document.body.removeChild(main);
						start();
					}, 1);
				}
			});
			initializeUI(instance);
			var main = instance.getMain();
			$(main).css('top', '0px');
			$(main).css('left', '0px');
			instance.dragUpdate( {
				dragHandler : main
			});
			UserAction.mousemove(main, {
				clientX : 0,
				clientY : 0
			});

			UserAction.mousedown(main, {
				clientX : 0,
				clientY : 0
			});
			setTimeout(function() {
				UserAction.mousemove(main, {
					clientX : 20,
					clientY : 20
				});
			}, 50);
			setTimeout(function() {
				UserAction.mouseup(main);
			}, 100);
		}, 100);
		});
	});

	test('range', function() {
		stop();
		setTimeout(function() {
			var DraggableUI = baidu.ui.createUI(new Function).extend( {
				draggable : true
			});
			var instance = new DraggableUI( {
				ondragend : function() {
					setTimeout(function() {
						equal(parseInt($(main).css('left')), 48, 'stop left');
						equal(parseInt($(main).css('top')), 48, 'stop top');
						document.body.removeChild(main);
						start();
					}, 1);
				},
				dragRange : [ 250, 250, 250, 252 ]
			});
			
			initializeUI(instance);
			var main = instance.getMain();
			/* 应该被移除，初始化的时候应该就addEventListener onmouseodwn */
			instance.dragUpdate( {
				dragHandler : main
			});
			UserAction.mousemove(main, {
				clientX : 0,
				clientY : 0
			});

			UserAction.mousedown(main, {
				clientX : 0,
				clientY : 0
			});
			setTimeout(function() {
				UserAction.mousemove(main, {
					clientX : 50,
					clientY : 50
				});
			}, 50);
			setTimeout(function() {
				UserAction.mouseup(main);
			}, 100);
		})

	});
	
//	 test("no option", function() {
//	
//	 var DraggableUI = baidu.ui.create(new Function).extend( {
//	 draggable : true
//	 });
//	 // var DraggableUI = baidu.ui.create(new
//	 // Function,{superClass:'baidu.ui.bahavior.draggable'})
//	 var instance = new DraggableUI( {
//	 dropOptions : {
//	 ondrag : function() {
//	 ok(true, 'drop');
//	 },
//	 ondragstart : function() {
//	 ok(true, 'dragstart');
//	 },
//	 ondragend : function() {
//	 ok(true, 'dragend');
//	 }
//	 }
//	 });
//	 initializeUI(instance);
//	 // instance.dragUpdate({dragHandler : instance.getMain()});
//	 instance.dragUpdate();
//	 });
//	 start();
//	 }, 200);
})();
