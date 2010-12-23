/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * path :  ui/itemSet.js
 * author :  fx
 * version :  1.0.0
 * date :  2010-10-18
 * 2010-10-18
 * ItemSet是accordion, tab等多item操作的抽象
 * 我们有以下规则
 * 1.ItemSet是item的集合，一个item是由head与body组成。
 *   head与body应该有一个对应关系，比如可以通过head找到对应的body
 * 2.可以通过head来切换不同的body
 */

///import baidu.ui.createUI;
///import baidu.array.each;
///import baidu.dom.g;
///import baidu.dom.insertHTML;
///import baidu.array.remove;
///import baidu.fn.bind;

baidu.ui.ItemSet = baidu.ui.createUI(function (options) {
    
}).extend( {
    currentClass     :  "current", 
    tplHead          :  "", 
    tplBody          :  "", 
    headIds          :  [], 
    bodyIds          :  [], 
    switchType       : "click",    
    /**
    *protect方法
    *做为子类getString()使用
    *通过用户传来的item对象获得item head部分的html字符串
    *@param {Object} item  item的格式为 {head:"",body:""}
    *@param {int} key
    *@return {String}htmlString 
    */ 
    _getHeadString : function(item, key) {
        var me = this, 
            headId = me.getId('head' + key);	
        me.headIds.push(headId);
        if(key == 0){
            me.addEventListener("onload", function(){
                me.setCurrentHead(baidu.g(headId)); 
            });
        }
        return 	baidu.format(me.tplHead, {
                id       :  headId, 
                bodyId   :  me.getId('body' + key), 
                "class"  :  key == 0 ? me.getClass('head')  +  " "  +  me.getClass(me.currentClass)  :  me.getClass('head'), 
                head     :  item['head'], 
                tangram  :  "name : " + me.getId('body' + key)
            });
    }, 
    /**
    *protect方法
    *做为子类getString()使用
    *通过用户传来的item对象获得item body部分的html字符串
    *@param {Object} item item的格式为 {head:"标题",body:"内容"}
    *@param {int} key
    *@return {String}htmlString
    */ 
   _getBodyString : function(item, key) {
        var me = this, 
            bodyId = me.getId('body' + key);
        me.bodyIds.push(bodyId);
        return 	baidu.format(me.tplBody,  {
                id       :  bodyId, 
                "class"  :  me.getClass('body'), 
                body  :  item['body'], 
                display  :  key == 0 ? "block"  :  "none"
            });
    }, 

    /**
    *外部事件绑定,做为中转方法，避免dom元素与事件循环引用。
    *@param {HTMLObject}
    */
    _getSwitchHandler : function(head){
        var me = this;
        //分发一个beforeswitch, 在切换之前执行.
        if(me.dispatchEvent("onbeforeswitch",{element:head}) ){
            me.switchByHead(head);
            //分发一个onswitch, 在切换之后执行
            me.dispatchEvent("onswitch");
        }
    },

    /**
    *内部方法注册head的onclick或者onmouseover事件，做为内部方法给render与addItem方法重用。
    *@param {HTMLObject} head
    */
    _addSwitchEvent  :  function(head) {
        var me = this;
        //head.me = me;
        head["on"  +  me.switchType] = baidu.fn.bind("_getSwitchHandler", me, head);
    }, 
    /**
     * 渲染item到main元素中
     * @param{HTMLObject|String} main
     */
    render  :  function(main) {
        var me = this;
        baidu.dom.insertHTML(me.renderMain(main),  "beforeEnd",  me.getString());
        baidu.each(me.getHeads(), function(head, key) {
            me._addSwitchEvent(head);
        });
        me.dispatchEvent("onload");
    },
    /**
     * 获得所有item head元素
     * @return {Array} HTMLObject Array
     */
    getHeads  :  function() {
        var me = this, 
            ary = [];
        baidu.each(me.headIds,  function(item, key) {
            ary.push(baidu.g(item));
        });
        return ary;
    }, 
    /**
     * 获得所有item body元素
     * @return {Array} HTMLObject Array
     */
    getBodies  :  function() {
        var me = this, 
            ary = [];
        baidu.each(me.bodyIds,  function(item, key) {
            ary.push(baidu.g(item));
        });
        return ary;
    }, 
    /**
    *取得当前的head
    */
    getCurrentHead : function(){
        return this.currentHead;
    },
    /**
    *设置当前的head
    */
    setCurrentHead : function(head){
        this.currentHead = head;
    },
    
    /**
     * 获得指定body对应的head
     * @param {HTMLObject} head
     * @return{HTMLObject} body
     */
    getBodyByHead  :  function(head) {
        return baidu.g(head.getAttribute("bodyId"));
    }, 
    /**
     * 增加item
     * @param {Object} item
     */
    addItem : function(item) {
        var index = this.getHeads().length;
        this.insertItemHTML(item, index);
        //this.getHeads().push(baidu.g(
        this._addSwitchEvent(this.getHeads()[index]);
        
    }, 
    /**
     * 删除item
     * @param {int} index
     */
    removeItem  : function(index) {
        var head = this.getHeads()[index], 
            headId = head.id, 
            body = this.getBodyByHead(head), 
            bodyId = body.id;
        baidu.dom.remove(head);
        baidu.dom.remove(body);
        baidu.array.remove(this.headIds, headId);
        baidu.array.remove(this.bodyIds, bodyId);
        
    }, 
    /**
    *通过head元素选择item
    * @param {HTMLObject} head
    */
    switchByHead :  function(head) {
        var me = this,
            oldHead = me.getCurrentHead();
        if(oldHead){
            me.getBodyByHead(oldHead).style.display = "none";
            baidu.dom.removeClass(oldHead,  me.getClass(me.currentClass));
        }
        me.setCurrentHead(head);
        me.getBodyByHead(head).style.display = "block";
        baidu.dom.addClass(head,  me.getClass(me.currentClass));
    }, 
    /**
    *通过索引选择item
    *@param {int} index
    */
    switchByIndex :  function(index) {
        this.switchByHead(this.getHeads()[index]);
    }, 
    /**
    *dispose
    */
    dispose :  function() {
        this.dispatchEvent("ondispose");	
    }
	
})

