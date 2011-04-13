module('baidu.ui.Modal.Modal$coverable');

test('hide select',function(){
	    var select_a = document.createElement('select');
		select_a.options[select_a.options.length] = new Option('content_a', 'value_a');
		document.body.appendChild(select_a);
		var m = new baidu.ui.Modal();
		m.render();
		m.show();
		var mo = m.getMain();
		ok(isShown(mo), '调用show之后modal应该展示');
		if(!baidu.browser.isWebkit && !baidu.browser.isGecko){
			ok(m.getMain().firstChild.firstChild.style['backgroundColor'] ,'The iframe is not transparent PUBLICGE-375');
			equals(m.getMain().firstChild.firstChild.style['zIndex'], '-1', 'The z-index of the iframe is -1')
			equals(m.getMain().firstChild.firstChild.style.width, m.getMain().offsetWidth + 'px', 'The width of the iframe is right');
			equals(m.getMain().firstChild.firstChild.style.height, m.getMain().offsetHeight + 'px', 'The Height of the iframe is right');
			equals(m.getMain().firstChild.firstChild.offsetTop, m.getMain().offsetTop, 'The top of the iframe is right');
			equals(m.getMain().firstChild.firstChild.offsetLeft, m.getMain().offsetLeft, 'The left of the iframe is right');
		}
		m.hide();
		ok(!isShown(mo), 'hide after hide');
		if(!baidu.browser.isWebkit && !baidu.browser.isGecko){
		    ok(!isShown(m.getMain().firstChild.firstChild) ,'The iframe is hidden PUBLICGE-390');
		}
	    m.dispose();
	    document.body.removeChild(select_a);
});

test('在div中遮罩 hide select', function() {
	/* 位置信息及css会引发用例情况异常，此用例在frame中运行 */
	var tt = document.body.appendChild(document.createElement('div'));
	$(tt).css('width', 200).css('height', 200).css('background-color',
			'red');
    var select_a = document.createElement('select');
	select_a.options[select_a.options.length] = new Option('content_a', 'value_a');
	tt.appendChild(select_a);
	var m = new baidu.ui.Modal({
		container : tt
	});
	m.render();
	m.show();
	var mo = m.getMain();
	ok(isShown(mo), '调用show之后modal应该展示');
	if(!baidu.browser.isWebkit && !baidu.browser.isGecko){
		ok(m.getMain().firstChild.firstChild.style['backgroundColor'] ,'The iframe is not transparent PUBLICGE-375');
		equals(m.getMain().firstChild.firstChild.style['zIndex'], '-1', 'The z-index of the iframe is -1')
		equals(m.getMain().firstChild.firstChild.style.width, m.getMain().offsetWidth + 'px', 'The width of the iframe is right');
		equals(m.getMain().firstChild.firstChild.style.height, m.getMain().offsetHeight + 'px', 'The Height of the iframe is right');
		equals(baidu.dom.getPosition(m.getMain().firstChild.firstChild).top, m.getMain().offsetTop, 'The top of the iframe is right PUBLICGE-391');
		equals(baidu.dom.getPosition(m.getMain().firstChild.firstChild).left, m.getMain().offsetLeft, 'The left of the iframe is right');
	}
	m.hide();
	ok(!isShown(mo), 'hide after hide');
	if(!baidu.browser.isWebkit && !baidu.browser.isGecko){
		ok(!isShown(m.getMain().firstChild.firstChild) ,'The iframe is hidden');
	}
    m.dispose();
    tt.removeChild(select_a);
    document.body.removeChild(tt);
});

//test('update modal',function(){
//    expect(16);
//    var select_a = document.createElement('select');
//	select_a.options[select_a.options.length] = new Option('content_a', 'value_a');
//	document.body.appendChild(select_a);
//	var m = new baidu.ui.Modal();
////	alert(1);
//	m.render();
////	alert(1);
//	m.show();
//	alert(1);
//	var mo = m.getMain();
//	ok(isShown(mo), '调用show之后modal应该展示');
//	ok(m.getMain().firstChild.firstChild.style['backgroundColor'] ,'The iframe is not transparent PUBLICGE-375');
//	equals(m.getMain().firstChild.firstChild.style['zIndex'], '-1', 'The z-index of the iframe is -1')
//	equals(m.getMain().firstChild.firstChild.style.width, m.getMain().offsetWidth + 'px', 'The width of the iframe is right');
//	equals(m.getMain().firstChild.firstChild.style.height, m.getMain().offsetHeight + 'px', 'The Height of the iframe is right');
//	equals(m.getMain().firstChild.firstChild.offsetTop, m.getMain().offsetTop, 'The top of the iframe is right');
//	equals(m.getMain().firstChild.firstChild.offsetLeft, m.getMain().offsetLeft, 'The left of the iframe is right');
//	var options = {
//			styles:{color: '#FF0000',
//					opacity : '0.3',
//					width : 100,
//			        height : 50,
//			        top : 50,
//			        left : 50
//	        }
//	}
//	m.update(options);
//	alert(1);
//	ok(isShown(mo), 'update之后modal仍然展示');
//	ok(m.getMain().firstChild.firstChild.style['backgroundColor'] ,'The iframe is not transparent PUBLICGE-375');
//	equals(m.getMain().firstChild.firstChild.style['zIndex'], '-1', 'The z-index of the iframe is -1')
//	equals(m.getMain().firstChild.firstChild.style.width, m.getMain().offsetWidth + 'px', 'The width of the iframe is right');
//	equals(m.getMain().firstChild.firstChild.style.height, m.getMain().offsetHeight + 'px', 'The Height of the iframe is right');
//	equals(m.getMain().firstChild.firstChild.offsetTop, m.getMain().offsetTop, 'The top of the iframe is right');
//	equals(m.getMain().firstChild.firstChild.offsetLeft, m.getMain().offsetLeft, 'The left of the iframe is right');
//	m.hide();
////	alert(2);
//	ok(!isShown(mo), 'hide after hide');
//	ok(!isShown(m.getMain().firstChild.firstChild) ,'The iframe is hidden');
//    m.dispose();
//    document.body.removeChild(select_a);
//});
