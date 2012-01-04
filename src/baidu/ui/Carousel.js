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
///import baidu.object.each;



/**
 * 创建一个简单的滚动组件
 * @name baidu.ui.Carousel
 * @class
 * @grammar new baidu.ui.Carousel(options)
 * @param {Object} options config参数.
 * @config {String} orientation 描述该组件是创建一个横向滚动组件或是竖向滚动组件，取值：horizontal:横向, vertical:竖向
 * @config {Object} contentText 定义carousel组件每一项的字符数据，格式：[{content: 'text-0'}, {content: 'text-1'}, {content: 'text-2'}...]
 * @config {String} flip 定义组件的翻页方式，取值：item:一次滚动一个项, page:一次滚动一页
 * @config {Number} pageSize 描述一页显示多少个滚动项，默认值是3
 * @config {function} onload 当渲染完组件时触发该事件
 * @config {function} onbeforescroll 当开始滚动时触发该事件，该事件的event参数中可以得到四个属性：index:当前需要滚动的索引, scrollOffset:滚动到可视区域的位置, direction:滚动方向, scrollUnit:需要滚动过多少个项
 * @config {function} onafterscroll 当结束一次滚动时触发该事件，该事件的event参数中可以得到四个属性：index:当前需要滚动的索引, scrollOffset:滚动到可视区域的位置, direction:滚动方向, scrollUnit:需要滚动过多少个项
 * @config {function} onprev 当翻到前一项或前一页时触发该事件
 * @config {function} onnext 当翻到下一项或下一页时触发该事件
 * @config {function} onitemclick 当点击某个项时触发该事件
 * @config {function} onfocus 当某一项获得焦点时触发该事件
 * @plugin autoScroll 为滚动组件增加自动滚动功能
 * @plugin btn 为滚动组件添加控制按钮插件
 * @plugin cycle 为滚动组件增加无限循环滚动功能
 * @plugin fx 为滚动组件增加动画滚动功能
 * @plugin splice 为滚动组件提供动态增加或是删减滚动项功能
 * @plugin table 支持在一个滚动项中放多个图片或是其它文字内容
 * @author linlingyu
 */



baidu.ui.Carousel = baidu.ui.createUI(function(options) {
    var me = this,
        data = me.contentText || [];
    me._dataList = data.slice(0, data.length);
    me._itemIds = [];
    me._items = {};//用来存入被删除的节点，当再次被使用时可以直接拿回来,格式:{element: dom, handler: []}
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
    _axis: {
        horizontal: {vector: '_boundX', pos: 'left', size: 'width', offset: 'offsetWidth', client: 'clientWidth', scrollPos: 'scrollLeft'},
        vertical: {vector: '_boundY', pos: 'top', size: 'height', offset: 'offsetHeight', client: 'clientHeight', scrollPos: 'scrollTop'}
    },
    /**
     * 生成一个容器的字符串
     * @return {String}
     * @private
     */
    getString: function() {
        var me = this,
            tpl = '<div id="#{id}" class="#{class}">#{content}</div>',
            str = baidu.string.format(tpl, {
                id: me.getId('scroll'),
                'class': me.getClass('scroll')
            });
        return baidu.string.format(tpl, {
            id: me.getId(),
            'class': me.getClass(),
            content: str
        });
    },
    /**
     * 渲染滚动组件到参数指定的容器中
     * @param {HTMLElement} target 一个用来存放组件的容器对象.
     */
    render: function(target) {
        var me = this;
        if (!target || me.getMain()) {return;}
        //先把已经存在的dataList生成出来guid
        baidu.array.each(me._dataList, function(item) {
	        me._itemIds.push(baidu.lang.guid());
	    });
        baidu.dom.insertHTML(me.renderMain(target), 'beforeEnd', me.getString());
        me._renderItems();
        me._resizeView();
        me._moveToMiddle();
        me.focus(me.scrollIndex);
        me.addEventListener('onbeforeendscroll', function(evt) {
            var orie = me.orientation == 'horizontal',
                axis = me._axis[me.orientation],
                sContainer = me.getScrollContainer();
            me._renderItems(evt.index, evt.scrollOffset);
            sContainer.style[axis.size] = parseInt(sContainer.style[axis.size])
                - me['_bound' + (orie ? 'X' : 'Y')].offset
                * evt.scrollUnit + 'px';
            me._moveToMiddle();
            me._scrolling = false;
        });
        me.dispatchEvent('onload');
    },
    /**
     * 从缓存中取出滚动项按照参数的格式在页面上排列出滚动项
     * @param {Number} index 索引值.
     * @param {Number} offset 指定索引项放在页面的位置.
     * @private
     */
    _renderItems: function(index, offset) {
        var me = this,
            sContainer = me.getScrollContainer(),
            index = Math.min(Math.max(index | 0, 0), me._dataList.length - 1),
            offset = Math.min(Math.max(offset | 0, 0), me.pageSize - 1),
            count = me.pageSize,
            i = 0,
            entry;
        while (sContainer.firstChild) {//这里改用innerHTML赋空值会使js存的dom也被清空
            baidu.dom.remove(sContainer.firstChild);
        }
        for (; i < count; i++) {
            entry = me._getItemElement(index - offset + i)
            sContainer.appendChild(entry.element);
            entry.setContent();
        }
    },
    /**
     * 将滚动容器排列到中间位置
     * @private
     */
    _moveToMiddle: function() {
        if (!this._boundX) {return;}
        var me = this,
            axis = me._axis[me.orientation];
        me.getBody()[axis.scrollPos] = me.orientation == 'horizontal'
            && baidu.browser.ie == 6 ? me._boundX.marginX : 0;
    },
    /**
     * 运算可视区域的宽高(包括对margin的运算)，并运算出一个滚动单位的offsetWidth和offsetHeight
     * @private
     */
    _resizeView: function() {
        if (this._dataList.length <= 0) {return;}//没有数据
        var me = this,
            axis = me._axis[me.orientation],
            orie = me.orientation == 'horizontal',
            sContainer = me.getScrollContainer(),
            child = baidu.dom.children(sContainer),
            boundX,
            boundY;
        function getItemBound(item, type) {
            var type = type == 'x',
                bound = item[type ? 'offsetWidth' : 'offsetHeight'],
                marginX = parseInt(baidu.dom.getStyle(item, type ? 'marginLeft' : 'marginTop')),
                marginY = parseInt(baidu.dom.getStyle(item, type ? 'marginRight' : 'marginBottom'));
            isNaN(marginX) && (marginX = 0);
            isNaN(marginY) && (marginY = 0);
            return {
//                size: bound,
                offset: bound + (orie ? marginX + marginY : Math.max(marginX, marginY)),
                marginX: marginX,
                marginY: marginY
            };
        }
        me._boundX = boundX = getItemBound(child[0], 'x');//设置滚动单位
        me._boundY = boundY = getItemBound(child[0], 'y');//设置滚动单位
        sContainer.style.width = boundX.offset
            * (orie ? child.length : 1)
            + (baidu.browser.ie == 6 ? boundX.marginX : 0)
            + 'px';
        sContainer.style.height = boundY.offset
            * (orie ? 1 : child.length)
            + (orie ? 0 : boundY.marginX)
            + 'px';
        me.getBody().style[axis.size] = me[axis.vector].offset * me.pageSize
            + (orie ? 0 : Math.min(me[axis.vector].marginX, me[axis.vector].marginY)) + 'px';
    },
    
    /**
     * 根据索引的从缓存中取出对应的滚动项，如果缓存不存在该项则创建并存入缓存，空滚动项不被存入缓存
     * @param {Number} index 索引值.
     * @return {HTMLElement}
     * @private
     */
    _baseItemElement: function(index) {
        var me = this,
            itemId = me._itemIds[index],
            entry = me._items[itemId] || {},
            txt = me._dataList[index],
            element;
        if (!entry.element) {
            entry.element = element = baidu.dom.create('div', {
                id: itemId || '',
                'class': me.getClass('item')
            });
            !itemId && baidu.dom.addClass(element, me.getClass('item-empty'));
            entry.content = txt ? txt.content : '';
            if (itemId) {
                entry.handler = [
                    {evtName: 'click', handler: baidu.fn.bind('_onItemClickHandler', me, element)},
                    {evtName: 'mouseover', handler: baidu.fn.bind('_onMouseHandler', me, 'mouseover')},
                    {evtName: 'mouseout', handler: baidu.fn.bind('_onMouseHandler', me, 'mouseout')}
                ];
                baidu.array.each(entry.handler, function(item) {
                    me.on(element, item.evtName, item.handler);
                });
                me._items[itemId] = entry;
            }
            entry.setContent = function(){
                this.content && (this.element.innerHTML = this.content);
                this.content && (delete this.content);
            }
        }
        return entry;
    },
    
    /**
     * 对_baseItemElement的再包装，在循环滚动中可以被重写
     * @param {Number} index 索引值.
     * @return {HTMLElement}
     */
    _getItemElement: function(index) {
        return this._baseItemElement(index);
    },
    /**
     * 处理点击滚动项的事件触发
     * @param {HTMLElement} ele 该滚动项的容器对象.
     * @param {Event} evt 触发事件的对象.
     * @private
     */
    _onItemClickHandler: function(ele, evt) {
        var me = this;
        me.focus(baidu.array.indexOf(me._itemIds, ele.id));
        me.dispatchEvent('onitemclick');
    },
    /**
     * 处理鼠标在滚动项上划过的事件触发
     * @param {String} type mouseover或是omouseout.
     * @param {Event} evt 触发事件的对象.
     * @private
     */
    _onMouseHandler: function(type, evt) {
        this.dispatchEvent('on' + type);
    },
    /**
     * 取得当前得到焦点项在所有数据项中的索引值
     * @return {Number} 索引值.
     */
    getCurrentIndex: function() {
        return this.scrollIndex;
    },
    /**
     * 取得数据项的总数目
     * @return {Number} 总数.
     */
    getTotalCount: function() {
        return this._dataList.length;
    },
    /**
     * 根据数据的索引值取得对应在页面的DOM节点，当节点不存时返回null
     * @param {Number} index 在数据中的索引值.
     * @return {HTMLElement} 返回一个DOM节点.
     */
    getItem: function(index) {
        return baidu.dom.g(this._itemIds[index]);
    },
    /**
     * 从当前项滚动到index指定的项，并将该项放在scrollOffset的位置
     * @param {Number} index 在滚动数据中的索引.
     * @param {Number} scrollOffset 在页面的显示位置，该参数如果不填默认值取0.
     * @param {String} direction 滚动方向，取值: prev:强制滚动到上一步, next:强制滚动到下一步，当不给出该值时，会自动运算一个方向来滚动.
     */
    scrollTo: function(index, scrollOffset, direction) {
        var me = this,
            axis = me._axis[me.orientation],
            scrollOffset = Math.min(Math.max(scrollOffset | 0, 0), me.pageSize - 1),
            sContainer = me.getScrollContainer(),
            child = baidu.dom.children(sContainer),
            item = me.getItem(index),
            smartDirection = direction,
            distance = baidu.array.indexOf(child, item) - scrollOffset,
            count = Math.abs(distance),
            len = me._dataList.length,
            i = 0,
            fragment,
            vergeIndex,
            vector,
            entry;
        //当移动距离是0，没有数据，index不合法，或是正处理滚动中。以上条件都退出
        if((item && distance == 0)
            || me._dataList.length <= 0 || index < 0
            || index > me._dataList.length - 1
            || me._scrolling) {return;}
        if (!smartDirection) {//如果方法参数没有给出合理的方向，需要自动运算合理的方向
            //如果index所对项已经存在于页，则以需要移动的距离来判断方法
            //如果不存在于页面，表示是远端运动，以可视区左边第一个有id的项来和index比较大小得出方向
            smartDirection = item ? (distance < 0 ? 'prev' : (distance > 0 ? 'next' : 'keep'))
                : baidu.array.indexOf(me._itemIds,
                    baidu.array.find(child, function(ele) {return !!ele.id}).id)
                    > index ? 'prev' : 'next';
        }
        vector = smartDirection == 'prev';
        if (!item) {//如果是一个远端移动
            //算出可视区中最接近index的一个项的索引，即边界索引
            vergeIndex = baidu.array.indexOf(me._itemIds,
                child[vector ? 0 : child.length - 1].id);
            //(x + len - y) % len
            //Math(offset - (is ? 0 : pz - 1)) + count
            //以上两个公式结合以后可以运算出当前边界项之后需要动态添加多少项而可以不管他的方向性
            count = Math.abs(scrollOffset - (vector ? 0 : me.pageSize - 1))
                + ((vector ? vergeIndex : index) + len - (vector ? index : vergeIndex)) % len;
            count > me.pageSize && (count = me.pageSize);
        }
        fragment = count > 0 && document.createDocumentFragment();
        //利用循环先把要移动的项生成并插入到相应的位置
        for (; i < count; i++) {
            entry = me._getItemElement(vector ? index - scrollOffset + i
                : me.pageSize + index + i - (item && !direction ? baidu.array.indexOf(child, item)
                    : scrollOffset + count));
            fragment.appendChild(entry.element);
            entry.setContent();//为了防止内存泄露在这里渲染内容，该方法只会渲染一次
        }
        vector ? sContainer.insertBefore(fragment, child[0])
            : sContainer.appendChild(fragment);
        distance = me[axis.vector].offset * count;//me[axis.vector].offset是单个项的移动单位
        //扩大scrollContainer宽度，让上面插入的可以申展开
        sContainer.style[axis.size] = parseInt(sContainer.style[axis.size]) + distance + 'px';
        //scrollContainer改变宽度后需要对位置重新调整，让可视区保持不保
        vector && (me.getBody()[axis.scrollPos] += distance);
        me._scrolling = true;//开始滚动
        if (me.dispatchEvent('onbeforescroll', {index: index, scrollOffset: scrollOffset,
            direction: smartDirection, scrollUnit: count})) {
            me.getBody()[axis.scrollPos] += count * me[axis.vector].offset * (vector ? -1 : 1);
            me.dispatchEvent('onbeforeendscroll', {index: index, scrollOffset: scrollOffset,
                direction: smartDirection, scrollUnit: count});
            me.dispatchEvent('onafterscroll', {index: index, scrollOffset: scrollOffset,
                direction: smartDirection, scrollUnit: count});
        }
    },
    /**
     * 取得翻页的索引和索引在页面中的位置
     * @param {String} type 翻页方向，取值：prev:翻到上一步,next:翻到下一步.
     * @return {Object} {index:需要到达的索引项, scrollOffset:在页面中的位置}.
     * @private
     */
    _getFlipIndex: function(type) {
        var me = this,
            vector = me.flip == 'item',
            type = type == 'prev',
            currIndex = me.scrollIndex,
            index = currIndex + (vector ? 1 : me.pageSize) * (type ? -1 : 1),
            offset = vector ? (type ? 0 : me.pageSize - 1)
                : baidu.array.indexOf(baidu.dom.children(me.getScrollContainer()), me.getItem(currIndex));
        //fix flip page
        if (!vector && (index < 0 || index > me._dataList.length - 1)) {
            index = currIndex - offset + (type ? -1 : me.pageSize);
            offset = type ? me.pageSize - 1 : 0;
        }
        return {index: index, scrollOffset: offset};
    },
    /**
     * 翻页的基础处理方法
     * @param {String} type 翻页方向，取值：prev:翻到上一步,next:翻到下一步.
     * @private
     */
    _baseSlide: function(type) {
        if (!this.getItem(this.scrollIndex)) {return;}
        var me = this,
            sContainer = me.getScrollContainer(),
            flip = me._getFlipIndex(type);
        if(flip.index < 0 || flip.index > me._dataList.length - 1){return;}
        function moveByIndex(index, offset, type){
            me.addEventListener('onbeforeendscroll', function(evt){
                var target = evt.target;
                target.focus(evt.index);
                target.removeEventListener('onbeforeendscroll', arguments.callee);
            });
            me.scrollTo(index, offset, type);
        }
        if (me.flip == 'item') {
            me.getItem(flip.index) ? me.focus(flip.index)
                : moveByIndex(flip.index, flip.scrollOffset, type);
        }else {
            me._itemIds[flip.index]
                && moveByIndex(flip.index, flip.scrollOffset, type);
        }
    },
    /**
     * 翻到上一项或是翻到上一页
     */
    prev: function() {
        var me = this;
        me._baseSlide('prev');
        me.dispatchEvent('onprev');
    },
    /**
     * 翻到下一项或是翻到下一页
     */
    next: function() {
        var me = this;
        me._baseSlide('next');
        me.dispatchEvent('onnext');
    },
    /**
     * 是否已经处在第一项或第一页
     * @return {Boolean} true:当前已是到第一项或第一页.
     */
    isFirst: function() {
        var flip = this._getFlipIndex('prev');
        return flip.index < 0;
    },
    /**
     * 是否已经处在末项或是末页
     * @return {Boolean} true:当前已是到末项或末页.
     */
    isLast: function() {
        var flip = this._getFlipIndex('next');
        return flip.index >= this._dataList.length;
    },
    /**
     * 使当前选中的项失去焦点
     * @private
     */
    _blur: function() {
        var me = this,
            itemId = me._itemIds[me.scrollIndex];
        if (itemId) {
            baidu.dom.removeClass(me._baseItemElement(me.scrollIndex).element,
                me.getClass('item-focus'));
            me.scrollIndex = -1;
        }
    },
    /**
     * 使某一项得到焦点
     * @param {Number} index 需要得到焦点项的索引.
     */
    focus: function(index) {
        var me = this,
            itemId = me._itemIds[index],
            item = itemId && me._baseItemElement(index);//防止浪费资源创出空的element
        if (itemId) {
            me._blur();
            baidu.dom.addClass(item.element, me.getClass('item-focus'));
            me.scrollIndex = index;
            me.dispatchEvent('onfocus', {index: index});
        }
    },
    /**
     * 取得存放所有项的上层容器
     * @return {HTMLElement} 一个HTML元素.
     */
    getScrollContainer: function() {
        return baidu.dom.g(this.getId('scroll'));
    },
    /**
     * 析构函数
     */
    dispose: function() {
        var me = this;
        me.dispatchEvent('ondispose');
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});
