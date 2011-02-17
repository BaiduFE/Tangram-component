module('baidu.ui.Table.Table$page');

/**
 * addRow removeRow gotoPage prevPage nextPage
 * 
 */
var checkCellData = function(cells, expectedData, msg) {
	for ( var index in expectedData) {
		equal(cells[index].innerHTML, expectedData[index], msg + ' cell '
				+ index);
	}
};

/*检查分页*/
test('createPage',function(){
	expect(5);
	var table = new baidu.ui.Table( {
		pageSize : 2,
		data : [ {
			content : [ "data1", "data2" ]
		}, {
			content : [ "data3", "data4" ]
		} ,{
			content : [ "data5", "data6" ]
		} ]
		/* addRow触发 ,还没有翻页，仍然是当前页 */
	});
	var div = te.dom[0];
	table.render(div);
	equal(table.data.length,2,'2 pages');
	equal(table.data[0].content[0],"data1");
	equal(table.data[0].content[1],"data2");
	equal(table.data[1].content[0],"data3");
	equal(table.data[1].content[1],"data4");
	
});

/* nextPage,prevPage实际上调的就是gotoPage */
test('gotoPage', function() {
	expect(8);
	var table = new baidu.ui.Table( {
		pageSize : 2,
		data : [ {
			content : [ "data1", "data2" ]
		}, {
			content : [ "data3", "data4" ]
		}, {
			content : [ "data5", "data6" ]
		} ],
		ongotopage : function() {
			var cells = table.getBody().rows[0].cells;
			checkCellData(cells, [ "data5", "data6" ], 'ongotoPage');
			equal(table.getBody().rows.length, 1, 'check row length');
			equal(table.currentPage, 2, 'current page is 2');
		}
	});
	var div = te.dom[0];
	table.render(div);
	equal(table.getCurrentPage(), 1, 'current page 1');
	table.gotoPage(++table.currentPage);
	equal(table.getTotalCount(), 3, 'data length');
	equal(table.getTotalPage(), 2, '2 pages');
	equal(table.getCurrentPage(), 2, 'current page 2');
});

test('prev/next page', function() {
	expect(16);
	var table = new baidu.ui.Table( {
		pageSize : 2,
		data : [ {
			content : [ "data1", "data2" ]
		}, {
			content : [ "data3", "data4" ]
		}, {
			content : [ "data5", "data6" ]
		} ],
		/* prevPage时触发，第二个页面行数比第一个少，因此滚动到第一个页面的时候会触发addeRow事件把第二行加上 */
		onaddrow : function() {
			var rows = table.getBody().rows;
			equal(rows.length, 2, 'row length is 2');
			checkCellData(rows[0].cells, [ "data1", "data2" ], 'add row data');
			checkCellData(rows[1].cells, [ "data3", "data4" ], 'add row data');
		},
		/* nextPage时触发，第二个页面行数比第一个少，因此滚动到第二个页面的时候会触发removeRow事件把第二行删掉 */
		onremoverow : function() {
			var rows = table.getBody().rows;
			equal(rows.length, 1, 'row length is 1');
			var cells = rows[0].cells;
			checkCellData(cells, [ "data5", "data6" ], 'remove row data');
		}
	});
	var div = te.dom[0];
	table.render(div);
	table.nextPage();
	var cells = table.getBody().rows[0].cells;
	checkCellData(cells, [ "data5", "data6" ], 'nextPage');
	table.nextPage();
	cells = table.getBody().rows[0].cells;
	checkCellData(cells, [ "data5", "data6" ], 'next nextPage');
	table.prevPage();
	cells = table.getBody().rows[0].cells;
	checkCellData(cells, [ "data1", "data2" ], 'prevPage row0');
	cells = table.getBody().rows[1].cells;
	checkCellData(cells, [ "data3", "data4" ], 'prevPage row1');
});

/* 当前页面为1,需要插入的页面编号为2，因此必须滚动到插入页的时候才真正做插入动作,从而可以节约资源 */
test('addRow---currpage<insertPage', function() {
	expect(5);
	var table = new baidu.ui.Table( {
		pageSize : 2,
		data : [ {
			content : [ "data1", "data2" ]
		}, {
			content : [ "data3", "data4" ]
		} ],
		/* addRow触发 ,还没有翻页，仍然是当前页 */
		onaddrow : function() {
			var rows = table.getBody().rows;
			equal(rows.length, 2, 'row length is 2');
			checkCellData(rows[0].cells, [ "data1", "data2" ], 'add row data');
			checkCellData(rows[1].cells, [ "data3", "data4" ], 'add row data');
		}
	});
	var div = te.dom[0];
	table.render(div);
	/* 不设置index ,add以后并不立即插入 */
	table.addRow( {
		content : [ "700", "800" ]
	});
});

/* 只有当插入的页面编号小于当前页面编码的时候，插入页面的内容会溢出到后面的页面 */
test('addRow---currpage>=insertPage', function() {
	expect(9);
	var table = new baidu.ui.Table( {
		pageSize : 2,
		data : [ {
			content : [ "data1", "data2" ]
		}, {
			content : [ "data3", "data4" ]
		}, {
			content : [ "data5", "data6" ]
		} ],
		/* addRow触发 */
		onaddrow : function() {
			var rows = table.getBody().rows;
			equal(rows.length, 2, 'row length is 2');
			checkCellData(rows[0].cells, [ "data3", "data4" ], 'add row data');
			checkCellData(rows[1].cells, [ "data5", "data6" ], 'add row data');
		}
	});
	var div = te.dom[0];
	table.render(div);
	table.nextPage();
	/* 设置index ,add以后第一页的数据溢出到第二页 */
	table.addRow( {
		content : [ "700", "800" ]
	}, 0);
	table.prevPage();
	var rows = table.getBody().rows;
	checkCellData(rows[0].cells, [ "700", "800" ], 'add row data');
	checkCellData(rows[1].cells, [ "data1", "data2" ], 'add row data');
});

test('removeRow--currPage<delePage', function() {
	expect(9);
	var table = new baidu.ui.Table( {
		pageSize : 2,
		data : [ {
			content : [ "data1", "data2" ]
		}, {
			content : [ "data3", "data4" ]
		}, {
			content : [ "data5", "data6" ]
		} ],
		/* removeRow触发 */
		onremoverow : function() {
			var rows = table.getBody().rows;
			equal(rows.length, 2, 'row length is 2');
			checkCellData(rows[0].cells, [ "data1", "data2" ],
					'remove row data');
			checkCellData(rows[1].cells, [ "data3", "data4" ],
					'remove row data');
		}
	});
	var div = te.dom[0];
	table.render(div);
	table.removeRow(2);
	table.nextPage();
	var rows = table.getBody().rows;
	/* 只有1页了，所以nextPage以后仍然是当前页 */
	checkCellData(rows[0].cells, [ "data1", "data2" ], 'remove row data');
	checkCellData(rows[1].cells, [ "data3", "data4" ], 'remove row data');
});

test('removeRow--currPage>=delePage', function() {
	expect(7);
	var table = new baidu.ui.Table( {
		pageSize : 2,
		data : [ {
			content : [ "data1", "data2" ]
		}, {
			content : [ "data3", "data4" ]
		}, {
			content : [ "data5", "data6" ]
		}, {
			content : [ "data7", "data8" ]
		} ],
		/* removerow触发,第一页的内容被删除，第二页的内容向上挪 */
		onremoverow : function() {
			var rows = table.getBody().rows;
			equal(rows.length, 1, 'row length is 1');
			checkCellData(rows[0].cells, [ "data7", "data8" ], 'add row data');
		}
	});
	var div = te.dom[0];
	table.render(div);
	table.nextPage();
	table.removeRow(0);
	table.prevPage();
	var rows = table.getBody().rows;
	checkCellData(rows[1].cells, [ "data5", "data6" ], 'remove row data');
	checkCellData(rows[0].cells, [ "data3", "data4" ], 'remove row data');
});

/* 没有设置pageSize的时候，不分页，直接添加或删除行 */
test('add/remove Row with pageSize', function() {
	expect(12);
	var rows;
	var table = new baidu.ui.Table( {
		data : [ {
			content : [ "data1", "data2" ]
		}, {
			content : [ "data3", "data4" ]
		} ],
		onaddrow : function() {
			rows = table.getBody().rows;
			equal(rows.length, 3, 'row length is 3');
			checkCellData(rows[0].cells, [ "data1", "data2" ], 'add row data');
			checkCellData(rows[1].cells, [ "data3", "data4" ], 'add row data');
			checkCellData(rows[2].cells, [ "700", "800" ], 'add row data');
		},
		/* removerow触发 */
		onremoverow : function() {
			rows = table.getBody().rows;
			equal(rows.length, 2, 'row length is 2');
			checkCellData(rows[0].cells, [ "data1", "data2" ], 'add row data');
			checkCellData(rows[1].cells, [ "700", "800" ], 'add row data');
		}
	});
	var div = te.dom[0];
	table.render(div);
	table.addRow( {
		content : [ "700", "800" ]
	});
	table.removeRow(1);
});
