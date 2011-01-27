/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

/*
 *
 *  智能遮罩，根据用户参数遮住元素下面的select或者flash
 *
 *  使用方法：
 *  baidu.ui.smartCover(element);
 */


//依赖包
///import baidu.ui;
///import baidu.ui.get;
///import baidu.ui.smartPosition.set;

///import baidu.object.extend;
///import baidu.browser.ie;

///import baidu.dom.hasAttr;
///import baidu.dom.setStyles;
///import baidu.dom._styleFilter.px;
///import baidu.dom.getPosition;
///import baidu.each;

(function(){
    var smartCover = {
        show    : show,
        hide    : hide,
        update  : update,
        shownIndex : 0,
        hideElement:{},
        iframes : [],
        options : {
            hideSelect : false,
            hideFlash: true
        }
    };

    baidu.ui.smartCover = baidu.ui.smartCover || smartCover;
    var me = baidu.ui.smartCover;

    /**
     * 获取当前需要被隐藏的元素
     * @prviate
     * @param {Array} 获取目标的nodeType
     * @param {HTMLElement} 获取目标的容器
     * @return {Array} 获取的目标数组
     */
    function getElementsToHide(elementTags,container){
        var elements = [],
            i = elementTags.length-1,
            j,
            eachElement,
            con = baidu.g(container) ? baidu.g(container) : document;

        for(; i>=0; i--){
            eachElement = con.getElementsByTagName(elementTags[i]);

            for(j = eachElement.length - 1; j>= 0; j--){
                /**
                 * 每次查找值查找当时还处于显示状态的元素
                 * 实现分层的效果
                 */
                if(eachElement[j] && eachElement[j].style.visibility != "hidden")
                    elements.push([eachElement[j],null]);
            }
        }
        return elements;
    }


    /**
     * 显示smartCover
     * @public
     * @param {UI} baidu.ui对象
     * @param {Object} options samrtCover配置参数
     * @return void
     * */
    function show(ui, options){
        /*
         * shownIndex递增
         * 层级的唯一编号
         */
        me.shownIndex += 1;
        var elementTags = [],
            op = {
                container : document
            };
        baidu.object.extend(op, smartCover.options);
        baidu.object.extend(op, options || {});
        
        op['hideFlash'] && elementTags.push("object");
        op['hideSelect'] && elementTags.push("select");

        //存入对应的层级
        me.hideElement[me.shownIndex] = getElementsToHide(elementTags,op.container);
        var main = ui.getMain(),
            pos = baidu.dom.getPosition(main),
            id = ui.getId(),
            shadeIframe = smartCover.iframes[id];

        if(baidu.ie && op['hideSelect']){
            //用iframe遮select
            if(!shadeIframe){
                shadeIframe = smartCover.iframes[id] = document.createElement('IFRAME');
                //一个简单的装饰器
                ui.getMain().appendChild(shadeIframe);
                shadeIframe.style.display = 'none';
            }

            //todo: 做为配置项，https
            shadeIframe.src = "javascript:void(0)";

            baidu.dom.setStyles(shadeIframe, {
                zIndex  : -1,
                display  : "block",
                border  : "none",
                position : "absolute",
                width : main.offsetWidth,
                height : main.offsetHeight,
                top : 0,
                left : 0,
                //Make sure that the iframe is not visible.
                filter : 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'
            });
        }
        baidu.each(me.hideElement[me.shownIndex],function(element){
            if(baidu.ui.get(element[0]) != ui){
                hideElement(element);
            }
        });
    }

    /**
     * 更新smartCover
     * @public
     * @param {UI} ui，baidu.ui对象
     * @return void
     * */
    function update(ui){
        if(baidu.ie){
            var main = ui.getMain(),
                id = ui.getId();
            if(!smartCover.iframes[id]){
                return ;
            }
            baidu.dom.setStyles(smartCover.iframes[id], {
                width : main.offsetWidth,
                height : main.offsetHeight
            });
        }
    }

    /**
     * 隐藏smartCover
     * @public 
     * @param {UI} ui，baidu.ui对象
     * @return void
     */
    function hide(ui){
        if(me.shownIndex == 0)
            return;

        var shadeIframe = smartCover.iframes[ui.getId()];

        if(baidu.ie && shadeIframe){
            shadeIframe.style.display = 'none';
        }
        baidu.each(me.hideElement[me.shownIndex],function(element){
            if(baidu.ui.get(element[0]) != ui)
            restoreElement(element);
        });
        //删除层级，shownIndex减一
        delete(me.hideElement[me.shownIndex]);
        me.shownIndex -= 1;
    }

    /**
     * 隐藏被选出的需要遮盖的元素
     * @prviate
     * @param {HTMLElement} element
     * @return void
     */
    function hideElement(element){
        if(element[1] === null){
            element[1] = element[0].style.visibility;
            element[0].style.visibility = "hidden";
        }
    }
    
    /**
     * 还原被选出的需要遮盖的元素
     * @prviate
     * @param {HTMLElement} element
     * @return void
     */
    function restoreElement(element){
        if(element[1] !== null){
            element[0].style.visibility = element[1];
            element[1] = null;
        }
    }
    
})();
