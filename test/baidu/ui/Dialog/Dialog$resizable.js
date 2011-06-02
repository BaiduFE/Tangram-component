module("baidu.ui.Dialog.Dialog$resizable");

test("Test the 3 new elements : s, e, se", function() {
	expect(6);
	var d, options = {
			titleText : "title",
			contentText : "content",
			modal : false
		};
	d = new baidu.ui.Dialog(options);
	d.render();

	equals(d.getMain().childNodes.length, 4, '默认添加了三个子元素，用于实现拖拽');
	var s = d.getMain().childNodes[1], e = d.getMain().childNodes[2], se = d.getMain().childNodes[3];
	ok($(s).css("width") == '100%' || s.style.width == d.getBody().offsetWidth + 'px',
			"元素s宽度与目标元素一致");
	equals($(s).css("cursor"), "s-resize", "校验cursor");
	ok($(e).css("height") == '100%' || e.style.height == d.getBody().offsetHeight + 'px',
			"元素e高度与目标元素一致");
	equals($(e).css("cursor"), "e-resize", "校验cursor");
	equals($(se).css("cursor"), "se-resize", "校验se元素cursor");

	d.close();
	d.dispose();
});

test("drag s", function() {
	expect(6);
	var d, options = {
			titleText : "title",
			contentText : "content",
			modal : false
		};
	d = new baidu.ui.Dialog(options);
	d.render();
	d.open();
	$(d.getMain()).css('backgroundColor', "red");
	stop();

	bodyWidth = d.getBody().offsetWidth;
	bodyHeight = d.getBody().offsetHeight;
	contentWidth = d.getContent().offsetWidth;
	contentHeight = d.getContent().offsetHeight;
	
	ua.mousemove(document.body, {
		clientX : bodyWidth,
		clientY : bodyHeight
	});

	var ehandle = d.getMain().childNodes[1];
	setTimeout(function() {
		ua.mousedown(ehandle, {
			clientX : bodyWidth,
			clientY : bodyHeight
		});
		setTimeout(function() {
			ua.mousemove(ehandle, {
				clientX : bodyWidth,
				clientY : bodyHeight + 100
			});
			setTimeout(function() {				
				ua.mouseup(ehandle);
//				setTimeout(function(){
					equals(parseInt(d.getBody().offsetWidth), bodyWidth, "s拖动后，body宽度不变");
					equals(parseInt(d.getContent().offsetWidth), contentWidth, "s拖动后，content宽度不变");
					equals(parseInt(d.width), contentWidth, "s拖动后，d的宽度不变");
					equals(parseInt(d.getBody().offsetHeight), bodyHeight + 100, "s拖动后，body高度变化");
					equals(parseInt(d.getContent().offsetHeight), contentHeight + 100, "s拖动后，content高度变化");
					equals(parseInt(d.height), contentHeight + 100, "s拖动后，d的高度变化");
					d.close();
					d.dispose();
					start();				
//				}, 30);
			}, 30);
		}, 30);
	}, 30);
});

test("drag e", function() {
	expect(6);
	var d, options = {
			titleText : "title",
			contentText : "content",
			modal : false
		};
	d = new baidu.ui.Dialog(options);
	d.render();
	stop();

	bodyWidth = d.getBody().offsetWidth;
	bodyHeight = d.getBody().offsetHeight;
	contentWidth = d.getContent().offsetWidth;
	contentHeight = d.getContent().offsetHeight;
	
	ua.mousemove(document.body, {
		clientX : bodyWidth,
		clientY : bodyHeight
	});

	var ehandle = d.getMain().childNodes[2];
	setTimeout(function() {
		ua.mousedown(ehandle, {
			clientX : bodyWidth,
			clientY : bodyHeight
		});
		setTimeout(function() {
			ua.mousemove(ehandle, {
				clientX : bodyWidth + 100,
				clientY : bodyHeight
			});
			setTimeout(function() {				
				ua.mouseup(ehandle);
//				setTimeout(function(){
					equals(parseInt(d.getBody().offsetWidth), bodyWidth + 100, "e拖动后，body宽度变化");
					equals(parseInt(d.getContent().offsetWidth), contentWidth + 100, "e拖动后，content宽度变化");
					equals(parseInt(d.width), contentWidth + 100, "s拖动后，d的宽度变化");
					equals(parseInt(d.getBody().offsetHeight), bodyHeight, "e拖动后，body高度不变");
					equals(parseInt(d.getContent().offsetHeight), contentHeight, "e拖动后，content高度不变");
					equals(parseInt(d.height), contentHeight, "e拖动后，d的高度不变");
					d.close();
					d.dispose();
					start();					
//				}, 30);
			}, 30);
		}, 30);
	}, 30);
});

test("drag se", function() {
	expect(6);
	var d, options = {
			titleText : "title",
			contentText : "content",
			modal : false
		};
	d = new baidu.ui.Dialog(options);
	d.render();
	stop();

	bodyWidth = d.getBody().offsetWidth;
	bodyHeight = d.getBody().offsetHeight;
	contentWidth = d.getContent().offsetWidth;
	contentHeight = d.getContent().offsetHeight;
	
	ua.mousemove(document.body, {
		clientX : bodyWidth,
		clientY : bodyHeight
	});

	var ehandle = d.getMain().childNodes[3];
	setTimeout(function() {
		ua.mousedown(ehandle, {
			clientX : bodyWidth,
			clientY : bodyHeight
		});
		setTimeout(function() {
			ua.mousemove(ehandle, {
				clientX : bodyWidth + 100,
				clientY : bodyHeight + 100
			});
			setTimeout(function() {				
				ua.mouseup(ehandle);
//				setTimeout(function(){
					equals(parseInt(d.getBody().offsetWidth), bodyWidth + 100, "se拖动后，body宽度变化");
					equals(parseInt(d.getContent().offsetWidth), contentWidth + 100, "se拖动后，content宽度变化");
					equals(parseInt(d.width), contentWidth + 100, "se拖动后，d的宽度变化");
					equals(parseInt(d.getBody().offsetHeight), bodyHeight + 100, "se拖动后，body高度变化");
					equals(parseInt(d.getContent().offsetHeight), contentHeight + 100, "se拖动后，content高度变化");
					equals(parseInt(d.height), contentHeight + 100, "se拖动后 ，d的高度变化");
					d.close();
					d.dispose();
					start();				
//				}, 30);
			}, 30);
		}, 30);
	}, 30);
});

test("update", function() {
	expect(4);
	var d, options = {
			titleText : "title",
			contentText : "content",
			modal : false
		};
	d = new baidu.ui.Dialog(options);
	d.render();
	var newoptions = {
			width : 100,
			height : 100
		};
	var s = d.getMain().childNodes[1], e = d.getMain().childNodes[2], se = d.getMain().childNodes[3];
	ok($(s).css("width") == '100%' || s.style.width == d.getBody().offsetWidth + 'px',
	"update前，元素s宽度与目标元素一致");
	ok($(e).css("height") == '100%' || e.style.height == d.getBody().offsetHeight + 'px',
	"update前，元素e高度与目标元素一致");
	d.update(newoptions);
	s = d.getMain().childNodes[1], e = d.getMain().childNodes[2], se = d.getMain().childNodes[3];
	ok($(s).css("width") == '100%' || s.style.width == d.getBody().style.width,
	"update后，元素s宽度与目标元素一致");
	ok($(e).css("height") == '100%' || e.style.height == d.getBody().style.height,
	"update后，元素e高度与目标元素一致");
	d.close();
	d.dispose();
});