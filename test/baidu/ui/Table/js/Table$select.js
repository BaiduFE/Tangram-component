(function(){
    module("baidu.ui.Table.Table$select");
    function build(){
        var myData = [],
            rowCount = 10;
        for(var i = 0; i < rowCount; i++){
            myData.push({content : ['', 'text~0' + i, 'text~1' + i, 'text~2' + i]});
        }
        return new baidu.ui.Table({
            data : myData,
            columns : [{index : 0, type : 'checkbox'}]
        });
    }
    //
    test("select & unselect", function(){
        var table = build();
            table.render(te.dom[0]);
            table.select([1, 4]);//2,5条数据选中
        ok(table.getBody().rows[1].cells[0].firstChild.checked, "select-1 is selected");
        ok(table.getBody().rows[4].cells[0].firstChild.checked, "select-4 is selected");
            table.unselect([1, 4]);//2,5条数据反选
        ok(!table.getBody().rows[1].cells[0].firstChild.checked, "select-1 is unselected");//加title rows要取得为2
        ok(!table.getBody().rows[4].cells[0].firstChild.checked, "select-4 is unselected");//加title rows要取得为2
    });
    //
    test("selectAll & unselectAll", function(){
        var table = build(),
            val;
            table.render(te.dom[0]);
            table.selectAll();
        for(var i = 0; i < table.getBody().rows.length; i++){
            val = table.getBody().rows[i].cells[0].firstChild.checked;
            if(!val){break;}
        }
        ok(val, "all is selected");
            table.unselectAll();
        for(var i = 0; i < table.getBody().rows.length; i++){
            val = table.getBody().rows[i].cells[0].firstChild.checked;
            if(val){break;}
        }
        ok(!val, "all is unselected");
    });
    //
    test("getSelected", function(){
        var table = build(), list;
            table.render(te.dom[0]);
        table.select([0, 2]);//选中0,2
        list = table.getSelected();
        equals(list.length, 2, "2 row is selected");
        ok(table.getBody().rows[0].cells[1].innerHTML == list[0].content[1], 'row[0] is selected');
        ok(table.getBody().rows[2].cells[1].innerHTML == list[1].content[1], 'row[2] is selected');
    });
//    test("getTitleCheckbox", function(){
//        var table = build(), c;
//            table.render(te.dom[0]);
//        c = table.getTitleCheckbox();
//        ok(table.getBody().rows[0].cells[0].firstChild === c, "this is title checkbox");
//    });

//	test("toggleAll", function(){
//		var state = table.getTitleCheckbox().checked, tab = div.firstChild, val = true;
//		table.toggleAll();
//		for(var i=0;i<tab.rows.length;i++){
//			val = tab.rows[i].cells[1].firstChild.checked == state;
//			if(!val){break;}
//		}
//		ok(val, "toggleAll");
//	});
//	//
})();