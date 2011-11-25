module("baidu.ui.ScrollPanel$adaptive")

test('reduce&enlarge-x&y',function(){
	expect(7);
	stop();
	ua.loadcss(upath+'style.css',function(){
		var div = document.body.appendChild(document.createElement("div"));
		$(div).css('width', '200px').css('height', '200px')
			.css('color', 'black').css('overflow','hidden');
		var divcontent = '1111111111111111111111111111111111111111<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>' +
				'1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>';	
		div.id = "mydev";
		div.innerHTML = divcontent;
		var options = {
			container : div,
			overflow: 'auto'
		};
		var scrollpanel = new baidu.ui.ScrollPanel(options);
		scrollpanel.render(div);
		equals(scrollpanel.getMain().style.height, "200px", "The scrollpanel size is right");
		equals(scrollpanel.getMain().style.width, "200px", "The scrollpanel size is right");
		$(div).css('width', '100px').css('height', '100px');
		setTimeout(function(){
			ok(scrollpanel.adaptive, "The adaptive is true");
			equals(scrollpanel.getMain().style.height, "100px", "The scrollpanel is resized");
			equals(scrollpanel.getMain().style.width, "100px", "The scrollpanel is resized");
			
			$(div).css('width', '300px').css('height', '300px');
			setTimeout(function(){
				equals(scrollpanel.getMain().style.height, "300px", "The scrollpanel is resized");
				equals(scrollpanel.getMain().style.width, "300px", "The scrollpanel is resized");
				scrollpanel.dispose();
				te.dom.push(div);
				start();
			}, 30);
		}, 30);
	});
});

test('flushBounds',function(){
	expect(13);
	stop();
	ua.loadcss(upath+'style.css',function(){
		var div = document.body.appendChild(document.createElement("div"));
		$(div).css('width', '200px').css('height', '200px')
			.css('color', 'black').css('overflow','hidden');
		var divcontent = '1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>' +
				'1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>';	
		div.id = "mydev";
		div.innerHTML = divcontent;
		var options = {
			adaptive : false,
			container : div,
			overflow: 'overflow-y'
		};
		var scrollpanel = new baidu.ui.ScrollPanel(options);
		scrollpanel.render(div);
		equals(scrollpanel.getMain().style.height, "200px", "The scrollpanel size is right");
		equals(scrollpanel.getMain().style.width, "200px", "The scrollpanel size is right");
		$(div).css('width', '50px').css('height', '50px');
		setTimeout(function(){
			ok(!scrollpanel.adaptive, "The adaptive is false");
			equals(scrollpanel.getMain().style.height, "200px", "The scrollpanel is resized");
			equals(scrollpanel.getMain().style.width, "200px", "The scrollpanel is resized");
			
			scrollpanel.flushBounds({width:50,height:50});
			equals(scrollpanel.isVisible("x"), false, "The scrollpanel's visibility");
			equals(scrollpanel.isVisible("y"), true, "The scrollpanel's visibility");
			equals(scrollpanel.getMain().style.height, "50px", "The scrollpanel is resized");
			equals(scrollpanel.getMain().style.width, "50px", "The scrollpanel is resized");
			
			$(div).css('width', '250px').css('height', '250px');
			scrollpanel.flushBounds({width:250,height:250});
			equals(scrollpanel.isVisible("x"), false, "The scrollpanel's visibility");
			equals(scrollpanel.isVisible("y"), true, "The scrollpanel's visibility");
			equals(scrollpanel.getMain().style.height, "250px", "The scrollpanel is resized");
			equals(scrollpanel.getMain().style.width, "250px", "The scrollpanel is resized");
			
			scrollpanel.dispose();
			te.dom.push(div);
			start();
		}, 30);
	});
});