module("create");

/**
 * <ul>
 * check create method
 * <li> check title
 * <li> check content
 * <li> check not shown
 */
test("create", function() {

	expect(3);
	var options = {
		titleText : "title",
		contentText : "content",
		modal : false
	};
	var d = baidu.ui.dialog.create(options);
	equals(options.titleText, d.getTitleInner().innerHTML, "check title");
	equals(options.contentText, d.getContent().innerHTML, "check content");
	var id = "tangramDIALOG" + d.guid;
	var element_dialog = document.getElementById(id);
	ok(!isShown(element_dialog) && !d.isShown(), "check not shown default");
	te.obj.push(d);
})

/**
 * <ul>
 * check create by content element
 * <li>
 */
test("create - Element", function() {

	expect(2);
	var element_content = document.createElement("div");
	element_content.id = "div_content_id";
	element_content.innerHTML = "test div";
	document.body.appendChild(element_content);
	var options = {
		content : element_content,
		modal : false
	};
	var d = baidu.ui.dialog.create(options);
	d.open();
	var element_dialog = document.getElementById("tangramDIALOG" + d.guid);
	equals(element_content.innerHTML, d.getContent().firstChild.innerHTML,
			"check content element");
	equals(element_content.id, d.getContent().firstChild.id,
			"check content element");
	d.close();
	te.obj.push(d);
})

/**
 * <ul>
 * check create with all options, event and method check in Dialog, property
 * check here
 * <li> create an element for content and put in option as content
 */
test(
		"create - property",
		function() {
			expect(9);
			var options = {
				titleText : "t",
				contentText : "c",
				width : '301px',
				height : '302px',
				top : '303px',
				left : '304px',
				classPrefix : "o-__-o",
				zIndex : 1002,
				closeText : "0~__~o",
				modal : false
			};
			var d = baidu.ui.dialog.create(options);
			d.open();
			var element_content = d.getContent();
			var element_dialog = element_content.parentNode.parentNode;
			equals(element_content.parentNode.style.width, options.width,
					'check width');
			/* title的高度 */
			equals(parseInt(element_content.parentNode.style.height), 302
					+ d.getTitle().offsetHeight, 'check height');
			equals(element_dialog.style.top, options.top, 'check top');
			equals(element_dialog.style.left, options.left, 'check top');
			var check = function(ele, next) {
				if (ele && ele.className)
					equals(ele.className.substr(0, 6), options.classPrefix,
							'check prefix - ' + ele.id);
				if (ele.firstChild)
					check(ele.firstChild);
				if (next && ele.nextSibling)
					check(ele.nextSibling, true);
			}
			check(element_dialog, false);
			// equals(d.getTitle().lastChild.innerHTML, options.closeText,
			// 'check close text');
			equals(element_dialog.style.zIndex, options.zIndex, 'check z index');
			d.close();
			te.obj.push(d);
		});

/**
 * TODO 更新了元素宽度和高度，所以用例必须单独写 TODO 校验居中
 */
test('check content width and height', function() {
	var options = {
		titleText : "t",
		contentText : "c",
		width : '300px',
		height : '302px'
	};
	var d = baidu.ui.dialog.create(options);
	d.open();
	equal($(d.getBody()).css('width'), '300px');
	/* title的高度 */
	equal(parseInt($(d.getBody()).css('height')), 302 + d.getTitle().offsetHeight);
});

test('center position', function() {
	var options = {
		titleText : "t",
		contentText : "c",
		width : '300px',
		height : '302px'
	};
	var d = baidu.ui.dialog.create(options);
	d.open();
	var left = (baidu.page.getViewWidth() - parseInt(d.getMain().offsetWidth))
			/ 2 + baidu.page.getScrollTop();
	var top = (baidu.page.getViewHeight() - parseInt(d.getMain().offsetHeight))
			/ 2 + baidu.page.getScrollLeft();
	equal(d.getMain().style.left, (left > 0 ? left : 0) + 'px', 'check left');
	equal(d.getMain().style.top, (top > 0 ? top : 0) + 'px', 'check top');
});