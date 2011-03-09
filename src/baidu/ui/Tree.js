
/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * path: ui/tree/Tree.js
 * author: fx
 * version: 1.0.0
 * date: 2010-10-27
 */

///import baidu.ui.createUI;
///import baidu.string.format;

/**
 * Tree：管理和操作TreeNode
 * @param {Object} options
 * options说明
 * data : 节点数据集合 {text: "", children: [{text: ""},{text: ""}]}
 * _hoverNode : hover时候返回的节点,默认值为null
 * _rootNode : 根节点,默认值为null,
 * parentNode : 父节点,默认值为null,
 * hasCheckbox  : 是否有复选框,默认值为false
 * _currentNode : 当前节点，默认值为null
 * expandable : 是否改变trunk的状态到leaf,当一个trunk的子节点数为0时，
 * 如果为true,那么就变为leaf的状态，否则就不会变
 */
baidu.ui.Tree = baidu.ui.createUI(function(options) {
        //树的所有节点的集合 树的ID与实例的键值对
        this._treeNodes = {};
});
///import baidu.ui.Tree.TreeNode; //[inner]
baidu.ui.Tree.extend({
    //ui类型
    uiType: 'tree',
    //模板
    tplDOM: "<div class='#{class}'>#{body}</div>",
    /**
     * 取得html string
     * @return tree的htmlstring,
    */
    getString: function() {
        var me = this;
        return baidu.format(me.tplDOM, {
            'class' : me.getClass(),
            body: me._getBodyString()
        });
    },
    /**
     * 渲染树
     * @param {HTMLElement|String} main
     */
    render: function(main) {
        var me = this;
        me.renderMain(main).innerHTML = me.getString();
        me.dispatchEvent('onload');
    },
    /**
     * 内部方法,取得树的HTML的内容
     * @return {String} string.
     */
    _getBodyString: function() {
        var string = '',
            me = this;
        if (me.data) {
            me._rootNode = new baidu.ui.Tree.TreeNode(me.data);
            me._rootNode.isRoot = true;
            me._rootNode.type = 'root';
            me._rootNode._level = 0;
            me._rootNode.setTree(me);
            //初始化树形结构
            string = me._rootNode.getString();
        }
        return string;
        
    },
    /**
     * 取得树的节点的集合map,treeNode的id与treeNode的键值对。
     * @return {Object} map.
     */
    getTreeNodes: function() {
        return this._treeNodes;
    },
    /**
     * 取得树的最根节点
     * @return {TreeNode} treeNode.
     */
    getRootNode: function() {
        return this._rootNode;
    },
    /**
     * 通过id属性来取得treeNode
     * @param {String} id
     * @return {TreeNode} treeNode.
     */
    getTreeNodeById: function(id) {
        return this.getTreeNodes()[id];
    },
    /**
     * 取得树的当前节点
     * @return {TreeNode} treeNode.
     */
    getCurrentNode: function() {
        return this._currentNode;
    },
    /**
     * 设置节点为树的当前节点
     * @return {TreeNode} treeNode.
     */
    setCurrentNode: function(treeNode) {
        this._currentNode = treeNode;
    }
});



