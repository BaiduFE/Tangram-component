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
		te.getUI = function(opt, norender, target) {
			opt = opt || {
				data : {
					id : 'a',
					text : 'a',
					children : [ {
						id : 'a0',
						text : 'a0'
					} ]
				}
			};
			var ui = new baidu.ui.Tree(opt);
			if (!norender)
				ui.render(target || div);
			te.obj.push(ui);
			if (target)
				te.dom.push(target);
			return ui;
		};
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);
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
	var tree = te.getUI(options, true);
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
	equals(tree.getRootNode().getChildNodes().length, 0, '默认不显示子节点');

	tree.getRootNode().expand();// 节点操作有单独用例进行，此处仅确认是否正确加载了所有数据,expandAll貌似有问题……
	equals(tree.getRootNode().getChildNodes().length, 2, 'toggle后显示2个子节点');
	equals(tree.getRootNode().getChildNodes()[0].text, 'a0', 'toggle后显示2个子节点');
	equals(tree.getRootNode().getChildNodes()[1].text, 'a1', 'toggle后显示2个子节点');
	tree.getRootNode().getChildNodes()[0].expand();
	equals(tree.getRootNode().getChildNodes()[0].getChildNodes()[0].text,
			'a00', 'toggle后显示2个子节点');
});

test('参数：expandable', function() {
	var options = {
		data : {
			text : 'a',
			children : [ {
				text : 'a0'
			} ]
		},
		// parentNode : null,
		// hasCheckbox : false,
		expandable : false
	};
	var tree = te.getUI(options);
	equals(tree.getRootNode().getChildNodes().length, 0, '默认不显示子节点');

	tree.getRootNode().expand();// 应该是不可展开
	equals(tree.getRootNode().getChildNodes.length, 0, '不可展开');

	// options.hasCheckbox = true;//checkbox貌似暂时不支持
	// tree = te.getUI(options);
	// tree.render(te.dom[0]);
	// tree.getRootNode().expand();
});

test('Tree function list', function() {
	var options = {};
	var tree = te.getUI();

	// getTreeNodeById
	equals(tree.getTreeNodeById('a').text, 'a', 'getNodeById');
	equals(tree.getTreeNodeById('aa'), undefined, 'getNodeById, not exist');
	equals(tree.getTreeNodeById('a0'), undefined, 'getNodeById, not expanded');
	tree.getTreeNodeById('a').expand();
	var node = tree.getTreeNodeById('a0');
	// 针对对象进行的操作可能存在死循环情况……
	equals(node && node.id, 'a0', 'getNodeById, expanded');

	// getCurrentNode
	equals(tree.getCurrentNode(), undefined, 'getCurrentNode, not set');
	tree.setCurrentNode(node);
	node = tree.getCurrentNode();
	// 这个 地方味道不太好，set current node居然没有任何额外的操作，
	// 比如class变更等，如果是这样
	// 是不是应该做为一个内部方法……
	equals(node && node.id, 'a0', 'setCurrentNode and get');
});

test('TreeNode constructor', function() {
	var node = new baidu.ui.Tree.TreeNode({
		text : 'a'
	});
	equals(node.uiType, 'tree-node', 'check ui type');
	equals(node.type, 'leaf', 'check node type');
	ok(/TANGRAM__[a-z]+/.test(node.id), 'check node id : ' + node.id);

});

test('TreeNode function appendData', function() {
	var tree = te.getUI(), node = tree.getTreeNodeById('a');

	/** appendData */
	equals(node.children.length, 1, 'before appendData');
	node.appendData([ {
		id : 'a1',
		text : 'a1'
	} ]);
	node.expand();
	equals(node.children.length, 2, 'after appendData');
	var cnode = tree.getTreeNodeById('a1');
	equals(cnode && cnode.id, 'a1', 'node exist on tree');
	/** appendData end */

});

test('TreeNode function appendChild', function() {
	var tree = te.getUI(), node = tree.getTreeNodeById('a');
	// 未展开时
	node.appendChild(new baidu.ui.Tree.TreeNode({
		id : 'a2',
		text : 'a2'
	}));
	equals(tree.getTreeNodeById('a2').getParentNode().id, 'a',
			'new node append');
	node.appendChild(new baidu.ui.Tree.TreeNode({
		id : 'a3',
		text : 'a3'
	}), 0);
	equals(node.getChildNodes()[0].id, 'a3', 'new node append with index');

	// 从其他节点下抓节点
	var cnode = tree.getTreeNodeById('a2');
	cnode.appendChild(tree.getTreeNodeById('a3'));
	equals(cnode.getChildNodes().length, 1, 'child size');
	equals(cnode.getChildNodes()[0].id, 'a3', 'child node append');
	// 同一个节点再操作会是个什么情况呢……
	cnode.appendChild(tree.getTreeNodeById('a3'), 0);
	equals(cnode.getChildNodes().length, 1, 'child size after new node');

	// 从其他树上抓节点
	var tree1 = te.getUI({
		data : {
			id : 'b',
			text : 'b',
			children : [ {
				id : 'b1',
				text : 'b1'
			} ]
		}
	}, false, document.body.appendChild(document.createElement('div')));
	// 需要展开
	tree1.getRootNode().expand();
	cnode.appendChild(tree1.getTreeNodeById('b1'));
	equals(cnode.getChildNodes().length, 2,
			'child size should be 2 after new node append');
	equals(tree1.getRootNode().getChildNodes.length, 0,
			'child size should be 0');
	equals(tree.getTreeNodeById('b1').getParentNode().id, 'a2',
			'new child parent should be a2');

	// 展开后的树，加节点是个啥情况
	cnode = tree1.getRootNode();
	cnode.appendChild(tree.getTreeNodeById('a3'));
	cnode.appendChild(tree.getTreeNodeById('a3'));
	var onode = tree.getTreeNodeById('a3');
	ok(onode == undefined, 'tree node with id a3 not exist');
	equals(tree1.getTreeNodeById('a3').id, 'a3', 'a3 on tree1');
});

test('TreeNode function getxxx', function() {
	var tree = te.getUI();

	var node = tree.getTreeNodeById('a');
	// get Id http://icafe.baidu.com:8100/jtrac/app/item/PUBLICGE-292/
	equals(node.getId('test'), 'a-test', 'getId');// 这个应该是私有属性

	/** getParendNode */
	equals(node.getParentNode(), undefined, 'getParentNode，根节点的父节点');
	node.expand();
	equals(tree.getTreeNodeById('a0').getParentNode().id, 'a',
			'getParentNode，有父节点的情况');
	node.appendChild(new baidu.ui.Tree.TreeNode({
		id : 'a1',
		text : 'a1'
	}));
	var cnode = tree.getTreeNodeById('a1');
	equals(cnode.getParentNode().id, node.id, 'getParentNode，新增节点的父节点');
	cnode.setParentNode(tree.getTreeNodeById('a0'));
	equals(cnode.getParentNode().id, 'a0', 'getParentNode，转移父节点后的父节点');
	/** getParendNode end */

	/** getTree */
	equals(node.getTree().mainId, tree.mainId, 'getTree from root node');
	equals(cnode.getTree().mainId, tree.mainId, 'getTree from child node');
	var tnode = new baidu.ui.Tree.TreeNode({
		text : 'a2'
	});
	var tt = tnode.getTree();
	var ttsize = 0;
	if (tt)
		for ( var key in tt) {
			ttsize++;
		}
	equals(ttsize, 0, 'getTree from new node should be blank');
	tnode.setTree(tree);
	equals(tnode.getTree().mainId, tree.mainId,
			'getTree from node with set Tree');
	/** getTree end */
});
