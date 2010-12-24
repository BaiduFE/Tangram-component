(function(){
	var table, div = document.createElement("div"), _data = [], rowCount = 21;
	for(var i=0;i<rowCount;i++){
		_data.push({id : "", content : ["select-"+i, "select-"+(i+10), "select-"+(i+20)]});
	}
	document.body.appendChild(div);
	table = new baidu.ui.table.Table({data : _data, withSelect : true, pageSize : 5, columnIndex : 1, title : ["column-0", "column-1", "column-2"]});
	table.render(div);
	module("baidu.ui.table.Table$select");
	test("select & unselect", function(){
		table.select([1, 4]);//2,5条数据选中
		ok(div.firstChild.rows[2].cells[1].firstChild.checked, "select-1 is selected");//加title rows要取得为2
		ok(div.firstChild.rows[5].cells[1].firstChild.checked, "select-4 is selected");//加title rows要取得为2
		table.unselect([1, 4]);//2,5条数据反选
		ok(!div.firstChild.rows[2].cells[1].firstChild.checked, "select-1 is unselected");//加title rows要取得为2
		ok(!div.firstChild.rows[5].cells[1].firstChild.checked, "select-4 is unselected");//加title rows要取得为2
	});
	//
	test("selectAll & unselectAll", function(){
		var tab = div.firstChild, val;
		table.selectAll();
		for(var i=0;i<tab.rows.length;i++){
			val = tab.rows[i].cells[1].firstChild.checked;
			if(!val){break;}
		}
		ok(val, "all is selected");
		table.unselectAll();
		for(var i=0;i<tab.rows.length;i++){
			val = tab.rows[i].cells[1].firstChild.checked;
			if(val){break;}
		}
		ok(!val, "all is unselected");
	});
	//
	test("getTitleCheckbox", function(){
		var c = table.getTitleCheckbox();
		ok(div.firstChild.rows[0].cells[1].firstChild === c, "this is title checkbox");
	});
	//
	test("toggleAll", function(){
		var state = table.getTitleCheckbox().checked, tab = div.firstChild, val = true;
		table.toggleAll();
		for(var i=0;i<tab.rows.length;i++){
			val = tab.rows[i].cells[1].firstChild.checked == state;
			if(!val){break;}
		}
		ok(val, "toggleAll");
	});
	//
	test("getSelected", function(){
		table.unselectAll();//先清空一下选项
		table.select([0, 2]);//选中0,2
		var list = table.getSelected(), tab = div.firstChild;
		equals(list.length, 2, "2 row is selected");
		ok(tab.rows[1].cells[0].innerHTML == list[0].content[0]);
		ok(tab.rows[3].cells[0].innerHTML == list[1].content[0]);
	});
})();