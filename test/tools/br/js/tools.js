/**
 * <ul>
 * 不存在的标准
 * <li>元素不存在，元素无父节点
 * <li>元素被隐藏了
 * <li>元素的父节点被隐藏
 * <li>存在的标准 - display = 'block' - display = ''
 * 
 * 参数： jquery object
 */
function isShown(o) {
	if (!o || (!o.parentNode && o != document))
		return false;

	if (o instanceof String || 'string' == typeof o)
		o = document.getElementById(o);
	if (o == document.body)
		return true;

	if (o.style && "none" == o.style.display)
		return false;
	if (parseInt(o.style.marginLeft) < -2000 || parseInt(o.style.left) < -2000)
		return false;
	if (parseInt(o.offsetHeight) == 0 || parseInt(o.offsetWidth) == 0)
		return false;
	if (o.parentNode && !isShown(o.parentNode))
		return false;
	return true;
}

var testingElement = {}, te = testingElement;

(function() {
	function mySetup() {
		te.dom = [];
		te.obj = [];
	}

	function myTeardown() {
		if (te) {
			if (te.dom && te.dom.length) {
				for ( var i = 0; i < te.dom.length; i++)
					if (te.dom[i] && te.dom[i].parentNode)
						te.dom[i].parentNode.removeChild(te.dom[i]);
			}
			if (te.obj && te.obj.length) {
				for ( var i = 0; i < te.obj.length; i++) {
					var obj = te.obj[i];
					if (obj.dispose && 'function' == typeof obj.dispose) {
						/* 对象的isdeposed属性校验 */
						if (!(obj.disposed === true)){
							try{
							obj.dispose();
							}catch(e){};
						}
					}
				}
			}
		}
	}

	var s = QUnit.testStart, e = QUnit.testDone, ms = QUnit.moduleStart, me = QUnit.moduleEnd, d = QUnit.done;
	QUnit.testStart = function() {
		mySetup();
		s.apply(this, arguments);;
	};
	QUnit.testDone = function() {
		e.call(this, arguments);
		myTeardown();
	};
	QUnit.moduleStart = function() {
		var h = setInterval(function() {
			if (window && window['baidu'] && window.document && window.document.body) {
				clearInterval(h);
				start();
			}
		}, 20);
		stop();
		ms.apply(this, arguments);;
	};
//	QUnit.moduleEnd = function() {
//		me.call(this, arguments);
//	};
//	QUnit.done = function(fail,total) {
////		d.call(this, arguments);
//		d(fail,total);
//	};
})();

//function Include(src) {
//	var url = "http://"
//			+ location.host
//			+ location.pathname.substring(0, location.pathname.substring(1)
//					.indexOf('/') + 1);
//	document.write("<script type='text/javascript' src='" + url
//			+ "/src/Import.php?f=" + src + "'></script>");
//}