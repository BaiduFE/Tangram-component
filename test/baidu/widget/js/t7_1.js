baidu.widget.create("t7_1", function(r, e) {
	e.exec = function() {
		'1' + r('t7_2').exec();
	};
}, {
	depends : 't7_2'
});