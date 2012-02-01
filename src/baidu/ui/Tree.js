
/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * path: ui/tree/Tree.js
 * author: fx
 * version: 1.0.0
 * date: 2010-10-27
 */

///import baidu.ui.createUI;
///import baidu.array.each;
///import baidu.array.remove;
///import baidu.dom.addClass;
///import baidu.dom.children;
///import baidu.dom.g;
///import baidu.dom.insertHTML;
///import baidu.dom.insertBefore;
///import baidu.dom.insertAfter;
///import baidu.dom.hide;
///import baidu.dom.remove;
///import baidu.dom.removeClass;
///import baidu.dom.show;
///import baidu.event.stopPropagation;
///import baidu.object.extend;
///import baidu.string.format;
///import baidu.string.encodeHTML;

/**
 * Tree：管理和操作TreeNode
 * @name baidu.ui.Tree
 * @class
 * @grammar new baidu.ui.Tree(options)
 * @param {Object} options
 * @config {Object} data 节点数据集合 {text: "", children: [{text: ""},{text: ""}]}
 * @config {Boolean} expandable  是否改变trunk的状态到leaf,当一个trunk的子节点数为0时，如果为true,那么就变为leaf的状态，否则就不会变
 * @config {Function} onclick  节点被点击后触发。
 * @config {Function} ontoggle  节点被展开或收起后触发。
 * @config {Function} onload  Tree渲染后触发。
 */

//  _rootNode : 根节点,默认值为null,
// _currentNode : 当前节点，默认值为null

baidu.ui.Tree = baidu.ui.createUI(function(options) {
    //树的所有节点的集合 树的ID与实例的键值对
    this._treeNodes = {};
});

//TreeNode类 

//此类做了以下优化。
//1. TreeNode通过字符串拼装HTML来代替模板format,因为多次使用
//   format是非常耗性能的。
//2. 弃用了baidu.ui.createUI的方法，在多次使用createUI有性能瓶颈。
//3. 增加了分步渲染机制。
//4. 优化了_getId,_getClass,_getCallRef等调用次数较多的方法。
//5. 减少函数调用的次数。比如_getId(),在初始化时，是通过字符串拼接来实现，因为一个函数多次调用
//   也对性能有影响。
//6. 用数组push再join代替字符串拼装。
//   如果字符串的叠加次数小于3至5，建议还是用字符串叠加，因为多次实例化一个Array，并且再join(''),
//   也挺消耗性能的。
//7. 去掉了不必要的HTML与样式，这些都会耗损渲染性能。

/**
 * 树节点类TreeNode
 * @name baidu.ui.Tree.TreeNode
 * @class
 * @grammar new baidu.ui.Tree.TreeNode(options)
 * @param {Object} options
 * @config {Boolean} isExpand  是否是展开, 默认值为false
 * @config {Array} children 子节点options数组  默认值为null
 * @config {Boolean} isRoot  是否是根节点,默认值为false
 * @config {Boolean} type  节点类型 trunk|leaf, 默认值为'leaf'
 * @config {String} id  节点的唯一标识ID。默认为null
 * @config {String} text  节点显示名称. 默认值为null
 * @config {String} href 节点的链接href. 默认值为null
 * @config {String} target 节点链接的target,有href的时候才生效。默认值为null
 * @config {String} icon 节点图标的路径. 默认值为null
 * @config {String} skin 节点样式选择符. 默认值为null
 * @config {Boolean} isToggle 是否支持节点展开或收起 默认值为true
 */
baidu.ui.Tree.TreeNode = function(options) {
    var me = this;
    baidu.object.extend(me, options);
    //这里只所以需要判断是因为_getId()的实现已经调用到了me.id,而me.id是对外开放的属性。
    me.id = me.id || baidu.lang.guid();
    me.childNodes = [];
    me._children = [];
    window['$BAIDU$']._instances[me.id] = me;
    me._tree = {};
    me._stringArray = [];
    
};



baidu.ui.Tree.TreeNode.prototype =  
/**
 * @lends baidu.ui.Tree.TreeNode.prototype
 */
{
    //ui控件的类型 **必须**
    uiType: 'tree-node',
    //节点的文本属性
    text: '' ,
    //节点类型：root trunk leaf
    type: 'leaf',
    //是否支持toggle
    isToggle: true,
    /**
     * 用来为HTML元素的ID属性生成唯一值。
     * @param {String} key
     * @return {String} id.
     * @private
     */
    _getId: function(key) {
       return this.id + '-' +key;
    },
    /**
     * 用来为HTML元素的class属性生成唯一值。
     * @param {String} key
     * @return {String} class.
     * @private
     */
    _getClass: function(key) {
        var me = this,
            className = 'tangram-tree-node-' + key;
        if( me.skin){
            className += ' '+me.skin+'-'+key;
        }
        return className;
    },
    /**
     * 生成当前实例所对应的字符串
     * @return {String} stringRef.
     * @private
     */
    _getCallRef: function() {
        return "window['$BAIDU$']._instances['" + this.id + "']";
    },
    /**
     * @private
     * 获得TreeNode dom的html string
     * @return {String} htmlstring.
     */
    getString: function() {
        var me = this,
            stringArray = me._stringArray,
            style='';
        stringArray.push('<dl id="',me.id,'">');
        me._createBodyStringArray();
        style = me.isExpand ? "display:''" : 'display:none';
        stringArray.push('<dd  style="'+style+'" id="',me.id,'-subNodeId"></dd></dl>');
        return stringArray.join('');
    },
    /**
     * 取得节点的父节点
     * @return {TreeNode} treeNode.
     */
    getParentNode: function() {
        return this.parentNode;
    },
    /**
     * 设置节点的父节点
     * @param {TreeNode} treeNode
     */
    setParentNode: function(parentNode) {
        var me = this;
        me.parentNode = parentNode;
        me._level = parentNode._level + 1;
    },
    /**
     * 取得节点的子节点数组
     * @return {Array} treeNodes.
     */
    getChildNodes: function() {
        return this.childNodes;
    },
    /**
     * 设置节点的对应的Tree
     * @param {Tree} tree
     */
    setTree: function(tree) {
        var me = this;
        me._tree = tree;
        me._tree._treeNodes[me.id] = me;
    },
    /**
     * 取得节点的对应的Tree
     * @return {Tree} tree.
     */
    getTree: function() {
        return this._tree;
    },
    /**
     * 增加一组children数据。数据格式:[{text:"",href:"",children:[{text:"",href:""}
     * ,{text:"",href:""}]},{text:""},{text:""}]
     * 可以数组里面嵌套数组
     * @param {Array} array
     */
    appendData: function(childrenData) {
        var me = this;
        baidu.dom.insertHTML(me._getSubNodesContainer(), 'beforeEnd'
        , me._getSubNodeString(childrenData));
        me._isRenderChildren = true;
    },
    /**
     * 取得所有子节点返回的HTMLString
     * @param {Array } array
     * @return {String} string.
     * @private
     */
    _getSubNodeString: function(childrenData) {
        var me = this,
            treeNode,
            len,
            stringArray = [],
            ii = 0,
            item,
            len = childrenData.length;
        for (; ii < len; ii++) {
            item = childrenData[ii];
            treeNode = new baidu.ui.Tree.TreeNode(item);
            if (ii == (len - 1)) {
                treeNode._isLast = true;
            }
            me._appendChildData(treeNode, len - 1);
            stringArray.push(treeNode.getString());
        }
        return stringArray.join('');
    },

    /**
     * 递归判断本节点是否是传进来treeNode的父节点
     * @param {TreeNode} treeNode 节点.
     */
    isParent: function(treeNode) {
        var me = this,
            parent = treeNode;
        while (!parent.isRoot && (parent = parent.getParentNode()) ) {
            if (parent == me) {
                return true;
            }
        }
        return false;
    },
    /**
     * 将已有节点添加到目标节点中，成为这个目标节点的子节点。
     * @param {TreeNode} parentNode 节点对象
     */
    appendTo: function(parentNode) {
        var me = this;
        me.getParentNode()._removeChildData(me);
        parentNode.appendChild(me);
        me.dispatchEvent('appendto');
    },
    /**
     * 将此节点移动至一个目标节点,成为这个目标节点的next节点
     * @param {TreeNode}  treeNode 移动至目标节点
     */
    moveTo: function(treeNode) {
        var me = this,
            oldParent = me.getParentNode(),
            newParent,
            index;
        if (oldParent == null) {
            return false;
        }
        //当treeNode是展开并且treeNode有子节点的时候。
        if (treeNode.isExpand && treeNode.getChildNodes().length > 0) {
            newParent = treeNode;
        }
        else {
            newParent = treeNode.getParentNode();
        }
        oldParent._removeChildData(me);
        index = (newParent == treeNode) ? -1 : treeNode.getIndex();
        newParent.appendChild(me, index);
        me.dispatchEvent('moveto');
    },
    /**
     * 新增一个子节点 只是单一的管理数据结构，没有渲染元素的职责。
     * @param {TreeNode} treeNode 需要加入的节点.
     * @param {TreeNode} index 索引，用来定位将节点加到索引对应的节点下.
     * @param {Boolean} isDynamic 是否是动态新增 用来区分动态新增节点和初始化json。
     * 初始化的json里面的children是有数据的，而动态新增节点的children是需要手动加的，
     * 所以如果初始化json就不需要对children进行维护，反之亦然.
     * @private
     */
    _appendChildData: function(treeNode,index,isDynamic) {
        var me = this,
            nodes = me.getChildNodes();
        treeNode.parentNode = me;
        treeNode.setTree(me.getTree());

        if (isDynamic) {
            nodes.splice(index+1 , 0, treeNode);
            //me.children = me.children || [];
            me._children.splice(index+1 , 0, treeNode.json);
        }
        else {
            nodes.push(treeNode);
            me._children.push(treeNode.json);
            //me.children.push(treeNode.json);
        }
    },

    /**
     * 新增一个子节点，1.先判断子节点是否被渲染过，如果渲染过，就将子节点append到自己subNodes容器里，否则就inertHTML的子节点的getString，2.对parentNode与childNodes进行变更， 3.更新treeNode与tree的update。
     * @param  {TreeNode}  treeNode 需要加入的节点(分为已经渲染的节点和为被渲染的节点)，通过treeNode._getContainer()返回值来判断是否被渲染.
     * @param  {Number}  index 此节点做为 节点集合的[index+1]的值
     * @return {TreeNode} treeNode 返回被新增的child
    */
    appendChild: function(treeNode,index) {
        var me = this,
            oldParent,
            string,
            childNodes,
            treeNodeContainer = treeNode._getContainer(),
            subNodeContainer = me._getSubNodesContainer();
        if (index == null) {
            index = me.getChildNodes().length - 1;
        }
        me._appendChildData(treeNode, index, true);
        childNodes = me.getChildNodes();
        oldParent = treeNode.getParentNode();
        string = treeNode.getString();
        //如果是已经被渲染过的节点
        if (treeNodeContainer) {
            //当本节点为展开的trunk节点
            if (index == -1) {
                //当本节点在treeNode加入之前的childNode的length为0时
                if (childNodes.length == 1) {
                    subNodeContainer.appendChild(treeNodeContainer);
                }
                else {
                    baidu.dom.insertBefore(treeNodeContainer, childNodes[1]._getContainer());
                }
            }
            else {
                baidu.dom.insertAfter(treeNodeContainer, childNodes[index]._getContainer());
            }
        }
        else {
            //console.log('-----appendData--------'+index);
            //当本节点为展开的trunk节点
            if (index == -1) {
                //当本节点在treeNode加入之前的childNode的length为0时
                if (childNodes.length == 1) {
                    baidu.dom.insertHTML(subNodeContainer, 'beforeEnd', string);
                }
                else {
                    baidu.dom.insertHTML(childNodes[1]._getContainer(), 'beforeBegin', string);
                }
            }
            else {
                baidu.dom.insertHTML(childNodes[index]._getContainer(), 'afterEnd', string);
            }
        }
        treeNode._updateAll();
        treeNode._updateOldParent(oldParent);
        if (me.type == 'leaf') {
            me.type = 'trunk';
            me._getIconElement().className = me._getClass('trunk');
        }
        me._getSpanElement().innerHTML = me._getImagesString();
        return treeNode;
    },
    /**
     * @private
     * @param {TreeNode} oldParentNode 节点之前的父节点
     * 修改节点原来父节点的状态.
     */
    _updateOldParent: function(oldParent) {
        var me = this;
        if (!oldParent) {
            return false;
        }
        if (oldParent.getLastChild()) {
            oldParent.getLastChild()._update();
        }
        else {
            if (me.getTree().expandable) {
                oldParent._getIconElement().className = me._getClass('leaf');
                oldParent.type = 'leaf';
            }
            oldParent._update();
        }
    },
    /**
     * 内部方法
     * @private
     * 只删除此节点的数据结构关系，而不删除dom元素对象。这个方法被用于appendTo
     * @param {TreeNode} treeNode
     * @param {Boolean} recursion  如果为true,那么就递归删除子节点
     * 主要是在将有子节点的节点做排序的时候会用到。.
     */
    _removeChildData: function(treeNode,recursion) {
        var me = this;
        baidu.array.remove(me._children, treeNode.json);
        baidu.array.remove(me.childNodes, treeNode);
        delete me.getTree().getTreeNodes()[treeNode.id];
        if (recursion) {
            while (treeNode.childNodes[0]) {
                treeNode._removeChildData(treeNode.childNodes[0]);
            }
        }
    },
    /**
     * 批量删除一个节点下的所有子节点
    */
    removeAllChildren: function() {
        var me = this,
            childNodes = me.getChildNodes();
        while (childNodes[0]) {
            me.removeChild(childNodes[0], true);
        }
    },
    /**
    *删除一个子节点
    *1.删除此节点对象的数据结构
    *2.删除此节点所对应的dom元素对象
    *@param {TreeNode} treeNode
    */
    removeChild: function(treeNode) {
        if (treeNode.getParentNode() == null) {
            return false;
        }
        var me = this,
            nodes = me.getChildNodes();
        me._removeChildData(treeNode, true);
        delete me.getTree().getTreeNodes()[treeNode.id];
        baidu.dom.remove(treeNode._getContainer());
        me.getTree().setCurrentNode(null);
        if (nodes.length <= 0 && !me.isRoot) {
            me._getSubNodesContainer().style.display = 'none';
            if (me.getTree().expandable) {
                me._getIconElement().className = me._getClass('leaf');
                me.type = 'leaf';
            }
        }
        me._updateAll();
    },
   /**
    * 除了更新节点的缩进图标状态外，还更新privious的状态
    * @private
    */
    _updateAll: function() {
        var me = this,
            previous = me.getPrevious();
        previous && previous._update();
        me._update();
    },
   /**
    * 更新节点的缩进，以及图标状态
    * @private
    */
    _update: function() {
        var me = this;
        me._getSpanElement().innerHTML = me._getImagesString();
        baidu.array.each(me.childNodes, function(item) {
            item._update();
        });
    },
    /**
    *更新节点的一系列属性
    *1.如有text,就更新text.
    *2.如有icon
    *@param {Object} options
    */
    update: function(options) {
        var me = this,
            hrefElement = me._getHrefElement(),
            textElement = me._getTextElement();
        baidu.extend(me, options);
        (hrefElement ? hrefElement : textElement).innerHTML = me.text;
    },
   /**
    * 切换toggle状态
    * @param {String} "block" or "none"
    * @param {String} "Lminus" or "Lplus"
    * @param {String} "Tminus" or "Tplus"
    * @param {Boolean} true or false
    * @private
    */
    _switchToggleState: function(display,lastClassName,className,flag) {
        var me = this,
            toggleElement = me._getToggleElement();
        if (me.type == 'leaf') {
            return false;
        }
        me.isExpand = flag;
        if (toggleElement) {
            toggleElement.className = me._getClass(me.isLastNode() ? lastClassName : className);
        }
        if (me.getChildNodes() && me.getChildNodes().length > 0) {
            me._getSubNodesContainer().style.display = display;
        }
    },
    /**
     * 展开节点
     * 分步渲染。第一次expand会渲染节点
     */
    expand: function() {
        var me = this;
        if (!me._isRenderChildren) {
            me.appendData(me.children);
        }
        me._switchToggleState('block', 'Lminus', 'Tminus', true);
    },
   /**
    * 收起节点
    */
    collapse: function() {
        this._switchToggleState('none', 'Lplus', 'Tplus', false);
    },
    /**
     * 切换，收起或者展开
     */
    toggle: function() {
        var me = this;
        if (me.type == 'leaf') {
            return false;
        }
        me.isExpand ? me.collapse() : me.expand();
    },

    /**
     * 切换focus的状态
     * @param {String className} className
     * @param {Bollean flag} flag
     * @param {String methodName} 方法名.
     * @private
     */
    _switchFocusState: function(className,flag,methodName) {
        var me = this;
        baidu.dom[methodName](me._getNodeElement() , me._getClass('current'));
        if (me.type != 'leaf') {
            me._getIconElement().className = me._getClass(className);
            me.isOpen = flag;
        }
    },
    /**
     * 失去焦点,让当前节点取消高亮。
     */
    blur: function() {
        var me = this;
        me._switchFocusState('trunk', false, 'removeClass');
        me.getTree().setCurrentNode(null);
    },
   /**
    * 取得焦点,并且让当前节点高亮，让上一节点取消高亮。
    */
    focus: function() {
        var me = this,
            oldNode = me.getTree().getCurrentNode();
        if (oldNode != null) {
            oldNode.blur();
        }
        me._switchFocusState('open-trunk', true, 'addClass');
        me.getTree().setCurrentNode(me);
        baidu.dom.removeClass(me._getNodeElement(), me._getClass('over'));
    },
    /**
     * 鼠标放上去的效果
     * @private
     */
    _onMouseOver: function(event) {
        var me = this;
        if (me != me.getTree().getCurrentNode()) {
            baidu.dom.addClass(me._getNodeElement(), me._getClass('over'));
        }
        me.dispatchEvent('draghover', {event: event});
        me.dispatchEvent('sorthover', {event: event});
    },
    /**
     * 鼠标离开的效果
     * @private
     */
    _onMouseOut: function() {
        var me = this;
        baidu.dom.removeClass(me._getNodeElement(), me._getClass('over'));
        me.getTree().dispatchEvent('mouseout', {treeNode: me});
    },
   /**
    * 点击节点时候的效果
    * @private
    */
    _onClick: function(eve) {
        var me = this;
        me.focus();
        me.getTree().dispatchEvent('click', {treeNode: me});
    },
   /**
    * mousedown节点时候的效果
    * @private
    */
    _onMouseDown: function(event) {
        var me = this;
        me.dispatchEvent('dragdown', {event: event});
    },
    
   /**
    * 当鼠标双击节点时的效果
    * @private
    */
    _onDblClick: function(event) {
        var me = this;
        me.focus();
        me.isToggle && me.toggle();
        me.getTree().dispatchEvent('dblclick', {
            treeNode: me,
            event: event
        });
    },
   /**
    * 当鼠标右击节点时的效果\
    * @private
    */
    _onContextmenu: function(event) {
        var me = this;
        return me.getTree().dispatchEvent('contextmenu', {
            treeNode: me,
            event: event
        });

    },
   /**
    * 点击toggle图标时候的效果
    * @private
    */
    _onToggleClick: function(event) {
        var me = this;
        me.isToggle && me.toggle();
        me.getTree().dispatchEvent('toggle', {treeNode: me});
        baidu.event.stopPropagation(event);
    },
    /**
     * 获得TreeNode  body的html string
     * @return {String} htmlstring.
     * @private
     */
    _createBodyStringArray: function() {
        var me = this,
            stringArray = me._stringArray;
        stringArray.push('<dt id="',me.id,'-node" class="tangram-tree-node-node"');
        if(me.skin){
            stringArray.push(' ',me.skin,'-node');
        }
        stringArray.push(' onclick="',me._getCallRef() + ('._onClick(event)'),'"> <span id="',
            me.id,'-span">',me._getImagesString(true),'</span>');
        me._createIconStringArray();
        me._createTextStringArray();
        stringArray.push('</dt>');
    },
    /**
     * 获得TreeNode  Images的html string
     * @param {Array} stringArray.
     * @param {isInit} 是否是初始化节点.
     * @return {Array} stringArray.
     * @private
     */
    _getImagesString: function(isInit) {
        var me = this,
            string = '';
        string += me._getIdentString(isInit);
        if (me.type == 'leaf') {
            string += me._getTLString(isInit);
        }
        else if (me.type == 'trunk') {
            if (me.children && me.children.length > 0) {
                string += me._getToggleString(isInit);
            } else {
                string += me._getTLString(isInit);
            }
        }
        return string;
    },
    /**
     * 获得TreeNode 缩进线条的String
     * @param {isInit} 是否是初始化节点.
     * @return {string} htmlstring.
     * @private
     */
    _getIdentString: function(isInit) {
        var me = this,
            string = '',
            prifix;
        while (me.getParentNode() && me.getParentNode().type != 'root') {
            me = me.getParentNode();
            prifix =( me.isLastNode(isInit) ? 'blank' : 'I');
            className = 'tangram-tree-node-' + prifix;
            if(me.skin){
                className += ' '+me.skin+ '-'+prifix;
            }
            string = '<span   class="'+className+'"></span>' + string;
        }
        return string;
    },
    /**
     * 获得TreeNode T线条或者L线条的String
     * @param {Array} stringArray.
     * @param {isInit} 是否是初始化节点.
     * @private
     */
    _getTLString: function(isInit) {
        var me = this,
            prifix = (me.isLastNode(isInit) ? 'L' : 'T');
            className = 'tangram-tree-node-' + prifix;
        if(me.skin){
            className += ' '+me.skin+'-'+prifix; 
        }
        return '<span   class="' + className + '" ></span>';
    },
    /**
     * 组建TreeNode  Toggle string
     * @param {Array} stringArray.
     * @param {isInit} 是否是初始化节点.
     * @private
     */
    _getToggleString: function(isInit) {
        var me = this,
            type = me.isExpand ? 'minus' : 'plus',
            prifix =  (me.isLastNode(isInit) ? 'L' : 'T') + type,
            className = 'tangram-tree-node-' + prifix;
        if(me.skin){
            className += ' '+me.skin+'-'+prifix;
        }
        return ['<span onclick="', me._getCallRef(),
                '._onToggleClick(event)" class="',className,
                '" id="',me.id,'-toggle"></span>'].join('');
    },
    /**
     * 组建TreeNode  Toggle string
     * @private
     */
    _createIconStringArray: function() {
        var me = this,
            className = (me.type == 'leaf' ? 'leaf' : 'trunk'),
            stringArray = me._stringArray;
        if (me.isOpen) {
            className = 'open-trunk';
        }
        stringArray.push('<span  class="tangram-tree-node-',className);
        if(me.skin) {
            stringArray.push(' ',me.skin,'-',className);
        }
        stringArray.push('" style="',me.icon ? 'background-image:url(' + me.icon + ')' : '',
            '" id="', me.id,'-icon"></span>');
    },
    /**
     * 获得TreeNode  text string
     * @return {String} htmlstring.
     * @private
     */
    _createTextStringArray: function() {

        var me = this,
            text = (me.href ? me._createHrefStringArray() : me.text),
            stringArray = me._stringArray;
        stringArray.push('<span title="',me.title || me.text,'" id="',
            me.id,'-text" >',text,'</span></span>');
    },
    /**
     * 获得TreeNode  href string
     * @return {String} htmlstring.
     * @private
     */
    _createHrefStringArray: function() {
        var me = this,
            stringArray = me._stringArray;
        stringArray.push('<a id="',me.id,'-link',
            (me.target ? "target='" + me.target + "'" : ''),' hidefocus="on" " href="',
            me.href,'" >',me.text,'</a>');
    },
    /**
     * 取得图标(线或者blank)的容器
     * @return {HTMLObject} span.
     * @private
     */
    _getSpanElement: function() {
        return baidu.g(this._getId('span'));
    },
    /**
     * 取得节点图标的HTMLObject
     * @return {HTMLObject}
     * @private
     */
    _getIconElement: function() {
        return baidu.g(this._getId('icon'));
    },
    /**
     * 取得文本父容器的HTMLObject
     * @return {HTMLObject}
     * @private
     */
    _getTextContainer: function() {
        return baidu.g(this._getId('textContainer'));
    },
    /**
     * 取得文本容器的HTMLObject
     * @return {HTMLObject}
     * @private
     */
    _getTextElement: function() {
        return baidu.g(this._getId('text'));
    },
    /**
     * 取得切换展开或收起的image HTMLObject
     * @return {HTMLObject}
     * @private
     */
    _getToggleElement: function() {
        return baidu.g(this._getId('toggle'));
    },
    /**
     * 取得装子节点的父容器 HTMLObject
     * @return {HTMLObject}
     * @private
     */
    _getSubNodesContainer: function() {
        return baidu.g(this._getId('subNodeId'));
    },
    /**
     * 取得href的容器 HTMLObject
     * @return {HTMLObject}
     * @private
     */
    _getHrefElement: function() {
        return baidu.g(this._getId('link'));
    },
    /**
     * 取得node(不包括子节点)的 HTMLObject
     * @return {HTMLObject}
     * @private
     */
    _getNodeElement: function() {
        return baidu.g(this._getId('node'));
    },
    /**
     * 取得node(包括子节点的dom)的容器 HTMLObject
     * @return {HTMLObject}
     * @private
     */
    _getContainer: function() {
        return baidu.g(this.id);
    },
    /**
     * 隐藏节点，但不包括它的子节点。
     */
    hide: function() {
        baidu.dom.hide(this._getNodeElement());
    },
    /**
     * 显示节点。
     */
    show: function() {
        baidu.dom.show(this._getNodeElement());
    },
    /**
     * 递归展开所有子节点
     */
    expandAll: function() {
        var me = this;
        if(me.children) {
            me.expand();
        }
        baidu.array.each(me.getChildNodes(), function(item) {
            item.expandAll();
        });
    },
    /**
     * 递归收起所有子节点
     */
    collapseAll: function() {
        var me = this;
        if (me.getChildNodes().length > 0) {
            me.collapse();
        }
        baidu.array.each(me.getChildNodes(), function(item) {
            item.collapseAll();
        });
    },
    /**
     * 取得本节点所对应父节点的索引
     * @return {int} index.
     */
    getIndex: function() {
        var me = this,
            nodes = me.isRoot ? [] : me.getParentNode().getChildNodes(),
            index = -1;
        for (var i = 0, len = nodes.length; i < len; i++) {
            if (nodes[i] == me) {
                return i;
            }
        }
        return index;
    },
    /**
     * 取得本节点的下一个节点
     * 如果没有就返回自己
     * @return {TreeNode} next.
     */
    getNext: function() {
        var me = this, 
            index = me.getIndex(),
            nodes;
        if(me.isRoot) {
            return me;
        }
        nodes = me.getParentNode().getChildNodes();
        return (index + 1 >= nodes.length) ? me : nodes[index + 1];
    },
    /**
     * 取得本节点的上一个节点
     * 如果没有就返回自己
     * @return {TreeNode} previous.
     */
    getPrevious: function() {
        var me = this, 
            index = me.getIndex(),
            nodes ;
        if(me.isRoot) {
            return me;
        }
        nodes = me.getParentNode().getChildNodes();
        return (index - 1 < 0) ? me : nodes[index - 1];
    },
    /**
     * 取得本节点的第一个子节点
     * 如果没有就返回null
     * @return {TreeNode} previous.
     */
    getFirstChild: function() {
        var me = this,
            nodes = me.getChildNodes();
        return (nodes.length <= 0) ? null : nodes[0];
    },
    /**
     * 取得本节点的最后一个子节点
     * 如果没有就返回null
     * @return {TreeNode} previous.
     */
    getLastChild: function() {
        var me = this,
            nodes = me.getChildNodes();
        return nodes.length <= 0 ? null : nodes[nodes.length - 1];
    },
    /**
     * 是否是最后一个节点
     * 在初始渲染节点的时候，自己维护了一个_isLast,就不用去动态算是否是最后一个子节点。
     * 而在动态新增，删除节点时，动态的处理是否是最后一个节点能方便代码实现，
     * 这样做的目的既能保证初始化时的性能，也能够方便动态功能的实现。.
     * @return {Boolean} true | false.
     */
     //isInit不作为参数做文档描述，是一个内部参数。
    isLastNode: function(isInit) {
        var me = this;
        if (isInit) {
            return me._isLast;
        }
        if(me.isRoot) {
            return true;
        }
            
        return me.getIndex() == (me.parentNode.childNodes.length - 1);
    }
    

};

baidu.object.extend(baidu.ui.Tree.TreeNode.prototype, baidu.lang.Class.prototype);

baidu.ui.Tree.extend(
    /**
     *  @lends baidu.ui.Tree.prototype
     */
    {
    //ui类型
    uiType: 'tree',
    //模板
    tplDOM: "<div class='#{class}'>#{body}</div>",
    /**
     * 取得html string
	 * @private
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
     * @private
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
     * @param {String} id       节点id
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
    },
    /**
     *销毁Tree对象
     */
    dispose: function() {
        var me = this;
        me.dispatchEvent('dispose');
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});
