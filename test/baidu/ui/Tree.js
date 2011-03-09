/**
 * check Button properties, methods and events TreeNode的校验，在Tree中进行
 */
module("baidu.ui.Tree");

(function() {
	function mySetup() {
		var div = document.createElement('div');
		div.id = 'div_test';
		document.body.appendChild(div);
		te.dom.push(div);
		te.getUI = function(opt) {
			var ui = new baidu.ui.Tree(opt);
			te.obj.push(ui);
			return ui;
		};
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);
		;
		mySetup();
	};
})();

/**
 * 基础校验
 * <li>类型
 * <li>render
 */
test("base", function() {
	var options = {
		data : {
			id : '01',
			text : '根节点'
		}
	};
	var tree = te.getUI(options);
	// 树的属性校验
	equals(tree.uiType, 'tree', 'uiType');
	tree.render(te.dom[0]);
	ok(isShown(tree.getMain()), '树是否显示');
	equals(tree.getMain().firstChild.className, 'tangram-tree', '树class name');

	// 节点属性校验
	equals(tree.getRootNode().uiType, 'tree-node', 'node ui type');
	equals(tree.getRootNode().type, 'root', 'node type');
	same(tree.getRootNode().text, '根节点', '根节点文本');
	equals(tree.getRootNode(), tree.getTreeNodes()['01'], '校验根节点就是第一个节点');
	ok(isShown(tree.getRootNode()._getNodeElement()), '根节点是否显示');
	equals(tree.getRootNode()._getNodeElement().className,
			'tangram-tree-node-node', '根节点class name');

	te.dom.push(tree.getMain());
});

test('参数：多个子节点', function() {
	var options = {
		data : {
			text : 'a',
			children : [ {
				text : 'a0',
				children : [ {
					text : 'a00'
				} ]
			}, {
				text : 'a1'
			} ]
		}
	};
	var tree = te.getUI(options);
	tree.render(te.dom[0]);
	equals(tree.getRootNode().getChildNodes().length, 0, '默认不显示子节点');

	tree.getRootNode().expand();// 节点操作有单独用例进行，此处仅确认是否正确加载了所有数据,expandAll貌似有问题……
	equals(tree.getRootNode().getChildNodes().length, 2, 'toggle后显示2个子节点');
	equals(tree.getRootNode().getChildNodes()[0].text, 'a0', 'toggle后显示2个子节点');
	equals(tree.getRootNode().getChildNodes()[1].text, 'a1', 'toggle后显示2个子节点');
	tree.getRootNode().getChildNodes()[0].expand();
	equals(tree.getRootNode().getChildNodes()[0].getChildNodes()[0].text,
			'a00', 'toggle后显示2个子节点');
});

test('参数：其他', function() {
	var options = {
		data : {
			text : 'a',
			children : [{text:'a0'}]
		},
		parentNode : null,
		hasCheckbox : false,
		expandable : false
	};
});
