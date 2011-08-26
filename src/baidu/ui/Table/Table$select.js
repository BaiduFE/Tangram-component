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
///import baidu.array.each;
///import baidu.lang.isNumber;
///import baidu.dom.insertHTML;
///import baidu.string.format;
///import baidu.ui.get;
///import baidu.dom.getAttr;
///import baidu.dom.g;
///import baidu.dom.getAncestorByTag;
///import baidu.object.values;
///import baidu.object.keys;
///import baidu.lang.Class.addEventListeners;
/**
 * 增加选择列的插件
 * @param   {Object} options config 参数
 * @config  {Object} columns，在columns的数据描述中加入type属性并设置为'checkbox'表示该列支持checkbox，如：{index:0, type: 'checkbox'}
 */
baidu.ui.Table.register(function(me){
//	me._selectedItems = {};      //当前选中的id:checkbox-id, data:row-data
//	me._checkboxList = {};       //所有的 row-id 和 checkbox-id 对照表
//  me._checkboxDomList = {};    //提高全选性能，提有DOM节点
	if(me.columns){
		me.addEventListeners("load, update", function(){
			me._selectedItems = {};
			me._checkboxList = {};
			me._checkboxDomList = {};
			me._createSelect();
		});
		me.addEventListeners({
			addrow : function(evnt){
				me.addCheckbox(evnt.rowId, me._selectIndex);
			},
			removerow : function(evnt){
				me.removeCheckbox(evnt.rowId);
			},
			gotopage : function(){
				me.unselectAll();
			}
		});
	}
});

baidu.object.extend(baidu.ui.Table.prototype, {
	tplSelect : '<input id="#{id}" type="checkbox" value="#{value}" onclick="#{handler}"/>', //这里事件使用onchange时ie会有问题
//	titleCheckboxId : null,   //表格头部id
	/**
	 * 当存在title时创建一个全选的checkbox
	 * @param {Number} index 列索引
	 * @memberOf {TypeName} 
	 */
	_createTitleScelect : function(index){
		var me = this;
		me.titleCheckboxId = me.titleCheckboxId || me.getId("checkboxAll");
		baidu.dom.insertHTML(me.getTitleBody().rows[0].cells[index], "beforeEnd",
			baidu.string.format(me.tplSelect, {
				id : me.titleCheckboxId,
				value : "all",
				handler : me.getCallString("toggleAll")
			})
		);
	},
	
	/**
	 * 在指定的clumnIndex中创建一列带checkbox的选择列
	 * @memberOf {TypeName} 
	 */
	_createSelect : function(){
		var me = this,
			rowCount = me.getRowCount(),
			i = 0,
			index;
		baidu.array.each(me.columns, function(item){//取出列索引
			if(item.hasOwnProperty("type") && item.type.toLowerCase() == "checkbox"){
				me._selectIndex = index = item.index;
				return false;
			}
		});
		if(me.title && baidu.lang.isNumber(index)){//如果存在表格标题,生成全选checkbox
			if(me.getTitleBody && me.getTitleBody()){//这里和$title插件存在文件载入先后关联
				me._createTitleScelect(index);
			}else{
				me.addEventListener("titleload", function(){
					me._createTitleScelect(index);
					me.removeEventListener("titleload", arguments.callee);
				});
			}
		}
		if(baidu.lang.isNumber(index)){
			for(;i < rowCount; i++){//生成各行的checkbox
				me.addCheckbox(me.getRow(i).getId(), index);
			}
		}
	},
	
	/**
	 * 生成单个ceckbox的字符
	 * @param {baidu.ui.table.Row} row 行组件
	 * @memberOf {TypeName} 
	 * @return {string}
	 */
	_getSelectString : function(row){
		var me = this,
			rsid = row.getId("checkbox");
		me._checkboxList[row.getId()] = rsid;
		me._checkboxDomList[row.getId()] = rsid;
		return baidu.string.format(me.tplSelect, {
			id : rsid,
			value : row.id ? row.id : row.guid,
			handler : me.getCallString("toggle", rsid)
		});
	},
	
	/**
	 * 添加单个checkbox到行中
	 * @param {String} rowId 该行的id
	 * @memberOf {TypeName} 
	 */
	addCheckbox : function(rowId, index){
		var me = this, row, cell, checkboxStr;
		if(baidu.lang.isNumber(index)){
			row = baidu.ui.get(baidu.g(rowId)),
			cell = row.getBody().cells[index],
			checkboxStr = me._getSelectString(row);
			baidu.dom.insertHTML(cell, "beforeEnd", checkboxStr);
			baidu.dom.setAttr(cell, "align", "center");
			row.addEventListener("update", function(){
				baidu.dom.insertHTML(cell, "beforeEnd", checkboxStr);
			});
			me._checkboxDomList[rowId] = baidu.dom.g(me._checkboxDomList[rowId]);
		}
	},
	
	/**
	 * 移除一个checkbox
	 * @param {Object} rowId 该行的id
	 * @memberOf {TypeName} 
	 */
	removeCheckbox : function(rowId){
		var me = this;
		delete me._selectedItems[me._checkboxList[rowId]];
		delete me._checkboxList[rowId];
		delete me._checkboxDomList[rowId];
	},
	
	/**
	 * 取得表格标题的全选checkbox
	 * @memberOf {TypeName} 
	 * @return {html-element} 
	 */
	getTitleCheckbox : function(){
		return baidu.dom.g(this.titleCheckboxId);
	},
	
	/**
	 * 设置一个自定义的全选checkbox
	 * @param {String} checkboxId 该checkbox的id
	 * @memberOf {TypeName}
	 */
	setTitleCheckbox : function(checkbox){
		this.titleCheckboxId = checkbox.id || checkbox;
	},
	
	/**
	 * 根据checkbox对象状态来维护选中的MAP
	 * @param {Object} checkboxId
	 * @memberOf {TypeName} 
	 */
	_setSelectItems : function(checkboxId){
		var me = this,
			checkbox = baidu.g(checkboxId),
			row;
		if(checkbox.checked){
			row = baidu.ui.get(baidu.dom.getAncestorByTag(checkboxId, "TR"));
			me._selectedItems[checkbox.id] = row.id || row;
		}else{
			delete me._selectedItems[checkbox.id];
		}
	},
	
	/**
	 * 根据给定的索引设置checkbox的选中或返选状态
	 * @param {Array} indexArr 格式[1, 4],当是null时默认值是_checkboxList
	 * @param {Boolean} val true:选中, false:反选
	 * @memberOf {TypeName}_setCheckboxState
	 */
	_setCheckboxState : function(indexArr, val){
		var me = this,
			indexArr = baidu.lang.isNumber(indexArr) ? [indexArr] : indexArr,	//索引
			rsidList = [],	//checkbox-id array
			checkbox;
		if(indexArr){
			baidu.array.each(indexArr, function(item){
				rsidList.push(me._checkboxDomList[me.getRow(item).getId()]);
			});
		}else{
			rsidList = baidu.object.values(me._checkboxDomList);
		}
		baidu.array.each(rsidList, function(checkbox){
			if(val && !checkbox.checked){
				checkbox.checked = true;
			}else if(!val && checkbox.checked){
				checkbox.checked = false;
			}
			if(indexArr){//单选
				me.toggle(checkbox);
			}else{
				me._setSelectItems(checkbox);
			}
		});
	},
	
	/**
	 * 根据给定的数组索引选中checkbox
	 * @param {Object} indexArr 格式：[1, 3, 8]
	 * @memberOf {TypeName} 
	 */
	select : function(indexArr){
		this._setCheckboxState(indexArr, true);
	},
	
	/**
	 * 根据给定的数组索引反选checkbox
	 * @param {Object} indexArr
	 * @memberOf {TypeName} 
	 */
	unselect : function(indexArr){
		this._setCheckboxState(indexArr, false);
	},
	
	/**
	 * 单项的切换选中或反选
	 * @param {Object} rsid
	 * @memberOf {TypeName} 
	 */
	toggle : function(rsid){
		var me = this,
			titleCheckbox = me.getTitleCheckbox(),
			checkbox = baidu.g(rsid),
			len;
		me._setSelectItems(rsid);//选中反选处理数据
		if(checkbox.checked){
			len = baidu.object.keys(me._selectedItems).length;
			if(titleCheckbox && !titleCheckbox.checked
				&& len == baidu.object.keys(me._checkboxList).length){
					titleCheckbox.checked = true;
			}
		}else{
			if(titleCheckbox && titleCheckbox.checked){
				titleCheckbox.checked = false;
			}
		}
	},
	
	/**
	 * 全部选中checkbox
	 * @memberOf {TypeName} 
	 */
	selectAll : function(){
		this._setCheckboxState(null, true);
	},
	
	/**
	 * 全部反选checkbox
	 * @memberOf {TypeName} 
	 */
	unselectAll : function(){
		this._setCheckboxState(null, false);
	},
	
	/**
	 * 当全选的checkbox存在时才可以切换全选和全反选
	 * @memberOf {TypeName} 
	 */
	toggleAll : function(){
		var me = this, checkbox = me.getTitleCheckbox();
		if(checkbox){
			this._setCheckboxState(null, checkbox.checked);
		}
	},
	
	/**
	 * 取得已经选中的数据，如果该行的row.data中设置id则返回所选中的id数组，否则返回该row的data
	 * @memberOf {TypeName} 
	 * @return {TypeName} 
	 */
	getSelected : function(){
		return baidu.object.values(this._selectedItems);
	}
});