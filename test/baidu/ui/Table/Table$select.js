module("baidu.ui.Table.Table$select");

(function() {
	function _testStart() {
		te.div = document.createElement("div");
		var _data = [], rowCount = 21;
		for(var i=0;i<rowCount;i++){
//			_data.push({id : "", content : ["select-"+i, "select-"+(i+10), "select-"+(i+20)]});
			_data.push({
		        id : '',
		        content : [
		            '',
		            'select-0' + i,
		            'select-1' + i,
		            'select-2' + i
		        ]
		    });
		}
		document.body.appendChild(te.div);
		te.table = new baidu.ui.Table({
		    title : ['删除', 'column-0', 'column-1', 'column-2'],
		    columns : [{index : 0, type : 'checkbox'}, {index : 1, enableEdit : true}],
		    data : _data,
		    pageSize : 5
		});
//		te.table = new baidu.ui.Table({data : _data, withSelect : true, pageSize : 5, columnIndex : 1, title : ["column-0", "column-1", "column-2"]});
		te.table.render(te.div);
		te.obj.push(te.table);
		te.dom.push(te.div);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);
		_testStart();
	};
})();

test("select & unselect", function(){
	var table = te.table;
	table.select([1, 4]);//2,5条数据选中
	ok(table.getBody().rows[1].cells[0].firstChild.checked, "select-1 is selected");//加title rows要取得为2
	ok(table.getBody().rows[4].cells[0].firstChild.checked, "select-4 is selected");//加title rows要取得为2
	table.unselect([1, 4]);//2,5条数据反选
	ok(!table.getBody().rows[1].cells[0].firstChild.checked, "select-1 is unselected");//加title rows要取得为2
	ok(!table.getBody().rows[4].cells[0].firstChild.checked, "select-4 is unselected");//加title rows要取得为2
});
//
test("selectAll & unselectAll", function(){
	var table = te.table;
	var tab = table.getBody(), val;
	table.selectAll();
	for(var i=0;i<tab.rows.length;i++){
		val = tab.rows[i].cells[0].firstChild.checked;
		if(!val){break;}
	}
	ok(val, "all is selected");
	table.unselectAll();
	for(var i=0;i<tab.rows.length;i++){
		val = tab.rows[i].cells[0].firstChild.checked;
		if(val){break;}
	}
	ok(!val, "all is unselected");
});
//
test("getTitleCheckbox", function(){
	var table = te.table;
	var c = table.getTitleCheckbox();
	ok(table.getTitleBody().rows[0].cells[0].firstChild.nextSibling === c, "this is title checkbox");
});
//
test("toggleAll", function(){
	var table = te.table;
	var state = table.getTitleCheckbox().checked, tab = table.getBody(), val = true;
	table.toggleAll();
	for(var i=0;i<tab.rows.length;i++){
		val = tab.rows[i].cells[0].firstChild.checked == state;
		if(!val){break;}
	}
	ok(val, "toggleAll");
});
//
test("getSelected", function(){
	var table = te.table;
	table.unselectAll();//先清空一下选项
	table.select([0, 2]);//选中0,2
	var list = table.getSelected(), tab = table.getBody();
	equals(list.length, 2, "2 row is selected");
	ok(tab.rows[0].cells[1].innerHTML == list[0].content[1]);
	ok(tab.rows[2].cells[1].innerHTML == list[1].content[1]);
});
