/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.createUI;
///import baidu.lang.guid;
///import baidu.string.format;
///import baidu.fn.bind;
///import baidu.dom.insertHTML;
///import baidu.array.indexOf;
///import baidu.array.removeAt;
///import baidu.array.each;
///import baidu.dom.g;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.remove;

/**
 * ItemSet是Accordion, Tab等多item操作的抽象类
 * @class
 * @grammar 抽象类
 * @param {Object} options config参数.
 * @config {String} switchType 事件激发类型，item由什么类型的事件来打开，取值如：click, mouseover等等
 * @config {Number} defaultIndex 初始化后的默认打开项索引，默认值是0
 * @author fx
 */
baidu.ui.ItemSet = baidu.ui.createUI(function(options){
    var me = this;
    me._headIds = [];
    me._bodyIds = [];
}).extend(
/**
 * @lends baidu.ui.ItemSet.prototype
 */
{
    currentClass: 'current',//展开项的css名称
    tplHead: '',
    tplBody: '',
    switchType: 'click',//事件名称，标记为当点击时激活事件
    defaultIndex: 0,//开始的默认打开项索引
    
    /**
     * 做为子类getString()使用,通过用户传来的item对象获得item head部分的html字符串
     * @private
     * @param {Object} item 格式为{head: '', body:''}
     * @param {Number} index 插件到数组中的索引，默认插入到数组最后
     * @return {String}
     */
    _getHeadString: function(item, index){
        var me = this,
            ids = me._headIds,
            headId = me.getId('head' + baidu.lang.guid()),
            index = ids[index] ? index : ids.length;
        ids.splice(index, 0, headId);
        return baidu.string.format(me.tplHead, {
            id: headId,
            'class': me.getClass('head'),
            head: item['head']
        });
    },
    
    /**
     * 做为子类getString()使用,通过用户传来的item对象获得item body部分的html字符串
     * @private
     * @param {Object} item 格式为{head: '', body:''}
     * @param {Number} index 插件到数组中的索引，默认插入到数组最后
     * @return {String}
     */
    _getBodyString: function(item, index){
        var me = this,
            ids = me._bodyIds,
            bodyId = me.getId('body' + baidu.lang.guid()),
            index = ids[index] ? index : ids.length;
        ids.splice(index, 0, bodyId);
        
        return baidu.string.format(me.tplBody, {
            id: bodyId,
            'class': me.getClass('body'),
            body: item['body'],
            display: 'none'
        });
    },
    
    /**
     * 外部事件绑定,做为中转方法，避免dom元素与事件循环引用。
     * @private
     * @param {HTMLElement} head 
     */
    _getSwitchHandler: function(head){
        var me = this;
        //分发一个beforeswitch, 在切换之前执行.
        if(me.dispatchEvent("onbeforeswitch",{element: head}) ){
            me.switchByHead(head);
            //分发一个onswitch, 在切换之后执行
            me.dispatchEvent("onswitch");
        }
    },
    
    /**
     * 内部方法注册head的onclick或者onmouseover事件，做为内部方法给render与addItem方法重用。
     * @private
     * @param {Object} head 一个head的dom
     */
    _addSwitchEvent: function(head){
        var me = this;
        head["on"  +  me.switchType] = baidu.fn.bind("_getSwitchHandler", me, head);
    },
    
    /**
     * 渲染item到target元素中
     * @param {HTMLElement|String} target 被渲染的容器对象
     */
    render: function(target){
        var me = this;
        baidu.dom.insertHTML(me.renderMain(target),  "beforeEnd",  me.getString());
        baidu.array.each(me._headIds, function(item, index){
            var head = baidu.dom.g(item);
            me._addSwitchEvent(head);
            if(index == me.defaultIndex){
                me.setCurrentHead(head);
                baidu.dom.addClass(head, me.getClass(me.currentClass));
                me.getBodyByHead(head).style.display = '';
            }
            head = null;
        });
        me.dispatchEvent("onload");
    },
    
    /**
     * 获得所有item head元素
     * @return {Array}
     */
    getHeads: function(){
        var me = this,
            list = [];
        baidu.array.each(me._headIds, function(item){
            list.push(baidu.dom.g(item));
        });
        return list;
    },
    
    /**
     * 获得所有item body元素
     * @return {Array}
     */
    getBodies: function(){
        var me = this,
            list = [];
        baidu.array.each(me._bodyIds, function(item){
            list.push(baidu.dom.g(item));
        });
        return list;
    },
    
    /**
     * 取得当前展开的head
     * @return {HTMLElement}
     */
    getCurrentHead: function(){
        return this.currentHead;
    },
    
    /**
     * 设置当前的head
     * @param {HTMLElement} head 一个head的dom
     */
    setCurrentHead: function(head){
        this.currentHead = head;
    },
    
    /**
     * 获得指定body对应的head
     * @param {HTMLElement} head 一个head的dom
     * @return {HTMLElement}
     */
    getBodyByHead: function(head){
        var me = this,
            index = baidu.array.indexOf(me._headIds, head.id);
        return baidu.dom.g(me._bodyIds[index]);
    },
    
    /**
     * 根据索引取得对应的body
     * @param {Number} index
     * @return {HTMLElement}
     */
    getBodyByIndex: function(index){
        return baidu.dom.g(this._bodyIds[index]);
    },
    
    /**
     * 在末尾添加一项
     * @param {Object} item 格式{head: '', body: ''}
     */
    addItem: function(item){
        var me = this,
            index = me._headIds.length;
        me.insertItemHTML(item);
    },
    
    /**
     * 根据索引删除一项
     * @param {Number} index 指定一个索引来删除对应的项
     */
    removeItem: function(index){
        var me = this,
            head = baidu.dom.g(me._headIds[index]),
            body = baidu.dom.g(me._bodyIds[index]),
            curr = me.getCurrentHead();
        curr && curr.id == head.id && me.setCurrentHead(null);
        baidu.dom.remove(head);
        baidu.dom.remove(body);
        baidu.array.removeAt(me._headIds, index);
        baidu.array.removeAt(me._bodyIds, index);
    },
    
    /**
     * 除去动画效果的直接切换项
     * @private
     * @param {HTMLElement} head 一个head的dom
     */
    _switch: function(head){
        var me = this,
            oldHead = me.getCurrentHead();
        if(oldHead){
            me.getBodyByHead(oldHead).style.display = "none";
            baidu.dom.removeClass(oldHead,  me.getClass(me.currentClass));
        }
        if(head){
            me.setCurrentHead(head);
            me.getBodyByHead(head).style.display = "block";
            baidu.dom.addClass(head,  me.getClass(me.currentClass));
        }
    },
    
    /**
     * 切换到由参数指定的项
     * @param {HTMLElement} head 一个head的dom
     */
    switchByHead: function(head){
        var me = this;
        if(me.dispatchEvent("beforeswitchbyhead", {element: head}) ){
            me._switch(head);
        }
    },
    
    /**
     * 根据索引切换到指定的项
     * @param {HTMLElement} head 一个head的dom
     */
    switchByIndex: function(index){
        this.switchByHead(this.getHeads()[index]);
    },
    
    /**
     * 销毁实例的析构
     */
    dispose: function(){
        this.dispatchEvent("ondispose");
    }
});