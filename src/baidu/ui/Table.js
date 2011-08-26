/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.createUI;
///import baidu.dom.g;
///import baidu.dom.remove;
///import baidu.dom.insertHTML;
///import baidu.string.format;
///import baidu.array.each;
///import baidu.lang.isNumber;
///import baidu.dom.setStyles;
///import baidu.dom._styleFilter.px;
///import baidu.ui.Base.getParent;
///import baidu.ui.Base.setParent;
///import baidu.ui.behavior.statable;
///import baidu.ui.behavior.statable.setStateHandler;
///import baidu.dom.children;
///import baidu.dom.setAttr;
///import baidu.dom.setAttrs;
///import baidu.event.on;
///import baidu.event.un;
///import baidu.fn.bind;

 /**
 * Table表格组件
 * @class
 * @grammar new baidu.ui.Table(options)
 * @param       {Object} options config参数
 * @config      {Object} data 生成表格的数据，格式[{id: "rsid0", content : ["column0", "column1"]}, {id : "rsid0", content : ["column0", "column1"]}], id不是必要，当有选择列时用来定义用户的checkbox的value
 * @config      {Object} columns 各个列的高级定义，格式[{index : 1, width : 100, type : "select"}, {index : 2, width : "100%", enableEdit : true}, {index : 3, width : "200px"}]
 */
baidu.ui.Table = baidu.ui.createUI(function(options){
    var me = this;
        me.data = me.data || [];        //数据
        me._rows = [];                  //所有的Row组件
//      me.columns = me.columns || [];  //列的设置信息
});
baidu.ui.Table.extend(
/**
 *  @lends baidu.ui.Table.prototype
 */
{
    uiType          : "table",
    tplBody         : '<div><table cellpadding="0" cellspacing="0" border="0" id="#{id}" class="#{class}" #{stateHandler}>#{rows}</table></div>',
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
     * @param {HTMLElement} target       目标父级元素
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
        me.resizeColumn();
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
        return new baidu.ui.Table.Row(options);
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
     * @param {Object} optoins  创建Row所需要的options
     * @param {Number} index
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
     */
    dispose : function(){
        var me = this;
        baidu.dom.remove(me.getId());
    }
});

/**
 * Row表格的行组件，Row组件，table的组合组件
 * @private
 * @class
 * @param       {Object}    options config参数
 * @config      {String}    id 标识该行的id，当该行存在checkbox复选框时，该id会被赋予checkbox的value
 * @config      {Array}     content 该行的单远格字符内容，如['column-1', 'column-2', 'column-3'...]
 */
baidu.ui.Table.Row = baidu.ui.createUI(function(options){
    this._cells = {};//所有生成的cell集合
    this.addState("selected");
}).extend(
/**
 * @lends baidu.ui.Table.Row.prototype
 */
{
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
                cell = new baidu.ui.Table.Cell({target : td});
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

/**
 * Cell单元格组件，当调用Row组件的getCell方法时该组件才会被生成
 * @private
 * @class Cell组件类
 */
baidu.ui.Table.Cell = baidu.ui.createUI(function(options){}).extend(
/**
 *  @lends baidu.ui.Table.Cell.prototype
 */
{
    uiType : 'table-cell',

    /**
     * 初始化cell并提供父级对象参数row
     * @param {Object} _parent
     * @memberOf {TypeName} 
     */
    _initialize : function(_parent){
        var me = this;
        me.setParent(_parent);
        baidu.dom.setAttrs(me.target, {id : me.getId(), "data-guid" : me.guid});
    },

    /**
     * 重写Main方法
     * @memberOf {TypeName} 
     * @return {html-td} 
     */
    getMain : function(){
        return baidu.dom.g(this.getId());
    },

    /**
     * 取得baidu.ui.table.Row对象
     * @memberOf {TypeName} 
     * @return {baidu.ui.table.Row} 
     */
    getParent : function(){
        return this._parent;
    },

    /**
     * 设置父对象
     * @param {Object} _parent
     * @memberOf {TypeName} 
     */
    setParent : function(_parent){
        this._parent = _parent;
    },

    /**
     * 取得单元格的字符串内容
     * @memberOf {TypeName} 
     * @return {string} 
     */
    getHTML : function(){
        return this.getMain().innerHTML;
    },

    /**
     * 设置单元格的字符串内容
     * @param {Object} content
     * @memberOf {TypeName} 
     */
    setHTML : function(content){
        var me = this, parent = me.getParent();
        parent.getParent().data[parent.getMain().rowIndex].content[me.getMain().cellIndex] = content;
        me.getMain().innerHTML = content;
    }
});