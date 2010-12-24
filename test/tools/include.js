/**
 * 
 * 
 * demo: <code>	 var interfaces = {
 *  			testcase : {
 *  				core:[
 *  				],
 *  			other:[
 *  				'isQuirks'
 *  				]
 *  			}
 *  		};
 *          include(interfaces);
 *                  </code>
 */
function include(i) {
	var loadjs = function(path) {
		var s = document.createElement('SCRIPT');
		var script = document.getElementsByTagName("SCRIPT");
		s.type = 'text/javascript';
		s.src = path;
		script[0].parentNode.appendChild(s);
		s = null;
	};

	var url = window.location.href, urlToken = url.split("#"), i, len;
	/* 以test切割作为源路径计算方式*/
	var paths = location.href.split( [ '?', '#' ]);
	var proj = paths[0].split('/test/')[0];

	/* load UserAction and tools */
	loadjs(proj + '/test/tools/UserAction.js');
	loadjs(proj + '/test/tools/tools.js');

	var currentpath = paths[0].split('/test/')[1];
	currentpath = currentpath.substring(0, currentpath.lastIndexOf('/'));

	/**
	 * name中包含js/
	 */
	var translateCaseToSource = function(name) {
		name = name.indexOf('js/') == 0 ? name.substring(3) : name;
		if (name.indexOf('.js') > 0) {
			name = name.substring(0, name.indexOf('.js'));
		}
		return currentpath.split('/').join('.') + '.'
				+ name.split('/').join('.');
	};

	var loadsrc = function() {
		var srclist = new Array();
		$.each(i.cases, function(i, n) {
			if (n == 'js/tools.js')
				return;
			var name = translateCaseToSource(n);
			srclist.push(name);
		});
		var path = proj + '/test/tools/br/import.php?f=' + srclist.join(',');
		loadjs(path);
		$.each(i.cases, loadcase);
	};

	/**
	 * 加载case，计算路径使用当前路径
	 */
	var loadcase = function(i, name) {
		if (name.indexOf('.js') > 0) {
			name = name.substring(0, name.indexOf('.js'));
		}
		loadjs(proj + '/test/' + currentpath + '/' + name.split('.').join('/')
				+ '.js');
	};

	loadsrc();
};