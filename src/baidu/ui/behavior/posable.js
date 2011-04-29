/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 */


///import baidu.ui.behavior;

///import baidu.dom.getWindow;
///import baidu.dom.getStyle;
///import baidu.dom.getPosition;
///import baidu.dom.setPosition;
///import baidu.dom._styleFilter.px;


///import baidu.event.on;
///import baidu.page.getViewWidth;
///import baidu.page.getViewHeight;
///import baidu.page.getScrollTop;
///import baidu.page.getScrollLeft;

///import baidu.lang.isFunction;


///import baidu.fn.bind;

/**
 * @author berg, lxp
 * @behavior 为ui控件添加定位行为
 *
 * 根据用户参数将元素定位到指定位置
 * TODO: 1. 用surround做触边折返场景时, 折返的大小通常是原始高宽+另一元素的高宽
 *
 * });
 */
(function() {
    var Posable = baidu.ui.behavior.posable = function() { };

    /**
     * 将控件或者指定元素的左上角放置到指定的坐标
     * @param {Array|Object} coordinate 定位坐标,相对文档左上角的坐标，可以是{x:200,y:300}格式，也可以是[200, 300]格式.
     * @param {HTMLElement|string} element optional 目标元素或目标元素的id，如果不指定，默认为当前控件的主元素.
     * @param {Object} options optional 选项，包括：position/coordinate/offset/insideScreen.
     */
    Posable.setPosition = function(coordinate, element, options) {
        element = baidu.g(element) || this.getMain();
        options = options || {};
        var me = this,
            args = [element, coordinate, options];
        me.__execPosFn(element, '_positionByCoordinate', options.once, args);
    };

    /**
     * 将元素放置到指定的坐标点
     *
     * @param {HTMLElement|string} source 要定位的元素.
     * @param {Array|Object} coordinate 定位坐标,相对文档左上角的坐标，可以是{x:200,y:300}格式，也可以是[200, 300]格式.
     * @param {Object} options optional 选项，同setPosition.
     */
    Posable._positionByCoordinate = function(source, coordinate, options, _scrollJustify) {
        coordinate = coordinate || [0, 0];
        options = options || {};
        
        var me = this,
            elementStyle = {},
            cH = baidu.page.getViewHeight(),
            cW = baidu.page.getViewWidth(),
            scrollLeft = baidu.page.getScrollLeft(),
            scrollTop  = baidu.page.getScrollTop(),
            sourceWidth = source.offsetWidth,
            sourceHeight = source.offsetHeight,
            offsetParent = source.offsetParent,
            parentPos = (!offsetParent || offsetParent == document.body) ? {left: 0, top: 0} : baidu.dom.getPosition(offsetParent);

        //兼容position大小写
        options.position = (typeof options.position !== 'undefined') ? options.position.toLowerCase() : 'bottomright';

        coordinate = _formatCoordinate(coordinate || [0, 0]);
        options.offset = _formatCoordinate(options.offset || [0, 0]);
    
        coordinate.x += (options.position.indexOf('right') >= 0 ? (coordinate.width || 0) : 0); 
        coordinate.y += (options.position.indexOf('bottom') >= 0 ? (coordinate.height || 0) : 0); 
        
        elementStyle.left = coordinate.x + options.offset.x - parentPos.left;
        elementStyle.top = coordinate.y + options.offset.y - parentPos.top;

        switch (options.insideScreen) {
           case "surround" :
                elementStyle.left += elementStyle.left < scrollLeft ? sourceWidth  + (coordinate.width || 0): 
                                    ((elementStyle.left + sourceWidth ) > (scrollLeft + cW) ? - sourceWidth - (coordinate.width || 0) : 0);
                elementStyle.top  += elementStyle.top  < scrollTop  ? sourceHeight  + (coordinate.height || 0):
                                    ((elementStyle.top  + sourceHeight) > (scrollTop  + cH) ? - sourceHeight - (coordinate.height || 0) : 0);
                break;
            case 'fix' :
                elementStyle.left = Math.max(
                        0 - parseFloat(baidu.dom.getStyle(source, 'marginLeft')) || 0,
                        Math.min(
                            elementStyle.left,
                            baidu.page.getViewWidth() - sourceWidth - parentPos.left
                            )
                        );
                elementStyle.top = Math.max(
                        0 - parseFloat(baidu.dom.getStyle(source, 'marginTop')) || 0,
                        Math.min(
                            elementStyle.top,
                            baidu.page.getViewHeight() - sourceHeight - parentPos.top
                            )
                        );
                break;
            case 'verge':
                var offset = {
                    width: (options.position.indexOf('right') > -1 ? coordinate.width : 0),//是否放在原点的下方
                    height: (options.position.indexOf('bottom') > -1 ? coordinate.height : 0)//是否放在原点的右方
                },
                optOffset = {
                    width: (options.position.indexOf('bottom') > -1 ? coordinate.width : 0),
                    height: (options.position.indexOf('right') > -1 ? coordinate.height : 0)
                };
               
                elementStyle.left -= (options.position.indexOf('right') >= 0 ? (coordinate.width || 0) : 0);
                elementStyle.top -= (options.position.indexOf('bottom') >= 0 ? (coordinate.height || 0) : 0);
                
                elementStyle.left += elementStyle.left + offset.width + sourceWidth - scrollLeft > cW - parentPos.left ?
                    optOffset.width - sourceWidth : offset.width;
                elementStyle.top += elementStyle.top + offset.height + sourceHeight - scrollTop > cH - parentPos.top ?
                    optOffset.height - sourceHeight : offset.height;
                break;
        }
        baidu.dom.setPosition(source, elementStyle);


        //如果因为调整位置令窗口产生了滚动条，重新调整一次。
        //可能出现死循环，用_scrollJustify保证重新调整仅限一次。
        if (!_scrollJustify && (cH != baidu.page.getViewHeight() || cW != baidu.page.getViewWidth())) {
            me._positionByCoordinate(source, coordinate, {}, true);
        }
        _scrollJustify || me.dispatchEvent('onpositionupdate');
    };

    /**
     * 根据参数不同，选择执行一次或者在window resize的时候再次执行某方法
     * @private
     *
     * @param {HTMLElement|string} element 根据此元素寻找window.
     * @param {string} fnName 方法名，会在this下寻找.
     * @param {Boolean} once 是否只执行一次.
     * @return {arguments} args 执行方法的参数.
     */
    Posable.__execPosFn = function(element, fnName, once, args) {
        var me = this;

        if (typeof once == 'undefined' || !once) {
            baidu.event.on(
                baidu.dom.getWindow(element),
                'resize',
                baidu.fn.bind.apply(me, [fnName, me].concat([].slice.call(args)))
            );
        }
        me[fnName].apply(me, args);
    };
    /**
     * 格式化坐标格式
     * @param {Object|array} coordinate 要调整的坐标格式.
     * @return {Object} coordinate 调整后的格式
     * 类似：{x : number, y : number}.
     */
    function _formatCoordinate(coordinate) {
        coordinate.x = coordinate[0] || coordinate.x || coordinate.left || 0;
        coordinate.y = coordinate[1] || coordinate.y || coordinate.top || 0;
        return coordinate;
    }
})();
