/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */
///import baidu.ui.createUI;
///import baidu.dom.insertHTML;
///import baidu.dom.children;
///import baidu.dom.getStyle;
///import baidu.dom.create;
///import baidu.dom.remove;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.string.format;
///import baidu.array.each;
///import baidu.array.indexOf;
///import baidu.browser.ie;
///import baidu.fn.bind;


baidu.ui.Carousel = baidu.ui.createUI(function(options){
    var me = this,
        data = me.contentText || [];
    me._datas = data.slice(0, data.length);
    me._itemIds = [];
    me._items = {};//用来存入被删除的节点，当再次被使用时可以直接拿回来
    baidu.array.each(me._datas, function(item){
        me._itemIds.push(baidu.lang.guid());
    })
    me.flip = me.flip.toLowerCase();
    me.orientation = me.orientation.toLowerCase();
}).extend(
    /**
     *  @lends baidu.ui.Carousel.prototype
     */
{
    uiType: 'carousel',
    orientation: 'horizontal',//horizontal|vertical
    //direction: 'down',//up|right|down|left
    flip: 'item',//item|page
    pageSize: 3,
    scrollIndex: 0,
    offsetWidth: 0,
    offsetHeight: 0,
    
    _axis: {
        horizontal: {pos: 'left', size: 'width', offset: 'offsetWidth', scrollPos: 'scrollLeft', scrollSize: 'scrollWidth'},
        vertical: {pos: 'top', size: 'height', offset: 'offsetHeight', scrollPos: 'scrollTop', scrollSize: 'scrollHeight'}
    },
    
    tplDOM: '<div id="#{id}" class="#{class}">#{content}</div>',
    
    getString: function(){
        var me = this,
            str = baidu.string.format(me.tplDOM, {
                id: me.getId('scroll'),
                'class': me.getClass('scroll')
            });
        return baidu.string.format(me.tplDOM, {
            id: me.getId(),
            'class': me.getClass(),
            content: str
        });
    },
    
    render: function(target){
        var me = this;
        if(!target || me.getMain()){return;}
        baidu.dom.insertHTML(me.renderMain(target), 'beforeEnd', me.getString());
        me._renderItems();
//        me._renderItems(8, 0);
        me._resizeView();
        me._moveCenter();
        me.focus(me.scrollIndex);
        me.dispatchEvent('onload');
    },
    
    _renderItems: function(index, offset){
        var me = this,
            sContainer = me.getScrollContainer(),
            index = Math.min(Math.max(index | 0, 0), me._datas.length - 1),
            offset = Math.min(Math.max(offset | 0, 0), me.pageSize - 1),
            sContainer = me.getScrollContainer(),
            i = 0,
            count = me.pageSize * 3;
        index < offset && (offset = index);//这种情况比如把1放到可视区域2的位置
        sContainer.innerHTML = '';
        for(; i < count; i++){
            sContainer.appendChild(
                me._getItemElement(index - offset - me.pageSize + i)
            );
        }
    },
    
    _moveCenter: function(){
        if(!this._boundX && !this._boundY){return;}
        var me = this,
            axis = me._axis[me.orientation],
            orie = me.orientation == 'horizontal'
            ieOffset = orie && baidu.browser.ie == 6 ? me._boundX.marginX : 0;
        me.getBody()[axis.scrollPos] = me[axis.offset]
            * me.pageSize
            + (orie ? 0 : Math.abs(Math.max(me._boundY.marginX, me._boundY.marginY) / 2 - me._boundY.marginX))
            + ieOffset;
    },
    
    _resizeView: function(){
        if(this._datas.length <= 0){return;}//没有数据
        var me = this,
            axis = me._axis[me.orientation],
            orie = me.orientation == 'horizontal',
            sContainer = me.getScrollContainer(),
            child = baidu.dom.children(sContainer),
            boundX,
            boundY;
        function getItemBound(item, type){
            var type = type == 'x',
                bound = item[type ? 'offsetWidth' : 'offsetHeight'],
                marginX = parseInt(baidu.dom.getStyle(item, type ? 'marginLeft' : 'marginTop')),
                marginY = parseInt(baidu.dom.getStyle(item, type ? 'marginRight' : 'marginBottom'));
            isNaN(marginX) && (marginX = 0);
            isNaN(marginY) && (marginY = 0);
            return {
//                width: bound,
                offset: bound + (orie ? marginX + marginY : Math.max(marginX, marginY)),
                marginX: marginX,
                marginY: marginY
            };
        }
        me._boundX = boundX = getItemBound(child[0], 'x');
        me._boundY = boundY = getItemBound(child[0], 'y');
        me.offsetWidth <= 0 && (me.offsetWidth = boundX.offset);
        me.offsetHeight <= 0 && (me.offsetHeight = boundY.offset);
        
        sContainer.style.width = boundX.offset
            * (orie ? child.length : 1)
            + (baidu.browser.ie == 6 ? boundX.marginX + boundX.marginY : 0)
            + 'px';
        orie && (sContainer.style.height = boundY.offset + 'px');//如果是横向滚动需要设一下高度，防止不会自动撑开
        me.getBody().style[axis.size] = me[axis.offset] * me.pageSize + 'px';
    },
    
    _getItemElement: function(index){
        var me = this,
            itemId = me._itemIds[index],
            element = me._items[itemId],
            txt = me._datas[index];
        if(!element){
            element = baidu.dom.create('div', {
                id: itemId || '',
                'class': me.getClass('item')
            });
            element.innerHTML = txt ? txt.content : '';
            if(itemId){
                me._items[itemId] = element;
                element.onclick = baidu.fn.bind('_onItemClickHandler', me, element);
                element.onmouseover = baidu.fn.bind('_onMouseHandler', me, 'mouseover');
                element.onmouseout = baidu.fn.bind('_onMouseHandler', me, 'mouseout');
            }
        }
        return element;
    },
    
    _onItemClickHandler: function(ele, evt){
        var me = this;
        me.focus(baidu.array.indexOf(me._itemIds, ele.id));
        me.dispatchEvent('onitemclick');
    },
    
    _onMouseHandler: function(type, evt){
        var me = this;
        me.dispatchEvent('on' + type);
    },
    
    getCurrentIndex: function(){
        return this.scrollIndex;
    },
    
    getTotalCount: function(){
        return this._datas.length;
    },
    
    /**
     * 根据数据的索引值取得对应在页面的DOM节点，当节点不存时返回null
     * @param {Number} index 在数据中的索引值
     * @return {HTMLElement} 返回一个DOM节点
     */
    getItem: function(index){
        return baidu.dom.g(this._itemIds[index]);
    },
    
    /**
     * 
     */
    scrollTo: function(index, scrollOffset){
        var me = this;
        if(me._datas.length <= 0){return;}
        if(me.dispatchEvent('onbeforescroll',
            {index: index, scrollOffset: offset})){
            me._renderItems(index, scrollOffset);
            me.dispatchEvent('onafterscroll');
        }
    },
    
    prev: function(){
        var me = this;
    },
    
    next: function(){
        var me = this;
    },
    
    isFirst: function(){
        return this.scrollIndex <= 0;
    },
    
    isLast: function(){
        var me = this;
        return me.scrollIndex >= me._datas.length - 1;
    },
    
    focus: function(index){
        var me = this,
            beforeItem = me._itemIds[index]
                && me._getItemElement(me.scrollIndex),
            currItem = me._itemIds[index]
                && me._getItemElement(index);
        beforeItem
            && baidu.dom.removeClass(beforeItem, me.getClass('item-focus'));
        if(currItem){
            baidu.dom.addClass(currItem, me.getClass('item-focus'));
            me.scrollIndex = index;
        }
    },
    
    getScrollContainer: function(){
        return baidu.dom.g(this.getId('scroll'));
    },
    
    dispose: function(){
        var me = this;
        me.dispatchEvent('ondispose');
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});