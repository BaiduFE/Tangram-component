/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/starRate/StarRate.js
 * author: rocy
 * version: 1.0.0
 * date: 2010-07-20
 */
///import baidu.ui.createUI;
///import baidu.ui.starRate;

///import baidu.dom.g;
///import baidu.dom.insertHTML;
///import baidu.string.format;
///import baidu.event.on;

/**
 * 星级评价条
 * @param {Object} [options] 选项
 * @param {Number} [options.total] 总数,默认5个
 * @param {Number} [options.current] 当前亮着的星星数
 * @param {String} [options.classOn] 星星点亮状态的className
 * @param {String} [options.classOff] 星星未点亮状态的className
 */
//TODO: 实现一个支持任意刻度的星的显示
baidu.ui.starRate.StarRate = baidu.ui.createUI(function(options){
	
	
}).extend({
	uiType  : "starRate",
	// 总共需要多少个星星【可选，默认显示5个】
	total : 5,
	// 亮着的星星数【可选，默认无】
	current : 0,
	// 鼠标移出焦点区域触发函数【可选】
	//leave : function(){}
	// 鼠标经过的触发功能函数【可选】
	//hover : function(num){}
	// 点击的触发功能函数【可选】
	//click : function(num){}
	tplStar : '<span id="#{id}" class="#{className}" onmouseover="#{onmouseover}" onclick="#{onclick}"></span>',
	
	classOn : 'on',
	
	classOff : 'off',
    isDisable : false,
	
	getString : function(){
		var me = this, ret = [], i;
		for(i=0; i < me.total; ++i){
			ret.push(baidu.string.format(me.tplStar, {
				id 			: me.getId(i),
				className	: i < me.current ? me.getClass(me.classOn) : me.getClass(me.classOff),
				onmouseover : me.getCallString("hoverAt",i+1),
				onclick		: me.getCallString("clickAt", i+1)
			}));
		}
		return ret.join('');
	},
	
	render : function(element){
		var me = this,element = baidu.g(element);
		baidu.dom.insertHTML(element, "beforeEnd",me.getString());
		baidu.on(element, 'mouseout', function(){me.starAt(me.current);me.dispatchEvent("onleave");});
	},
	
	starAt : function(num){
		var me = this, i;
		for(i=0; i < me.total; ++i){
			baidu.g(me.getId(i)).className = i < num ? me.getClass(me.classOn) : me.getClass(me.classOff);
		}
	},
	
	hoverAt : function(num){
        if(!this.isDisable){
		    this.starAt(num);
		    this.dispatchEvent("onhover",{data : {index : num}});
        }
	},
	
	clickAt : function(num){
		if(!this.isDisable){
            this.current = num;
		    this.dispatchEvent("onclick",{data : {index : num}});
        }
	},
	
	/**
	 * 值不可更改,即不响应鼠标事件
	 */
	disable : function(){
		var me = this;
        me.isDisable = true;
	},
	/**
	 * disable之后的恢复
	 */
	enable : function(){
		var me = this;
        me.isDisable = false;
	}
	
	
});
