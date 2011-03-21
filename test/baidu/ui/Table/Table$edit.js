module('baidu.ui.Table.Table$edit');

/**
 * 检测单元格是否可编辑
 * <li>双击
 * <li>判断子元素是否input及是否显示
 * <li>设定值并blur，确认cell是否值改变
 * 
 * @return
 */
var check = function(c, isEditable, newValue) {
	var first, last = newValue || 'test';
	if (isEditable) {
		first = c.innerHTML.replace('<.*$', '');
//		console.log(first);
	}
	$(c).dblclick();
	if (isEditable) {/* 检测包含子元素并子元素标签并子元素value */
		ok(c.firstChild && c.firstChild.tagName == 'INPUT'
				&& c.firstChild.value == first,
				'双击后出现输入框，输入框value为当前cell内容:' + first);

		c.firstChild.value = last;

		/* 输入值并触发blur，应该使cell值发生变化 */
		$(c.firstChild).blur();
		equals(c.innerHTML, last, '输入确认后单元格应该和新值一致');
	} else { /* 不包含元素，或者元素不显示 */
		ok(!c.firstChild || c.firstChild.tagName != 'INPUT'
				|| c.firstChild.style.display == 'none', '不包含子元素或者子元素不显示');
	}
};

test('校验是否可编辑和非可编辑', function() {
	var columns = [ {
		index : 0,
		width : '100px'
	}, {
		index : 1,
		width : '100px',
		enableEdit : true
	} ];
	/**
	 * 初始化一个table，第1、2列不可以编辑，第3列可以编辑
	 */
	var tb = new baidu.ui.Table( {
		data : [ {
			id : "row1",
			content : [ "1", "2" ]
		}, {
			id : "row2",
			content : [ "3", "4" ]
		} ],
		columns : columns
	});
	tb.render(te.dom[0]);
	te.obj.push(tb);

	/**
	 * 双击第3列，进入编辑状态
	 */
	check(tb.getRow(0).getCell(1).getMain(), true);
	check(tb.getRow(1).getCell(1).getMain(), true);

	/**
	 * 双击第1列，不应该进入编辑状态
	 */
	check(tb.getRow(0).getCell(0).getMain(), false);

	/**
	 * 更新非可编辑列为可编辑列
	 */
	columns[0].enableEdit = true;
	tb.update({columns: columns});
	check(tb.getRow(0).getCell(0).getMain(), true);
	
	/**
	 * 更新非可编辑列为不可编辑列
	 */
	columns[0].enableEdit = false;
	tb.update(columns);
	check(tb.getRow(0).getCell(0).getMain(), false);//PUBLICGE-216
});
