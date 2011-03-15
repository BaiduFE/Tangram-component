module('baidu.ui.Table.Table$title');

test('Create a table with title but no rows, then add a row', function() {
	expect(5);
	var table = new baidu.ui.Table({
		title : ["c0", "c1", "c2"]
	});
	var div = te.dom[0];
	table.render(div);
	ok(!!table.getTitleBody(), 'The column title is created');
	equal(table.getBody().style.tableLayout, 'fixed', 'The table style "tableLayout" is "fixed"');
	equal(table.getTitleBody().style.tableLayout, 'fixed', 'The title style "tableLayout" is "fixed"');
	equal(table.getTitleBody().style.width, table.getBody().offsetWidth + 'px', 'The title style "width" is the initial value');
	table.addRow( {
		content : [ "700", "800", "900" ]
	});
	equal(table.getTitleBody().style.width, table.getBody().offsetWidth + 'px', 'The title style "width" is updated');
	table.dispose();
});

test('Create a table with title and data rows, then add a row', function() {
	expect(2);
	var table = new baidu.ui.Table({
		data : [ {
			content : [ "500", "600", "700" ]
		} ],
		title : ["c0", "c1", "c2"]
	});
	var div = te.dom[0];
	table.render(div);
	equal(table.getTitleBody().style.width, table.getBody().offsetWidth + 'px', 'The title style "width" is the initial value');
	table.addRow( {
		content : [ "700", "800", "900" ]
	});
	equal(table.getTitleBody().style.width, table.getBody().offsetWidth + 'px', 'The title style "width" is the same with the offserWidth of the data row');
	table.dispose();
});

test('Update a table with title', function() {
	expect(6);
	var table = new baidu.ui.Table( {
		data : [ {
			id : "row1",
			content : [ "500", "600", "700" ]
		} ],
		columns : [ {
			index : 0,
			width : '200px'
		}, {
			index : 1,
			width : '200px'
		}, {
			index : 2,
			width : "200px",
		} ],
		title : [ "columnName-0", "columnName-1", "columnName-2" ]
	});
	var div = te.dom[0];
	table.render(div);
	ok(!!table.getTitleBody(), 'The column title is created');
	equal(table.getBody().style.tableLayout, 'fixed', 'The table style "tableLayout" is "fixed"');
	equal(table.getTitleBody().style.tableLayout, 'fixed', 'The title style "tableLayout" is "fixed"');
	equal(table.getTitleBody().style.width, table.getBody().offsetWidth + 'px', 'The title style "width" is the initial value');
	table.update( {
		data : [ {
			id : "",
			content : [ "100", "200", "300" ]
		}, {
			id : "row2",
			content : [ "200", "300", "400" ]
		} ]
	});

	equal(table.getTitleBody().style.width, table.getBody().offsetWidth + 'px', 'The title style "width" is the same with the offserWidth of the data row');
	var flag = true;
	for (var i = 0; i < 3; i++)
		if(table.getRow(0).getCell(i).getBody().style.width != table.getTitleBody().rows[0].cells[0].style.width)
			flag = false;
	ok(flag, 'The title cell width is the same with the data cell width')
	table.dispose();
});