module('baidu.ui.Combox.Combox$statable');

test('',function(){
	var options = {
			data :[ {
				content : 'a'
			}, {
				content : 'b'
			}, {
				content : 'c'
			} ]
		    };
		var div = document.body.appendChild(document.createElement("div"));
		var cb = new baidu.ui.Combox(options);
		cb.render(div);
		
		var input = cb.getInput();
		var arrow = cb.getArrow();
		$(input).attr("value", "a");
		var ie, ic;
		ie= baidu.event._listeners.length;
		//触发ondisable事件，有三个事件被撤销，且input是readonly的
		cb.dispatchEvent('ondisable');
	    ic = baidu.event._listeners.length;
		equals(ic, ie - 3, 'The events are disabled');
		ok($(input).attr("readonly"), "The input is readonly");
		
		//触发focus事件，没有监听函数
		$(input).focus();
		ok(!cb.menu.getBody(),  'The menu is not open');
		ok((cb.menu.data.length == 3), "The focus event of input is un");
		
		//触发keyup事件，没有监听函数，menu没有打开且里面的值没变
		var datalength = cb.menu.data.length;
		ua.keyup(input);
		ok(!cb.menu.getBody(),  'The menu is not open');
		ok((cb.menu.data.length == 3 && datalength == 3), "The keyup event of input is un");
		
		//触发click事件，没有监听函数，menu没有打开且里面的值没变
		cb.menu.data = [ {
			content : 'a'
		} ];
		datalength = cb.menu.data.length;
	    ua.click(arrow);
	    ok(!cb.menu.getBody(),  'The menu is not open PUBLICGE-369');
	    ok((cb.menu.data.length == 1 && datalength == 1), "The click event of arrow is un");
		cb.menu.data = [ {
			content : 'a'
		},{
			content : 'b'
		},{
			content : 'c'
		}];
		
		//触发ondisable事件，有三个事件被撤销，且input是readonly的
	    ie= baidu.event._listeners.length;
		cb.dispatchEvent('onenable');
	    ic = baidu.event._listeners.length;
		equals(ic, ie + 3, 'The events are enabled');
		ok(!$(input).attr("readonly"), "The input is not readonly");
		

		//触发focus事件，有监听函数
		$(input).blur();//因为上面focus过一次，所以必须先blur，接下来的focus事件才能触发
		input.value = "";
		datalength = cb.menu.data.length;
		$(input).focus();
		ok((cb.menu.data.length == 3 && datalength == 3), "The focus event of input is on");
		//触发keyup事件，有监听函数，menu里面的值被筛选
		datalength = cb.menu.data.length;
		input.value = "a";
		ua.keyup(input);
		ok((cb.menu.data.length == 1 && datalength == 3), "The keyup event of input is on");
		
		//触发click事件，有监听函数，menu里面的值又增加
		datalength = cb.menu.data.length;
	    ua.click(arrow);
	    ok((cb.menu.data.length == 3 && datalength == 1), "The click event of arrow is on");
	    cb.menu.dispose();
		cb.dispose();
});