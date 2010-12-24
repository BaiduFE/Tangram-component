module('baidu.ui.tooltip.create')

test('single element', function() {
	var divs = testingElement.dom;
	var tps = baidu.ui.tooltip.create(divs[0], {
		content : 'test tooltip'
	});
	equals(tps.length || 1, 1, 'check length');
	baidu.each(tps, function(tp, i) {
		equals(tp.uiType, 'TOOLTIP', 'check type');
		equals(tp.targetId, divs[i].id, 'check type');
	});
	te.obj.push(tps);
})

test('single id', function() {
	var divs = testingElement.dom;
	var tps = baidu.ui.tooltip.create(divs[0].id, {
		content : 'test tooltip'
	});
	equals(tps.length || 1, 1, 'check length');
	baidu.each(tps, function(tp, i) {
		equals(tp.uiType, 'TOOLTIP', 'check type');
		equals(tp.targetId, divs[i].id, 'check type');
	});
	te.obj.push(tps);
})

test('multi element', function() {
	var divs = testingElement.dom;
	var tps = baidu.ui.tooltip.create(divs, {
		content : 'test tooltip'
	});
	equals(tps.length, divs.length, 'check length');
	baidu.each(tps, function(tp, i) {
		equals(tp.uiType, 'TOOLTIP', 'check type');
		equals(tp.targetId, divs[i].id, 'check type');
	});
})

test('multi id', function() {
	var divs = testingElement.dom, ids = [];
	baidu.each(divs, function(div) {
		ids.push(div.id)
	});
	var tps = baidu.ui.tooltip.create(ids, {
		content : 'test tooltip'
	});
	equals(tps.length, divs.length, 'check length');
	baidu.each(tps, function(tp, i) {
		equals(tp.uiType, 'TOOLTIP', 'check type');
		equals(tp.targetId, divs[i].id, 'check type');
	});
	te.obj.push(tps);
})
//
//test('position by element', function() {
//	var divs = testingElement.dom;
//	divs[0].style.position = 'absolute';
//	divs[0].style.left = '0px';
//	divs[0].style.top = '0px';
//	divs[0].style.border = '0px';
//	divs[0].style.height = '10px';
//	var tps = baidu.ui.tooltip.create(divs[0], {
//		content : 'test tooltip',
//		positionBy : 'element'
//	});
//	tps.open();
//	equals(tps.getMain().style.left, '0px', 'check left');
//	equals(tps.getMain().style.top, '10px', 'check top');
//	debugger
//	te.obj.push(tps);
//})

// TODO position in quirks mode
