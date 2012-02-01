module('baidu.ui.Table.Table$edit');

(function() {
	te.getUI = function() {
		var ui = new baidu.ui.Table({
			data : [ {
				id : "row1",
				content : [ "1", "2" ]
			}, {
				id : "row2",
				content : [ "3", "4" ]
			} ],
			columns : [ {
				index : 0,
				width : '100px'
			}, {
				index : 1,
				width : '100px',
				enableEdit : true
			} ]
		});
		te.obj.push(ui);
		ui.render(te.dom[0]);
		return ui;
	};

	te.getCell = function(row, col, ui) {
		return (ui || te.obj[0]).getRow(row).getCell(col).getMain();
	};

	/**
	 * <li>校验input和可编辑属性一致
	 * <li>可编辑时，校验双击显示input
	 * <li>可编辑时，校验blur后input的value被复制给cell，并，input消失
	 */
	te.checkCell = function(row, col, options) {
		var cell = te.getCell(row, col),
		//
		editable = !!(options && options.editable);
		// 双击进入可编辑状态
		// TT.event.fire(cell, 'dblclick');
		$(cell).dblclick();

		var input = baidu.e(cell).first();
		equals(input._dom.length == 1 && input._dom[0] != null, editable,
				'可编辑状态和输入框的显示保持一致');
		if (editable) {
			// set value and blur
			input._dom[0].value = options.value;
			// TT.event.fire(input._dom[0], 'blur');//TODO 这地方会触发两次，没弄明白原理
			$(input._dom[0]).blur();
			
			stop();
			setTimeout(function() {// IE下blur后的步骤为异步
				equals(cell.innerHTML.replace('<.*$', ''), options.value,
						'blur后，cell的值同input的值');
				equals(input.getStyle('display'), 'none', 'blur后，input隐藏');
				start();
			}, 100);
		}
	};
})();

test('可编辑状态', function() {
	stop();
	ua.importsrc("baidu.element,baidu.dom.first,baidu.dom.getStyle", function(){
		var ui = te.getUI();
		te.checkCell(0, 1, {
			editable : true,
			value : 'test'
		});
	}, "baidu.element", "baidu.ui.Table.Table$edit");
});

test('不可编辑状态，更新为可编辑', function() {
	var ui = te.getUI();
	te.checkCell(0, 0);

	ui.update({
		data : [ {
			id : "row1",
			content : [ "1", "2" ]
		}, {
			id : "row2",
			content : [ "3", "4" ]
		} ],
		columns : [ {
			index : 0,
			width : '100px',
			enableEdit : true
		}, {
			index : 1,
			width : '100px',
			enableEdit : true
		} ]
	});
	te.checkCell(0, 0, {
		editable : true,
		value : 'test'
	});
});

test('可编辑更新为不可编辑', function(){
	var ui = te.getUI();
	ui.update({
		data : [ {
			id : "row1",
			content : [ "1", "2" ]
		}, {
			id : "row2",
			content : [ "3", "4" ]
		} ],
		columns : [ {
			index : 0,
			width : '100px',
			enableEdit : true
		}, {
			index : 1,
			width : '100px'
		} ]
	});
	te.checkCell(0, 1, {});
});
