module("baidu.ui.Button.Button$poll");

test("Timer is undefined and duration is 250", function() {
	var div_test = te.dom[0];
	var num = 0;
	var options = {
		content : "按钮",
		poll : true,
		onmousedown : function(){
			num++;
		}
	};
	var button = new baidu.ui.Button(options);
	ok(!!button.__listeners['onmousedown'], 'The mousedown event is on');
	button.render(div_test.id);
	ua.mousedown(button.getBody());
	stop();
	setTimeout(function(){
		ua.mouseup(button.getBody());
		equal(num, 3, 'Dispatch mousedown event 3 times');	
		start();
	}, 250);
	te.obj.push(button);
});

test("Timer is 4 and duration is 250", function() {
	var div_test = te.dom[0];
	var num = 0;
	var options = {
		content : "按钮",
		poll : {time : 4},
		onmousedown : function(){
			num++;
		}
	};
	var button = new baidu.ui.Button(options);
	ok(!!button.__listeners['onmousedown'], 'The mousedown event is on');
	button.render(div_test.id);
	ua.mousedown(button.getBody());
	stop();
	setTimeout(function(){
		ua.mouseup(button.getBody());
		equal(num, 1, 'Dispatch mousedown event once');
		start();
	}, 250);
	te.obj.push(button);
});

test("Timer is 4 and duration is 650", function() {
	var div_test = te.dom[0];
	var num = 0;
	var options = {
		content : "按钮",
		poll : {time : 4},
		onmousedown : function(){
			num++;
		}
	};
	var button = new baidu.ui.Button(options);
	ok(!!button.__listeners['onmousedown'], 'The mousedown event is on');
	button.render(div_test.id);
	ua.mousedown(button.getBody());
	stop();
	setTimeout(function(){
		ua.mouseup(button.getBody());
		//TODO
		equal(num, 3, 'Dispatch mousedown event 3 times' +
				'（注意：在IE下可能得不到正确结果，原因为如果mousedown的时间拉得太长（如1650），会导致计算不精确）');
		start();
	}, 650);
	te.obj.push(button);
});

test("Test when the button disposed, whether the poll event is canceled", function() {
	var div_test = te.dom[0];
	var options = {
		content : "按钮",
		poll : true
	};
	var button = new baidu.ui.Button(options);
	button.render(div_test.id);
	ua.mousedown(button.getBody());
	stop();
	setTimeout(function(){
		ua.mouseup(button.getBody());
		button.dispose();
		start();
		equals(button.poll, undefined, 'The poll event is canceled PUBLICGE-338');
	}, 250);
});