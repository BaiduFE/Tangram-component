/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/table/Row.js
 * author: berg
 * version: 1.0.0
 * date: 2010/09/08
 */
///import baidu.ui.createUI;
///import baidu.ui.Base.getParent;
///import baidu.ui.Base.setParent;
///import baidu.ui.table.Table;
///import baidu.ui.behavior.statable;
///import baidu.ui.behavior.statable.setStateHandler;
///import baidu.dom.g;
///import baidu.array.each;
///import baidu.string.format;
///import baidu.dom.children;
///import baidu.dom.remove;
///import baidu.dom.setAttr;
///import baidu.dom.setAttrs;
///import baidu.ui.table.Cell;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.fn.bind;
/**
 *
 * 表格行控件
 * 这是一个特殊的控件，他没有render等方法，无法直接使用，必须通过table控件调用
 *
 * @param options
 * {
 *  id : "",
 *  content : ["cell-0", "cell-1"...]
 * }
 */
baidu.ui.table.Row = baidu.ui.createUI(function(options){
	this._cells = {};				//所有生成的cell集合
    this.addState("selected");		//
}).extend({
    uiType : "table-row",
    statable : true,
	//tplBody : '<table cellpadding="0" cellspacing="0" border="0" width="#{width}" id="#{id}" class="#{class}" #{stateHandler}>#{rows}</table>',
    /**
     * 重写默认的getMain方法
     * 在Row控件中，main元素就是getId获得的元素
     * @return {HTMLElement} main main元素
     */
    getMain : function(){
        return baidu.g(this.getId());
    },

    /**
     * 获得控件字符串
     * @param {array} data 行中每一列中的数据
     */
    getString : function(){
		var me = this,
			colsArr = [],
			clazz = me.getClass("col"),
			columns = {};
        //提速
		colsArr.push("<tr id='", me.getId(), "' class='", me.getClass(), "' data-guid='", me.guid, "' ", me._getStateHandlerString(), ">");
		baidu.array.each(me.content, function(item, i){
			colsArr.push('<td>', item, '</td>');
		});
		colsArr.push("</tr>");
		return colsArr.join("");
    },
    
    /**
     * 更新当前控件
     * @param {object} options optional
     */
    update : function(options){
		var me = this,
			cols = baidu.dom.children(me.getMain());
        options = options || {};
        baidu.object.extend(me, options);
        baidu.array.each(cols, function(item, i){
        	item.innerHTML = me.content[i];
        });
		me.dispatchEvent("update");
    },
	
	/**
	 * 使用dom的方式在指定的索引位置插入一行
	 * @param {Number} index 插入位置的索引
	 * @memberOf {TypeName} 
	 */
	insertTo : function(index){
		var me = this, row, cell;
		if(!me.getMain()){//防止多次调用
			row = me.getParent().getBody().insertRow(index);
			baidu.dom.setAttrs(row, {id : me.getId(), "class" : me.getClass(), "data-guid" : me.guid});
			me.setStateHandler(row);
			baidu.array.each(me.content, function(item, i){
				cell = row.insertCell(i);
				baidu.dom.setAttr(cell, "class", me.getClass("col"));
				cell.innerHTML = item;
			});
		}
	},
	
    /**
     * 获得所有列元素
     * @return {array} cols
     */
    _getCols : function(){
        return baidu.dom.children(this.getId());
    },
    
    /**
     * 获得一行中所有列的字符串
     * @param {object} data  数据
     * @param {number} index  当前行的索引
     * @return {string} HTML string
     */
    _getColsString : function(data, index){
        return colsArr.join('');
    },


    /**
     * 选中当前行
     */
    select : function(){
    	var me = this, id = me.getMain().id;
        if(!me.getState(id)['disabled']){
            me.setState("selected", id);
        }
    },

    /**
     * 去掉当前行的选中状态
     */
    unselect : function(){
    	var me = this;
        me.removeState("selected", me.getMain().id);
    },

    /**
     * 移除当前行
     */
    remove : function(){
        var me = this;
        me.getParent().getBody().deleteRow(me.getBody().rowIndex);
        me.dispose();
    },

    /**
     * 如果指定行处于选中状态，让其取消选中状态，否则反之
     */
    toggle : function(){
        var me = this;
        if(me.getState(me.getMain().id)["selected"]){
            me.unselect();
        }else{
            me.select();
        }
    },
	
    /**
     * 根据索引取得单元格对象
     * @param {Number} index
     * @memberOf {TypeName} 
     * @return {baidu.ui.table.Cell} 
     */
	getCell : function(index){
		var me = this, td = me._getCols()[index], cell;
		if(td){
			if(td.id){
				cell = me._cells[td.id];
			}else{
				cell = new baidu.ui.table.Cell({target : td});
				cell._initialize(me);
				me._cells[cell.getId()] = cell;
			}
		}
		td = null;
		return cell;
	},
	
	/**
	 * 销毁实例
	 * @memberOf {TypeName} 
	 */
    dispose : function(){
        var me = this;
        me.dispatchEvent("dispose");
        baidu.lang.Class.prototype.dispose.call(me);
    }
});
