baidu.widget.create("a", function(require, exports){
	var b = require("b");
	exports.a = b.b;
}, {depends:['b']});