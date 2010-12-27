module('baidu.ui.dialog.Dialog$draggable');

/**
 * <ul>
 * check dragable
 * <li> open
 * <li> drag
 * <li> check position
 */
test("Draggable", function() {
	stop();
	expect(5);
	var di, dm, ds, de, dd, d = new baidu.ui.dialog.Dialog( {
		titleText : "title",
		contentText : "content",
		ondragstart : function() {
			if (!ds) {
				ds = true;
				ok(true, 'ondragstart');
			}
		},
		ondragend : function() {
			if (!de) {
				de = true;
				ok(true, 'ondragstart');
			}
		},
		ondrag : function() {
			if (!dd) {
				dd = true;
				ok(true, 'ondrag');
			}
		},
		modal : false
	});
	d.render();
	dm = d.getMain();
	di = d.getTitle();
	di.style.border = 'solid';
	d.open();

	/* need move mouse before testing */
	UserAction.mousemove(document, {
		clientX : 0,
		clientY : 0
	});
	var startX = parseInt($(dm).css('left'))||0;
	var startY = parseInt($(dm).css('top'))||0;
	UserAction.mousedown(di);

	var move = function(x, y) {
		if (x > 100) {
			UserAction.mouseup(document);
			setTimeout(function() {
//				console.log(x + ' - ' + startX);
				equals(parseInt($(dm).css('left')), 110 + startX, 'left before drag');
				equals(parseInt($(dm).css('top')), 55 + startY, 'top before drag');
				d.close();
				te.obj.push(d);
				QUnit.start();
			}, 200);
		} else {
			UserAction.mousemove(document, {
				clientX : x + 10,
				clientY : y + 5
			});
			setTimeout(function() {
				move(x + 10, y + 5);
			}, 21);
		}
	};
	move(10, 5);
});