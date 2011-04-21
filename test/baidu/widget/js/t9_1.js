/**
 * 
 */
baidu.widget.create('t9_1', function(r, e) {
	e.exec = function() {
		return 1 + r('t9_2').exec();
	};
}, {
	depends : 't9_2'
});