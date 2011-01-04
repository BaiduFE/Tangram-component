module("iframe");

/**
 * <ul>
 * check iframe
 * <li> check title
 * <li> check content
 * <li> check not shown
 */
test("iframe", function() {
	var options = {
		titleText : "title",
		modal : false
	};
	var framesrc = "../data/test.html";
	var d = baidu.ui.dialog.iframe(framesrc, options);
		/* check title */
		equals(options.titleText, d.getTitleInner().innerHTML, "check title");
		var ele = d.getContent().firstChild;
		var id = 'tangram-dialog--' + d.guid;
		var className = 'tangram-dialog-iframe';
		/* check element is shown */
		ok(isShown(ele), "check element is shown");
		/* check element source */
		ok(new RegExp(framesrc + "$").test(ele.src), "check iframe src : "+ ele.src);
		/* check element class */
		equals(ele.className, className, "check iframe class");
		/* check element name */
		equals(ele.name, id + '-iframe', "check iframe name");
		/* check element node name */
		equals(ele.nodeName, "IFRAME", "check node type");
		/* check element parent node is content */
		equals(ele.parentNode.parentNode.id, id, "check dialog id");
		/* check element parent node's next sibling is footer */
		equals(id + "-footer", ele.parentNode.nextSibling.id, "check footer id");
		/* check element parent node's prev sibling is title */
		equals(id + "-title", ele.parentNode.previousSibling.id, "check title id");
		d.close();
		te.obj.push(d);	
})

test('dialog position',function(){
	var options = {
			width : '300px',
			height : '302px'
	};
	var framesrc = "../data/test.html";
	var d = baidu.ui.dialog.iframe(framesrc, options);
	stop();
	/*需要设置超时加载iframe*/
	setTimeout(function(){
		equal($(d.getBody()).css('width'),'300px','check dialog width');
		equal($(d.getBody()).css('height'),'302px','check dialog height');
		var left = (baidu.page.getViewWidth() - parseInt(d.getMain().offsetWidth))/2 + baidu.page.getScrollTop();
		var top = (baidu.page.getViewHeight() - parseInt(d.getMain().offsetHeight))/2 + baidu.page.getScrollLeft(); 
		equal(parseInt(d.getMain().style.left),parseInt((left > 0? left:0)),'check left');
		equal(parseInt(d.getMain().style.top),parseInt(top > 0 ? top : 0),'check top');
		equal(d.getMain().style.right,'','check right');
		equal(d.getMain().style.bottom,'','check bottom');
		te.obj.push(d);
		start();
	},100);

})

test('left&top',function(){
	var options = {
		left : '120px',
		top : 100
	};
	var framesrc = "../data/test.html";
	var d = baidu.ui.dialog.iframe(framesrc, options);
	stop();
	setTimeout(function(){
		equal(d.getMain().style.left,'120px');
		equal(d.getMain().style.top,'100px');
		equal(d.getMain().style.right,'','check right');
		equal(d.getMain().style.bottom,'','check bottom');
		te.obj.push(d);
		start();
	},100);
	
});

test('right&bottom',function(){
		var options = {
		bottom : '100px',
		right : 200
	};
	var framesrc = "../data/test.html";
	var d = baidu.ui.dialog.iframe(framesrc, options);
	stop();
	setTimeout(function(){
		equal(d.getMain().style.left,'auto');
		equal(d.getMain().style.top,'auto');
		equal(d.getMain().style.right,'200px','check right');
		equal(d.getMain().style.bottom,'100px','check bottom');
		te.obj.push(d);
		start();
	},100);
});
