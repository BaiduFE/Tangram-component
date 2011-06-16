module("baidu.ui.Dialog");

/**
 * <ul>
 * check method getTitle and getTitleInner
 * <li> check title element
 * <li> check title inner element
 * <li> check title inner element innerHTML
 */
test("get methods", function() {
	expect(6);
	stop();
	ua.importsrc("baidu.dom.getStyle", function(){
		var options = {
				titleText : "title",
				contentText : "content",
				modal : false
			};
			var d = new baidu.ui.Dialog(options), pre = 'tangram-dialog--' + d.guid;
			d.render();
			/* get title */
			equals(d.getTitle().id, pre + "-title", 'check title');
			/* get title inner */
			equals(d.getTitleInner().innerHTML, options.titleText, 'check title');
			/* get title inner */
			equals(d.getTitleInner().id, pre + "-title-inner", 'check title inner');
			/* get content */
			equals(d.getContent().innerHTML, options.contentText, 'check content');
			/* get content */
			equals(d.getContent().id, pre + "-content", 'check content');
			/* get footer */
			equals(d.getFooter().id, pre + "-footer", 'check footer');
			te.obj.push(d);
			start();
	});
});

/**
 * <li>check event onOpen, onUpdate, onBeforeClose, onClose
 * <li>check method open and close
 */
test("on", function() {
	var d, updated = false, options = {
		titleText : "title",
		contentText : "content",
		modal : false,
		onupdate : function() {
			ok(true, 'on update');
		},
		onopen : function() {
			ok(true, 'on open');
		},
		onbeforeclose : function() {
			ok(true, 'on before close');
		},
		onclose : function() {
			ok(true, 'on close');
		}
	};
	d = new baidu.ui.Dialog(options);
	d.render();
	element_dialog = document.getElementById("tangramDIALOG" + d.guid);
	ok(!isShown(element_dialog) && !d.isShown(), 'not shown default');
	d.open();
//	ok(isShown(element_dialog) && d.isShown(), 'shown after call open');
	d.close();
	ok(!isShown(element_dialog) && !d.isShown(), 'hide after call close');
	te.obj.push(d);
})

test('dispose', function() {
	var d, evtlist, updated = false, options = {
		titleText : "title",
		contentText : "content",
		modal : false
	}
	var ie = baidu.event._listeners.length;
	d = new baidu.ui.Dialog(options);
	d.render();
	var ia = baidu.event._listeners.length;
	d.close();
	/* dispose before close */
	d.dispose();
	var ic = baidu.event._listeners.length;
	equals(ic, ie, 'after dispose, event is un');
	ok(!isShown(d.getMain()), 'hide after dispose');
})

test('close on multi instance', function() {
	expect(8);
	var d1, d2, updated = false, options = {
		titleText : "title",
		contentText : "content",
		modal : false
	}
	d1 = new baidu.ui.Dialog(options);
	d1.render();
	d2 = new baidu.ui.Dialog(options);
	d2.render();
	d1.open();
	ok(isShown(d1.getMain()) && d1.isShown(), 'd1 shown after d1 open');
	ok(!isShown(d2.getMain()) && !d2.isShown(), 'd2 hide after d1 open');
	d2.open();
	ok(isShown(d1.getMain()) && d1.isShown(), 'd1 shown after d2 open');
	ok(isShown(d2.getMain()) && d2.isShown(), 'd2 shown after d2 open');
	d2.close();
	ok(isShown(d1.getMain()) && d1.isShown(), 'd1 shown after d2 close');
	ok(!isShown(d2.getMain()) && !d2.isShown(), 'd2 hide after d2 close');
	d1.close();
	ok(!isShown(d1.getMain()) && !d1.isShown(), 'd1 shown after d2 close');
	ok(!isShown(d2.getMain()) && !d2.isShown(), 'd2 hide after d2 close');
	testingElement.obj.push(d1);
	testingElement.obj.push(d2);
});

test('left&top',function(){
	var options = {
		left : '120px',
		top : 100,
		onopen : function(){
			equal(d.getMain().style.left,'120px');
			equal(d.getMain().style.top,'100px');
			equal(d.getMain().style.right,'','check right');
			equal(d.getMain().style.bottom,'','check bottom');
		}
	};
	var d = new baidu.ui.Dialog(options);
	//stop();
	d.render();
	d.open();
//	setTimeout(function(){
//		equal(d.getMain().style.left,'120px');
//		equal(d.getMain().style.top,'100px');
//		equal(d.getMain().style.right,'','check right');
//		equal(d.getMain().style.bottom,'','check bottom');
//		te.obj.push(d);
//		start();
//	},100);
	te.obj.push(d);
});

test('right&bottom',function(){
		var options = {
		bottom : '100px',
		right : 200,
		onopen : function(){
			equal(d.getMain().style.left,'auto');
			equal(d.getMain().style.top,'auto');
			equal(d.getMain().style.right,'200px','check right');
			equal(d.getMain().style.bottom,'100px','check bottom');
		}
	};
	var d = new baidu.ui.Dialog(options);
	d.render();
	d.open();
//	stop();
//	setTimeout(function(){
//		equal(d.getMain().style.left,'auto');
//		equal(d.getMain().style.top,'auto');
//		equal(d.getMain().style.right,'200px','check right');
//		equal(d.getMain().style.bottom,'100px','check bottom');
//		start();
//	},100);
    te.obj.push(d);
});
/**
 * 测试：Firefox下窗口高度是根据内容自适应还是默认高度2010-12-17
 */
test('default height',function(){
	var options = {
		height : 100,
		titleText : "title",
		contentText : "content",
		modal : false
	};
	var d = new baidu.ui.Dialog(options);
	d.render();
	equals(baidu.dom.getStyle(d.getContent(),'height'),d.height+'px');
});


test('test update',function(){
	expect(16);
	var d = new baidu.ui.Dialog();
	d.render();
	d.open();
	equals(d.getTitle().firstChild.innerHTML, '', 'The titleText is null when create a dialog with no options');
	equals(d.getContent().innerHTML, '', 'The contentText is null when create a dialog with no options');
	
	var options = {
	};
	d.update(options);
	equals(d.getTitle().firstChild.innerHTML, '', 'The titleText is null when update a dialog with no options');
	equals(d.getContent().innerHTML, '', 'The contentText is null when update a dialog with no options');
	
	var options = {
			titleText : 'initText',
			contentText : 'initText' 
	};
	d.update(options);
	equals(d.getTitle().firstChild.innerHTML, 'initText', 'The titleText is right when update');
	equals(d.getContent().innerHTML, 'initText', 'The contentText is right when update');
	
	var options = {
			titleText : 'myTitleText',
			contentText : 'myContentText' 
	};
	d.update(options);
	equals(d.getTitle().firstChild.innerHTML, 'myTitleText', 'The titleText is right when update');
	equals(d.getContent().innerHTML, 'myContentText', 'The contentText is right when update');
	
	var options = {
	};
	d.update(options);
	equals(d.getTitle().firstChild.innerHTML, 'myTitleText', 'The titleText is right when update');
	equals(d.getContent().innerHTML, 'myContentText', 'The contentText is right when update');
	
	var options = {
			titleText : '',
			contentText : '' 
	};
	d.update(options);
	equals(d.getTitle().firstChild.innerHTML, '', 'The titleText is right when update');
	equals(d.getContent().innerHTML, '', 'The contentText is right when update');
	
	var options = {
			titleText : 'myTitleText',
			contentText : 'myContentText' 
	};
	d.update(options);
	equals(d.getTitle().firstChild.innerHTML, 'myTitleText', 'The titleText is right when update');
	equals(d.getContent().innerHTML, 'myContentText', 'The contentText is right when update');
	
	var div = document.createElement('div');
	div.innerHTML = 'myContent';
	var options = {
			content : div
	};
	d.update(options);
	equals(d.getContent().firstChild.innerHTML, 'myContent', 'The content is right when update');
	
	var div2 = document.createElement('div');
	div2.innerHTML = 'myAnotherContent';
	var options = {
			content : div2
	};
	d.update(options);
	equals(d.getContent().firstChild.innerHTML, 'myAnotherContent', 'The content is right when update');
	
	te.obj.push(d);
});

test('test update without update()',function(){
	expect(12);
	var d = new baidu.ui.Dialog();
	d.render();
	d.open();
	equals(d.getTitle().firstChild.innerHTML, '', 'The titleText is null when create a dialog with no options');
	equals(d.getContent().innerHTML, '', 'The contentText is null when create a dialog with no options');
	
	d.titleText = 'initText';
	d.contentText = 'initText';
	d.update();
	equals(d.getTitle().firstChild.innerHTML, 'initText', 'The titleText is right when update');
	equals(d.getContent().innerHTML, 'initText', 'The contentText is right when update');
	
	d.titleText = 'myTitleText';
	d.contentText = 'myContentText'; 
	d.update();
	equals(d.getTitle().firstChild.innerHTML, 'myTitleText', 'The titleText is right when update');
	equals(d.getContent().innerHTML, 'myContentText', 'The contentText is right when update');

	d.titleText = '';
	d.contentText = '';
	d.update();
	equals(d.getTitle().firstChild.innerHTML, '', 'The titleText is right when update');
	equals(d.getContent().innerHTML, '', 'The contentText is right when update');
	
	d.titleText = 'myTitleText';
	d.contentText = 'myContentText'; 
	d.update();
	equals(d.getTitle().firstChild.innerHTML, 'myTitleText', 'The titleText is right when update');
	equals(d.getContent().innerHTML, 'myContentText', 'The contentText is right when update');
	
	var div = document.createElement('div');
	div.innerHTML = 'myContent';
	d.content = div;
	d.update();
	equals(d.getContent().firstChild.innerHTML, 'myContent', 'The content is right when update');
	
	div.innerHTML = 'myAnotherContent';
	d.content = div;
	d.update();
	equals(d.getContent().firstChild.innerHTML, 'myAnotherContent', 'The content is right when update');
	
	te.obj.push(d);
});


test('test update content and position',function(){
	expect();
	var div = document.createElement('div');
	div.innerHTML = 'myContent';
	var options = {
			left : 10,
			top  : 10,
			titleText : 'initText',
			content : div
	};
	var d = new baidu.ui.Dialog(options);
	d.render();
	d.open();
	equals(d.getTitle().firstChild.innerHTML, 'initText', 'The titleText is right when create a dialog');
	equals(d.getContent().firstChild.innerHTML, div.innerHTML, 'The content is right when create a dialog');
	equals(d.getMain().style.left, '10px', 'The left is right when create a dialog');
	equals(d.getMain().style.top, '10px', 'The top is right when create a dialog');
	
	var options = {
			left : 100,
			top  : 100,
			width : 100,
			height  : 100
	};
	d.update(options);
	equals(d.getTitle().firstChild.innerHTML, 'initText', 'The titleText is right when update');
	equals(d.getContent().firstChild.innerHTML ,div.innerHTML, 'The content is right when update');
	equals(d.getMain().style.left, '100px', 'The left is right when update');
	equals(d.getMain().style.top, '100px', 'The top is right when update');
	equals(d.getContent().offsetWidth, '100', 'The width is right when update');
	equals(d.getContent().offsetHeight, '100', 'The height is right when update');
	
	te.obj.push(d);
});

test('test update contextText and position',function(){
	expect(10);
	var div = document.createElement('div');
	div.innerHTML = 'myContent';
	var options = {
			left : 10,
			top  : 10,
			titleText : 'initText',
			contentText : 'initText'
	};
	var d = new baidu.ui.Dialog(options);
	d.render();
	d.open();
	equals(d.getTitle().firstChild.innerHTML, 'initText', 'The titleText is right when create a dialog');
	equals(d.getContent().innerHTML, 'initText', 'The content is right when create a dialog');
	equals(d.getMain().style.left, '10px', 'The left is right when create a dialog');
	equals(d.getMain().style.top, '10px', 'The top is right when create a dialog');
	
	var options = {
			left : 100,
			top  : 100,
			width : 100,
			height  : 100
	};
	d.update(options);
	equals(d.getTitle().firstChild.innerHTML, 'initText', 'The titleText is right when update');
	equals(d.getContent().innerHTML, 'initText', 'The content is right when update');
	equals(d.getMain().style.left, '100px', 'The left is right when update');
	equals(d.getMain().style.top, '100px', 'The top is right when update');
	equals(d.getContent().offsetWidth, '100', 'The width is right when update');
	equals(d.getContent().offsetHeight, '100', 'The height is right when update');
	
	te.obj.push(d);
});

test('test update contextText and content',function(){
	expect(16);
	var d = new baidu.ui.Dialog();
	d.render();
	d.open();
	equals(d.getContent().innerHTML, '', 'The content is right when create a dialog');
	
	var options = {
			contentText : 'initText'
	};
	d.update(options);
	equals(d.getContent().innerHTML, 'initText', 'The contentText is right when update');
	
	var div = document.createElement('div');
	div.innerHTML = 'myContent';
	var options = {
			content : div
	};
	d.update(options);
	equals(d.getContent().firstChild.innerHTML ,div.innerHTML, 'The content is right when update');
	
	var options = {
			contentText : 'initText'
	};
	d.update(options);
	equals(d.getContent().innerHTML, 'initText', 'The contentText is right when update');
	
	var options = {
			contentText : 'initText',
			content : div
	};
	d.update(options);
	equals(d.getContent().firstChild.innerHTML, div.innerHTML, 'The content is right when update');
	
	d.update();
	equals(d.getContent().firstChild.innerHTML, div.innerHTML, 'The content is right when update');
	
	var options = {
			contentText : 'initText',
			content : div
	};
	d.update(options);
	equals(d.getContent().firstChild.innerHTML, div.innerHTML, 'The content is right when update');
	
	var options = {
	};
	d.update(options);
	equals(d.getContent().firstChild.innerHTML, div.innerHTML, 'The content is right when update');
	
	var options = {
			contentText : 'initText',
			content : div
	};
	d.update(options);
	equals(d.getContent().firstChild.innerHTML, div.innerHTML, 'The content is right when update');
	
	var options = {
			content : div
	};
	d.update(options);
	equals(d.getContent().firstChild.innerHTML, div.innerHTML, 'The content is right when update');
	
	var options = {
			contentText : 'initText',
			content : div
	};
	d.update(options);
	equals(d.getContent().firstChild.innerHTML, div.innerHTML, 'The content is right when update');
	
	var options = {
			contentText : 'initText'
	};
	d.update(options);
	equals(d.getContent().innerHTML, 'initText', 'The content is right when update');
	
	var options = {
			contentText : 'initText',
			content : div
	};
	d.update(options);
	equals(d.getContent().firstChild.innerHTML, div.innerHTML, 'The content is right when update');
	
	var options = {
			contentText : ''
	};
	d.update(options);
	equals(d.getContent().innerHTML, '', 'The content is right when update');
	
	var options = {
			contentText : 'initText',
			content : div
	};
	d.update(options);
	equals(d.getContent().firstChild.innerHTML, div.innerHTML, 'The content is right when update');
	
	var options = {
			content : null,
			contentText : ''
	};
	d.update(options);
	equals(d.getContent().innerHTML, '', 'The content is right when update');
	
	te.obj.push(d);
});