(function() {
	module("baidu.ui.behavior.droppable");
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
		ua.importsrc('baidu.ui.createUI,baidu.dom.draggable', function() {
			var DraggableUI = baidu.ui.createUI(new Function).extend( {
				droppable : true
			});
			var instance = new DraggableUI( {
				ondrop : function() {
					equal(parseInt($(main).css('top')), 200,
							'ondrop of drop top');
					equal(parseInt($(main).css('left')), 100,
							'ondrop of drop left');
					equal(parseInt($(div_drag).css('left')), 208,
							'ondrop of drag left');
					equal(parseInt($(div_drag).css('top')), 208,
							'ondrop of drag top');

				},
				ondropover : function() {
					ok(true, 'drag over');
				},
				ondropout : function() {
					equal(parseInt($(div_drag).css('top')), 312,
							'ondropout of drag top');
					equal(parseInt($(div_drag).css('left')), 312,
							'ondropout of drag left');
				}
			});
			initializeUI(instance);
			var main = instance.getMain();
			$(main).css('top', '200px').css('left', '100px');
			var div_drag = te.dom[0];
			baidu.dom.draggable(div_drag);
			ua.mousemove(document, {
				clientX : 0,
				clientY : 0
			});
			ua.mousedown(div_drag, {
				clientX : 0,
				clientY : 0
			});

			var move = function(ele, x, y) {
				if (x > 300) {
					UserAction.mouseup(ele);
					setTimeout(function() {
						equal(parseInt($(ele).css('left')), 312,
								'mouseup check left');
						equal(parseInt($(ele).css('top')), 312,
								'mouseup check top');
						instance._theDroppable.cancel()
						document.body.removeChild(main);
						start();
					}, 60);

				} else {
					setTimeout(function(){
						UserAction.mousemove(document, {
							clientX : x + 52,
							clientY : y + 52
						});
					},30);

					setTimeout(function() {
						move(ele, x + 52, y + 52);
					}, 100);
				}
			};
			move(div_drag, 0, 0);
		});

	});

	test('drop outside', function() {
		/* 运行该用例的时候注意将鼠标移到当前客户端可视区域，如可以移到任务栏处 */

		stop();
//		ua.importsrc('baidu.ui.createUI,baidu.dom.draggable', function() {
			var options = {
				ondrop : function() {
					ok(false, 'ondrop should not be called');
				},
				ondropover : function() {
					ok(true, 'drag over');
				},
				ondropout : function() {
					equal(parseInt($(div_drag).css('top')), 260,
							'ondropout of drag top');
					equal(parseInt($(div_drag).css('left')), 260,
							'ondropout of drag left');
				}
			};
			var div_drag = te.dom[0];
			baidu.dom.draggable(div_drag);
			var DraggableUI = baidu.ui.createUI(new Function).extend( {
				droppable : true
			});
			var instance = new DraggableUI(options);
			initializeUI(instance);
			var main = instance.getMain();
			te.dom.push(main);
			ua.mousemove(document, {
				clientX : 0,
				clientY : 0
			});
			ua.mousedown(div_drag, {
				clientX : 0,
				clientY : 0
			});

			var move = function(ele, x, y) {
				if (x > 300) {
					UserAction.mouseup(ele, {
						clientX : $(ele).css('left'),
						clientY : $(ele).css('top')
					});
					setTimeout(function() {
						equal(parseInt($(ele).css('left')), 312,
								'mouseup check left');
						equal(parseInt($(ele).css('top')), 312,
								'mouseup check top');
						instance._theDroppable.cancel()
						start();
					}, 100);

				} else {
					UserAction.mousemove(document, {
						clientX : x + 52,
						clientY : y + 52
					});
					setTimeout(function() {
						move(ele, x + 52, y + 52);
					}, 100);
				}
			};
			move(div_drag, 0, 0);
//		});
	});
	
	test('update',function(){
		stop();
		expect(2);
//		ua.importsrc('baidu.ui.createUI,baidu.dom.draggable', function() {
			var div_drag = te.dom[0];
			baidu.dom.draggable(div_drag);
			var DraggableUI = baidu.ui.createUI(new Function).extend( {
				droppable : true
			});
			var instance = new DraggableUI();
			initializeUI(instance);
			var lis = baidu.dom.ddManager.__listeners;
			var options = {
				droppable : false
			};
			instance.dropUpdate(options);
			for(var index in lis['ondrag']){
				ok(false,'ondrag is not removed');
			}
			for(var index in lis['ondragend']){
				ok(false,'ondragend is not removed');
			}
			options = {
				droppable : true
			};
			instance.dropUpdate(options);
			lis = baidu.dom.ddManager.__listeners;
			for(var index in lis['ondrag']){
				ok(lis['ondrag'][index],'ondrag added');
			}
			for(var index in lis['ondragend']){
				ok(lis['ondragend'][index],'ondrag added');
			}
			te.dom.push(instance.getMain());
			start();
//		});
	});

})();