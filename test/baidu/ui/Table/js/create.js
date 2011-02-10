module('baidu.ui.table.create');

test('create',function(){
	expect(4);
	var table = baidu.ui.table.create();
	var div = te.dom[0];
	table.render(div);
	equal(table.uiType,"table",'check ui type');
	ok(table.getMain(),'table created');
	equal(table.data.length,0,'data length');
	equal(table._rows.length,0,'row length');
});


test('options',function(){
	expect(4);
	var table = baidu.ui.table.create({
		data : [{
			content : ["20","30"]
		}]
	});
	var div = te.dom[0];
	table.render(div);
	equal(table.uiType,"table",'check ui type');
	ok(table.getMain(),'table created');
	equal(table.data.length,1,'data length');
	equal(table._rows.length,1,'row length');
});