/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/smartCover.js
 * author: berg
 * version: 1.0.0
 * date: 2010-05-18
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


(function(){
    var smartCover = {
        show    : show,
        hide    : hide,
        update  : update,
        iframes : [],
        options : {
            hideSelect : false,
            hideFlash: true
        }
    };

    baidu.ui.smartCover = baidu.ui.smartCover || smartCover;
    var me = baidu.ui.smartCover;

    function getElementsToHide(elementTags,container){
        var elements = [],
            i = elementTags.length-1,
            j,
            eachElement,
            con = baidu.g(container) ? baidu.g(container) : document;

        for(; i>=0; i--){
            eachElement = con.getElementsByTagName(elementTags[i]);

            for(j = eachElement.length - 1; j>= 0; j--){
                if(eachElement[j])
                    elements.push([eachElement[j],null]);
            }
        }
        return elements;
    }


    function show(ui, options){
        var elementTags = [],
            op = {
                container : document
            };
        baidu.object.extend(op, smartCover.options);
        baidu.object.extend(op, options || {});
        
        op['hideFlash'] && elementTags.push("object");
        op['hideSelect'] && elementTags.push("select");

        me.elementsToHide = getElementsToHide(elementTags,op.container);
        var len = me.elementsToHide.length,
            element,
            i,
            main = ui.getMain(),
            pos = baidu.dom.getPosition(main),
            id = ui.getId(),
            shadeIframe = smartCover.iframes[id];

        if(baidu.ie && !op['hideSelect']){
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

        if(!me.elementsToHide){
            return ;
        }
        for(i = 0; i < len; i++) {
            element = me.elementsToHide[i];
            //不隐藏ui控件中的元素
            if(baidu.ui.get(element[0]) != ui){
                hideElement(element);
            }
        }
    }

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

    function hide(ui){
        me.elementsToHide = me.elementsToHide || getElementsToHide(['object', 'select']);

        var len = me.elementsToHide.length,
            element,
            i,
            shadeIframe = smartCover.iframes[ui.getId()];

        if(baidu.ie && shadeIframe){
            shadeIframe.style.display = 'none';
        }
        if(!me.elementsToHide){
            return ;
        }
        for (i = 0; i < len; i++) {
            element = me.elementsToHide[i];
            if(baidu.ui.get(element[0]) != ui)
                restoreElement(element);

            me.elementsToHide[i][0] = null;
        }
        delete(me.elementsToHide);
    }

    function hideElement(element){
        if(element[1] === null){
            element[1] = element[0].style.visibility;
            element[0].style.visibility = "hidden";
        }
    }

    function restoreElement(element){
        if(element[1] !== null){
            element[0].style.visibility = element[1];
            element[1] = null;
        }
    }
    
})();
