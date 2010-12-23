/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * @author: meizz
 * @namespace: baidu.fx.scale
 * @version: 2010-06-07
 */

///import baidu.dom.g;
///import baidu.dom.show;
///import baidu.browser.ie;
///import baidu.dom.getStyle;
///import baidu.object.extend;

///import baidu.fx.create;

/**
 * 将DOM元素放大
 * 2010-07-02 添加opacityTrend属性定制，可以手动控制透明的趋势
 *
 * @param   {HTMLElement}   element     DOM元素或者ID
 * @param   {JSON}          options     类实例化时的参数配置
 *          {transformOrigin, from,     to, restoreAfterFinish}
 *          {"0px 0px"        number    number}
 * @return  {fx}     效果类的实例
 */
baidu.fx.scale = function(element, options) {
    if (!(element = baidu.dom.g(element))) return null;
    options = baidu.object.extend({from : 0.1,to : 1}, options || {});

    // "0px 0px" "50% 50%" "top left"
    var r = /^(-?\d+px|\d?\d(\.\d+)?%|100%|left|center|right)(\s+(-?\d+px|\d?\d(\.\d+)?%|100%|top|center|bottom))?/i;
    !r.test(options.transformOrigin) && (options.transformOrigin = "0px 0px");

    var original = {},
        fx = baidu.fx.create(element, baidu.object.extend({
        //[Implement Interface] initialize
        initialize : function() {
            baidu.dom.show(element);
            var me = this,
                o = original,
                s = element.style,
                save    = function(k){me.protect(k)};

            // IE浏览器使用 zoom 样式放大
            if (baidu.browser.ie) {
                save("top");
                save("left");
                save("position");
                save("zoom");
                save("filter");

                this.offsetX = parseInt(baidu.dom.getStyle(element, "left")) || 0;
                this.offsetY = parseInt(baidu.dom.getStyle(element, "top"))  || 0;

                if (baidu.dom.getStyle(element, "position") == "static") {
                    s.position = "relative";
                }

                // IE 的ZOOM没有起始点，以下代码就是实现起始点
                r.test(this.transformOrigin);
                var t1 = RegExp["\x241"].toLowerCase(),
                    t2 = RegExp["\x244"].toLowerCase(),
                    ew = this.element.offsetWidth,
                    eh = this.element.offsetHeight,
                    dx, dy;

                if (/\d+%/.test(t1)) dx = parseInt(t1, 10) / 100 * ew;
                else if (/\d+px/.test(t1)) dx = parseInt(t1);
                else if (t1 == "left") dx = 0;
                else if (t1 == "center") dx = ew / 2;
                else if (t1 == "right") dx = ew;

                if (!t2) dy = eh / 2;
                else {
                    if (/\d+%/.test(t2)) dy = parseInt(t2, 10) / 100 * eh;
                    else if (/\d+px/.test(t2)) dy = parseInt(t2);
                    else if (t2 == "top") dy = 0;
                    else if (t2 == "center") dy = eh / 2;
                    else if (t2 == "bottom") dy = eh;
                }

                // 设置初始的比例
                s.zoom = this.from;
                o.cx = dx; o.cy = dy;   // 放大效果起始原点坐标
            } else {
                save("WebkitTransform");
                save("WebkitTransformOrigin");   // Chrome Safari
                save("MozTransform");
                save("MozTransformOrigin");         // Firefox Mozllia
                save("OTransform");
                save("OTransformOrigin");             // Opera 10.5 +
                save("transform");
                save("transformOrigin");               // CSS3
                save("opacity");
                save("KHTMLOpacity");

                // 设置初始的比例和效果起始点
                s.WebkitTransform =
                    s.MozTransform =
                    s.OTransform =
                    s.transform = "scale("+ this.from +")";

                s.WebkitTransformOrigin = 
                    s.MozTransformOrigin = 
                    s.OTransformOrigin =
                    s.transformOrigin = this.transformOrigin;
            }
        }

        //[Implement Interface] render
        ,render : function(schedule) {
            var s = element.style,
                b = this.to == 1,
                b = typeof this.opacityTrend == "boolean" ? this.opacityTrend : b,
                p = b ? this.percent : 1 - this.percent,
                n = this.to * schedule + this.from * (1 - schedule);

            if (baidu.browser.ie) {
                s.zoom = n;
                s.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity:"+
                    Math.floor(p * 100) +")";
                // IE 下得计算 transform-origin 变化
                s.top = this.offsetY + original.cy * (1 - n);
                s.left= this.offsetX + original.cx * (1 - n);
            } else {
                s.WebkitTransform =
                    s.MozTransform =
                    s.OTransform =
                    s.transform = "scale("+ n +")";
                s.KHTMLOpacity = s.opacity = p;
            }
        }
    }, options), "baidu.fx.scale");

    return fx.launch();
};
