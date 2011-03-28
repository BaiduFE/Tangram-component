module("baidu.ui.Suggestion.Suggestion$smartCover");

test("hide and show a select", function() {
	stop();
	var te = testingElement, sugg, input = te.dom[0], options = {
		onshow : function() {
			setTimeout(function(){
				equals(select.style.visibility, "hidden", "The select element is hidden");
				if (baidu.browser.ie) {
					equal(sugg.getMain().lastChild.style.width,
							sugg.getMain().offsetWidth + 'px');
					equal(sugg.getMain().lastChild.style.height,
							sugg.getMain().offsetHeight + 'px');
				}
				sugg.hide();
			},0);
		},
		onhide : function() {
			setTimeout(function(){
				equals(select.style.visibility, "", "The select element is shown");
				sugg.dispose();
				start();
			},0);
		}
	};
	
	var select = document.createElement('select');
	var option = document.createElement("option");  
	option.text = 'content_a';  
	option.value = 'value_a';  
	select.add(option, null); 
	document.body.appendChild(select);
	te.dom.push(select);
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	baidu.ui.smartCover.options.hideSelect = true;
	sugg.show('a', [ 'ab', 'ac' ]);

});

test("hide and show 2 selects", function() {
	expect(4);
	stop();
	var te = testingElement, input = te.dom[0], sugg, options = {
		onshow : function() {
			setTimeout(function(){
				equals(select.style.visibility, "hidden", "The select element is hidden");
				equals(select1.style.visibility, "hidden", "The select element is hidden");
				sugg.hide();
			},0);
		},
		onhide : function() {
			setTimeout(function(){
				equals(select.style.visibility, "", "The select element is shown");
				equals(select1.style.visibility, "", "The select element is shown");
				start();
			},0);
		}
	};
	
	var select = document.createElement('select');
	var option = document.createElement("option");  
	option.text = 'content_a';  
	option.value = 'value_a';  
	select.add(option, null);  
	var select1 = document.createElement('select');
	var option1 = document.createElement("option");  
	option1.text = 'content_a';  
	option1.value = 'value_a';  
	select1.add(option1, null);  
	document.body.appendChild(select);
	document.body.appendChild(select1);
	te.dom.push(select);
	te.dom.push(select1);
	
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	baidu.ui.smartCover.options.hideSelect = true;
	te.obj.push(sugg);
	sugg.show('a', [ 'ab', 'ac' ]);
});
