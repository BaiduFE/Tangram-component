module("baidu.parser.Json");

test("create", function() {
	expect(3);
	var result = baidu.parser.Json({
		method : 'POST'
	});
	equals(result._jPath, null, "json parser");
	equals(typeof result._DOMParser, 'undefined', "json parser");
	equals(result._method, "POST", "options");
});

test("_parser", function() {
	expect(8);
	var parser = baidu.parser.Json({
		method : 'POST'
	});
	
    var lib = {
            'name' :'My Library',
            '@open' : '2007-17-7',
            'address' : {
                'city' : 'beijing',
                'zip' : '12345',
                'state' : 'MI',
                'street' : 'Mockingbird Lane'
            },
            'books':[{
                'title' : 'Harry Potter',
                'isbn'  : '1234-1234',
                'category' : 'Childrens',
                'available' : '3',
                'chapters' : [ 'Chapter 1', 'Chapter 2' ]
            },
            {
                'title' : 'Brief History of time',
                'isbn'  : '1234-ABCD',
                'category' : 'Science',
                'chapters' : [ '1', '2' ]
            },
            {
                'title' : 'Lord of the Rings',
                'isbn'  : '1234-PPPP',
                'category' : 'Fiction',
                'chapters' : [ 'Section 1', 'Section 2' ]
            }],
            'categories' : [
            {'name':'Childrens', 'description':'Childrens books'},
            {'name':'Science', 'description':'Books about science'},
            {'name':'Fiction', 'description':'Fiction books'}
            ]
        };
    
    var lib1 = {
            'title' :'继母',
            'author' : {
                'name' : '严歌苓',
                'gentle' : 'female'
            }
        };
    var lib1String = '{"title":"继母","author":{"name":"严歌苓","gentle":"female"}}';
    var result = parser._parser(lib);
    equals(result, true, "The result is right");
	equals(parser._jPath.json, lib, "The _jPath is right");
	equals(parser._dom, parser._jPath, "The _dom is right");
	
	result =  parser._parser(lib1String);
    equals(result, true, "The result is right");
	equals(parser._jPath.json.title, '继母', "The _jPath is right");
	equals(parser._jPath.json.author.name, '严歌苓', "The _jPath is right");
	equals(parser._jPath.json.author.gentle, 'female', "The _jPath is right");
	equals(parser._dom, parser._jPath, "The _dom is right");
});

test("_query", function() {
	expect(4);
	var parser = baidu.parser.Json({
		method : 'POST'
	});
    
    var lib = {
            'name' :'My Library',
            '@open' : '2007-17-7',
            'address' : {
                'city' : 'beijing',
                'zip' : '12345',
                'state' : 'MI',
                'street' : 'Mockingbird Lane'
            },
            'books':[{
                'title' : 'Harry Potter',
                'isbn'  : '1234-1234',
                'category' : 'Childrens',
                'available' : '3',
                'chapters' : [ 'Chapter 1', 'Chapter 2' ]
            },
            {
                'title' : 'Brief History of time',
                'isbn'  : '1234-ABCD',
                'category' : 'Science',
                'chapters' : [ '1', '2' ]
            },
            {
                'title' : 'Lord of the Rings',
                'isbn'  : '1234-PPPP',
                'category' : 'Fiction',
                'chapters' : [ 'Section 1', 'Section 2' ]
            }],
            'categories' : [
            {'name':'Childrens', 'description':'Childrens books'},
            {'name':'Science', 'description':'Books about science'},
            {'name':'Fiction', 'description':'Fiction books'}
            ]
        };
    
    equals(parser._query('//name').length, 0, "The result is right");
    
    parser._parser(lib);
    ok(te.arrayCompare(parser._query('//name'), ["My Library", "Childrens", "Science", "Fiction"]), "The result is right");
    ok(te.arrayCompare(parser._query('/categories/name'), ["Childrens", "Science", "Fiction"]), "The result is right");
    equals(parser._query('/books/available'), 3, "The result is right");
});