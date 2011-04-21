baidu.widget.create("t6_1", function(r, e) {
	e.exec = r('t6_2').exec;
}, {
	depends : [ 't6_2' ]
});