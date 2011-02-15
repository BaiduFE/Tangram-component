module('baidu.ui.Table.Table$btn');

/**
 * <li>resize
 * <li>onresize,onupdate,onload
 */

test('onload,resize', function() {
	var table = new baidu.ui.Table( {
		withPager : true,
		data : [ {
			content : [ "data1,data2" ]
		} ]
	});
	var div = te.dom[0];
	table.render(div);
	/* resize */
	equal(table.getPagerContainer().style.width,
			table.getBody().offsetWidth + 'px', 'check table container');
	equal(div.lastChild.id, table.getId("-pager"), 'check pager id');
	ok(table.pager, 'pager is created');
});

/*
 * onupdate(Table中的update)
 */
test('onupdate', function() {
	var table = new baidu.ui.Table( {
		withPager : true,
		pageSize : 1,
		data : [ {
			content : [ "data1", "data2" ]
		}, {
			content : [ "data3", "data4" ]
		} ]
	});
	var div = te.dom[0];
	table.render(div);
	table.update( {
		data : [ {
			id : "",
			content : [ "100", "200", "300" ]
		}, {
			id : "row2",
			content : [ "200", "300", "400" ]
		} ]
	});
	equal(table.getPagerContainer().style.width,
			table.getBody().offsetWidth + 'px', 'check table container');
});

/* onaddrow,onremoverow调用btn自己的update函数 */
test('update', function() {
	var table = new baidu.ui.Table( {
		withPager : true,
		data : [ {
			content : [ "data1", "data2" ]
		}, {
			content : [ "data3", "data4" ]
		}, {
			content : [ "data5", "data6" ]
		} ],
		pageSize : 2
	});
	var div = te.dom[0];
	table.render(div);
	table.removeRow(0);
	equal(table.getTotalPage(), 1, '1 page');
	/*
	 * 保证update被触发，不验证具体功能,addRow&&removerow在Table$page中验证，pager.update在pager中验证
	 * endPage必须比总页数大1
	 */
	equal(table.pager.endPage, 2, 'endPage is 2');
	table.addRow( {
		content : [ "700", "800" ]
	});
	equal(table.getTotalPage(), 2, '2 pages');
	equal(table.pager.endPage, 3, 'endPage is 3');
});

/* window.resizeTo在一些标签型浏览器中无效，如chrome，在ie8下证实可以 */
/* resize 通过frame方式进行 */
test('onresize', function() {
	ua
			.frameExt(function(w, f) {
				var tb = new w.baidu.ui.Table( {
					withPager : true,
					data : [ {
						content : [ "data1", "data2" ]
					}, {
						content : [ "data3", "data4" ]
					}, {
						content : [ "data5", "data6" ]
					} ],
					pageSize : 2
				});
				tb.render(w.document.body.appendChild(w.document
						.createElement('div')));
				$(f).css('width', 600);
				equals(parseInt(w.$(tb.getPagerContainer()).css('width')),
						parseInt(w.$(tb.getBody()).css('width')),
						'窗口大小变化后，重绘按钮位置');
				this.finish();
			});
});