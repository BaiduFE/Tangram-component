//

baidu.widget.create("dialog", function(require, exports, me){
	exports.create = function(){
		return 'dialog_create';
		//alert('creating dialog');
	}
},{depends:['uibase']});

baidu.widget.create('dialogBase', function(require, exports, me){
	exports.create = function(){
		return 'dialogBase_create';
		//alert('creating dialogBase');
	}
},{depends:['uibase']});