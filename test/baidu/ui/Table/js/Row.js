module('baidu.ui.table.Row');

/**
 * <li>getCell
 * <li>insertTo
 * <li>select
 * <li>unselect
 * <li>remove
 * <li>toggle
 * <li>getParent
 * <li>setParent
 * <li>update
 * <li>dispose
 */

var checkCellData = function(cells, expectedData, msg) {
	for ( var index in expectedData) {
		equal(cells[index].innerHTML, expectedData[index], msg + ' cell '
				+ index);
	}
};

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
	var row = table.getRow(0);
	equal(row.getMain().id, table.getBody().rows[0].id, 'check row 0');
});

test('select/unselect', function() {
	expect(2);
	var table = new baidu.ui.table.Table( {
		data : [ {
			content : [ "100", "200", "300" ]
		} ]
	});
	var div = te.dom[0];
	table.render(div);
	var row = table.getRow(0);
	var mainId = row.getMain().id;
	row.select();
	ok(row.getState(mainId)["selected"], 'toggle selected');
	row.unselect();
	ok(!row.getState(mainId)["selected"], 'toggle unselected');
});

test('toggle', function() {
	expect(4);
	var table = new baidu.ui.table.Table( {
		data : [ {
			content : [ "100", "200", "300" ]
		}, {
			content : [ "400", "500", "600" ]
		} ]
	});
	var div = te.dom[0];
	table.render(div);
	var row = table.getRow(0);
	var row1 = table.getRow(1);
	var mainId = row.getMain().id;
	var main1Id = row1.getMain().id;
	row.toggle();
	ok(row.getState(mainId)["selected"], 'toggle selected');
	ok(!row1.getState(main1Id)["selected"], 'toggle selected');
	row.toggle();
	row1.toggle();
	ok(!row.getState(mainId)["selected"], 'toggle unselected');
	ok(row1.getState(main1Id)["selected"], 'toggle selected');
});

test('set/get Parent', function() {
	expect(4);
	var table = new baidu.ui.table.Table( {
		data : [ {
			content : [ "100", "200", "300" ]
		} ]
	});
	var div = te.dom[0];
	table.render(div);
	var row = table.getRow(0);
	row.setParent(table);
	same(row._parent, table, 'set Parent');
	equal(row._parent.getId(), table.getId(), 'equal id of setParent');
	var parent = row.getParent(table);
	same(parent, table, 'get Parent');
	equal(parent.getId(), table.getId(), 'equal id of getParent');
});

test('get Cell', function() {
	expect(7);
	var table = new baidu.ui.table.Table( {
		data : [ {
			content : [ "100", "200", "300" ]
		}, {
			content : [ "400", "500", "600" ]
		} ]
	});
	var div = te.dom[0];
	table.render(div);
	var row = table.getRow(1);
	var cell = row.getCell(1);
	equal(cell.target.innerHTML, '500', 'check cell text');
	equal(cell.target.id, cell.getId(), 'check cell id');
	/* check 另一个分支，cell.target的id已经存在的情况 */
	cell = row.getCell(1);
	ok(cell instanceof baidu.ui.table.Cell, "it's a Cell instance");
	equal(cell.target.innerHTML, '500', 'check cell text');
	equal(cell.target.id, cell.getId(), 'check cell id');
	cell = row.getCell(0);
	equal(cell.target.innerHTML, '400', 'check cell text');
	equal(cell.target.id, cell.getId(), 'check cell id');
});

test(
		'getString',
		function() {
			expect(1);
			var table = new baidu.ui.table.Table( {
				data : [ {
					content : [ "100", "200", "300" ]
				}, {
					content : [ "400", "500", "600" ]
				} ]
			});
			var div = te.dom[0];
			table.render(div);
			var row = table.getRow(1);
			var str = row.getString();
			/* 实际的字符串和getString获得的字符串存在单引号和双引号的差别，所以做一下修正便于比较 */
			str = str
					.replace(
							/tr id='tangram-table-row--TANGRAM__i' class='tangram-table-row' data-guid='TANGRAM__i'/,
							'tr id="tangram-table-row--TANGRAM__i" class="tangram-table-row" data-guid="TANGRAM__i"');

			equal(str, table.getBody().rows[1].outerHTML, 'check row html');
		});

test('update', function() {
	expect(3);
	var table = new baidu.ui.table.Table( {
		data : [ {
			content : [ "100", "200", "300" ]
		}, {
			content : [ "400", "500", "600" ]
		} ]
	});
	var div = te.dom[0];
	table.render(div);
	var row = table.getRow(0);
	row.update( {
		data : {
			content : [ "new1", "new2", "new3" ]
		},
		onupdate : function() {
			var domCells = table.getBody().rows[0].cells;
			checkCellData(domCells, [ "new1", "new2", "new3" ],
					'check update text');
		}
	});

});

/* 用法：1.new Row 2.setParent 3.insertTo */
test('insertTo', function() {
	var table = new baidu.ui.table.Table( {
		data : [ {
			content : [ "100", "200", "300" ]
		}, {
			content : [ "400", "500", "600" ]
		} ]
	});
	var div = te.dom[0];
	table.render(div);
	var row = new baidu.ui.table.Row( {
		data : {
			content : [ "newCell1", "newCell2", "newCell3" ]
		}
	});
	row.setParent(table);
	row.insertTo();
	equal(table.getBody().rows.length, 3, 'insert 1 row to table');
	var cellBody = table.getBody().rows[0].cells;
	equal(cellBody.length, 3, 'check cell length');
	checkCellData(cellBody, [ "newCell1", "newCell2", "newCell3" ],
			'check insertTo');
	var lis = baidu.event._listeners.length;
	/*ondispose在stateable中注册，必须先insertTo才能被触发*/
	row.dispose();
	/*statable中的mouse up,down,over,move四个事件*/
	equal(baidu.event._listeners.length,lis-4,'remove liseteners');
});

test('remove', function() {
	expect(6);
	var table = new baidu.ui.table.Table( {
		data : [ {
			content : [ "100", "200", "300" ]
		}, {
			content : [ "400", "500", "600" ]
		} ]
	});
	var div = te.dom[0];
	table.render(div);
	var row = table.getRow(1);
	equal(table.getBody().rows.length, 2, 'remove 1 row');
	row.remove();
	var cellBody = table.getBody().rows[0].cells;
	equal(cellBody.length, 3, 'check cell length');
	checkCellData(cellBody, [ "100", "200", "300" ], 'check remove');
	equal(table.getBody().rows.length, 1, 'remove 1 row');
});
