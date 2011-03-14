module("baidu.ui.ScrollPanel");

/*
 * overflow
 * setVisible
 * dispose
 */
test('init render',function(){
	stop();
	ua.loadcss(upath+'ScrollPanel/style.css',function(){
		var div = document.body.appendChild(document.createElement("div"));
		$(div).css('width', '200px').css('height', '200px')
			.css('color', 'black').css('overflow','hidden');//
		var divcontent = '1------------------------------------------------------<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>' +
				'1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>';	
		div.id = "mydev";
		div.innerHTML = divcontent;
		var options = {
			container : div,
			overflow: 'overflow-y'
		};
		var scrollpanel = new baidu.ui.ScrollPanel(options);
		scrollpanel.render(div);
		var main = scrollpanel.getMain();
		ok(scrollpanel.getPanel().firstChild==scrollpanel.getTarget(),"div is in panel");
		equal(main.style.width,'200px','check main width');
		equal(main.style.height,'200px','check main height');
		equal(scrollpanel.getContainer().style.width,(200-scrollpanel._yScrollbar.getSize()['width'])+'px','check container width');
		equal(scrollpanel.getContainer().style.height,'200px','check container height');
		equal(main.style.height,'200px','check main height');
		equal(scrollpanel.isVisible('x'),false,'check x isVisible');
		equal(scrollpanel.isVisible('y'),true,'check y isVisible');
		ok(scrollpanel._xScrollbar==null,'check _xScrollbar is no create');
		equal(scrollpanel._yScrollbar.isVisible(),true,'check y scrollBar isVisible ');
		te.dom.push(scrollpanel.getMain());
		start();
	});

});

test('setVisible',function(){
		var div = document.body.appendChild(document.createElement("div"));
		$(div).css('width', '200px').css('height', '200px')
			.css('color', 'black').css('overflow','hidden');//
		var divcontent = '1------------------------------------------------------<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>' +
				'1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>';	
		div.id = "mydev";
		div.innerHTML = divcontent;
		var options = {
			container : div,
			overflow: 'overflow-y'
		};
		var scrollpanel = new baidu.ui.ScrollPanel(options);
		scrollpanel.render(div);
        scrollpanel.setVisible(false,'y');
        equal(scrollpanel.isVisible('y'),false,'check y isVisible');
        equal(scrollpanel._yScrollbar.isVisible(),false,'check y scrollBar isVisible ');
        te.dom.push(scrollpanel.getMain());

});

test('dispose',function(){
		var div = document.body.appendChild(document.createElement("div"));
		$(div).css('width', '200px').css('height', '200px')
			.css('color', 'black').css('overflow','hidden');//
		div.id = "mydev";
		var options = {
			container : div,
			ondispose : function(){
				ok(true,'this is dispose');
			}
		};
		var scrollpanel = new baidu.ui.ScrollPanel(options);
		scrollpanel.render(div);
		var parentNode = scrollpanel.getMain().parentNode;
		scrollpanel.dispose();
		ok(scrollpanel.getMain()==null,'main is remove');
		ok(div.parentNode==parentNode,'target is reset');
		ok(scrollpanel._yScrollbar==null,'_yScrollbar is remove');
		ok(scrollpanel._xScrollbar==null,'_xScrollbar is remove');

});

