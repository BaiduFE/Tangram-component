/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.createUI;
///import baidu.lang.Event;
///import baidu.object.extend;
///import baidu.object.each;
///import baidu.dom.g;
///import baidu.dom.remove;
///import baidu.dom._styleFilter.px;
///import baidu.dom.setStyles;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.ui.behavior.posable.setPositionByElement;
///import baidu.dom.show;
///import baidu.dom.hide;
///import baidu.string.format;
///import baidu.array.each;
///import baidu.lang.isFunction;
///import baidu.event.getTarget;
///import baidu.event.preventDefault;
///import baidu.dom.getAncestorByTag;

/**
 * Menubar 下拉菜单
 * @class
 * @grammar new baidu.ui.Menubar(options)
 * @param {Object} [options]                             配置选项
 * @param {String} width 选项宽度，默认200
 * @param {String} height 选项高度
 * @param {Number} zIndex 菜单zIndex，默认1200
 * @param {String} position 相对位置，默认bottomCenter
 * @param {Object} data 数据项
 * @param {Number} hideDelay 鼠标移出子菜单多长时间，菜单消失，默认300
 * @param {Function} toggle 开关函数,返回false时不显示
 */
baidu.ui.Menubar = baidu.ui.createUI(function(options){
    var me = this;
    me.items = {};//建立数据索引存储区
    me.data = options.data || [];
    me._initialized = false; //判断是否已经初始化
    me.dispatchEvent("oninit");
}).extend(
/**
 * @lends baidu.ui.Menubar.prototype
 */
{
    uiType: "menubar",
    width: 200,//这个地方不要写成字符串
    height: '',
    zIndex: 1200,
    hideDelay: 300,
    position: 'bottomCenter',
    tplBody: '<div id="#{id}" class="#{class}">#{content}</div>',
    tplBranch: '<ul id="#{ulId}">#{subitems}</ul>',
    tplItem: '<li onmouseover="#{onmouseover}" onmouseout="#{onmouseout}"><a href="#" id="#{id}" class="#{class}" onclick="#{onclick}" title="#{title}">#{content}</a>#{branch}</li>',
    tplContent: '<span class="#{contentClass}">#{content}</span>',
    tplArrow: '<span class="#{arrow}"></span>',
	/**
	 * @private
	 */
    toggle: function(){return true},
    posable: true,
    
    /**
     * 获取Menubar组件的HTML String
	 * @private
     * @return {String}
     */
    getString: function(){
        var me = this;
        return baidu.string.format(me.tplBody, {
            id: me.getId(),
            "class": me.getClass(),
            guid: me.guid,
            content: me.getItemsString(me.data, 0)
        });
    },
    
    /**
     * 生成items字符串
	 * @private
     * @param {Object} items 数据
     * @param {String} branchId 条目ID
     * @return {String}
     */
    getItemsString: function(items, branchId){
        var me = this,
            htmlArr = [];
        baidu.array.each(items, function(itemData, idx){
            var itemArr = [],
                itemId = branchId + '-' + idx;
            me.items[itemId] = itemData;//建立数据索引，方便查找item数据
                itemArr.push(baidu.string.format(me.tplContent, {
                contentClass : me.getClass("content"),
                content : itemData.content || itemData.label
            }));

            if (itemData.items) {
                itemArr.push(baidu.string.format(me.tplArrow, {
                    arrow: me.getClass("arrow")
                }));
            }

            htmlArr.push(baidu.string.format(me.tplItem, {
                id: me.getItemId(itemId),
                "class": (itemData.disabled ? (me.getClass("item") + ' ' + me.getClass("item-disabled")) : me.getClass("item")),
                onclick: me.getCallRef() + ".itemClick('"+itemId+"', event);",
                onmouseover: itemData.disabled || me.getCallRef() + ".itemMouseOver(event, '" + itemId + "')",
                onmouseout: itemData.disabled || me.getCallRef() + ".itemMouseOut(event, '" + itemId + "')",
                content: itemArr.join(''),
                branch: itemData.items ? me.getItemsString(itemData.items, itemId) : '',
                title: itemData.title
            }));
        });
        
        return baidu.string.format(me.tplBranch, {
            ulId: me.getBranchId(branchId),
            subitems: htmlArr.join('')
        });
    },
    
    /**
     * 渲染menubar
     * @param {HTMLElement} target 目标元素
     */
    render: function(target){
        var me = this;
        target = baidu.g(target);
        if(target){
            me.targetId = target.id || me.getId("target");
        }
        me.renderMain();
        me.dispatchEvent("onload");
    },
    
    /**
     * 单个条目被点击时触发
     * @param {String} idx item索引
     * @param {Event} evt 浏览器的事件对象
     */
    itemClick: function(idx, evt){
        var me = this;
        baidu.event.preventDefault(evt || window.event);
        me._close();
        me.dispatchEvent("onitemclick", me.getItemEventData(idx));
    },
    
    /**
     * 事件触发数据
     * @param {String} idx item索引
     * @return {Object}   item对象
     */
    getItemEventData: function(idx){
        return {
            value: this.getItemData(idx),
            index: idx
        };
    },
    
    /**
     * 单个条目mouseover的响应
     * @param {Object} idx     索引
     */
    itemMouseOver: function(evt, idx){
        var me = this,
            target = baidu.event.getTarget(evt),
            itemData = me.getItemData(idx), 
            itemDom = me.getItem(idx),
            subItem;
        baidu.dom.addClass(itemDom, me.getClass("item-hover"));
        if(itemData.items){//如果有子菜单，先运算子菜单的打开位置
            subItem = baidu.dom.g(me.getBranchId(idx));
            if(subItem.style.display == 'none'){
                baidu.dom.show(subItem);
                target.tagName.toUpperCase() != 'LI' && (target = baidu.dom.getAncestorByTag(target, 'LI'));//如果换了tplItem这里就会有问题;
                me.setPositionByElement(target, subItem, {
                    position: 'rightCenter',
                    once: true
                });
            }
        }
        itemData.showing = true;//记录显示状态，为延迟关闭功能使用
        me.dispatchEvent("onitemmouseover", me.getItemEventData(idx));
    },
    
    /**
     * 单个条目mouseout的响应
     * @param {Object} idx item索引
     */
    itemMouseOut: function(evt, idx){
        var me = this,
            target = baidu.event.getTarget(evt),
            itemData = me.getItemData(idx), 
            itemDom = me.getItem(idx);
        baidu.dom.removeClass(me.getItem(idx), me.getClass("item-hover"));
        itemData.showing = false;
        clearTimeout(itemData.outListener);
        itemData.outListener = setTimeout(function(){ //延迟关闭菜单
            if (!itemData.showing) {
                itemData.items && baidu.dom.hide(me.getBranchId(idx));
                me.dispatchEvent("onitemmouseout", me.getItemEventData(idx));
            }
        }, me.hideDelay);
    },
    
    /**
     * 更新menubar
     * @param {Object} options    选项
     */
    update: function(options){
        var me = this, 
            main = me.getMain(), 
            target = me.getTarget();
        options && baidu.object.extend(me, options);
        main.innerHTML = me.getString();
        
        me.dispatchEvent("onupdate");
        
        baidu.dom.setStyle(main, 'z-index', me.zIndex);
        
        var body = me.getBody();
        baidu.dom.setStyles(body, {
            height: me.height,
            width: me.width
        });
        
        baidu.dom.setStyle(me.getBranchId(0), 'width', me.width);
        baidu.dom.addClass(me.getBranchId(0), me.getClass('root'));
        
        baidu.object.each(me.items, function(item, key){
            if (item.items) {//判断是否有子菜单
                baidu.dom.setStyles(me.getBranchId(key), {
//                    left: me.width,//这句运算子标签的出现位置
                    width: me.width,
                    position: 'absolute',
                    display: 'none'
                });
            }
        });
                       
        if (target) {
            me.setPositionByElement(target, me.getMain(), {
                position: me.position,
                once: true
            });
        }
    },
    
    /**
     * 获取条目的元素id
     * @param {Number} idx 索引值
     * @return {String} id    获取item的id
     */
    getItemId: function(idx){
        return this.getId("item-" + idx);
    },
    
    /**
     * 获取子菜单容器id
     * @param {Object} idx item索引
     */
    getBranchId: function(idx){
        return this.getId("branch-" + idx);
    },
    
    /**
     * 获取指定索引值的页面元素
     * @param {Number} idx     索引
     * @return {HTMLElement} dom节点
     */
    getItem: function(idx){
        return baidu.g(this.getItemId(idx));
    },
    
    /**
     * 获取条目数据
     * @param {Number} idx 条目索引
     * @return {Object} 条目对应数据
     */
    getItemData: function(idx){
        return this.items[idx];
    },
    
    /**
     * 打开menubar
     */
    open: function(){
        var me = this,
            target = me.getTarget(),
            body = me.getBody(),
            showing;
        if (baidu.lang.isFunction(me.toggle) && !me.toggle()) {
            return;
        }
        if (!me.dispatchEvent("onbeforeopen")) 
            return;
        if (showing = baidu.ui.Menubar.showing) {
            showing.close();
        }
        body && (body.style.display = '');
        if (!me._initialized) {//如果已经初始化就不再重复update
            me.update();
            me._initialized = true;
        }else{
            if(target){
                me.setPositionByElement(target, me.getMain(), {
                    position: me.position,
                    once: true
                });
            }
        }
        me.dispatchEvent("onopen");
        baidu.ui.Menubar.showing = me;
    },
    
    /**
     * 关闭menubar
     */
    close: function(){
        var me = this,
            body = me.getBody();
        if (!body) 
            return;
        
        if (me.dispatchEvent("onbeforeclose")) {
            me._close();
            me.dispatchEvent("onclose");
        }
    },
   
    _close: function(){
        var me = this,
            body = me.getBody();
        
        baidu.ui.Menubar.showing = null;
        body.style.display = 'none';
    },

    /**
     * 销毁Menubar
     */
    dispose: function(){
        var me = this;
        me.dispatchEvent("ondispose");
        me.getMain() && baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    },
    
    /**
     * 获取target元素
     * @return {HTMLElement} HTML元素
     */
    getTarget: function(){
        return baidu.g(this.targetId);
    }
});
