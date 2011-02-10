module('baidu.ui.table.Cell');

/**
 * <li>getMain
 * <li>_initialize
 * <li>getParent
 * <li>setParent
 * <li>setHTML
 * <li>getHTML
 */

test('getMain', function() {
	var table = new baidu.ui.table.Table( {
		data : [ {
			content : [ "100", "200", "300" ]
		}, {
			content : [ "400", "500", "600" ]
		} ]
	});
	var div = te.dom[0];
	table.render(div);
	var cell0 = table.getRow(1).getCell(0);
	var cell = table.getBody().rows[1].cells[0];
	equal(cell0.getMain().id, cell.id, 'check getMain');
});


test("set/get HTML", function() {
	var table = new baidu.ui.table.Table( {
		data : [ {
			content : [ "100", "200" ]
		}, {
			content : [ "400", "500" ]
		} ]
	});
	var div = te.dom[0];
	table.render(div);
	var row = table.getRow(0);
	var cell = row.getCell(1);
	cell.setHTML("newText");
	equal(table.getBody().rows[0].cells[1].innerHTML, 'newText',
			"set content to cell");
	cell.getHTML();
	equal(cell.getHTML(), 'newText',"set content to cell");
});

test('set/get Parent,_initialize',function(){
	expect(3);
	var table = new baidu.ui.table.Table( {
		data : [ {
			content : [ "100", "200" ]
		}, {
			content : [ "400", "500" ]
		} ]
	});
	var div = te.dom[0];
	table.render(div);
	var row = table.getRow(0);
	var cell = row.getCell(0);
	cell._initialize(row);
	equal(cell.getParent().getId(),row.getId(),'check parent id');
	equal(cell.getId(),cell.target.getAttribute("id"),'check id');
	equal(cell.guid,cell.target.getAttribute("data-guid"),'check guid');
});

