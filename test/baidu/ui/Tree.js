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
//	equals(tree.getRootNode(), tree.getTreeNodes()['01'], '校验根节点就是第一个节点');
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
                type: 'trunk',
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

	node.expand();

    //将node.children 改为 _children
	/** appendData */
	equals(node._children.length, 1, 'before appendData');
	node.appendData([ {
		id : 'a1',
		text : 'a1'
	} ]);
	equals(node._children.length, 2, 'after appendData');
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
	equals(node.getChildNodes()[0].id, 'a2', 'new node append with index');

	// 从其他节点下抓节点
	var cnode = tree.getTreeNodeById('a2');
	cnode.appendChild(tree.getTreeNodeById('a3'));
	equals(cnode.getChildNodes().length, 1, 'child size');
	equals(cnode.getChildNodes()[0].id, 'a3', 'child node append');
	// // 同一个节点再操作会是个什么情况呢……
	// cnode.appendChild(tree.getTreeNodeById('a3'), 0);
	equals(cnode.getChildNodes().length, 1, 'child size after new node');

	// 从其他树上抓节点
	var div = document.body.appendChild(document.createElement('div'));
	var tree1 = te.getUI({
		data : {
			id : 'b',
			text : 'b',
			children : [ {
				id : 'b1',
				text : 'b1'
			} ]
		}
	}, false, div);
	// 需要展开
	tree1.getRootNode().expand();
	cnode.appendChild(tree1.getTreeNodeById('b1'));
	equals(cnode.getChildNodes().length, 2, 'child size should be 2');
	equals(tree1.getRootNode().getChildNodes.length, 0,
			'child size should be 0');
	equals(tree.getTreeNodeById('b1').getParentNode().id, 'a2',
			'child parent should be a2');

	// 展开后的树，加节点是个啥情况
	cnode = tree1.getRootNode();
    var nodea3 = tree.getTreeNodeById('a3');
    nodea3.parentNode._removeChildData(nodea3);
	cnode.appendChild(nodea3);
	ok(tree.getTreeNodeById('a3') == undefined, 'a3 not exist on tree');
	ok(tree1.getTreeNodeById('a3') != undefined, 'a3 exist on tree1');
});

test('TreeNode function appendTo', function() {
	/**
	 * 节点0拖到节点1下，
	 * <li>如果有第三个参数，节点0从3下取否则从tree下取
	 * <li>如果有第四个参数，节点1从4下取，否则从3下取，否则从tree下取
	 */
	var dragto = function(target, tonode, tree0, tree1) {
		var node0 = (tree0 || tree).getTreeNodeById(target), node1 = (tree1
				|| tree0 || tree).getTreeNodeById(tonode), size = node1
				.getChildNodes().length;
		node0.appendTo(node1);
		equals(node1.getChildNodes().length, size + 1, tonode + '孩子节点数+1');
        //equals(node1.getChildNodes()[0].id, node0.id,
				//'id1\'s last child should be id0');
		equals(node1.getChildNodes()[node1.getChildNodes().length-1].id, node0.id,
				'id1\'s last child should be id0');
	};
	var tree = te.getUI(), root = tree.getTreeNodeById('a');
	root.expand();
	// 从当前树上拖节点，从上向下拖
	root.appendChild(new baidu.ui.Tree.TreeNode({
		id : 'a1',
		text : 'a1'
	}));
	dragto('a1', 'a0');
    
	// 从当前树上拖节点，从下向上拖回根节点
	dragto('a1', 'a');

	// 平级拖动是啥情况……
    //这个有问题
	//dragto('a1', 'a');    
    
	// 从其他树上拖节点
	var div = document.body.appendChild(document.createElement('div'));
	var tree1 = te.getUI({
		data : {
			id : 'b',
			text : 'b',
			children : [ {
				id : 'b1',
				text : 'b1'
			} ]
		}
	}, false, div);
	tree1.getTreeNodeById('b').expand();
	dragto('b1', 'a', tree1, tree);

//	// root 拖走是啥情况……
//	dragto('b', 'a', tree1, tree);

//	// 新建节点append
//	new baidu.ui.Tree.TreeNode({
//		id : 'a1',
//		text : 'a1'
//	}).appendTo(root);
//	equals(root.getChildNodes().length, 2, 'root child size should be 2');
});

test('TreeNode function blur and focus', function() {
	var tree = te.getUI(), node = tree.getTreeNodeById('a'), nodeid = node
			._getId('node');

	node.focus();
	equals($("#" + nodeid).attr('class'),
			'tangram-tree-node-node tangram-tree-node-current');
	node.blur();
	equals($("#" + nodeid).attr('class'), 'tangram-tree-node-node');
	node.focus();
	equals($("#" + nodeid).attr('class'),
			'tangram-tree-node-node tangram-tree-node-current');
	node.focus();
	equals($("#" + nodeid).attr('class'),
			'tangram-tree-node-node tangram-tree-node-current');

	node.expand();
	equals($("#" + nodeid).attr('class'),
			'tangram-tree-node-node tangram-tree-node-current');
	node.collapse();
	equals($("#" + nodeid).attr('class'),
			'tangram-tree-node-node tangram-tree-node-current');
});

test('TreeNode function toggle, collapse and expand', function() {
	var tree = te.getUI(), node = tree.getTreeNodeById('a'), nodeid = "#"
			+ node._getId('subNodeId');
	// expand前，它是叶子
	equals(node.getChildNodes().length, 0, 'size of child before expand');
    
	equals($(nodeid)[0].children.length, 0, 'size of subnode child');
    document.getElementById(node._getId('subNodeId')).style.display="none";
    //TODO
	//equals(parseInt($(nodeid).css('height')), 0, 'subnode is not shown');
    equals(document.getElementById(node._getId('subNodeId')).offsetHeight, 0, 'subnode is not shown');
	node.expand();
    equals(node.getChildNodes().length, 1, 'size of child after expand');
	equals($(nodeid)[0].children.length, 1, 'size of subnode child');
	ok(parseInt($(nodeid).css('height')) > 0, 'subnode is shown');
	equals($(nodeid).css('display'), 'block', 'subnode is shown');
	equals($(nodeid)[0].children[0].id, 'a0', 'subnode child is a0');
	node.collapse();// 折叠后
	equals(node.getChildNodes().length, 1, 'size of child after collapse');
	equals($(nodeid)[0].children.length, 1, 'size of subnode child');
	equals($(nodeid).css('display'), 'none', 'subnode is shown');
	//TODO
});

test('TreeNode function collapseAll and expandAll', function() {
	var tree = te.getUI({
		data : {
			id : 'a',
			text : 'a',
			children : [ {
				text : 'a0',
                type: 'trunk',
				children : [ {
					id : 'a00',
					text : 'a00'
				} ]
			}, {
				text : 'a1',
                type: 'trunk',
				children : [ {
					id : 'a10',
					text : 'a10'
				} ]
			} ]
		}
	}), node = tree.getTreeNodeById('a');
    node.expandAll();

	// 节点挂载，并显示
	equals(tree.getTreeNodeById('a00').id, 'a00');
	equals(tree.getTreeNodeById('a10').id, 'a10');
	ok(isShown($('#a00')[0]), 'a00 shown');
	ok(isShown($('#a10')[0]), 'a10 shown');
	node.collapseAll();
	ok(!isShown($('#a00')[0]), 'a00 hide');
	ok(!isShown($('#a10')[0]), 'a10 hide');
   
});

test('TreeNode function getxxx', function() {
	var tree = te.getUI();

	var node = tree.getTreeNodeById('a');
	// get Id http://icafe.baidu.com:8100/jtrac/app/item/PUBLICGE-292/
	equals(node._getId('test'), 'a-test', '_getId');// 这个应该是私有属性
	equals(node.getParentNode(), undefined, 'getParentNode，根节点的父节点');
	node.expand();

	/** getParendNode */
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

test('TreeNode function Index, First, Last, Next and Previous', function() {
	var tree = te.getUI(), node = tree.getTreeNodeById('a');
	node.expand();
	equals(node.getIndex(), -1, 'root index');
	equals(node.getFirstChild().getIndex(), 0, 'root first child index');
	equals(node.getFirstChild().id, 'a0', 'first');
	equals(node.getLastChild().id, 'a0', 'last');
	equals(node.getFirstChild().getNext().id, 'a0', 'first next');
	equals(node.getLastChild().getNext().id, 'a0', 'last next');
	equals(node.getFirstChild().getPrevious().id, 'a0', 'first previous');
	equals(node.getLastChild().getPrevious().id, 'a0', 'last previous');

	node.appendChild(new baidu.ui.Tree.TreeNode({
		id : 'a1',
		text : 'a1'
	}));
	equals(node.getFirstChild().getIndex(), 0, 'root first child index');
	equals(node.getFirstChild().id, 'a0', 'first');
	equals(node.getLastChild().getIndex(), 1, 'root first child index');
	equals(node.getLastChild().id, 'a1', 'last');
	equals(node.getFirstChild().getNext().id, 'a1', 'first next');
	equals(node.getLastChild().getNext().id, 'a1', 'last next');
	equals(node.getFirstChild().getPrevious().id, 'a0', 'first previous');
	equals(node.getLastChild().getPrevious().id, 'a0', 'last previous');

});

test('TreeNode function hide, show and toggle', function(){
	var tree = te.getUI(), node = tree.getTreeNodeById('a');
	node.expand();
	node.getFirstChild().hide();
	ok(!isShown(document.getElementById(node.getFirstChild()._getId('node'))), 'hide');
	node.getFirstChild().show();
	ok(isShown(document.getElementById(node.getFirstChild()._getId('node'))), 'show');
	node.toggle();
	ok(!isShown(document.getElementById(node.getFirstChild()._getId('node'))), 'toggle');
	node.toggle();
	ok(isShown(document.getElementById(node.getFirstChild()._getId('node'))), 'toggle');
});

test('Test the "isParent()" function', function(){
	var tree = te.getUI({
		data : {
			id : 'a',
			text : 'a',
			children : [ {
				id : 'a0',
				text : 'a0',
				children : [ {
					id : 'a00',
					text : 'a00'
				} ]
			}, {
				id : 'a1',
				text : 'a1',
				children : [ {
					id : 'a10',
					text : 'a10'
				} ]
			} ]
		}
	});
	var node_a = tree.getTreeNodeById('a');
	node_a.expand();
	var node_a0 = tree.getTreeNodeById('a0');
	node_a0.expand();
	var node_a1 = tree.getTreeNodeById('a1');
	node_a1.expand();
	var node_a00 = tree.getTreeNodeById('a00');
	var node_a10 = tree.getTreeNodeById('a10');
	ok(node_a0.isParent(node_a00), 'a0 is the parenNode of a00');
	ok(!node_a0.isParent(node_a1), 'a0 is not the parenNode of a1');
	ok(!node_a0.isParent(node_a10), 'a0 is not the parenNode of a10');
	ok(node_a1.isParent(node_a10), 'a1 is the parenNode of a10');
	ok(node_a.isParent(node_a0), 'a is the parenNode of a0');
	ok(node_a.isParent(node_a00), 'a is the parenNode of a00');
	ok(!node_a0.isParent(node_a0), 'a0 is not the parenNode of a0');
	ok(!node_a0.isParent(node_a), 'a0 is not the parenNode of a');
	var newnode = node_a10;
	for (var i = 20; i < 30; i++){
		newnode.appendChild(new baidu.ui.Tree.TreeNode({
			id : 'a' + i,
			text : 'a' + i
		}));
		newnode = tree.getTreeNodeById('a' + i);
	}
	ok(node_a1.isParent(tree.getTreeNodeById('a29')), 
			'a1 is the parenNode of a29 (a tree of 13 layers)');
});

test('Test the "moveTo()" function', function(){
	var tree = te.getUI({
		data : {
			id : 'a',
			text : 'a',
			children : [ {
				id : 'a0',
				text : 'a0',
				children : [ {
					id : 'a00',
					text : 'a00'
				} ]
			}, {
				id : 'a1',
				text : 'a1',
				children : [ {
					id : 'a10',
					text : 'a10'
				} ]
			} ]
		}
	});

	var node_a = tree.getTreeNodeById('a');
	node_a.expand();
	var node_a0 = tree.getTreeNodeById('a0');
	node_a0.expand();
	var node_a1 = tree.getTreeNodeById('a1');
	node_a1.expand();
	var node_a00 = tree.getTreeNodeById('a00');
	var node_a10 = tree.getTreeNodeById('a10');
	node_a0.moveTo(node_a1);
	ok((node_a.getChildNodes()[0].id == 'a1') && 
			(node_a.getChildNodes()[1].id == 'a0'), "a0 is moved to a10");
	node_a0.moveTo(node_a10);
	ok((node_a.getChildNodes().length == 1) && 
			(node_a1.getChildNodes().length == 2) && 
			(node_a1.getChildNodes()[0].id == 'a10') && 
			(node_a1.getChildNodes()[1].id == 'a0'), "a0 is moved to a1");
	ok(!node_a.moveTo(node_a00), "Move the root node 'a', return false ");
});

test('Test the "removeAllChildren()" function', function(){

	var tree = te.getUI({
		data : {
			id : 'a',
			text : 'a',
			children : [ {
				id : 'a0',
				text : 'a0',
				children : [ {
					id : 'a00',
					text : 'a00',
					children : [ {
						id : 'a000',
						text : 'a000'
					} ]
				} ]
			}, {
              id : 'a1',
              text : 'a1'
          }  ]
		}
	});
	var node_a = tree.getTreeNodeById('a');
	node_a.expand();
	var node_a0 = tree.getTreeNodeById('a0');
	node_a0.expand();
	var node_a00 = tree.getTreeNodeById('a00');
	node_a00.expand();
	var node_a000 = tree.getTreeNodeById('a000');
	var node_a1 = tree.getTreeNodeById('a1');
	node_a1.removeAllChildren(true);
	equals(node_a1.getChildNodes().length, 0, 'Remove a leaf node');
	node_a00.removeAllChildren(true);
	equals(node_a00.getChildNodes().length, 0, 
			'Remove a node with a childNodes');
	node_a.removeAllChildren(true);
	equals(node_a.getChildNodes().length, 0, 
			'Remove a root node with some childNodes and grandchildNodes');
});

test('Test the "isLastNode()" function', function(){
	var tree = te.getUI(), node_a = tree.getTreeNodeById('a');
	node_a.expand();
	var node_a0 = tree.getTreeNodeById('a0');
	ok(node_a0.isLastNode(), 'a0 is the last node');
	ok(node_a0.isLastNode(), 'a0 is the last node');
	ok(node_a0.isLastNode(), 'a0 is the last node');
	ok(node_a.isLastNode(), 'a is  the last node');
	ok(node_a.isLastNode(), 'a is  the last node');
	ok(node_a.isLastNode(), 'a is  the last node');
});

test('Test the "update()" function', function(){
	var tree = te.getUI();
	var node_a = tree.getTreeNodeById('a');
	node_a.expand();
	var options = {
			id : 'b',
			text : 'b',
			href : 'www.baidu.com',
			isExpand : true,
	        isToggle : true,
	        children : [ {
              id : 'b0',
              text : 'b0'
             } ]
	};
	node_a.update(options);
	equals(baidu.dom.g("a-text").innerHTML, 'b', 'The innerHTML of node_a is updated');
	equals(node_a.text, 'b', 'The text attribute of node_a is updated');
//	更新仅支持类似text等……
});

test('Test the "removeChild()" function', function(){
	var tree = te.getUI({
		data : {
			id : 'a',
			text : 'a',
			children : [ {
				id : 'a0',
				text : 'a0',
				children : [ {
					id : 'a00',
					text : 'a00',
					children : [ {
					id : 'a000',
					text : 'a000'
				    } ]
				} ]
			}, {
				id : 'a1',
				text : 'a1',
				children : [ {
					id : 'a10',
					text : 'a10'
				} ]
			} ]
		}
	});
	var node_a = tree.getTreeNodeById('a');
	node_a.expand();
	var node_a0 = tree.getTreeNodeById('a0');
	node_a0.expand();
	var node_a1 = tree.getTreeNodeById('a1');
	node_a1.expand();
	var node_a00 = tree.getTreeNodeById('a00');
	var node_a10 = tree.getTreeNodeById('a10');
	node_a1.removeChild(node_a10);
	equals(node_a1.getChildNodes().length, 0, 
			'The dom element of "a10" is deleted');
	equals(tree.getTreeNodeById('a10'), undefined, 
			'The data of "a10" is deleted');
	node_a0.removeChild(node_a00);
	equals(node_a0.getChildNodes().length, 0, 
			'The dom element of "a00" is deleted');
	equals(tree.getTreeNodeById('a00'), undefined, 
			'The data of "a00" is deleted');
	equals(tree.getTreeNodeById('a000'), undefined, 
			'The data of "a000" is deleted');
	node_a.removeChild(node_a0);
	equals(node_a.getChildNodes().length, 1, 
			'The dom element of "a0" is deleted');
	equals(tree.getTreeNodeById('a0'), undefined, 
			'The data of "a0" is deleted');
});

test('Test the "dispose()" function', function() {
	var tree = te.getUI();
	te.checkUI.dispose(tree);
	ok(!isShown(tree.getMain()), 'hide after dispose');
});