module("baidu.ui.starRate");

test('create',function(){
	expect(4);
	var div = document.createElement('div');
	document.body.appendChild(div);
	te.obj.push(div);
	var sRate = new baidu.ui.starRate.create(div);
	equal(sRate.uiType,'starRate','ui type is starRate');
	equal(sRate.classOn,'on','check classOn');
	equal(sRate.classOff,'off','check classOff');
	equal(sRate.total,5,'total is 5');
	
})

test('options',function(){
	expect(5);
	var div = document.createElement('div');
	document.body.appendChild(div);
	te.obj.push(div);
	var sRate = new baidu.ui.starRate.create(div,{
		total : 10,
		current : 3
	});
	equal(sRate.uiType,'starRate','ui type is starRate');
	equal(sRate.classOn,'on','check classOn');
	equal(sRate.classOff,'off','check classOff');
	equal(sRate.total,10,'total is 10');
	equal(sRate.current,3,'current is 10');
})