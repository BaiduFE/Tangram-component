module("baidu.ui.button.create");

test("create", function() {
	var button = baidu.ui.button.create();
	var buttonElement = button.getMain();
	ok(buttonElement, "dom created");
	equals(button.uiType.toLowerCase(), "button", "check type");
});

test("create button in container", function() {
	var div_test = document.createElement("div");
	div_test.id = "div_test";
	document.body.appendChild(div_test);
	var button = baidu.ui.button.create(div_test);
	var buttonElement = button.getMain();
	ok(buttonElement, "dom created");
	equals(button.getMain().id, div_test.id, "check button is inserted into target or not");
});