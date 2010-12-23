/*
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * @path:ui/table/Table$edit.js
 * @author:linlingyu
 * @version:1.0.0
 * @date:2010-11-05
 */
///import baidu.ui.table.Table;
///import baidu.array.each;
///import baidu.ui.input;
///import baidu.ui.input.Input;
///import baidu.ui.input.create;
///import baidu.dom.hide;
///import baidu.dom.show;
///import baidu.ui.get;
///import baidu.dom.g;
///import baidu.event.getTarget;
///import baidu.dom.setStyle;
///import baidu.dom.getAncestorByTag;
///import baidu.lang.Class.addEventListeners;
/**
 * 使单元格支持编辑
 */
baidu.ui.table.Table.register(function(me){
	//me._editArray = [];	//存入用户设置的需要编辑的行对象
	//me._textField;		//编辑的通用input
	if(me.columns){
		me.addEventListeners("load, update", function(){
			var i = 0,
				rowCount = me.getRowCount();
			me._editArray = [];
			baidu.array.each(me.columns, function(item){
				if(item.hasOwnProperty("enableEdit")){
					me._editArray.push(item);
				}
			});
			if(me._editArray.length > 0){
				me._textField = baidu.ui.input.create(me.getMain());
				me._textField.getBody().onblur = function(evt){me._cellBlur(evt);}//为了保持和_cellFocus参数一致，这里不使用控件的onblur
				baidu.dom.hide(me._textField.getBody());
//				baidu.dom.setStyle(me.getBody(), "tableLayout", "fixed");
			}
			for(; i < rowCount; i++){
				me.attachEdit(me.getRow(i));
			}
		});
		me.addEventListener("addrow", function(evt){
			me.attachEdit(baidu.ui.get(baidu.g(evt.rowId)));
		});
	}
});
//
baidu.object.extend(baidu.ui.table.Table.prototype, {
	/**
	 * 绑定一行中的某列拥有双击事件
	 * @param {baidu.ui.table.Row} row 行对象
	 * @memberOf {TypeName} 
	 */
	attachEdit : function(row){
		var me = this;
		baidu.array.each(me._editArray, function(item){
			row.getBody().cells[item.index].ondblclick = function(evnt){
				me._cellFocus(evnt, this);
			}
		});
	},
	
	/**
	 * 当双击单元格时取得焦点实现编辑
	 * @param {Event} evt
	 * @param {html-element} cell
	 * @memberOf {TypeName} 
	 */
	_cellFocus : function(evt, cell){
		var me = this,
			input = me._textField.getBody(),
			cellWidth = cell.clientWidth;//当是自适应模式时，这里需要先把clientWidth保存
		if(baidu.event.getTarget(evt || window.event).id != input.id){
			input.value = cell.innerHTML;
			cell.innerHTML = "";
			//baidu.dom.setStyle(input, "width", "0px");//当是自适应模式是时，需要先设为0
			cell.appendChild(input);
			baidu.dom.show(input);
			baidu.dom.setStyle(input, "width", cellWidth - input.offsetWidth + input.clientWidth + "px");
			input.focus();
			input.select();
		}
	},
	
	/**
	 * 失去单元格焦点时当编辑数据写回单元格
	 * @param {Event} evt
	 * @memberOf {TypeName} 
	 */
	_cellBlur : function(evt){
		var me = this,
			target = baidu.event.getTarget(evt || window.event),
			cell = baidu.dom.getAncestorByTag(target, "td");
		baidu.dom.hide(target);
		me.getTarget().appendChild(target);
		cell.innerHTML = target.value;
	}
});