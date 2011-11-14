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
 * select插件，支持通过select控件的数据创建combox   
 * @name baidu.ui.Combox.Combox$select
 * @addon baidu.ui.Combox
 * @param   {Object}            [options]   参数对象
 * @config  {Element|String}    select      select对象的id或者element本身
 * @config  {String}            type        启动插件参数，设置为'select'
 * @author  
 */
baidu.ui.Combox.register(function(me){
    var select = me.select = baidu.dom.g(me.select),
        pos;
    if(!select
        || me.type.toLowerCase() != 'select'
        || select.tagName.toUpperCase() != 'SELECT'){return;}
    me.addEventListener('beforerender', function(){
        baidu.array.each(select.options, function(item){
            me.data.push({value: (item.value || item.innerHTML), content: item.innerHTML});
        });
        pos = baidu.dom.getPosition(select);
        me.position = {x: pos.left, y: pos.top};
        select.style.display = 'none';
        me.addEventListener('itemclick', function(data){
            select.value = data.value.value || data.value.content;
        });
    });
});