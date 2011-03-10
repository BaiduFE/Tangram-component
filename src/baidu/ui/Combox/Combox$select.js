/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Combox;
///import baidu.array.each;
///import baidu.lang.isArray;
///import baidu.dom.g;
///import baidu.dom.getPosition;
///import baidu.dom.setStyle;

/**
 * select 插件
 * @param   {Object}            [options]   参数对象
 * @config  {Element|String}    select      select对象的id或者element本身
 * @config  {String}            type        启动插件参数，设置为'select'
 */
baidu.ui.Combox.register(function(me){
    
    me.addEventListener("onbeforerender",function(){

        if(me.type == 'select'){
            me.select = baidu.g(me.select);
            if('select' != me.select.tagName.toLowerCase()) return;


            baidu.array.each(me.select.options, function(opt){
                var tmpPosition;

                me.data.push({value:opt.value || opt.innerHTML, content: opt.innerHTML});

                tmpPosition = baidu.dom.getPosition(me.select);
                me.position = {x:tmpPosition.left,y:tmpPosition.top};

                baidu.setStyle(me.select, 'display', 'none');

                me.onitemchosen = function(data){
                    me.select.value = data.value.value || data.value.content;           
                };
            });
        }
    });
});
