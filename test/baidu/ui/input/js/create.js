module("baidu.ui.input.create");

test("create", function() {
	var input = baidu.ui.input.create();	
	var inputElement = input.getMain();
	ok(!inputElement, "dom is not created because there is no target argument in create method");
});

test("create input in container", function() {
	var input = baidu.ui.input.create(te.dom[0].id);
	var inputElement = input.getMain();
	ok(inputElement, "dom created");
	equals(input.uiType, "INPUT", "check type");
//	equals(input.getMain().id, div_test.id, "check input is inserted into target or not");
	equals(input.getMain().id, te.dom[0].id, "check input is inserted into target or not");
	te.dom.push(inputElement);
});