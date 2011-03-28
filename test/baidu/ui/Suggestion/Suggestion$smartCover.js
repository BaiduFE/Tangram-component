module("baidu.ui.Suggestion.Suggestion$smartCover");

test("hide and show a select", function() {
	expect(2);
	stop();
	var te = testingElement, sugg, options = {
		onshow : function() {
			setTimeout(function(){
				equals(select.style.visibility, "hidden", "The select element is hidden");
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
	
	var div = document.createElement('div');
	var tr = document.createElement('tr');
	var select = document.createElement('select');
	var option = document.createElement("option");  
	option.text = 'content_a';  
	option.value = 'value_a';  
	select.add(option, null); 
	document.body.appendChild(div);
	div.appendChild(tr);
	tr.appendChild(select);
	te.dom.push(select);
	var input = document.createElement("input");
	document.body.appendChild(input);
	sugg = new baidu.ui.Suggestion(options);
	sugg.render(input);
	baidu.ui.smartCover.options.hideSelect = true;
	ua.click(select);
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
