/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.ui.Carousel;
///import baidu.ui.Carousel.Carousel$splice;
///import baidu.array.hash;
///import baidu.array.each;
///import baidu.ui.Table;
///import baidu.lang.isArray;
///import baidu.lang.isNumber;
///import baidu.object.extend;

/**
 * 支持在一个滚动项中放多个图片或是其它文字内容
 * @name baidu.ui.Carousel.Carousel$table
 * @addon baidu.ui.Carousel.Carousel
 * @param {Object} options config参数.
 * @config {Boolean} supportTable 是否支持表格项，默认支持
 * @config {Object} gridLayout 描述一个滚动项的内容是以多行多列的数据形式，例如：{row:3, col:2}
 */
baidu.ui.Carousel.register(function(me) {
    if(!me.supportTable){return;}
    me.gridLayout = baidu.object.extend({row: 3, col: 3},
        baidu.lang.isArray(me.gridLayout) ? baidu.array.hash(['row', 'col'], me.gridLayout)
            : me.gridLayout);
    me._dataList = me._formatTableData(me._dataList);
    me._tables = [];
    baidu.array.each(me._dataList, function(item, i){
        me._tables.push(new baidu.ui.Table({data: item}));
        me._dataList[i] = {content: me._tables[i].getString()};
    });
});

baidu.ui.Carousel.extend(
/**
 *  @lends baidu.ui.Carousel.prototype
 */
{
    supportTable: true,
    /**
	 * 将一维的数组通过layout格式化成二维的数据
	 * @param {Array} data 需要插入到table的数据(一维)
	 * @return {Array} 根据layout格式化后的数据(二维)
	 * @private
	 */
    _formatTableData: function(data){
        var me = this,
            layout = me.gridLayout,
            count = data.length,
            array = [],
            i = 0,
            table;
        for(; i < count; i++){
            i % (layout.row * layout.col) == 0 && array.push([]);
            table = array[array.length - 1];
            i % layout.col == 0 && table.push({content: []});
            table[table.length - 1].content.push(data[i].content);
        }
        return array;
    },
    /**
     * 在指定索引处插入一个新的多行多列表格
	 * @name baidu.ui.Carousel.Carousel$table.addTableItem
	 * @addon baidu.ui.Carousel.Carousel$table
     * @param {Object} data 需要插入的数据（一维数组），格式：[{content: 'col-0'}, {content: 'col-1'}, {content: 'col-2'}....]
     * @param {Number} index 在指定的索引处插入，默认在末端插入
     */
    addTableItem: function(data, index){
        var me = this,
            data = me._formatTableData(data),
            index = Math.min(Math.max(baidu.lang.isNumber(index) ? index : me._dataList.length, 0), me._dataList.length);
        me._tables.splice(index, 0, new baidu.ui.Table({data: data[0]}));
        me._addText(me._tables[index].getString(), index);
    },
    /**
     * 移除由索引指定的项
	 * @name baidu.ui.Carousel.Carousel$table.removeTableItem
	 * @addon baidu.ui.Carousel.Carousel$table
     * @param {Number} index 需要移除的索引项
     * @return {HTMLElement} 被移除的表格对象，不存在该对象或不存在于当前页面的返回null
     */
    removeTableItem: function(index){
        if(!baidu.lang.isNumber(index) || index < 0
            || index > this._dataList.length - 1){return;}
        var me = this;
        me._tables.splice(index, 1);
        return me._removeItem(index);
    },
    /**
     * 根据索引取得表格
	 * @name baidu.ui.Carousel.Carousel$table.getTable
	 * @addon baidu.ui.Carousel.Carousel$table
     * @param {Number} index 索引
     * @return {baidu.ui.Table} 该索引对应的表格对象，不存在该表格对象的返回null
     */
    getTable: function(index){
        return this._tables[index];
    }
});