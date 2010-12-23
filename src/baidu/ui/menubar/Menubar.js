/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/menubar/Menubar.js
 * author: rocy
 * version: 1.0.0
 * date: 2010-12-09
 */
///import baidu.ui.menubar;
///import baidu.ui.createUI;

///import baidu.lang.Event;

///import baidu.object.extend;
///import baidu.object.each;

///import baidu.dom.g;
///import baidu.dom.remove;
///import baidu.dom.setStyles;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.ui.smartPosition.element;

///import baidu.string.format;

///import baidu.array.each;

///import baidu.lang.isFunction;

/**
 * Menubar 下拉菜单
 * @param {Object} [options]                             配置选项
 * @param {String} [options.width = '200']               选项宽度
 * @param {String} [options.height]                      选项高度
 * @param {Number} [options.zIndex = 1200]               菜单zIndex
 * @param {String} [options.position = 'bottomCenter']   相对位置
 * @param {Object} [options.data]                        数据项
 * @param {Number} [options.hideDelay = 300]             鼠标移出子菜单多长时间，菜单消失
 * @param {Function} [options.toggle]                    开关函数,返回false时不显示
 */
baidu.ui.menubar.Menubar = baidu.ui.menubar.Menubar ||
baidu.ui.createUI(function(options){
    var me = this;
    me.items = {};//建立数据索引存储区
    me.data = options.data || [];
    me._initialized = false; //判断是否已经初始化
    me.dispatchEvent("oninit");
}).extend({
    uiType: "menubar",
    width: '200',
    height: '',
    zIndex: 1200,
    hideDelay: 300,
    position: 'bottomCenter',
    tplBody: '<div id="#{id}" class="#{class}">#{content}</div>',
    tplBranch: '<ul id="#{ulId}">#{subitems}</ul>',
    tplItem: '<li onmouseover="#{onmouseover}" onmouseout="#{onmouseout}"><a href="#" id="#{id}" class="#{class}" onclick="#{onclick}" title="#{title}">#{content}</a>#{branch}</li>',
    tplContent: '<span class="#{contentClass}">#{content}</span>',
    tplArrow: '<span class="#{arrow}"></span>',
    toggle: function(){return true},
    
    /**
     * 获取Menubar组件的HTML String
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
                onclick: me.getCallString("itemClick", itemId),
                onmouseover: itemData.disabled || me.getCallString("itemMouseOver", itemId),
                onmouseout: itemData.disabled || me.getCallString("itemMouseOut", itemId),
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
     */
    itemClick: function(idx){
        var me = this;
        me.close(true);
        me.dispatchEvent("onitemclick", me.getItemEventData(idx));
    },
    
    /**
     * 事件触发数据
     * @param {String} idx item索引
     * @return {Object}
     */
    getItemEventData: function(idx){
        return {
            value: this.getItemData(idx),
            index: idx
        };
    },
    
    /**
     * 单个条目mouseover的响应
     * @param {Object} idx
     */
    itemMouseOver: function(idx){
        var me = this, 
            itemData = me.getItemData(idx), 
            itemDom = me.getItem(idx);
        baidu.dom.addClass(itemDom, me.getClass("item-hover"));
        itemData.items && baidu.dom.show(me.getBranchId(idx)); //如果有子菜单，显示子菜单
        itemData.showing = true;//记录显示状态，为延迟关闭功能使用
        me.dispatchEvent("onitemmouseover", me.getItemEventData(idx));
    },
    
    /**
     * 单个条目mouseout的响应
     * @param {Object} idx item索引
     */
    itemMouseOut: function(idx){
        var me = this, 
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
     * @param {Object} options
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
                    left: me.width,
                    width: me.width,
                    position: 'absolute',
                    display: 'none'
                });
            }
        });
               
        if (target) {
            baidu.ui.smartPosition.element(me.getMain(), target, {
                position: me.position
            });
        } 
    },
    
    /**
     * 获取条目的元素id
     * @param {Number} idx 索引值
     * @return {String}id
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
     * @param {Number} idx
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
            showing;
        if (baidu.lang.isFunction(me.toggle) && !me.toggle()) {
            return;
        }
        if (!me.dispatchEvent("onbeforeopen")) 
            return;
        if (showing = baidu.ui.menubar.showing) {
            showing.close(true);
        }
        
        if (!me._initialized) { //如果已经初始化就不再重复update
            me.update();
            me._initialized = true;
        }
        
        var body = me.getBody();
        baidu.dom.addClass(body, me.getClass('open'));
        baidu.dom.removeClass(body, me.getClass('empty'));
		me.dispatchEvent("onopen");
        baidu.ui.menubar.showing = me;
    },
    
    /**
     * 关闭menubar
     * @param {Boolean} directly 是否直接关闭
     */
    close: function(directly){
        var me = this,
            body = me.getBody();
        if (!body) 
            return;
        baidu.ui.menubar.showing = null;
        if (directly || me.dispatchEvent("onbeforeclose")) {
            baidu.dom.addClass(body, me.getClass('empty'));
            baidu.dom.removeClass(body, me.getClass('open'));
            me.dispatchEvent("onclose");
        }
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
