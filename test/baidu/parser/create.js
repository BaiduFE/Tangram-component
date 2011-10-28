module("baidu.parser.create");

test("create", function() {
	expect(8);
	stop();
	ua.importsrc('baidu.parser.Parser,baidu.parser.Json,baidu.parser.Xml', function(){
		var result = baidu.parser.create();
		equals(result, null, "The result is right");
		
		result = baidu.parser.create(baidu.parser.type.HTML);
		equals(result, null, "The result is right");
		
		result = baidu.parser.create(baidu.parser.type.XML);
		equals(result._DOMParser, null, "xml parser");
		equals(typeof result._jPath, 'undefined', "xml parser");
		equals(result._method, "GET", "no options");
		
		result = baidu.parser.create(baidu.parser.type.JSON,{
			method : 'POST'
		});
		equals(result._jPath, null, "json parser");
		equals(typeof result._DOMParser, 'undefined', "json parser");
		equals(result._method, "POST", "options");
		start();
	}, 'baidu.parser.Parser', 'baidu.parser.create');
});