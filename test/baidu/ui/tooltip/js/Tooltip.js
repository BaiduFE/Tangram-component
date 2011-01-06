module('baidu.ui.tooltip.Tooltip');
test('target and type', function() {
	var div = testingElement.dom[0];
	var t = new baidu.ui.tooltip.Tooltip();
	t.render(div);
	equals(t.uiType, 'tooltip', 'check type');
	equals(t.targetId, div.id, 'check id');
});

test(
		'option attribute',
		function() {
			var step = 0, tp, t, div = testingElement.dom[0];
			div.style.position = 'absolute';
			div.style.left = '100px';
			div.style.height = '100px';
			div.style.top = '100px';
			var op = {
				width : 100,
				height : 100,
				content : 'test',
				single : true,
				zIndex : 1001,
				positionBy : 'element',
				onopen : function() {
					step++;
					tp = t.getMain();
					if (step == 1) {
						equals(t.width, op.width, 'check width');
						equals(parseInt(tp.style.width), op.width,
								'check dom width');
						equals(t.height, op.height, 'check height');
						equals(parseInt(tp.style.height), op.height,
								'check dom height');
						equals(t.single, op.single, 'check single');
						equals(t.zIndex, op.zIndex, 'check z index');
						equals(tp.style.zIndex, op.zIndex, 'check dom z index');
						equals(t.positionBy, op.positionBy, 'check position by');
						t.close();

						t.update( {
							positionBy : 'mouse'
						});
						t.open();
					} else if (step == 2) {
						equals(t.positionBy, 'mouse', 'check positionBy');
						t.close();
						start();
					}
				}
			};
			t = new baidu.ui.tooltip.Tooltip(op);
			t.render(div);
			t.open();
			stop();
		});

/**
 * "init","open","close","beforeopen","beforeclose"
 */
test('on', function() {
	var div = testingElement.dom[0], _step = 0;
	var handle = function(type, step) {
		return function(ev) {
			equals(ev.type, type, 'check event type');
			equals(_step++, step, 'check step');
		};
	};
	var tp = new baidu.ui.tooltip.Tooltip( {
		// oninit : handle('oninit', 0),
		onbeforeopen : handle('onbeforeopen', 1 - 1),
		onopen : handle('onopen', 2 - 1),
		onbeforeclose : handle('onbeforeclose', 3 - 1),
		onclose : handle('onclose', 4 - 1)
	});
	tp.render(div);
	tp.open();
	tp.close();
});
