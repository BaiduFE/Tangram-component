module('baidu.ui.Dialog.Dialog$coverable');

test('onopen, hide select,transparent smartCover',function(){
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
				width : 200,
				height :200
			};
		var d = new baidu.ui.Dialog(options);
		d.render();
		d.padding = d.border = d.margin = 0;
		d.open();
		ok(!d.getMain().firstChild.firstChild.style['backgroundColor'],'The iframe is transparent');
		equals(d.getMain().firstChild.firstChild.style['zIndex'], '-1', 'The z-index of the iframe is -1')
		ok(Math.abs(d.getMain().firstChild.firstChild.offsetWidth - d.getBody().offsetWidth) < 5, 'The width of the iframe is right');
		ok(Math.abs(d.getMain().firstChild.firstChild.offsetHeight - d.getBody().offsetHeight * 0.97) < 5, 'The Height of the iframe is right');
		te.obj.push(d);
		document.body.removeChild(select_a);
		document.body.removeChild(select_b);
		start();
	};
	ua.importsrc('baidu.dom.setPosition', 
			check ,'baidu.dom.setPosition', 'baidu.ui.Dialog.Dialog$coverable');
});

test('onopen, hide select,transparent smartCover, red dialog',function(){
	expect(5);
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
			width : 200,
			height :200
		};
	var d = new baidu.ui.Dialog(options);
	d.render();
	$(d.getMain()).css('backgroundColor', "red");
	d.open();
	ok(!d.getMain().firstChild.firstChild.style['backgroundColor'],'The iframe is transparent');
	ok(d.getMain().style['backgroundColor'] == 'red' || d.getMain().style['backgroundColor'] == '#ff0000', 'The table is red');
	equals(d.getMain().firstChild.firstChild.style['zIndex'], '-1', 'The z-index of the iframe is -1')
	ok(Math.abs(d.getMain().firstChild.firstChild.offsetWidth - d.getBody().offsetWidth) < 5, 'The width of the iframe is right');
	ok(Math.abs(d.getMain().firstChild.firstChild.offsetHeight - d.getBody().offsetHeight * 0.97) < 5, 'The Height of the iframe is right');
	te.obj.push(d);
	document.body.removeChild(select_a);
	document.body.removeChild(select_b);
});

test('onopen, hide select,white smartCover',function(){
	expect(4);
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
			width : 200,
			height :200,
			coverableOptions : {
				color : 'white'
			}
		};
	if(baidu.browser.ie){
		baidu.extend(options, {
			coverableOptions : {
				color : 'white',
				opacity : 100
			}
		});
	}
	var d = new baidu.ui.Dialog(options);
	d.render();
	d.open();
	ok(d.getMain().firstChild.firstChild.style['backgroundColor'] == 'white' || d.getMain().firstChild.firstChild.style['backgroundColor'] == '#ffffff', 'The iframe is not transparent PUBLICGE-375');
	equals(d.getMain().firstChild.firstChild.style['zIndex'], '-1', 'The z-index of the iframe is -1')
	ok(Math.abs(d.getMain().firstChild.firstChild.offsetWidth - d.getBody().offsetWidth) < 5, 'The width of the iframe is right');
	ok(Math.abs(d.getMain().firstChild.firstChild.offsetHeight - d.getBody().offsetHeight * 0.97) < 5, 'The Height of the iframe is right');
	te.obj.push(d);
	document.body.removeChild(select_a);
	document.body.removeChild(select_b);
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
	var d = new baidu.ui.Dialog(options);
	d.render();
	d.open();
	d.close();
	equals(d.getMain().firstChild.firstChild.style.display, 'none', 'The style.display of the iframe is none');
	ok(!isShown(d.getMain().firstChild.firstChild) ,'The iframe is hidden');
	te.obj.push(d);
	document.body.removeChild(select_a);
});

test('onopen, hide flash, transparent smartCover',function(){
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
		var d = new baidu.ui.Dialog(options);
		d.render();
		var div = document.createElement('div');
		div.id = 'flashContainer1';
		document.body.appendChild(div);
		baidu.swf.create({
            id: "flash1",
            url: upath + 'flash/test_flash.swf',
            width:695,
            height:90,
            wmode:'window'
        }, "flashContainer1");
		var div2 = document.createElement('div');
		div2.id = 'flashContainer2';
		document.body.appendChild(div2);
		baidu.swf.create({
            id: "flash1",
            url: upath + 'flash/test_flash.swf',
            width:695,
            height:90,
            wmode:'transparent'
        }, "flashContainer2");
		d.open();
		ok(!d.getMain().firstChild.firstChild.style['backgroundColor'],'The iframe is transparent');
		equals(d.getMain().firstChild.firstChild.style['zIndex'], '-1', 'The z-index of the iframe is -1')
		ok(Math.abs(d.getMain().firstChild.firstChild.offsetWidth - d.getBody().offsetWidth) < 5, 'The width of the iframe is right');
		ok(Math.abs(d.getMain().firstChild.firstChild.offsetHeight - d.getBody().offsetHeight * 0.97) < 5, 'The Height of the iframe is right');
		te.obj.push(d);
		document.body.removeChild(div);
		document.body.removeChild(div2);
		start();
	};
	ua.importsrc('baidu.swf.create', 
			check ,'baidu.swf.create', 'baidu.ui.Dialog.Dialog$coverable');
});

test('onopen, hide flash, transparent smartCover, red dialog',function(){
	expect(5);
	var options = {
			titleText : "title",
			contentText : "content",
			top : '50',
			left : '50',
			width : 300,
			height :300
		};
	var d = new baidu.ui.Dialog(options);
	d.render();
	$(d.getMain()).css('backgroundColor', "red");
	var div = document.createElement('div');
	div.id = 'flashContainer1';
	document.body.appendChild(div);
	baidu.swf.create({
        id: "flash1",
        url: upath + 'flash/test_flash.swf',
        width:695,
        height:90,
        wmode:'window'
    }, "flashContainer1");
	var div2 = document.createElement('div');
	div2.id = 'flashContainer2';
	document.body.appendChild(div2);
	baidu.swf.create({
        id: "flash1",
        url: upath + 'flash/test_flash.swf',
        width:695,
        height:90,
        wmode:'transparent'
    }, "flashContainer2");
	d.open();
	ok(!d.getMain().firstChild.firstChild.style['backgroundColor'],'The iframe is transparent');
	ok(d.getMain().style['backgroundColor'] == 'red' || d.getMain().style['backgroundColor'] == '#ff0000', 'The table is red');
	equals(d.getMain().firstChild.firstChild.style['zIndex'], '-1', 'The z-index of the iframe is -1')
	ok(Math.abs(d.getMain().firstChild.firstChild.offsetWidth - d.getBody().offsetWidth) < 5, 'The width of the iframe is right');
	ok(Math.abs(d.getMain().firstChild.firstChild.offsetHeight - d.getBody().offsetHeight * 0.97) < 5, 'The Height of the iframe is right');
	te.obj.push(d);
	document.body.removeChild(div);
	document.body.removeChild(div2);
});

test('onopen, hide flash, white smartCover',function(){
	expect(4);
	var options = {
			titleText : "title",
			contentText : "content",
			top : '50',
			left : '50',
			width : 300,
			height :300,
			coverableOptions : {
				color : 'white'
			}
		};
	if(baidu.browser.ie){
		baidu.extend(options, {
			coverableOptions : {
				color : 'white',
				opacity : 100
			}
		});
	}
	var d = new baidu.ui.Dialog(options);
	d.render();
	var div = document.createElement('div');
	div.id = 'flashContainer1';
	document.body.appendChild(div);
	baidu.swf.create({
        id: "flash1",
        url: upath + 'flash/test_flash.swf',
        width:695,
        height:90,
        wmode:'window'
    }, "flashContainer1");
	var div2 = document.createElement('div');
	div2.id = 'flashContainer2';
	document.body.appendChild(div2);
	baidu.swf.create({
        id: "flash1",
        url: upath + 'flash/test_flash.swf',
        width:695,
        height:90,
        wmode:'transparent'
    }, "flashContainer2");
	d.open();
	ok(d.getMain().firstChild.firstChild.style['backgroundColor'],'The iframe is not transparent');
	equals(d.getMain().firstChild.firstChild.style['zIndex'], '-1', 'The z-index of the iframe is -1')
	ok(Math.abs(d.getMain().firstChild.firstChild.offsetWidth - d.getBody().offsetWidth) < 5, 'The width of the iframe is right');
	ok(Math.abs(d.getMain().firstChild.firstChild.offsetHeight - d.getBody().offsetHeight * 0.97) < 5, 'The Height of the iframe is right');
	te.obj.push(d);
	document.body.removeChild(div);
	document.body.removeChild(div2);
});

test('close, hide flash',function(){
	expect(2);
	var options = {
			titleText : "title",
			contentText : "content",
			top : '50',
			left : '50',
			width : 300,
			height :300
		};
	var d = new baidu.ui.Dialog(options);
	d.render();
	var div = document.createElement('div');
	div.id = 'flashContainer1';
	document.body.appendChild(div);
	baidu.swf.create({
        id: "flash1",
        url: upath + 'flash/test_flash.swf',
        width:695,
        height:90,
        wmode:'window'
    }, "flashContainer1");
	d.open();
	d.close();
	equals(d.getMain().firstChild.firstChild.style.display, 'none', 'The style.display of the iframe is none');
	ok(!isShown(d.getMain().firstChild.firstChild) ,'The iframe is hidden');
	te.obj.push(d);
	document.body.removeChild(div);
});

test('onupdate, hide select',function(){
	expect(12);
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
				top : 50,
				left : 50,
				width : 200,
				height :200
			};
		var d = new baidu.ui.Dialog(options);
		d.render();
		d.open();
		ok(!d.getMain().firstChild.firstChild.style['backgroundColor'],'The iframe is transparent');
		equals(d.getMain().firstChild.firstChild.style['zIndex'], '-1', 'The z-index of the iframe is -1')
		ok(Math.abs(d.getMain().firstChild.firstChild.offsetWidth - d.getBody().offsetWidth) < 5, 'The width of the iframe is right');
		ok(Math.abs(d.getMain().firstChild.firstChild.offsetHeight - d.getBody().offsetHeight * 0.97) < 5, 'The Height of the iframe is right');
		equals(baidu.dom.getPosition(d.getMain().firstChild.firstChild).top + 'px', d.getMain().style.top, 'The top of the iframe is right');
		equals(baidu.dom.getPosition(d.getMain().firstChild.firstChild).left+ 'px', d.getMain().style.left, 'The left of the iframe is right');
		var options_update = {
				top : 100,
				left : 100,
				width : 400,
				height :400
			};
		d.update(options_update);
		ok(!d.getMain().firstChild.firstChild.style['backgroundColor'],'The iframe is transparent');
		equals(d.getMain().firstChild.firstChild.style['zIndex'], '-1', 'The z-index of the iframe is -1')
		equals(d.getMain().firstChild.firstChild.style.width, d.getBody().style.width, 'The width of the iframe is right');
		equals(d.getMain().firstChild.firstChild.offsetHeight , Math.round(d.getBody().offsetHeight * 0.97), 'The Height of the iframe is right');
		equals(baidu.dom.getPosition(d.getMain().firstChild.firstChild).top + 'px', d.getMain().style.top, 'The top of the iframe is right');
		equals(baidu.dom.getPosition(d.getMain().firstChild.firstChild).left+ 'px', d.getMain().style.left, 'The left of the iframe is right');
		te.obj.push(d);
		document.body.removeChild(select_a);
		document.body.removeChild(select_b);
		start();
	};
	ua.importsrc('baidu.dom.getPosition', 
			check ,'baidu.dom.getPosition', 'baidu.ui.Dialog.Dialog$coverable');
});