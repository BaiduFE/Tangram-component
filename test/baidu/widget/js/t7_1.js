baidu.widget.create("t7_1", function(r, e) {
	var t7_2 = r('t7_2').exec();
	e.exec = function() {
		return 1 + t7_2;
	};
	e.exec1 = function(){
		return 1 + r('t7_2').exec();
	};
}, {
	depends : 't7_2'
});