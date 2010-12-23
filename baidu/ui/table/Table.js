/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/table/Table.js
 * author: berg
 * version: 1.0.0
 * date: 2010/09/04
 */
///import baidu.ui.table;
///import baidu.ui.create;
///import baidu.ui.createUI;
///import baidu.ui.table.Row;
///import baidu.dom.g;
///import baidu.dom.remove;
///import baidu.dom.insertHTML;
///import baidu.string.format;
///import baidu.array.each;
///import baidu.lang.isNumber;
///import baidu.dom.setStyles;
///import baidu.dom._styleFilter.px;
/**
 *
 * 表格控件
 *
 * @param options
 * {data : 表格的数据，格式：[{id:"该id为checkbox的value", content:["单元格内容~1", "单元格内容~2", "单元格内容~3"]}]
 * 	title : 表格的列标题，格式：["columnName-0", "columnName-1", "columnName-2"]
 * 	columns : 对列的设置，格式[{col:index0, width:number0}, {col:index1, width:number1}, {col:index2, width:number2}]
 *  pageSize : 一页显示多少条记录
 * 	withSelect : 是否需要提供一个选择的列，默认为false不提供
 * 	columnIndex : 提供的选择列需要插入到第几列中，默认是0插入到第一列
 * }
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
     * @param {HTMLElement} target
	 */
	render : function(target){
		
		var me = this;
        if(!target){return;}
        baidu.dom.insertHTML(me.renderMain(target), "beforeEnd", me.getString());
        me.resizeColumn();
		me.dispatchEvent("onload");
	},
	
    /**
     * 更新表格
     * @param {object} options 参数
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
     * @param {object} options 
     * @return {baidu.ui.table.Row} 行控件
     */
    _createRow : function(options){
    	options.parent = this;
    	return baidu.ui.create(baidu.ui.table.Row, options);
    },
    
    /**
     * 获得指定row控件
     * @param {number}  index  索引
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
     * @return {number} count 
     */
    getRowCount : function(){
        return this._rows.length;
    },
	
    /**
     * 添加行
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
	 * 
	 * @param {Object} optoins  创建Row所需要的options
	 * @param {Object} index
	 * @memberOf {TypeName} 
	 */
	addRow : function(options, index){
		var me = this;
		me.dispatchEvent("addrow", {rowId : me._addRow(options, index)});
	},
	
    /**
     * 删除行
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
	 * 
	 * @param {Object} index
	 * @memberOf {TypeName} 
	 */
	removeRow : function(index){
		var me = this,
			rowId = me._removeRow(index);
		if(rowId){me.dispatchEvent("removerow", {rowId : rowId});}
	},
	
    /**
     * 获取target元素
     * @return {HTMLElement} target
     */
    getTarget : function(){
    	var me = this;
        return baidu.g(me.targetId) || me.getMain();
    },
	
    /**
     * 销毁当前实例
     */
    dispose : function(){
        var me = this;
        baidu.dom.remove(me.getId());
    }
});
