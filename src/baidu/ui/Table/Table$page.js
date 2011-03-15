/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * @path:ui/Table/Table$page.js
 * @author:linlingyu
 * @version:1.0.0
 * @date:2010-9-30
 */
///import baidu.ui.Table;
///import baidu.lang.isNumber;
///import baidu.array.each;
///import baidu.dom.g;
/**
 * 表格翻页的插件
 * @param   {Object} options config参数
 * @config  {Number} pageSize 一页显多少行的数字表示形式
 */
baidu.ui.Table.register(function(me){
	me._createPage();
	me.addEventListener("beforeupdate", function(){
		me._createPage();
	});
});
//
baidu.object.extend(baidu.ui.Table.prototype, {
	currentPage : 1,	//当前页
//	pageSize : 10,	//没有默认值，如果在options中设定了该值表示要分页，不设定则表示全部显示
	_createPage : function(){
		var me = this;
		me.dataSet = me.data || [];
		if(me.pageSize){//如果需要分页
			me.data = me.data.slice(0, me.pageSize);
		}
	},
	/**
	 * 直接翻到索引指定的页数
	 * @param {Object} index
	 * @memberOf {TypeName} 
	 */
	gotoPage : function(index){
		var me = this,
			index = index <= 0 ? 1 : Math.min(index, me.getTotalPage()),//对页数的修正
			offset = (index - 1) * me.pageSize,
			data = me.dataSet.slice(offset, offset + me.pageSize),
			i = 0,
			row;
		for(; i < me.pageSize; i++){
			row = me.getRow(i);
			if(data[i]){
				if(row){
					row.update(data[i]);
				}else{
					me.dispatchEvent("addrow", {rowId : me._addRow(data[i])});
				}
			}else{
				if(row){
					me.dispatchEvent("removerow", {rowId : me._removeRow(i--)});
				}
			}
		}
		me.data = data;
		me.currentPage = index;
		me.dispatchEvent("gotopage");
	},
	
	/**
	 * 翻到上一页
	 * @memberOf {TypeName} 
	 */
	prevPage : function(){
		var me = this;
		me.gotoPage(--me.currentPage);
	},
	
	/**
	 * 翻到下一页
	 * @memberOf {TypeName} 
	 */
	nextPage : function(){
		var me = this;
		me.gotoPage(++me.currentPage);
	},
	
	/**
	 * 取得总记录数
	 * @memberOf {TypeName} 
	 * @return {number} 
	 */
	getTotalCount : function(){
		return this.dataSet.length;
	},
	
	/**
	 * 取得总页数
	 * @memberOf {TypeName} 
	 * @return {number} 
	 */
	getTotalPage : function(){
		var me = this;
		return baidu.lang.isNumber(me.pageSize) ? Math.ceil(me.dataSet.length/me.pageSize)
		  : me.currentPage;
	},
	
	/**
	 * 取得当前页数
	 * @memberOf {TypeName} 
	 * @return {number} 
	 */
	getCurrentPage : function(){
		return this.currentPage;
	},
	
	/**
	 * 新增一个行，
	 * @param {Object} options 格式同table的addRow
	 * @param {Number} index 在索引的行之前插入，可选项，默认值是在最后插入
	 * @memberOf {TypeName} 
	 */
	addRow : function(options, index){
		var me = this,
			index = baidu.lang.isNumber(index) ? index : me.getTotalCount(),
			currPage = me.getCurrentPage(),
			instPage = Math.ceil((index + 1) / me.pageSize),
			data = options,
			rowId;
		if(me.pageSize){
			me.dataSet.splice(index, 0, data);
            if(currPage >= instPage){//addrow
                index %= me.pageSize;
                if(currPage != instPage){
                    data = me.dataSet[(currPage - 1) * me.pageSize];
                    index = 0;
                }
                rowId = me._addRow(data, index);
                if(me.getRowCount() > me.pageSize){//removerow
                    me.dispatchEvent("removerow", {rowId : me._removeRow(me.getRowCount() - 1)});
                }
            }
            me.dispatchEvent("addrow", {rowId : rowId});
		}else{
			me.dispatchEvent("addrow", {rowId : me._addRow(options, index)});
		}	
	},
	
	/**
	 * 移除一个行
	 * @param {Object} index 需要移除的行的索引
	 * @memberOf {TypeName} 
	 */
	removeRow : function(index){
		var me = this,
			currPage = me.getCurrentPage(),
			delePage = Math.ceil((index + 1) / me.pageSize),
			removeRowId,
			data;
		if(me.pageSize){
			me.dataSet.splice(index, 1);
	        if(currPage >= delePage){
	            index = currPage != delePage? 0 : index % me.pageSize;
	            removeRowId = me._removeRow(index);
	            data = me.dataSet[currPage * me.pageSize - 1];//-1是上面删除了的一个
	            if(data){
	                me.dispatchEvent("addrow", {rowId : me._addRow(data)});
	            }
	        }
	        me.dispatchEvent("removerow", {rowId : removeRowId});
		}else{
			me.dispatchEvent("removerow", {rowId : me._removeRow(index)});
		}
	}
});