module('baidu.ui.Dialog.Dialog$draggable');

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
	var di, dm, ds, de, dd, d = new baidu.ui.Dialog( {
	    
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
				ok(true, 'ondragend');
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
	var startX = parseInt($(dm).css('left')) || 0;
	var startY = parseInt($(dm).css('top')) || 0;
	UserAction.mousedown(di);
	function move(x, y){
	    setTimeout(function(){
	        if(x > 100){
	            UserAction.mouseup(di);
                equals(parseInt($(dm).css('left')), x + startX, 'left before drag');
                equals(parseInt($(dm).css('top')), y + startY, 'top before drag');
                d.close();
                te.obj.push(d);
                QUnit.start();
	        }else{
	            UserAction.mousemove(document, {
                    clientX : x + 10,
                    clientY : y + 5
                });
                move(x + 10, y + 5);
	        }
	    }, 16);
	}
	move(0, 0);
});