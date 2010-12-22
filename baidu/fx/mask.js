/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * @author: meizz
 * @namespace: baidu.fx.mask
 * @version: 2010-05-20
 */

///import baidu.dom.getStyle;
///import baidu.object.extend;

///import baidu.fx.create;

/**
 * 面具遮罩效果
 * 
 * @param   {HTMLElement} element DOM元素或者ID
 * @param   {JSON}        options 类实例化时的参数配置
 *          {startOrigin,   from,   to}
 * @return  {Effect}     效果类的实例
 */

baidu.fx.mask = function(element, options) {
    // mask 效果只适用于绝对定位的DOM元素
    if (!(element = baidu.dom.g(element)) ||
        baidu.dom.getStyle(element, "position") != "absolute")
        return null;

    var e = element, original = {};
    options = options || {};

    // [startOrigin] "0px 0px" "50% 50%" "top left"
    var r = /^(\d+px|\d?\d(\.\d+)?%|100%|left|center|right)(\s+(\d+px|\d?\d(\.\d+)?%|100%|top|center|bottom))?/i;
    !r.test(options.startOrigin) && (options.startOrigin = "0px 0px");

    var options = baidu.object.extend({restoreAfterFinish:true, from:0, to:1}, options || {});

    var fx = baidu.fx.create(e, baidu.object.extend({
        //[Implement Interface] initialize
        initialize : function() {
            e.style.display = "";
            this.protect("clip");
            original.width = e.offsetWidth;
            original.height = e.offsetHeight;

            // 计算效果起始点坐标
            r.test(this.startOrigin);
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
            original.x = dx;
            original.y = dy;
        }

        //[Implement Interface] render
        ,render : function(schedule) {
            var n = this.to * schedule + this.from * (1 - schedule),
                top = original.y * (1 - n) +"px ",
                left = original.x * (1 - n) +"px ",
                right = original.x * (1 - n) + original.width * n +"px ",
                bottom = original.y * (1 - n) + original.height * n +"px ";
            e.style.clip = "rect("+ top + right + bottom + left +")";
        }

        //[Implement Interface] finish
        ,finish : function(){
            if (this.to < this.from) e.style.display = "none";
        }
    }, options), "baidu.fx.mask");

    return fx.launch();
};
