module("baidu.ui.Suggestion.Suggestion$coverable");

test("hide and show a select", function() {
	expect(6);
	stop();
	var check = function(){
		var te = testingElement, sugg, input = te.dom[0], options = {
			onshow : function() {
				setTimeout(function(){
					ok(!sugg.getMain().firstChild.firstChild.style['backgroundColor'] ,'The iframe is transparent');
					equals(sugg.getMain().firstChild.firstChild.style['zIndex'], '-1', 'The z-index of the iframe is -1')
					equals(sugg.getMain().firstChild.firstChild.style.width, sugg.getMain().offsetWidth + 'px', 'The width of the iframe is right');
					equals(sugg.getMain().firstChild.firstChild.style.height, sugg.getMain().offsetHeight + 'px', 'The Height of the iframe is right');
					sugg.hide();
				},0);
			},
			onhide : function() {
				setTimeout(function(){
					equals(sugg.getMain().firstChild.firstChild.style.display, 'none', 'The style.display of the iframe is none');
					ok(!isShown(sugg.getMain().firstChild.firstChild) ,'The iframe is hidden');
					document.body.removeChild(select_a);
					document.body.removeChild(select_b);
					sugg.dispose();
					start();
				},0);
			}
		};
		
		var select = document.createElement('select');
		var select_a = document.createElement('select');
		select_a.options[select_a.options.length] = new Option('content_a', 'value_a');
		select_a.style.position = 'absolute';
		document.body.appendChild(select_a);
		baidu.dom.setPosition(select_a, {left: 10, top : 110});
		var select_b = document.createElement('select');
		select_b.options[select_b.options.length] = new Option('content_a', 'value_a');
		select_b.style.position = 'absolute';
		document.body.appendChild(select_b);
		baidu.dom.setPosition(select_b, {left: 300, top : 600});
		sugg = new baidu.ui.Suggestion(options);
		sugg.render(input);
		sugg.show('a', [ 'abbbbbbbbbbbbbb', 'accccccccccccc' ]);
	};
	ua.importsrc('baidu.dom.setPosition', 
			check ,'baidu.dom.setPosition', 'baidu.ui.Suggestion.Suggestion$coverable');
});

test("hide and show a flash", function() {
	expect(6);
	stop();
	var check = function(){
		var te = testingElement, sugg, input = te.dom[0], options = {
			onshow : function() {
				setTimeout(function(){
					ok(!sugg.getMain().firstChild.firstChild.style['backgroundColor'] != 0 ,'The iframe is transparent');
					equals(sugg.getMain().firstChild.firstChild.style['zIndex'], '-1', 'The z-index of the iframe is -1')
					equals(sugg.getMain().firstChild.firstChild.style.width, sugg.getMain().offsetWidth + 'px', 'The width of the iframe is right');
					equals(sugg.getMain().firstChild.firstChild.style.height, sugg.getMain().offsetHeight + 'px', 'The Height of the iframe is right');
					sugg.hide();
				},0);
			},
			onhide : function() {
				setTimeout(function(){
					equals(sugg.getMain().firstChild.firstChild.style.display, 'none', 'The style.display of the iframe is none');
					ok(!isShown(sugg.getMain().firstChild.firstChild) ,'The iframe is hidden');
					document.body.removeChild(div);
					sugg.dispose();
					start();
				},0);
			}
		};
		
		sugg = new baidu.ui.Suggestion(options);
		sugg.render(input);
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
		sugg.show('a', [ 'ab', 'ac' ]);
	};
	ua.importsrc('baidu.swf.create', 
			check ,'baidu.swf.create', 'baidu.ui.Suggestion.Suggestion$coverable');
});