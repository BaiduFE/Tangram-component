/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */
///import baidu.ui.createUI;
///import baidu.lang.guid;
///import baidu.browser.ie;
///import baidu.dom.insertHTML;
///import baidu.string.format;
///import baidu.array.each;
///import baidu.array.indexOf;
///import baidu.array.find;
///import baidu.dom.g;
///import baidu.dom.remove;
///import baidu.dom.children;
///import baidu.dom.getStyle;
///import baidu.dom.create;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
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
        me.addEventListener('onafterscroll', function(evt){
            me._renderItems(evt.index, evt.scrollOffset);
            me._moveCenter();
        });
        me.dispatchEvent('onload');
    },
    
    _renderItems: function(index, offset){
        var me = this,
            sContainer = me.getScrollContainer(),
            index = Math.min(Math.max(index | 0, 0), me._datas.length - 1),
            offset = Math.min(Math.max(offset | 0, 0), me.pageSize - 1),
            sContainer = me.getScrollContainer(),
            count = me.pageSize,
            i = 0,
            itemIndex;
        while(sContainer.firstChild){//这里改用innerHTML赋空值会使js存的dom也被清空
            baidu.dom.remove(sContainer.firstChild);
        }
        for(; i < count; i++){
            sContainer.appendChild(me._getItemElement(index - offset + i));
        }
    },
    
    _moveCenter: function(){
        if(!this._boundX && !this._boundY){return;}
        var me = this,
            axis = me._axis[me.orientation],
            orie = me.orientation == 'horizontal'
            ieOffset = orie && baidu.browser.ie == 6 ? me._boundX.marginX : 0;
        me.getBody()[axis.scrollPos] = (orie ? 0 : Math.abs(Math.max(me._boundY.marginX, me._boundY.marginY)
            / 2 - me._boundY.marginX)) + ieOffset;
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
    
    _baseItemElement: function(index){
        var me = this,
            itemId = me._itemIds[index],
            element = me._items[itemId],
            txt = me._datas[index];
        if(!element){
            element = baidu.dom.create('div', {
                id: itemId || '',
                'class': me.getClass('item')
            });
            !itemId && baidu.dom.addClass(element, me.getClass('item-empty'));
            element.innerHTML = txt ? txt.content : '';
            if(itemId){
                element.onclick = baidu.fn.bind('_onItemClickHandler', me, element);
                element.onmouseover = baidu.fn.bind('_onMouseHandler', me, 'mouseover');
                element.onmouseout = baidu.fn.bind('_onMouseHandler', me, 'mouseout');
                me._items[itemId] = element;
            }
        }
        return element; 
    },
    
    _getItemElement: function(index){
        return this._baseItemElement(index);
    },
    
    _onItemClickHandler: function(ele, evt){
        var me = this;
        me.focus(baidu.array.indexOf(me._itemIds, ele.id));
        me.dispatchEvent('onitemclick');
    },
    
    _onMouseHandler: function(type, evt){
        this.dispatchEvent('on' + type);
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
    scrollTo: function(index, scrollOffset, direction){
        var me = this,
            axis = me._axis[me.orientation],
            body = me.getBody(),
            sContainer = me.getScrollContainer(),
            child = baidu.dom.children(sContainer),
            item = me.getItem(index),
            smartDirection = direction,
            distance = index - scrollOffset,
            count = Math.abs(distance),
            len = me._datas.length,
            i = 0,
            fragment,
            vergeIndex,
            is;
        if((item && distance == 0 && !direction)
            || me._datas.length <= 0 || index < 0
            || index > me._datas.length - 1){return;}
        if(!smartDirection){//自动运算合理的方向
            smartDirection = item ? (distance < 0 ? 'prev' : (distance > 0 ? 'next' : 'keep'))
                : baidu.array.indexOf(me._itemIds,
                    baidu.array.find(child, function(ele){return !!ele.id}))
                    > index ? 'prev' : 'next';
        }
        is = smartDirection == 'prev';
        if(!item || direction){
            vergeIndex = baidu.array.indexOf(me._itemIds,
                child[is ? 0 : child.length - 1].id);
            //(x + len - y) % len
            //Math(offset - (is ? 0 : pz - 1)) + count
            count = Math.abs(scrollOffset - (is ? 0 : me.pageSize - 1))
                + ((is ? vergeIndex : index) + len - (is ? index : vergeIndex)) % len;
            count > me.pageSize && (count = me.pageSize);
        }
        fragment = count > 0 && document.createDocumentFragment();
        for(; i < count; i++){
            fragment.appendChild(
                me._getItemElement(is ? index - scrollOffset + i
                    : me.pageSize + index + i
                        - (item && !direction ? baidu.array.indexOf(child, item) : scrollOffset + count))
            );
        }
        is ? sContainer.insertBefore(fragment, child[0])
            : sContainer.appendChild(fragment);
        distance = me[axis.offset] * count;
        sContainer.style[axis.size] = parseInt(sContainer.style[axis.size]) + distance + 'px';
        is && (body[axis.scrollPos] += distance);
        me._blur();//防止闪烁
        if(me.dispatchEvent('onbeforescroll',
            {index: index, scrollOffset: scrollOffset, direction: direction, distance: distance})){
            me.getBody()[axis.scrollPos] += distance * (is ? -1 : 1);
            me.dispatchEvent('onafterscroll',
                {index: index, scrollOffset: scrollOffset, direction: direction});
        }
    },
    
    _getFlipIndex: function(type){
        var me = this,
            is = me.flip == 'item',
            type = type == 'prev',
            currIndex = me.scrollIndex,
            index = me.scrollIndex + (is ? 1 : me.pageSize) * (type ? -1 : 1),
            offset = is ? (type ? 0 : me.pageSize - 1) : me.scrollIndex % me.pageSize;
        if(!is && !me._getItemElement(index).id){
            index = (Math.floor(me.scrollIndex / me.pageSize) + (type ? -1 : 1))
                * me.pageSize;
            offset = 0;
        }
        return {index: index, scrollOffset: offset};
    },
    
    _baseFlip: function(type){
        var me = this,
            sContainer = me.getScrollContainer(),
            flip = me._getFlipIndex(type);
        function scrollTo(index, offset, type){
            me.addEventListener('onafterscroll', function(evt){
                var target = evt.target;
                target.focus(evt.index);
                target.removeEventListener('onafterscroll', arguments.callee);
            });
            me.scrollTo(index, offset, type);
        }
        if(me.flip == 'item'){
            me.getItem(flip.index) ? me.focus(flip.index)
                : scrollTo(flip.index, flip.scrollOffset, type);
        }else{
            me._getItemElement(flip.index).id
                && scrollTo(flip.index, flip.scrollOffset, type);
        }
    },
    
    prev: function(){
        this._baseFlip('prev');
    },
    
    next: function(){
        this._baseFlip('next');
    },
    
    isFirst: function(){
        var flip = this._getFlipIndex('prev');
        return flip.index < 0;
    },
    
    isLast: function(){
        var flip = this._getFlipIndex('next');
        return flip.index >= this._datas.length;
    },
    
    _blur: function(){
        var me = this,
            itemId = me._itemIds[me.scrollIndex];
        if(itemId){
            baidu.dom.removeClass(me._baseItemElement(me.scrollIndex),
                me.getClass('item-focus'));
            me.scrollIndex = -1;
        }
    },
    
    focus: function(index){
        var me = this,
            itemId = me._itemIds[index],
            item = itemId && me._baseItemElement(index);//防止浪费资源创出空的element
        if(itemId){
            me._blur();
            baidu.dom.addClass(item, me.getClass('item-focus'));
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