module("baidu.parser.Parser");

test("create", function() {
	expect(10);
	stop();
	ua.importsrc('baidu.parser.Json,baidu.parser.Xml', function(){
		var parser = new baidu.parser.Parser();
		equals(parser._method, "GET", "The _method is right");
		equals(parser.onload, baidu.fn.blank, "The onload is right");
		equals(parser._dom, null, "The _dom is right");
		equals(parser._isLoad, false, "The _isLoad is right");
		ok(te.isEmpty(parser._queryData), "The _queryData is right");
		
		var load = function(){
			alert();
		};
		parser = new baidu.parser.Parser({
			method : 'POST',
			onload : load
		});
		equals(parser._method, "POST", "The _method is right");
		equals(parser.onload, load, "The onload is right");
		equals(parser._dom, null, "The _dom is right");
		equals(parser._isLoad, false, "The _isLoad is right");
		ok(te.isEmpty(parser._queryData), "The _queryData is right");
		start();
	}, 'baidu.parser.Json', 'baidu.parser.Parser');
});

test("load", function() {
	expect(12);
	var num = 0;
	var xmlparser = baidu.parser.Xml({
		onload : function(){
			num ++;
		}
	});
	
	xmlparser.load();
	equals(xmlparser._isLoad, false, "The _isLoad is right");
	ok(te.isEmpty(xmlparser._queryData), "The _queryData is right");
	
	var text="<bookstore>";
	text=text+"<book>";
	text=text+"<title>Harry Potter</title>";
	text=text+"<author>J K. Rowling</author>";
	text=text+"<year>2005</year>";
	text=text+"</book>";
	text=text+"</bookstore>";
	xmlparser.load(text);
	equals(xmlparser._isLoad, true, "The _isLoad is right");
	ok(te.isEmpty(xmlparser._queryData), "The _queryData is right");
	ok(xmlparser._dom, "The _dom is right");
	equals(xmlparser._query('//book')[0].childNodes[0].textContent, "Harry Potter", "The title is right");
	
	var jsonparser = baidu.parser.Json({
		onload : function(){
			num ++;
		}
	});
	 var lib1 = {
	            'title' :'继母',
	            'author' : {
	                'name' : '严歌苓',
	                'gentle' : 'female',
	            }
	        };
	 
	jsonparser.load();
	equals(jsonparser._isLoad, false, "The _isLoad is right");
	ok(te.isEmpty(jsonparser._queryData), "The _queryData is right");

	jsonparser.load(lib1);
	equals(jsonparser._isLoad, true, "The _isLoad is right");
	ok(te.isEmpty(jsonparser._queryData), "The _queryData is right");
	equals(jsonparser._dom, jsonparser._jPath, "The _dom is right");
	
	equals(num, 2, "The onload is right");
});

test("loadUrl xml get", function() {
	expect(4);
	stop();
	var xmlparser = baidu.parser.Xml({
		onload : function(){
			equals(xmlparser._isLoad, true, "The _isLoad is right");
			ok(te.isEmpty(xmlparser._queryData), "The _queryData is right");
			ok(xmlparser._dom, "The _dom is right");
			equals(xmlparser._query('//title')[0].childNodes[0].textContent, "Harry Potter", "The title is right");
			start();
		}
	});
	
	xmlparser.loadUrl("../../baidu/parser/Xml/books.xml");
});


test("loadUrl xml post", function() {
	expect(4);
	stop();
	var xmlparser = baidu.parser.Xml({
		onload : function(){
			equals(xmlparser._isLoad, true, "The _isLoad is right");
			ok(te.isEmpty(xmlparser._queryData), "The _queryData is right");
			ok(xmlparser._dom, "The _dom is right");
			equals(xmlparser._query('//title')[0].childNodes[0].textContent, "Everyday Italian", "The title is right");
			start();
		}
	});
	
	xmlparser.loadUrl("../../baidu/parser/Xml/books.php", "POST", "var=title");
});

test("loadUrl json get", function() {
	expect(4);
	stop();
	
	var jsonparser = baidu.parser.Json({
		onload : function(){
			equals(jsonparser._isLoad, true, "The _isLoad is right");
			ok(te.isEmpty(jsonparser._queryData), "The _queryData is right");
			ok(jsonparser._dom, "The _dom is right");
			equals(jsonparser._query('//name')[0], "My Library", "The name is right");
			start();
		}
	});
	jsonparser.loadUrl("../../baidu/parser/Json/lib.json");
});

test("loadUrl json post", function() {
	expect(4);
	stop();
	
	var jsonparser = baidu.parser.Json({
		onload : function(){
			equals(jsonparser._isLoad, true, "The _isLoad is right");
			ok(te.isEmpty(jsonparser._queryData), "The _queryData is right");
			ok(jsonparser._dom, "The _dom is right");
			equals(jsonparser._query('//name')[0], "Your Library", "The name is right");
			start();
		}
	});
	jsonparser.loadUrl("../../baidu/parser/Json/lib.php", "POST", "var=title");
});

test("query", function() {
	expect(4);
	var num = 0;
	var xmlparser = baidu.parser.Xml({
		onload : function(){
			num ++;
		}
	});
	
	var text="<bookstore>";
	text=text+"<book>";
	text=text+"<title>Harry Potter</title>";
	text=text+"<author>J K. Rowling</author>";
	text=text+"<year>2005</year>";
	text=text+"</book>";
	text=text+"</bookstore>";
	
	var result = xmlparser.query('//title');
	equals(result.length, 0, "The result is right");

	xmlparser.load(text);
	result = xmlparser.query('//title');
	equals(xmlparser.query('//title')[0].textContent, "Harry Potter", "The result is right");
	
	var jsonparser = baidu.parser.Json({
		onload : function(){
			num ++;
		}
	});
	 var lib = {
	            'title' :'继母',
	            'author' : {
	                'name' : '严歌苓',
	                'gentle' : 'female',
	            }
	        };

	var result = jsonparser.query('//title');
	equals(result.length, 0, "The result is right");
		
	jsonparser.load(lib);
	var result = jsonparser.query('//title');
	equals(jsonparser.query('//title')[0], "继母", "The result is right");
});

test("getRoot", function() {
	expect(2);
	var num = 0;
	var xmlparser = baidu.parser.Xml({
		onload : function(){
			num ++;
		}
	});
	
	var text="<bookstore>";
	text=text+"<book>";
	text=text+"<title>Harry Potter</title>";
	text=text+"<author>J K. Rowling</author>";
	text=text+"<year>2005</year>";
	text=text+"</book>";
	text=text+"</bookstore>";

	xmlparser.load(text);
	equals(xmlparser.getRoot(), xmlparser._dom, "getRoot");
	
	var jsonparser = baidu.parser.Json({
		onload : function(){
			num ++;
		}
	});
	 var lib = {
	            'title' :'继母',
	            'author' : {
	                'name' : '严歌苓',
	                'gentle' : 'female',
	            }
	        };

	 
	jsonparser.load(lib);
	equals(jsonparser.getRoot(), jsonparser._dom, "getRoot");
});