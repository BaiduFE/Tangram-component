module('baidu.ui.Base');

(function() {
	te.extBase = function(opts) {
		var i, a = {};
		for (i in baidu.ui.Base)
			a[i] = baidu.ui.Base[i];
		for (i in opts)
			a[i] = opts[i];
		if (!a.update)
			a.update = function(opts) {
				for ( var i in opts)
					a[i] = opts[i];
				return a;
			};
		return a;
	};
})();

test('base', function() {
	equals(baidu.ui.Base.id, '', 'id default is blank');
	equals(baidu.ui.Base.getId(), 'tangram---undefined', 'get Id');
	var a = te.extBase({
		uiType : 'test',
		id : 'id'
	});
	equals(a.getId(), 'tangram-test--id', 'get Id');
});

test('getClass', function() {
	var a = te.extBase({
		classPrefix : 'cp'
	});
	equals(a.getClass(), 'cp', 'getClass');
	a.update({
		skin : 'sk'
	});
	equals(a.getClass(), 'cp sk', 'getClass');
	equals(a.getClass('t'), 'cp-t sk-t', 'getClass');
});

test('getMain renderMain', function() {
	var a = te.extBase({
		'uiType' : 'test',
		'id' : 'id'
	});
	equals(a.getMain(), null, 'main default null');
	a.renderMain();
	equals(a.getMain().tagName, 'DIV', 'get main after render');
	equals(a.getMain().id, a.getId('main'), 'get main after render');
	a.renderMain(document.createElement('a'));
	equals(a.getMain().tagName, 'DIV', 'never render again');
	
	var b = te.extBase({
		'uiType' : 'test',
		'id' : 'id1'
	});
	var tgt = document.body.appendChild(document.createElement('span'));
	b.renderMain(tgt);
	equals(b.getMain().tagName, 'SPAN', '订制renderMain对象');
	equals(b.getMain().id, tgt.id, '订制对象的id');
});

test('getBody', function(){
	var a = te.extBase();
	equals(a.getBody(), null, 'none body default');
	a.update({render:function(){
		a.renderMain();
	}});
});
