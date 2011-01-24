module('baidu.ui.popup.Popup$draggable');

var drag = function(ele,x,y){
	UserAction.mousemove(ele);
	UserAction.mousedown(ele, {
		clientX : 0,
		clientY : 0
	});

	setTimeout(function(){
		UserAction.mousemove(document,{clientX:x,clientY:y});
	},60);
	setTimeout(function(){
		UserAction.mouseup(ele);
	},80);
};

test('draggable', function() {
	stop();
	/*因为延时问题，ondrag被调用的次数不太好确定下来*/
//	expect(4);
	var options = {
		top : '0px',
		left : '0px',
		draggable : true,
		modal : false,
		ondragstart : function() {
			ok(true, 'start to drag');
		},
		ondrag : function() {
			ok(true,'be dragged');
		},
		ondragend : function() {
			equal($(this.getMain()).css('top'), '40px', 'get final top');
			equal($(this.getMain()).css('left'), '30px', 'get final lfet');
			start();
		}
	};
	var popup = new baidu.ui.popup.Popup(options);
	te.obj.push(popup);
	popup.render();
	popup.open();
	drag(popup.getBody(),30,40);
	popup.close();
});


test('ondispose', function() {
	stop();
	expect(2);
	var options = {
		draggable : true,
		modal : false,
		ondragend : function() {
			ok(true,'drag finish');
			start();
		}
	};
	var popup = new baidu.ui.popup.Popup(options);
	te.obj.push(popup);
	popup.render();
	popup.open();
	UserAction.mousemove(popup.getBody(), {
		clientX : 0,
		clientY : 0
	});
	UserAction.mousedown(popup.getBody(), {
		clientX : 0,
		clientY : 0
	});

	setTimeout(function(){
		UserAction.mousemove(document,{clientX:30,clientY:40});
	},20);
	setTimeout(function(){
		UserAction.mouseup(popup.getBody());
		var length = baidu.event._listeners.length;
		popup.dispose();
		equal(length,baidu.event._listeners.length+1,'unload onresize event');
	},40);
	popup.close();
});

test('range', function() {
	stop();
	expect(2);
	var options = {
		draggable : true,
		modal : false,
		ondragend : function() {
		/*拖动范围受限于页面大小*/
		equal(parseInt($(this.getMain()).css('top')), maxHeight, 'get final top');
		equal(parseInt($(this.getMain()).css('left')), maxWidth, 'get final lfet');
			start();
		}
	};
	var maxWidth = baidu.page.getWidth();
	var maxHeight = baidu.page.getHeight();
	var popup = new baidu.ui.popup.Popup(options);
	te.obj.push(popup);
	popup.render();
	popup.open();
	setTimeout(function(){//等page加载完成
		drag(popup.getBody(),baidu.page.getWidth()+10,baidu.page.getHeight()+20);//拖动范围受限于页面大小
	},20);
	
	popup.close();
});