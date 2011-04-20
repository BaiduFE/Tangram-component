module('baidu.widget.getPath');

test('base', function() {
	var w = baidu.widget, g = baidu.widget.getPath;
	equals(g('a'), 'a.js', 'base');
	w._basePath = upath;
	equals(g('a'), upath + 'a.js', 'with path');
	equals(g('core.log'), upath + 'core/log.js', 'with package');
	w._basePath = undefined;
});