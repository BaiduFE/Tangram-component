/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/behavior/sortable.js
 * author: fx
 * version: 1.0.0
 * date: 2010-12-21
 *
 */

///import baidu.dom.setStyles;
///import baidu.dom.getStyle;
///import baidu.ui.behavior;
///import baidu.dom.draggable;
///import baidu.dom.droppable;
///import baidu.array.each;
///import baidu.dom.insertBefore;
///import baidu.dom.insertAfter;
///import baidu.page.getWidth;
///import baidu.page.getHeight;
///import baidu.dom.getPosition;
///import baidu.object.extend;

//2011-2-23做了以下优化，在初始化的时候生成一个坐标与对象的键值对集合。
//再判断拖拽元素的坐标是否在键值对范围内，如果是就做排序操作。
(function() {

    var Sortable = baidu.ui.behavior.sortable = function() {
        this.addEventListener("dispose", function(){
            baidu.event.un(me.element, 'onmousedown', handlerMouseDown);
        });
    };

    /**
     * sortable : 组件公共行为，用来完成dom元素位置的交换.
     * 可以用于树的节点的排序，列表的排序等等.
     *
     *
     * @param {Array}  sortElements 被排序的元素数组.
     * @param {Array}  sortParentElement 被排序的元素的父元素，用来做事件代理的。.
     * @param {Object} options 可子定义参数.
     * sortHandlers {Array} 默认值[]  拖拽句柄数组，这个需要与elements一一对应.
     *                  如果handlers为空,那么整个sortElement都是可以进行拖拽。.
     *
     * sortDisabled {Boolean} 默认值
     *
     * sortRangeElement {HTMLElement} 默认值 null  定义拖拽的边界元素，就能在这个元素范围内进行拖拽
     *
     * sortRange {Array}    默认值[0,0,0,0] 鼠标的样式 排序的范围,排序的元素只能在这个范围进行拖拽
     *
     * onsortstart {Function}  排序开始的时候的事件
     *
     * onsort {Function}  正在排序时候的事件
     *
     * onsortend {Function}  排序结束时候的事件
     *
     */
     // TODO axis {String}   默认值 null .  坐标，当坐标为"x",元素只能水平拖拽，当坐标为"y",元素只能垂直拖拽。
     // TODO  delay {Integer}  默认值 0  当鼠标mousedown的时候延长多长时间才可以执行到onsortstart。
     //                        这个属性可以满足只点击但不排序的用户
     // TODO  useProxy 默认值 false  是否需要代理元素，在拖拽的时候是元素本身还是代理
     // 实现思路
     // 点击一组元素其中一个，在mousedown的时候将这个元素的position设为absolute,在拖动的时候判断
     // 此元素与其他元素是否相交，相交就在相交的元素下面生成一个空的占位符（宽和高与拖动元素一样），dragend的
     // 时候将此拖拽的元素替代占位符.那么排序就完成。
     // 完成此效果可以借助baidu.dom.drag来辅助实现.
     // 规则:
     // 1.这一组元素的style.position应该是一致的.
     // 2.这一组元素应该是同一html标签的元素.

    Sortable.sortUpdate = function(sortElements, sortParentElement, options) {
        var position,
            element,
            handler,
            me = this,
            rangeElementPostion,
            options = options || {};
        if (me.sortDisabled) {
            return false;
        }
        options.sortElements = sortElements;
        baidu.object.extend(me, options);
        me.sortHandlers = me.sortHandlers || me.sortElements;
        me.element = sortParentElement;
        me.sortRangeElement = baidu.g(me.sortRangeElement) || document.body;
        rangeElementPostion = baidu.dom.getPosition(me.sortRangeElement);
        //先将elements的position值存下来.在这里说明一下sortable的规则，对于elements,
        //应该是一组position值相同的元素。
        if (me.sortElements) {
            me._sortPosition = baidu.dom.getStyle(me.sortElements[0], 'position');
        }
        //设置range 上右下左
        if(!me.sortRange){
            me.sortRange = [
                rangeElementPostion.top,
                rangeElementPostion.left + me.sortRangeElement.offsetWidth,
                rangeElementPostion.top + me.sortRangeElement.offsetHeight,
                rangeElementPostion.left
            ];
        }

        baidu.event.on(me.element, 'onmousedown', mouseDownHandler);

    };

    function isInElements(elements, element) {
        var len = elements.length,
            i = 0;
        for (; i < len; i++) {
            if (elements[i] == element) {
                return true;
            }
        }
    }
    
    /*
     * 事件代理，放在sortElement的父元素上
     */
    function mouseDownHandler(event) {
        var element = baidu.event.getTarget(event),
            position = baidu.dom.getPosition(element),
            parent = element.offsetParent,
            parentPosition = (parent.tagName == 'BODY') ? {left: 0, top: 0} : baidu.dom.getPosition(parent);
            if (!isInElements(me.sortElements, element)) {
                return false;
            }
            baidu.dom.setStyles(element, {
                left: (position.left - parentPosition.left) + 'px',
                top: (position.top - parentPosition.top) + 'px',
                //如果position为relative,拖动元素，还会占有位置空间，所以在这里将
                //position设置为'absolute'
                position: 'absolute'
            });
            me._sortBlankDivId = me._sortBlankDivId || _createBlankDiv(element, me).id;
            baidu.dom.drag(element, {range: me.sortRange,
                ondragstart: function(trigger) {
                    me.sortElementsMap = _getElementsPosition(me.sortHandlers);
                    me.dispatchEvent('sortstart', {trigger: trigger});
                },
                ondrag: function(trigger) {
                    var elements = me.sortHandlers,
                        i = 0,
                        len = elements.length,
                        target,
                        position = baidu.dom.getPosition(trigger);
                    target = getTarget(
                            position.left,
                            position.top,
                            trigger.offsetWidth,
                            trigger.offsetHeight,
                            me.sortElementsMap
                        );
                    if (target != null) {
                        me._sortTarget = target;
                        baidu.dom.insertAfter(_getBlankDiv(me), target);
                    }
                    me.dispatchEvent('sort', {trigger: trigger});
                },

                ondragend: function(trigger) {
                    if (me._sortTarget) {
                        baidu.dom.insertAfter(trigger, me._sortTarget);
                        me.dispatchEvent('sortend', {trigger: trigger, reciever: me._sortTarget});
                    }
                    baidu.dom.remove(_getBlankDiv(me));
                    me._sortBlankDivId = null;
                    baidu.dom.setStyles(trigger, {position: me._sortPosition, left: '0px', top: '0px'});

                }
            });

    }

    //通过拖拽的元素的x,y坐标和宽高来定位到目标元素。
    function getTarget(left, top, width, height, map) {
        var i,
            _height,
            _width,
            _left,
            _top,
            array,
            max = Math.max,
            min = Math.min;
        for (i in map) {
            array = i.split('-');
            _left = +array[0];
            _top = +array[1];
            _width = +array[2];
            _height = +array[3];
            if (max(_left, left) <= min(_left + _width, left + width)
               && max(_top, top) <= min(_top + _height, top + height)) {
               return map[i];
            }
        }
        return null;
    }


    //取得一组元素的定位与元素的map
    function _getElementsPosition(elements) {
        var map = {},
            position;
        baidu.each(elements, function(item) {
            position = baidu.dom.getPosition(item);
            map[position.left + '-' + position.top + '-' + item.offsetWidth + '-' + item.offsetHeight] = item;
        });
        return map;
    }



    //取得空占位符的dom元素
    function _getBlankDiv(me) {
        return baidu.g(me.getId('sortBlankDiv'));
    }

    //创建一个空占位符的层
    function _createBlankDiv(trigger, me) {
        var div = baidu.dom.create('div', {
            id: me.getId('sortBlankDiv'),
            className: trigger.className
        });
        baidu.dom.setStyles(div, {
            width: trigger.offsetWidth + 'px',
            height: trigger.offsetHeight + 'px',
            borderWidth: '0px'
        });
        baidu.dom.insertBefore(div, trigger);
        return div;
    }

})();


