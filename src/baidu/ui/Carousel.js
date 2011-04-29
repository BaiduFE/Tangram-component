/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */
///import baidu.ui.createUI;
///import baidu.dom.insertHTML;
///import baidu.dom.children;
///import baidu.dom.getStyle;
///import baidu.dom.remove;
///import baidu.string.format;
///import baidu.array.each;
///import baidu.browser.ie;

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
    tplItem: '<div id="#{id}" class="#{class}" "#{handler}">#{content}</div>',
    
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
        me._resizeView();
        me._moveCenter();
        me.dispatchEvent('onload');
    },
    
    _getRenderData: function(index, offset){
        var me = this,
            array = [],
            index = Math.min(Math.max(index | 0, 0), me._datas.length - 1),
            offset = Math.min(Math.max(offset | 0, 0), me.pageSize - 1),
            count = me.pageSize * 3,
            i = 0,
            pointer;//起点索引
        index < offset && (offset = index);//这种情况比如把1放到可视区域2的位置
        pointer = index - offset - me.pageSize;
        for(; i < count; i++){
            array.push({
                index: pointer + i,
                id: me._itemIds[pointer + i] || '',
                data: me._datas[pointer + i] || {content: ''}
            });
        }
        return array;
    },
    
    _renderItems: function(index, offset){
        var me = this,
            array = [],
            data = me._getRenderData(index, offset),
            count = data.length,
            i = 0;
        for(; i < count; i++){
            array.push(baidu.string.format(me.tplItem, {
                id: data[i].id,
                'class': me.getClass('item'),
                content: data[i].data.content
            }));
        }
        me.getScrollContainer().innerHTML = array.join('');
    },
    
    _moveCenter: function(){
        if(!this._boundX && !this._boundY){return;}
        var me = this,
            axis = me._axis[me.orientation],
            is = me.orientation == 'horizontal'
            ieOffset = is && baidu.browser.ie == 6 ? me._boundX.marginX : 0;
        me.getBody()[axis.scrollPos] = me[axis.offset]
            * me.pageSize
            + (is ? 0 : Math.abs(Math.max(me._boundY.marginX, me._boundY.marginY) / 2 - me._boundY.marginX))
            + ieOffset;
    },
    
    _resizeView: function(){
        if(this._datas.length <= 0){return;}//没有数据
        var me= this,
            axis = me._axis[me.orientation],
            is = me.orientation == 'horizontal',
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
                width: bound,
                offset: bound + (is ? marginX + marginY : Math.max(marginX, marginY)),
                marginX: marginX,
                marginY: marginY
            };
        }
        me._boundX = boundX = getItemBound(child[0], 'x');
        me._boundY = boundY = getItemBound(child[0], 'y');
        me.offsetWidth <= 0 && (me.offsetWidth = boundX.offset);
        me.offsetHeight <= 0 && (me.offsetHeight = boundY.offset);
        
        sContainer.style.width = boundX.offset
            * (is ? child.length : 1)
            + (baidu.browser.ie == 6 ? boundX.marginX + boundX.marginY : 0)
            + 'px';
        is && (sContainer.style.height = boundY.offset + 'px');//如果是横向滚动需要设一下高度，防止不会自动撑开
        me.getBody().style[axis.size] = me[axis.offset] * me.pageSize + 'px';
    },
    
    
    
    
    
    
    
    
    getItemElement: function(){
        
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
//        var me = this,
//            index = Math.min(Math.max(index | 0, 0), me._datas.length - 1),
//            offset = Math.min(Math.max(scrollOffset | 0, 0), me.pageSize - 1);
//        if(me._datas.length <= 0){return;}
//        if(me.dispatchEvent('onbeforescroll',
//            {index: index, scrollOffset: offset, direction: direction})){
//            alert('ffff');
//        }
//        this._renderItems(index, scrollOffset);

//            axis = me._axis[me.orientation],
//            index = Math.min(Math.max(index | 0, 0), me._datas.length - 1),
//            offset = Math.min(Math.max(scrollOffset | 0, 0), me.pageSize - 1),
//            sContainer = me.getScrollContainer(),
//            child = baidu.dom.children(sContainer),
//            item = baidu.dom.g(me._itemIds[index]),
//            count = -1;
//        index < offset && (offset = index);
//        item && baidu.array.each(child, function(ele, i){
//            if(ele.id && ele.id == item.id){
//                count = i;
//                return false;
//            }
//        });
//        count -= me.pageSize + offset;
//        me.getBody()[axis.scrollPos] +=  me[axis.offset] * count;
        
    },
    
    prev: function(){
        
    },
    
    next: function(){
        
    },
    
    isFirst: function(){
        
    },
    
    isLast: function(){
        
    },
    
    focus: function(){
        
    },
    
    getScrollContainer: function(){
        return baidu.dom.g(this.getId('scroll'));
    }
});