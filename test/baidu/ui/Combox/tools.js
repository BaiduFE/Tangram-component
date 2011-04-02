//function mySetup() {
//	testingElement = {};
//	testingElement.dom = [];
//	testingElement.obj = [];
//	testingElement.evt = [];
//
//	var link = document.createElement('link');
//	link.setAttribute('rel','stylesheet');
//	link.setAttribute('type','text/css');
//	link.setAttribute('href','../../baidu/ui/Combox/style.css');
//	
//	document.getElementsByTagName("head")[0].appendChild(link);
////	var select = document.createElement('select');
////	select.id = "select_test";
////	document.body.appendChild(select);
////	testingElement.dom.push(select);
//
////	testingElement.dom.push(link);
//	for ( var i = 0; i < baidu.event._listeners; i++)
//		testingElement.evt.push(baidu.event._listeners[i]);
//}
//
//function myTeardown() {
//	if (testingElement) {
//		if (testingElement.dom && testingElement.dom.length) {
//			for ( var i = 0; i < testingElement.dom.length; i++)
//				if (testingElement.dom[i] && testingElement.dom[i].parentNode)
//					testingElement.dom[i].parentNode
//							.removeChild(testingElement.dom[i]);
//		}
//		if (testingElement.obj && testingElement.obj.length) {
//			for ( var i = 0; i < testingElement.obj.length; i++) {
//				console.log(typeof testingElement.obj[i]);
//				if (testingElement.obj[i] && testingElement.obj[i].dispose)
//					testingElement.obj[i].dispose();
//			}
//		}
//
//		var indexof = function(array, item) {
//			for ( var i = 0; i < array.length; i++)
//				if (array[i] == item)
//					return i;
//			return -1;
//		}
//		if (testingElement.evt.length < baidu.event._listeners.length)
//			for ( var i = 0; i < baidu.event._listeners.length; i++) {
//				var evt = baidu.event._listeners[i];
//				if (indexof(testingElement.evt, evt) != -1)
//					continue;
//				baidu.event.un(evt[0], evt[1], evt[2]);
//			}
//	}
//}
//
//function myModuleStart(name) {
//
//}
//
//function myModuleEnd(name) {
//
//}
//
//function myDone() {
//
//}
//
//(function() {
//	var s = QUnit.testStart, e = QUnit.testDone, ms = QUnit.moduleStart, me = QUnit.moduleEnd, d = QUnit.done;
//	QUnit.testStart = function() {
//		mySetup(arguments[0]);
//		s.apply(this, arguments);;
//	}
//	QUnit.testDone = function() {
//		e.call(this, arguments);
//		myTeardown();
//	}
//	QUnit.moduleStart = function() {
//		myModuleStart(arguments[0]);
//		ms.apply(this, arguments);;
//	}
//	QUnit.moduleEnd = function() {
//		me.call(this, arguments);
//		myModuleEnd(arguments[0]);
//	}
//	QUnit.done = function() {
//		d.call(this, arguments);
//	}
//})();