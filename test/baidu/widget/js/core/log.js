baidu.widget.create("core.log", function(require, exports){
	exports.log = function(){
		if(typeof console != 'undefined'){
			console.log(arguments);
		}
	}	
});