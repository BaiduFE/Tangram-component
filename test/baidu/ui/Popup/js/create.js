module('baidu.ui.create');

//test("create", function() {
//	var input = testingElement.dom[0];
//	var sugg = baidu.ui.suggestion.create(input);
//	testingElement.obj.push(sugg);
//	var suggElement = sugg.getMain();
//	ok(suggElement, "dom created");
//	ok(!isShown(suggElement), "hide default");
//	equals(sugg.uiType, "SUGGESTION", "check type");
//	equals(sugg.targetId, input.id, "check target");
//});
//
//test("create input in container", function() {
//	var input = testingElement.dom[0];
//	var div = document.createElement("div");
//	div.appendChild(input);
//	document.body.appendChild(div);
//	var sugg = baidu.ui.suggestion.create(input);
//	testingElement.obj.push(sugg);
//	testingElement.dom.push(div);
//	var suggElement = document.body.lastChild;
//	ok(suggElement, "dom created");
//	ok(!isShown(suggElement), "hide default");
//	equals(sugg.uiType, "SUGGESTION", "check type");
//	equals(sugg.targetId, input.id, "check target");
//});


test('create',function(){
	expect(7);
	var options = {
		modal : false
	};
	var popup = baidu.ui.popup.create(options);
	te.obj.push(popup);
	var popElement = popup.getMain();
	ok(popElement,"dom created");
	equal($(popElement).css('position'),'absolute','check position');
	equal($(popElement).css('marginLeft'),'-100000px','check marginLeft');
	ok(popup,"popup created");
	popup.open();
	ok(popup.isShown(),'popup is opened');
	popup.close();
	ok(!popup.isShown(),'popup is hidden');
	equal(popup.uiType,"popup",'ui type is popup');
});