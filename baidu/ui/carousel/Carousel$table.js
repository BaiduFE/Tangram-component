/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:ui/carousel/Carousel$table.js
 * @author:linlingyu
 * @version:1.0.0
 * @date:2010-09-21
 */

///import baidu.ui.carousel.Carousel;
///import baidu.ui.table.Table;
///import baidu.array.each;
///import baidu.dom.create;
///import baidu.lang.isArray;
///import baidu.lang.isNumber;
/**
 * 让跑马灯支持多行多列
 */
baidu.ui.carousel.Carousel.register(function(me){
	if(me.data){
		me.gridLayout = me.gridLayout ? (baidu.lang.isArray(me.gridLayout) ? {row : me.gridLayout[0], col : me.gridLayout[1]} : me.gridLayout) : {row : 3, col : 3};
		me._tableList = [];//table的数据
		var data = me._formatData(me.data), contentText = me.contentText = [];
		baidu.array.each(data, function(item, i){
			me._tableList.push(baidu.ui.table.create({data : item}));
			contentText.push({content : me._tableList[me._tableList.length-1].getString()});
		});
		me.addEventListener("load", function(){
			//让table组件得到main容器
			baidu.array.each(me._tableList, function(item, i){
				item.renderMain(me.getItem(i));
			});
		});
	}
});
baidu.object.extend(baidu.ui.carousel.Carousel.prototype, {
	/**
	 * 将一维的数组通过layout格式化成二维的数据
	 * @param {Array} data 需要插入到table的数据(一维)
	 * @memberOf {TypeName} 
	 * @return {TypeName} 根据layout格式化后的数据(二维)
	 */
	_formatData : function(data){
		var me = this,
			totalPage = Math.ceil(data.length / (me.gridLayout.row * me.gridLayout.col)),
			re = [],
			tab, row, val, i, j, k;
		for(i=0;i<totalPage;i++){
			tab = [];
			for(j=0;j<me.gridLayout.row;j++){
				row = [];
				for(k=0;k<me.gridLayout.col;k++){
					val = data[i * me.gridLayout.row * me.gridLayout.col + j * me.gridLayout.col + k];
					row.push(val ? val : "&nbsp;");
				}
				tab.push({content : row});
			}
			re.push(tab);
		}
		return re;
	},
	/**
	 * 在指索引之前插入一个新的多行多列表格
	 * @param {Object} data 要插入的数据(一维数组)
	 * @param {Object} index? 可选，在指定的索引之前插入，不指定则在末端插入
	 * @memberOf {TypeName} 
	 */
	addTableItem : function(data, index){
		var me = this, table,
			dataArr = me._formatData(data),
			insert = baidu.lang.isNumber(index)? index : me.totalCount,
			div;
		if(dataArr.length > 0){
			table = baidu.ui.table.create({data : dataArr[0]});
			Array.prototype.splice.apply(me.data, [insert * me.gridLayout.row * me.gridLayout.col, 0].concat(data));//这时data的数据长度不是固定，me.data只记录有用的数据
			me._tableList.splice(insert, 0, table);
			div = baidu.dom.create("div");
			div.innerHTML = me._tableList[insert].getString();
			me.addItem(div, index);
			table.renderMain(me.getItem(me.totalCount - 1));
		}
	},
	/**
	 * 移除由索引指定的表格
	 * @param {Object} index 要移除的索引
	 * @memberOf {TypeName} 
	 * @return {TypeName} baidu.ui.table.Table
	 */
	removeTableItem : function(index){
		var me = this, tab = me.getTable(index), count = 0, cells;
		//为提高性能，对me.data的维护这里暂时先假定每一页的数据都是填满的，最后一页可以出现不填满的情况
		me.data.splice(index * me.gridLayout.row * me.gridLayout.col, me.gridLayout.row * me.gridLayout.col);
		me._tableList.splice(index, 1);
		me.removeItem(index);
		return tab;
	},
	/**
	 * 根据索引取得表格
	 * @param {Object} index 索引
	 * @memberOf {TypeName} 
	 * @return {TypeName} baidu.ui.table.Table
	 */
	getTable : function(index){
		return this._tableList[index];
	}
});
