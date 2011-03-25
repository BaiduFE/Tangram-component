module('baidu.ui.Table');

(function() {

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);
		var div = document.body.appendChild(document.createElement('div'));
		div.id = 'div_test';
		te.dom.push(div);
	};
})();

/**
 * <li>addRow
 * <li>getRow
 * <li>removeRow
 * <li>getRowCount
 * <li>getTarget
 * <li>update
 * <li>render
 * <li>resizeColumn
 */

var checkRowData = function(data, expectData, msg) {
	for ( var index in expectData) {
		equal(data.content[index], expectData[index], msg + ' check cell'
				+ index);
	}
};

// test('init',
// function() {
// expect(2);
// var table = new baidu.ui.Table();
// var div = document.createElement('div');
// document.body.appendChild(div);
// table.render(div);
// equal(div.firstChild.firstChild.tagName, "TABLE",
// "first element is table");
// equal(table.getBody().rows.length, 0, 'no rows');
// table.dispose();
// });

/* 在render中调用resizeColumn */
test('resizeColumn', function() {
	var table = new baidu.ui.Table({
		data : [ {
			id : "row1",
			content : [ "100", "200", "300" ]
		}, {
			id : "row2",
			content : [ "200", "300", "400" ]
		}, {
			id : "row3",
			content : [ "300", "400", "500" ]
		} ],
		columns : [ {
			index : 0,
			width : '250px'
		}, {
			index : 1,
			width : 100,
			type : "select"
		}, {
			index : 2,
			width : "200px",
			enableEdit : true
		} ]
	});
	var div = document.createElement('div');
	document.body.appendChild(div);
	table.render(div);
	equal(table.getBody().rows.length, 3, 'total 3 rows');
	var row = table.getBody().rows[0];
	/* check each cell width */
	equal(row.cells[0].style.width, '250px', 'check row 1');
	equal(row.cells[1].style.width, '100px', 'check row 2');
	equal(row.cells[2].style.width, '200px', 'check row 3');
	te.obj.push(table);
});

test('get Row', function() {
	expect(1);
	var table = new baidu.ui.Table({
		data : [ {
			content : [ "100", "200", "300" ]
		}, {
			content : [ "400", "500", "600" ]
		} ]
	});
	var div = te.dom[0];
	table.render(div);
	equal(table.getBody().rows.length, 2, '2 rows');
	var row = table.getRow(1);
	checkRowData(row, 3, [ "400", "500", "600" ], 'getRow');
	table.dispose();
});

test('add Row',
		function() {
			expect(15);
			var table = new baidu.ui.Table({
				data : [ {
					content : [ "100", "200", "300" ]
				}, {
					content : [ "400", "500", "600" ]
				} ]
			});
			var div = te.dom[0];
			table.render(div);
			equal(table.getBody().rows.length, 2, '2 rows');
			/* 没有index参数 */
			table.addRow({
				content : [ "700", "800", "900" ]
			});
			var row = table.getRow(2);
			equal(table.getBody().rows.length, 3, '3 rows');
			checkRowData(row, 3, [ "700", "800", "900" ],
					'after addRow without index');

			/* index 0 : add before row 0 */
			table.addRow({
				content : [ "tableCell1", "tableCell2", "tableCell3" ]
			}, 0);
			equal(table.getBody().rows.length, 4, '4 rows');
			row = table.getRow(0);
			checkRowData(row, [ "tableCell1", "tableCell2", "tableCell3" ],
					'after addRow with index');
			row = table.getRow(1);
			checkRowData(row, [ "100", "200", "300" ],
					'after addRow with index');

			row = table.getRow(2);
			checkRowData(row, [ "400", "500", "600" ],
					'after addRow with index');

			row = table.getRow(3);
			checkRowData(row, [ "700", "800", "900" ],
					'after addRow with index');
			table.dispose();
		});

test('remove Row', function() {
	expect(6);
	var table = new baidu.ui.Table({
		data : [ {
			content : [ "100", "200", "300" ]
		}, {
			content : [ "400", "500", "600" ]
		} ]
	});
	var div = te.dom[0];
	table.render(div);
	/* getRowCount */
	equal(table.getRowCount(), 2, 'check rowCount before remove');
	/* 无效index参数 */
	table.removeRow(3);
	equal(table.getBody().rows.length, 2, 'remove invalid 2 rows');
	/* 有效index参数 */
	table.removeRow(0);
	/* getRowCount */
	equal(table.getRowCount(), 1, 'check rowCount after remove');
	var row = table.getRow(0);
	checkRowData(row, [ "400", "500", "600" ], 'after remove Row');

	table.dispose();
});

/* update means to replace original data */
test('update', function() {
	expect(8);
	var table = new baidu.ui.Table({
		data : [ {
			id : "row1",
			content : [ "500", "600", "700" ]
		} ],
		title : [ "columnName-0", "columnName-1", "columnName-2" ]
	});
	var div = te.dom[0];
	table.render(div);
	table.update({
		data : [ {
			id : "",
			content : [ "100", "200", "300" ]
		}, {
			id : "row2",
			content : [ "200", "300", "400" ]
		} ]
	});
	equal(table.getRowCount(), 2, 'check rowCount before remove');
	var row = table.getRow(0);
	checkRowData(row, [ "100", "200", "300" ], 'after update Row');
	row = table.getRow(1);
	checkRowData(row, [ "200", "300", "400" ], 'after update Row');
	/* getTarget */
	equal(div.id, table.getTarget().id, 'check getTarget');
	table.dispose();
});

test('更新不应该使列宽信息丢失', function() {/* PUBLICGE-215 */
	stop();
	ua.loadcss(upath + 'Table/style.css', function() {
		var cs = [ {
			index : 0,
			width : '100px'
		} ];
		var tb = new baidu.ui.Table({
			data : [ {
				id : 'row1',
				content : [ 1 ]
			} ],
			columns : cs
		});
		tb.render(te.dom[0]);
		equals(parseInt($('div#div_test td').css('width')), 100, '通过宽度设置列宽为100');
		tb.update([ {
			data : [ {
				id : 'row1',
				content : [ 2 ]
			} ]
		} ]);
		equals(parseInt($('div#div_test td').css('width')), 100, '更新数据不应该导致列宽信息丢失');
		start();
	});
});

test('dispose', function() {
	var table = new baidu.ui.Table();
	var div = te.dom[0];
	table.render(div);
	table.dispose();
	equal(table.getBody(), null, "table is disposed");
});
