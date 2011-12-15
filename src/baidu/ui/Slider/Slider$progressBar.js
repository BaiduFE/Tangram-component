/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/Slider/Slider$progressBar.js
 * author: linlingyu
 * version: 1.0.0
 * date: 2010-12-6
 */
///import baidu.ui.Slider;
///import baidu.ui.ProgressBar;
///import baidu.dom.insertHTML;
///import baidu.string.format;
///import baidu.lang.Class.addEventListeners;
/**
  * 和进度条结合，进度条跟随滑块的滑动
 * @name baidu.ui.Slider.Slider$progressBar
 * @addon baidu.ui.Slider
 */
baidu.ui.Slider.register(function(me){
    me.addEventListener("load", function(){
        baidu.dom.insertHTML(me.getThumb(), "beforeBegin", me.getProgressBarString());
        me.progressBar = new baidu.ui.ProgressBar({
            layout: me.layout,
            skin : me.skin ? me.skin + "-followProgressbar" : null
        });
        me.progressBar.render(me.getId("progressbar"));
        me._adjustProgressbar();
        me.addEventListener("dispose", function(){
                me.progressBar.dispose();
        });
    });
    me.addEventListeners('slide, slideclick, update', function(){
        me._adjustProgressbar();
    });
});

baidu.ui.Slider.extend({
    tplProgressbar : "<div id='#{rsid}' class='#{class}' style='position:absolute; left:0px; top:0px;'></div>",//这里position如果没有设置，会造成该div和thumb之间掉行
        
        /**
         * 根据tplProgressbar生成一个容器用来存入progressBar组件
         */
    getProgressBarString : function(){
        var me = this;
        return baidu.string.format(me.tplProgressbar, {
                rsid : me.getId("progressbar"),
                "class" : me.getClass("progressbar")
        });
    },
    
    /**
     * 当滑动thumb时，让prgressBar的长度跟随滑块
     */
    _adjustProgressbar : function(){
        var me = this,
            layout = me.layout,
            axis = me._axis[layout],
            thumb = me.getThumb(),
            thumbPos = parseInt(thumb.style[axis.pos], 10);
        if(!me.progressBar){return;}
        me.progressBar.getBar().style[me.progressBar.axis[layout].size] = (isNaN(thumbPos) ? 0 : thumbPos)
            + thumb[axis.offsetSize] / 2 + 'px';
    }
});