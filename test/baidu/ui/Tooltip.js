module('baidu.ui.Tooltip');

(function() {
	function mySetup() {
		for ( var i = 0; i < 3; i++) {
			var div = document.createElement('div');
			div.id = "div_test" + i;
			document.body.appendChild(div);
			te.dom.push(div);
		}
	}
	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);;
		mySetup();
	}
})();

/**
 * target ?
 */

test('target and type', function() {
	var div = testingElement.dom[0];
	var t = new baidu.ui.Tooltip({});
	t.render(div);
	equals(t.uiType, 'tooltip', 'check type');
	equals(t.getMain().id, div.id, 'check id');
});

test('option attribute',function() {
			var step = 0, tp, t, div = testingElement.dom[0];
			div.style.position = 'absolute';
			div.style.left = '100px';
			div.style.height = '100px';
			div.style.top = '100px';
			var target = document.body.appendChild(document.createElement('div'));
			target.id = 'targetid';
			target.title = 'test target';
			var content = document.createElement('span');
			    content.innerHTML = '提示';
			var op = {
				width : 100,
				height : 100,
				single : true,
				zIndex : 1001,
				positionBy : 'element',
				target : target,
				content : content,
				onopen : function() {
					step++;
					tp = t.getMain();
					if (step == 1) {
						equals(t.width, op.width, 'check width');
						equals(parseInt(tp.style.width), op.width,
								'check dom width');
						equals(t.height, op.height, 'check height');
						equals(parseInt(tp.style.height), op.height,
								'check dom height');
						equals(t.single, op.single, 'check single');
						equals(t.zIndex, op.zIndex, 'check z index');
						equals(tp.style.zIndex, op.zIndex, 'check dom z index');
						equals(t.positionBy, op.positionBy, 'check position by');
						t.close();
						t.update( {
							positionBy : 'mouse'
						});
						t.open();
					} else if (step == 2) {
						equals(t.positionBy, 'mouse', 'check positionBy');
						t.close();
						start();
					}
				}
			};
			t = new baidu.ui.Tooltip(op);
			t.render(div);
			t.open();
			stop();
		});

/**
 * "init","open","close","beforeopen","beforeclose"
 */
test('on', function() {
	var div = testingElement.dom[0], _step = 0;
	var handle = function(type, step) {
		return function(ev) {
			equals(ev.type, type, 'check event type');
			equals(_step++, step, 'check step');
		};
	};
	var target = document.body.appendChild(document.createElement('div'));
		target.id = 'targetid',
		target.title = 'test target';
	var tp = new baidu.ui.Tooltip( {
		// oninit : handle('oninit', 0),
		target : target,
		onbeforeopen : handle('onbeforeopen', 1 - 1),
		onopen : handle('open', 2 - 1),
		onbeforeclose : handle('onbeforeclose', 3 - 1),
		onclose : handle('onclose', 4 - 1)
	});
	tp.render(div);
	tp.open();
	tp.close();
});

test("Set or don't set the offset of the tooltip", function(){
	var div = testingElement.dom[0];
	div.style.position = 'absolute';
	div.style.height = '100px';
	div.style.width = '100px';
	var target = document.body.appendChild(document.createElement('div'));
		target.id = 'targetid';
		$(target).css('height','50px').css('width','50px').css('left','0px').css('top','0px').css('color','red');
		var targetPos = baidu.dom.getPosition(target);
	var tp = new baidu.ui.Tooltip({
		target : target,
		offset : [100,100],
		contentText : 'content'
	});
	tp.render(div);
	tp.open();
	equals(tp.getMain().style.top, targetPos.top+50+100+'px', 
			"If set the offset, the top position of the "
			+"tooltip = the top position of the div + the "
			+"height of the div + the offset of the tooltip ");
	equals(tp.getMain().style.left, targetPos.left+50+100+'px', 
			"If set the offset, the left position of the "
			+"tooltip = the left position of the div + the "
			+"offset of the tooltip ");
	tp.close();
	var content = document.createElement('span');
    content.innerHTML = '提示';
	var tp1 = new baidu.ui.Tooltip({
		target : target,
		content : content
	});
	tp1.render(div);
	tp1.open();
	equals(tp1.getMain().style.top, targetPos.top+50+'px', 
			"If don't set the offset, the top position of the "
			+"tooltip = the top position of the div + the "
			+"height of the div ");
	equals(tp1.getMain().style.left, targetPos.left+50+'px', 
			"If don't set the offset, the left position of the "
			+"tooltip = the left position of the div ");
	tp1.close();
});

/*
 * 设置多例的情况,默认情况
 */
test('isSingleton false',function(){
	var div = testingElement.dom[0];
	var target1 = document.body.appendChild(document.createElement('div')),
	    target2 = document.body.appendChild(document.createElement('div'));
	    
	var tp = new baidu.ui.Tooltip({
		target : [target1,target2]
	});
	tp.render(div);
	
	//同一组内显示
	tp.open(target1);
	equal(tp.currentTarget,target1,'check currentTarget target1');//验证currentTarget，因tootip位置根据currentTarget定位
	ok(parseInt(tp.getMain().style.left)>0,'tooltip show');
	tp.open(target2);
	equal(tp.currentTarget,target2,'check currentTarget target2');
	ok(parseInt(tp.getMain().style.left)>0,'tooltip show');
	tp.close();
	ok(!(parseInt(tp.getMain().style.left)>0),'tooltip close');
	equal(tp.currentTarget,null,'check currentTarget null');
	
	//不同组显示
	var div1 = document.body.appendChild(document.createElement('div'));
	var target3 = document.body.appendChild(document.createElement('div')); 
	var tp1 = new baidu.ui.Tooltip({
		target : target3
	});
	tp1.render(div1);
	tp1.open(target3);
	tp.open(target2);
	ok(parseInt(tp.getMain().style.left)>0,'tooltip show');
	ok(parseInt(tp1.getMain().style.left)>0,'tooltip1 show');
	equal(tp.currentTarget,target2,'check tp currentTarget target2');
	equal(tp1.currentTarget,target3,'check tp1 currentTarget target3');

});

/*
 * 单例情况，不同组只能有一个tooltip显示
 */
test('isSingleton true',function(){
	var div = testingElement.dom[0];
	var target1 = document.body.appendChild(document.createElement('div')),
	    target2 = document.body.appendChild(document.createElement('div'));
	target1.id = 'test1';
	target2.id = 'test2';    
	var tp = new baidu.ui.Tooltip({
		target : [target1,target2]
	});
	baidu.ui.Tooltip.isSingleton = true;
	tp.render(div);
	
	//不同组显示
	var div1 = document.body.appendChild(document.createElement('div'));
	var target3 = document.body.appendChild(document.createElement('div')); 
	target3.id = 'test3';
	var tp1 = new baidu.ui.Tooltip({
		target : [target3]
	});
	tp1.render(div1);
	
	tp.open(target2);
	tp1.open();
	ok(!(parseInt(tp.getMain().style.left)>0),'tooltip close')
	ok(parseInt(tp1.getMain().style.left)>0,'tooltip1 show');
	equal(tp.currentTarget,null,'check tp currentTarget target2');
	equal(tp1.currentTarget,target3,'check tp1 currentTarget target3');

});

/**
 * target设置title时，优先级：contentElement>content>title
 * 不提供contentElement更新功能？所有target使用同一个提示信息？
 */
test('target title',function(){
	var div = testingElement.dom[0],
	    target1 = document.body.appendChild(document.createElement('div')),
	    contentElement = document.createElement('span');
	target1.id = 'target1';
	target1.title = 'this is a title';  
	contentElement.innerHTML = '提示';
	var options = {
		target : [target1],
		contentElement : contentElement
	};
    var tp = new baidu.ui.Tooltip(options);    
	tp.render(div);
	tp.open();
	equal(tp.getBody().firstChild,contentElement);
	    
	options = {
		contentElement : null
	}; 
	tp.update(options);
	equal(baidu.getAttr(tp.target[0], 'tangram-tooltip-title'),'this is a title');
	ok(!tp.getTarget().title,'cancel title');
	equal(tp.getBody().innerHTML,'this is a title');
	
	options = {//设置contentElement=null，应该显示content
		content : 'content'
	}
	tp.update(options);
	equal(tp.getBody().innerHTML,'content');
	
	options = {
		contentElement : contentElement
	}; 
	tp.update(options);
	equal(tp.getBody().firstChild,contentElement);
	
	options = {
		contentElement : null,
		content : 'content'
	}; 
	tp.update(options);
	equal(tp.getBody().innerHTML,'content');

});

test('dispose',function(){
	var l1 = baidu.event._listeners.length;
	var div = testingElement.dom[0];
	var target = document.body.appendChild(document.createElement('div'));
	var options = {
		target:target,
		ondispose : function(){
			ok(true,'dispose is dispatched');
		}
	};
	var t = new baidu.ui.Tooltip(options);
	t.render(div);
	t.dispose();
	equal(baidu.dom.g(t.getId()),null,'disposed');
	equals(baidu.event._listeners.length, l1, 'event removed all');
});
