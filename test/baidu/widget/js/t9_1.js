/**
 * 
 */
baidu.widget.create('t9_1', function(r, e) {
	var t9_2 = r('t9_2');
	e.exec = function() {
		return 1 + t9_2.exec();
	};
}, {
	depends : 't9_2'
});