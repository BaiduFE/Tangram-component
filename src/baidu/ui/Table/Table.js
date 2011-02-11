/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/table/Table.js
 * author: berg
 * version: 1.0.0
 * date: 2010/09/04
 */

///import baidu.ui.create;
///import baidu.ui.createUI;
//import baidu.ui.Table.Row;
///import baidu.dom.g;
///import baidu.dom.remove;
///import baidu.dom.insertHTML;
///import baidu.string.format;
///import baidu.array.each;
///import baidu.lang.isNumber;
///import baidu.dom.setStyles;
///import baidu.dom._styleFilter.px;

 /**
 * Table表格控件。
 * @class
 * @param        {Object}                 [options]     选项
 * @config       {Object}                 data          生成表格的数据，格式[{id : "rsid0", content : ["column0", "column1"]}, {id : "rsid0", content : ["column0", "column1"]}], id不是必要，当有选择列时用来定义用户的checkbox的value
 * @config       {Object}                 columns       各个列的高级定义，格式[{index : 1, width : 100, type : "select"}, {index : 2, width : "100%", enableEdit : true}, {index : 3, width : "200px"}]
 * @config       {Object}                 title         定义表格列的title说明，格式：["colName0", "删除", "colName2", "colName3"]
 * @config       {Number}                 pageSize      一页显示多少行数据，默认全部显示
 */
baidu.ui.table.Table = baidu.ui.createUI(function(options){
	var me = this;
		me.data = me.data || [];		//数据
		me._rows = [];					//所有的Row组件
//		me.columns = me.columns || [];	//列的设置信息
}).extend({
    uiType          : "table",
	tplBody			: '<div><table cellpadding="0" cellspacing="0" border="0" id="#{id}" class="#{class}" #{stateHandler}>#{rows}</table></div>',
    /**
     * 获得控件字符串
     * @private
     * @return {string} HTML string
     */
	getString : function(){
		var me = this;
		return baidu.format(me.tplBody, {
			id          : me.getId(),
			"class"     : me.getClass(),
            rows        : me._getRowsString()
		});
	},
	
    /**
     * 获得所有行的字符串
     * @private
     * @return {string} HTML string
     */
    _getRowsString : function(){
        var me = this,
            i = 0,
            len = me.data.length,
            rowsArr = [],
            row;
        
        for(; i < len; i++){
            row = me.getRow(i);
            if(!row){
                row = me._rows[i] = me._createRow(me.data[i]);
            }else {
                row.update(me.data[i]);
            }
            rowsArr.push(row.getString());
        }
        while(me._rows.length > me.data.length){//更新_rows中多余的数据,当update时user有可能会更新data
        	me._rows.pop();
        }
        return rowsArr.join("");
    },
	
	/**
	 * 渲染表格
	 * @public 
     * @param {HTMLElement} target       目标父级元素
	 */
	render : function(target){
		debugger;
		var me = this;
        if(!target){return;}
        baidu.dom.insertHTML(me.renderMain(target), "beforeEnd", me.getString());
        me.resizeColumn();
		me.dispatchEvent("onload");
	},
	
    /**
     * 更新表格
     * @public
     * @param     {object}                 options       选项
	 * @config    {Object}                 data          生成表格的数据，格式[{id : "rsid0", content : ["column0", "column1"]}, {id : "rsid0", content : ["column0", "column1"]}], id不是必要，当有选择列时用来定义用户的checkbox的value
     * @config    {Object}                 columns       各个列的高级定义，格式[{index : 1, width : 100, type : "select"}, {index : 2, width : "100%", enableEdit : true}, {index : 3, width : "200px"}]
     * @config    {Object}                 title         定义表格列的title说明，格式：["colName0", "删除", "colName2", "colName3"]
     * @config    {Number}                 pageSize      一页显示多少行数据，默认全部显示
     */
    update : function(options){
        var me = this;
        options = options || {};
        baidu.object.extend(me, options);
        me.dispatchEvent("beforeupdate");
        me.getMain().innerHTML = me.getString();//getString会更新data
		me.dispatchEvent("update");
    },
	
    /**
     * 按照columns的参数设置单元格的宽度
     * @private
     * @return {string} HTML string
     */
	resizeColumn : function(){
		var me = this,
			widthArray = [],
			row = me.getBody().rows[0];
		if(row && me.columns){
			baidu.array.each(me.columns, function(item){
				if(item.hasOwnProperty("width")){
					baidu.dom.setStyles(row.cells[item.index], {width : item.width});
				}
			});
		}
	},
    /**
     * 创建一个行控件
     * @private
     * @param {object} options 
     * @return {baidu.ui.table.Row} 行控件
     */
    _createRow : function(options){
    	options.parent = this;
    	return baidu.ui.create(baidu.ui.table.Row, options);
    },
    
    /**
     * 获得指定行控件
     * @public
     * @param {number}  index  索引
     * @return {baidu.ui.table.Row|null} 指定行控件
     */
    getRow : function(index){
        var row = this._rows[index];
        if(row && !row.disposed){
            return row;
        }
        //return this._rows[index] || null;
        return null;
    },

    /**
     * 获得表格中的行数
     * @public
     * @return {number} count 
     */
    getRowCount : function(){
        return this._rows.length;
    },
	
    /**
     * 添加行
     * @private
     * @param {Object} optoins  创建Row所需要的options
     * @param {number} index 可选参数，表示在指定的索引的row之前插入，不指定该参数将会在最后插入
     */
    _addRow : function(options, index){
        var me = this,
			index = baidu.lang.isNumber(index) ? index : me.getBody().rows.length,
        	row = me._createRow(options);
        me.data.splice(index, 0, options);
        me._rows.splice(index, 0, row);
        row.insertTo(index);
        return row.getId();
    },
	
	/**
	 * 添加行控件
	 * @private
	 * @param {Object} optoins  创建Row所需要的options
	 * @param {Number} index
	 * @memberOf {TypeName} 
	 */
	addRow : function(options, index){
		var me = this;
		me.dispatchEvent("addrow", {rowId : me._addRow(options, index)});
	},
	
    /**
     * 删除行
     * @private
     * @param {number} index 要删除的数据索引
     */
    _removeRow : function(index){
        var me = this,
        	row = me._rows[index],
        	rowId;
        if(row){
        	rowId = row.getId();
        	me.data.splice(index, 1);
	        row.remove();
	        me._rows.splice(index, 1);
	        0 == index && me.resizeColumn();
        }
        return rowId;
    },
	
	/**
     * 删除行
     * @public
     * @param {number} index 要删除的数据索引
     */
	removeRow : function(index){
		var me = this,
			rowId = me._removeRow(index);
		if(rowId){me.dispatchEvent("removerow", {rowId : rowId});}
	},
	
    /**
     * 获取target元素
     * @private
     * @return {HTMLElement} target
     */
    getTarget : function(){
    	var me = this;
        return baidu.g(me.targetId) || me.getMain();
    },
	
    /**
     * 销毁当前实例
     * @public
     */
    dispose : function(){
        var me = this;
        baidu.dom.remove(me.getId());
    }
});