module('baidu.ui.Combox.Combox$select');

test('Check the basic functions',function(){
	var select = document.createElement('select');
	var option = document.createElement("option");  
	option.text = 'content_a';  
	option.value = 'value_a';  
	select.add(option, null);  
	option = document.createElement("option");  
	option.text = 'content_b';  
	option.value = 'value_b';  
	select.add(option, null);  
	select.style.position = 'absolute';
	select.style.left = '100px';
	select.style.top = '200px';
	document.body.appendChild(select);
	var div = document.body.appendChild(document.createElement("div"));
	var options = {
		select : select,
		type : 'select'
	};
	var cb = new baidu.ui.Combox(options);
	equal(cb.data.length, 0, "Before render, there is no data in the combox");
	cb.render(div);	
	//测试combox的data已经被赋值为select的options
	var data = [{
		value : 'value_a',
		content : 'content_a'
			},{
		value : 'value_b',
		content : 'content_b'
		}];
	ok((cb.data[0].value == data[0].value) && 
			(cb.data[0].content == data[0].content) && 
			(cb.data[1].value == data[1].value) && 
			(cb.data[1].content == data[1].content), "The data of the combox is set");
	equals(cb.select.style.display, "none", "The select is hidden");
	//测试combox的位置是否被重新设置为select所在的位置
	ok(Math.abs(baidu.dom.getPosition(cb.getMain()).left - 102) < 5 && 
			Math.abs(baidu.dom.getPosition(cb.getMain()).top - 202) < 5,
			"The position of the Combox is reset,PUBLICGE-329,PUBLICGE-318");
	//测试onitemchosen事件能否正确加载监听函数并派发
	cb.menu.open();
	cb.menu.itemClick("0-1");
	equals(cb.select.value, cb.menu.data[1].value, 
			'The "onitemchosen" event is dispatched and can work well');
	cb.menu.dispose();
	cb.dispose();
});

test('Check the ajax form content',function(){
	stop();
	var check  = function(){
		var select = document.createElement('select');
		var option = document.createElement("option");  
		option.text = 'content_a';  
		option.value = 'value_a';  
		select.add(option, null);
		$(select).attr("name", "select1");
		var options = {
			select : select,
			type : 'select'
		};
		document.body.appendChild(select);
		var div = document.body.appendChild(document.createElement("div"));
		var cb = new baidu.ui.Combox(options);
		cb.render(div);	
		div1 = document.createElement('div');
		div1.id = 'test_div';
		form = document.createElement('form');
		form.id = 'test_form';
		div1.appendChild(form);
		document.body.appendChild(div1);
		form.appendChild(cb.getMain());
		form.appendChild(select);
		form.action = upath+'form.php';
		form.method = 'post';
		stop();
		var ajaxOptions = {
				onfailure : function(){
					ok(false, "The hidden select is not sended");
				},
				onsuccess : function(xhr, text) {
					ok(true, "The hidden select is sended");
					$('div#test_div').remove();
					QUnit.start();
				}
			};
		baidu.ajax.form(form, ajaxOptions);
		cb.menu.dispose();
		cb.dispose();
		start();
	};
	ua.importsrc('baidu.ajax.form', 
			check ,'baidu.ajax.form', 'baidu.ui.Combox.Combox$select');
});