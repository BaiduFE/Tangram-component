module("baidu.parser.Xml");

test("create", function() {
	expect(3);
	var result = baidu.parser.Xml({
		method : 'POST'
	});
	equals(result._DOMParser, null, "xml parser");
	equals(typeof result._jPath, 'undefined', "xml parser");
	equals(result._method, "POST", "options");
});

test("_parser", function() {
	expect(3);
	
	var text="<bookstore>";
	text=text+"<book>";
	text=text+"<title>Harry Potter</title>";
	text=text+"<author>J K. Rowling</author>";
	text=text+"<year>2005</year>";
	text=text+"</book>";
	text=text+"</bookstore>";

	var parser = baidu.parser.Xml({
		method : 'POST'
	});
	
	var result = parser._parser(text);
	ok(parser._DOMParser, "The _DOMParser is right");
	ok(parser._dom, "The _dom is right");
	ok(result, "The result is right");
});

test("_query", function() {
	expect(4);
	
	var text="<bookstore>";
	text=text+"<book>";
	text=text+"<title>Harry Potter</title>";
	text=text+"<author>J K. Rowling</author>";
	text=text+"<year>2005</year>";
	text=text+"</book>";
	text=text+"</bookstore>";

	var parser = baidu.parser.Xml({
		method : 'POST'
	});

	parser._parser(text);
    equals(parser._query('//name').length, 0, "The result is right");
	equals(parser._query('//book')[0].childNodes[0].textContent, "Harry Potter", "The title is right");
	equals(parser._query('//book/title')[0].textContent, 'Harry Potter', "The title is right");
	equals(parser._query('/bookstore/book/year')[0].textContent, '2005', "The year is right");
});
