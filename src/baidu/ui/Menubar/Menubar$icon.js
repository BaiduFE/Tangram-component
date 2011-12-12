/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Menubar;
///import baidu.object.extend;
///import baidu.string.format;
///import baidu.object.each;
///import baidu.dom.insertHTML;

/**
 * 支持菜单图标
 * @name baidu.ui.Menubar.Menubar$icon
 * @addon baidu.ui.Menubar
 */
baidu.ui.Menubar.extend({
    tplIcon : '<span class="#{icon}" style="#{iconStyle};"></span>',
    
    /**
     * 更新item图标
	 * @name baidu.ui.Menubar.Menubar$icon.updateIcons
	 * @addon baidu.ui.Menubar.Menubar$icon
	 * @function
     */
    updateIcons : function(){
        var me = this;
        baidu.object.each(me.items, function(item, key){
            if (me.getItem(key)) {
                baidu.dom.insertHTML(me.getItem(key), "afterBegin", baidu.string.format(me.tplIcon, {
                    icon: me.getClass("icon"),
                    iconStyle: item.icon ? ('background-position:' + item.icon) : 'background-image:none'
                }))
            }
        });
    }
});

baidu.ui.Menubar.register(function(me){
    me.addEventListener('onupdate', me.updateIcons);
});
