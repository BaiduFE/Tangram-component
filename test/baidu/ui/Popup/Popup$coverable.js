module('baidu.ui.Popup.Popup$coverable');

test('onopen, hide select',function(){
	expect(4);
	stop();
	var check = function(){
		var select_a = document.createElement('select');
		select_a.options[select_a.options.length] = new Option('content_a', 'value_a');
		select_a.style.position = 'absolute';
		document.body.appendChild(select_a);
		baidu.dom.setPosition(select_a, {left: 100, top : 200});
		var select_b = document.createElement('select');
		select_b.options[select_b.options.length] = new Option('content_a', 'value_a');
		select_b.style.position = 'absolute';
		document.body.appendChild(select_b);
		baidu.dom.setPosition(select_b, {left: 300, top : 600});
		var options = {
				titleText : "title",
				contentText : "content",
				top : '50',
				left : '50',
				width : '200px',
				height :'200px'
			};
		var popup = new baidu.ui.Popup(options);
		popup.render();
		popup.open();
		ok(popup.getMain().firstChild.firstChild.style['backgroundColor'],'The iframe is not transparent PUBLICGE-375');
		equals(popup.getMain().firstChild.firstChild.style['zIndex'], '-1', 'The z-index of the iframe is -1')
		equals(popup.getMain().firstChild.firstChild.style.width, popup.getMain().style.width, 'The width of the iframe is right');
		equals(popup.getMain().firstChild.firstChild.style.height, popup.getMain().style.height, 'The Height of the iframe is right');
		te.obj.push(popup);
		document.body.removeChild(select_a);
		document.body.removeChild(select_b);
		start();
	};
	ua.importsrc('baidu.dom.setPosition', 
			check ,'baidu.dom.setPosition', 'baidu.ui.Popup.Popup$coverable');
});

test('close, show select',function(){
	expect(2);
	var select_a = document.createElement('select');
	select_a.options[select_a.options.length] = new Option('content_a', 'value_a');
	select_a.style.position = 'absolute';
	document.body.appendChild(select_a);
	baidu.dom.setPosition(select_a, {left: 100, top : 200});
	var options = {
			titleText : "title",
			contentText : "content",
			top : '50',
			left : '50',
			width : 200,
			height :200
		};
	var popup = new baidu.ui.Popup(options);
	popup.render();
	popup.open();
	popup.close();
	equals(popup.getMain().firstChild.firstChild.style.display, 'none', 'The style.display of the iframe is none');
	ok(!isShown(popup.getMain().firstChild.firstChild) ,'The iframe is hidden');
	te.obj.push(popup);
	document.body.removeChild(select_a);
});

test('onopen, hide flash',function(){
	expect(4);
	stop();
	var check = function(){
		var options = {
				titleText : "title",
				contentText : "content",
				top : '50',
				left : '50',
				width : 300,
				height :300
			};
		var popup = new baidu.ui.Popup(options);
		popup.render();
		var div = document.createElement('div');
		div.id = 'flashContainer1';
		document.body.appendChild(div);
		baidu.swf.create({
            id: "flash1",
            url: "http://drmcmm.baidu.com/media/id=nHcdrHRdP1m&gp=402&time=nHc4PjmzP16vn0.swf",
            width:695,
            height:90,
            wmode:'window'
        }, "flashContainer1");
		popup.open();
		ok(popup.getMain().firstChild.firstChild.style['backgroundColor'],'The iframe is not transparent PUBLICGE-375');
		equals(popup.getMain().firstChild.firstChild.style['zIndex'], '-1', 'The z-index of the iframe is -1')
		equals(popup.getMain().firstChild.firstChild.style.width, popup.getMain().style.width, 'The width of the iframe is right');
		equals(popup.getMain().firstChild.firstChild.style.height, popup.getMain().style.height, 'The Height of the iframe is right');
		te.obj.push(popup);
		document.body.removeChild(div);
		start();
	};
	ua.importsrc('baidu.swf.create', 
			check ,'baidu.swf.create', 'baidu.ui.Dialog.Dialog$coverable');
});

test('close, hide flash',function(){
	expect(2);
	stop();
	var check = function(){
		var options = {
				titleText : "title",
				contentText : "content",
				top : '50',
				left : '50',
				width : 300,
				height :300
			};
		var popup = new baidu.ui.Popup(options);
		popup.render();
		var div = document.createElement('div');
		div.id = 'flashContainer1';
		document.body.appendChild(div);
		baidu.swf.create({
            id: "flash1",
            url: "http://drmcmm.baidu.com/media/id=nHcdrHRdP1m&gp=402&time=nHc4PjmzP16vn0.swf",
            width:695,
            height:90,
            wmode:'window'
        }, "flashContainer1");
		popup.open();
		popup.close();
		equals(popup.getMain().firstChild.firstChild.style.display, 'none', 'The style.display of the iframe is none');
		ok(!isShown(popup.getMain().firstChild.firstChild) ,'The iframe is hidden');
		te.obj.push(popup);
		document.body.removeChild(div);
		start();
	};
	ua.importsrc('baidu.swf.create', 
			check ,'baidu.swf.create', 'baidu.ui.Dialog.Dialog$coverable');
});

test('onupdate, hide select',function(){
	expect(8);
	stop();
	var check = function(){
		var select_a = document.createElement('select');
		select_a.options[select_a.options.length] = new Option('content_a', 'value_a');
		select_a.style.position = 'absolute';
		document.body.appendChild(select_a);
		baidu.dom.setPosition(select_a, {left: 100, top : 200});
		var select_b = document.createElement('select');
		select_b.options[select_b.options.length] = new Option('content_a', 'value_a');
		select_b.style.position = 'absolute';
		document.body.appendChild(select_b);
		baidu.dom.setPosition(select_b, {left: 200, top : 400});
		var options = {
				titleText : "title",
				contentText : "content",
				top : '50',
				left : '50',
				width : 200,
				height :200
			};
		var popup = new baidu.ui.Popup(options);
		popup.render();
		popup.open();
		ok(popup.getMain().firstChild.firstChild.style['backgroundColor'],'The iframe is not transparent PUBLICGE-375');
		equals(popup.getMain().firstChild.firstChild.style['zIndex'], '-1', 'The z-index of the iframe is -1')
		equals(popup.getMain().firstChild.firstChild.style.width, popup.getMain().style.width, 'The width of the iframe is right');
		equals(popup.getMain().firstChild.firstChild.style.height, popup.getMain().style.height, 'The Height of the iframe is right');
		var options_update = {
				width : '400px',
				height :'400px'
			};
		popup.update(options_update);
		ok(popup.getMain().firstChild.firstChild.style['backgroundColor'],'The iframe is not transparent PUBLICGE-375');
		equals(popup.getMain().firstChild.firstChild.style['zIndex'], '-1', 'The z-index of the iframe is -1')
		equals(popup.getMain().firstChild.firstChild.style.width, popup.getMain().style.width, 'The width of the iframe is right');
		equals(popup.getMain().firstChild.firstChild.style.height, popup.getMain().style.height, 'The Height of the iframe is right');
		te.obj.push(popup);
		document.body.removeChild(select_a);
		document.body.removeChild(select_b);
		start();
	};
	ua.importsrc('baidu.dom.setPosition', 
			check ,'baidu.dom.setPosition', 'baidu.ui.Dialog.Dialog$coverable');
});