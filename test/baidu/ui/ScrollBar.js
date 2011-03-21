module('baidu.ui.ScrollBar');

/**
 * getString
 * render
 * update
 * flushUI
 * _registMouseWheelEvt
 * dispose
*/

test('init render',function(){
	stop();
	ua.loadcss(upath+'ScrollBar/style.css',function(){
		var div = document.body.appendChild(document.createElement("div"));
		$(div).css('width', '100px').css('height', '200px').css('border', 'solid')
			.css('color', 'black');
		div.id = "div_test";
		var options = {
			skin: 'scrollbar',
			onload : function(){
				ok(true,'load is success');
			}
		};
		var scrollbar = new baidu.ui.ScrollBar(options);
		scrollbar.render(div);
		equal(scrollbar.uiType,'scrollbar');
		equal(scrollbar._prev.uiType,'button',"check prev type");
		equal(scrollbar._next.uiType,'button','check next type');
		equal(scrollbar._slider.uiType,'slider','check _slider type');
		equal(scrollbar.getSize().height,scrollbar._next.getBody().offsetHeight);
		equal(scrollbar._slider.getThumb().innerHTML.match(scrollbar.getThumbString()),scrollbar.getThumbString(),"check thumb inner");
		equal(scrollbar._slider.getMain().style['height'],(200-2*scrollbar._arrowSize['height'])+'px','check slider height');
		equal(baidu.dom.getStyle(scrollbar._slider.getThumb(),'height'),scrollbar.dimension+'%','check thumb height');
		
//		alert(baidu.dom.getStyle(scrollbar._prev.getBody(),'height')); prev 的高度怎么变成0了
		start();
		te.dom.push(div);
	});

});

test('mousedown prev next',function(){
    var div = document.body.appendChild(document.createElement("div"));
	$(div).css('width', '100px').css('height', '200px').css('border', 'solid')
			.css('color', 'black');
	div.id = "div_test";
	var options = {
		skin: 'scrollbar',
		onmousedown : function(){
			ok(true,'onmousedown event');
		}
	};
	var scrollbar = new baidu.ui.ScrollBar(options);
	scrollbar.render(div);
	var thumb = scrollbar._slider.getThumb();
	var thumbtop = parseInt(baidu.dom.getStyle(thumb,'top'));
	var sliderheight = parseInt(baidu.dom.getStyle(scrollbar._slider.getMain(),'height'));
	var thumbheight = sliderheight*parseFloat(baidu.dom.getStyle(thumb,'height'))*0.01;
	ua.mousedown(scrollbar._next.getBody());
	ua.mouseup(scrollbar._next.getBody());
	equal(baidu.dom.getStyle(thumb,'top'),(thumbtop+sliderheight-thumbheight)*(scrollbar.step)*0.01+'px','click next step 1');
	
	ua.mousedown(scrollbar._next.getBody());
	ua.mouseup(scrollbar._next.getBody());
	ua.mousedown(scrollbar._next.getBody());
	ua.mouseup(scrollbar._next.getBody());
	equal(baidu.dom.getStyle(thumb,'top'),(thumbtop+sliderheight-thumbheight)*(scrollbar.step*3)*0.01+'px','click next step 3');
	
	ua.mousedown(scrollbar._prev.getBody());
	ua.mouseup(scrollbar._next.getBody());
	equal(baidu.dom.getStyle(thumb,'top'),(thumbtop+sliderheight-thumbheight)*(scrollbar.step*2)*0.01+'px','click prev step 1');
	
	ua.mousedown(scrollbar._slider.getThumb());
	ua.mouseup(scrollbar._next.getBody());
	equal(baidu.dom.getStyle(thumb,'top'),(thumbtop+sliderheight-thumbheight)*(scrollbar.step*2)*0.01+'px','click thumb ');
	
	ua.mousedown(scrollbar._prev.getBody());
	ua.mouseup(scrollbar._next.getBody());
	ua.mousedown(scrollbar._prev.getBody());
	ua.mouseup(scrollbar._next.getBody());
	equal(baidu.dom.getStyle(thumb,'top'),thumbtop+'px','click prev step 3');
    te.dom.push(div);
});

test('horizontal mousedown prev next',function(){
    var div = document.body.appendChild(document.createElement("div"));
	$(div).css('width', '200px').css('height', '100px').css('border', 'solid')
			.css('color', 'black');
	div.id = "div_test";
	var options = {
		skin: 'scrollbar',
		orientation : 'horizontal',
		onmousedown : function(){
			ok(true,'onmousedown event');
		}
	};
	var scrollbar = new baidu.ui.ScrollBar(options);
	scrollbar.render(div);
	var thumb = scrollbar._slider.getThumb();
	var thumbleft = parseInt(baidu.dom.getStyle(thumb,'left'));
	var sliderwidth = parseInt(baidu.dom.getStyle(scrollbar._slider.getMain(),'width'));
	var thumbwidth = sliderwidth*parseFloat(baidu.dom.getStyle(thumb,'width'))*0.01;
	ua.mousedown(scrollbar._next.getBody());
	ua.mouseup(scrollbar._next.getBody());
	equal(baidu.dom.getStyle(thumb,'left'),(thumbleft+sliderwidth-thumbwidth)*(scrollbar.step)*0.01+'px','click next step 1');
	
	ua.mousedown(scrollbar._next.getBody());
	ua.mouseup(scrollbar._next.getBody());
	ua.mousedown(scrollbar._next.getBody());
	ua.mouseup(scrollbar._next.getBody());
	equal(baidu.dom.getStyle(thumb,'left'),(thumbleft+sliderwidth-thumbwidth)*(scrollbar.step*3)*0.01+'px','click next step 3');
	
	ua.mousedown(scrollbar._prev.getBody());
	ua.mouseup(scrollbar._next.getBody());
	equal(baidu.dom.getStyle(thumb,'left'),(thumbleft+sliderwidth-thumbwidth)*(scrollbar.step*2)*0.01+'px','click prev step 1');
	
	ua.mousedown(scrollbar._slider.getThumb());
	ua.mouseup(scrollbar._next.getBody());
	equal(baidu.dom.getStyle(thumb,'left'),(thumbleft+sliderwidth-thumbwidth)*(scrollbar.step*2)*0.01+'px','click thumb ');
	
	ua.mousedown(scrollbar._prev.getBody());
	ua.mouseup(scrollbar._next.getBody());
	ua.mousedown(scrollbar._prev.getBody());
	ua.mouseup(scrollbar._next.getBody());
	equal(baidu.dom.getStyle(thumb,'left'),thumbleft+'px','click prev step 3');
    te.dom.push(div);
});

test('mousemove thumb',function(){
    var div = document.body.appendChild(document.createElement("div"));
	$(div).css('width', '100px').css('height', '200px').css('border', 'solid')
			.css('color', 'black');
	div.id = "div_test";
	var options = {
		skin: 'scrollbar',
		onscroll : function(){
			ok(true, 'on onscroll');
		    equal(baidu.dom.getStyle(scrollbar._slider.getThumb(),'top'),(thumbtop+50)+'px','drag thumb 50');
            var value = 50/slidelength * 100;
            equal(scrollbar._slider.value,value,'check slider value');
            te.dom.push(div);
		    start();
		}
	};
	stop();
	var scrollbar = new baidu.ui.ScrollBar(options);
	scrollbar.render(div);
	var thumb = scrollbar._slider.getThumb();
	var thumbtop = parseInt(baidu.dom.getStyle(thumb,'top'));
	var thumbleft = parseInt(baidu.dom.getStyle(thumb,'left'));
	var sliderheight = parseInt(baidu.dom.getStyle(scrollbar._slider.getMain(),'height'));
	var thumbheight = sliderheight*parseFloat(baidu.dom.getStyle(thumb,'height'))*0.01;
	var slidelength = thumbtop+sliderheight-thumbheight;
	ua.mousemove(thumb, {
		clientX : thumbleft,
		clientY:thumbtop
	});
	ua.mousedown(thumb, {
		clientX : thumbleft,
		clientY:thumbtop
	});
	setTimeout(function() {
		ua.mousemove(thumb,{
			clientX : thumbleft,
			clientY:thumbtop+50
		});
	}, 30);
	setTimeout(function() {
        ua.mouseup(thumb,{
        	clientX : thumbleft,
        	clientY:thumbtop+50
        });
	}, 60);
});

test('mousedown slider',function(){
    var div = document.body.appendChild(document.createElement("div"));
	$(div).css('width', '100px').css('height', '200px').css('border', 'solid')
			.css('color', 'black');
	div.id = "div_test";
	var options = {
		skin: 'scrollbar',
	};
	stop();
	var scrollbar = new baidu.ui.ScrollBar(options);
	scrollbar.render(div);
	var thumb = scrollbar._slider.getThumb();
	var slider = scrollbar._slider.getBody();
	var thumbPos = baidu.dom.getPosition(thumb);
	var thumbleft = thumbPos.left;
	var thumbtop = thumbPos.top;
	var sliderheight = parseInt(baidu.dom.getStyle(scrollbar._slider.getMain(),'height'));
	var thumbheight = sliderheight*parseFloat(baidu.dom.getStyle(thumb,'height'))*0.01;
	setTimeout(function(){
		ua.mousemove(slider, {
			clientX : thumbleft,
			clientY:thumbtop+70
		});
	},30)
    setTimeout(function(){
		ua.mousedown(slider, {
			clientX : thumbleft,
			clientY:thumbtop+70
		});
	},60)
	setTimeout(function(){
	   equal(baidu.dom.getStyle(thumb,'top'),(70-thumbheight*0.5)+'px','mousedown slider ');
	   te.dom.push(div);
	   start();
	},100)
});

test('flushUI',function(){
    var div = document.body.appendChild(document.createElement("div"));
	$(div).css('width', '100px').css('height', '200px').css('border', 'solid')
			.css('color', 'black');
	div.id = "div_test";
	var options = {
		skin: 'scrollbar'
	};
	var scrollbar = new baidu.ui.ScrollBar(options);
	scrollbar.render(div);
	var thumb = scrollbar._slider.getThumb();
	var sliderheight = parseInt(baidu.dom.getStyle(scrollbar._slider.getMain(),'height'));
	equal(scrollbar.value,0);
	equal(baidu.dom.getStyle(thumb,'top'),'0px','init thumb top');
	scrollbar.flushUI(50,30);
	var thumbheight = sliderheight*parseFloat(baidu.dom.getStyle(thumb,'height'))*0.01;
	equal(baidu.dom.getStyle(thumb,'height'),'30%','flushUI thumb height');
    equal(baidu.dom.getStyle(thumb,'top'),(sliderheight*0.5-thumbheight/2)+'px','flushUI thumb top');
    te.dom.push(div);

});

/*鼠标滑轮滚动事件*/
//test('_registMouseWheelEvt',function(){
//    var div = document.body.appendChild(document.createElement("div"));
//	$(div).css('width', '100px').css('height', '200px').css('border', 'solid')
//			.css('color', 'black');
//	div.id = "div_test";
//	var options = {
//		skin: 'scrollbar'
//	};
//	var scrollbar = new baidu.ui.ScrollBar(options);
//	scrollbar.render(div);
//	var thumb = scrollbar._slider.getThumb();
//    te.dom.push(div);
//
//});

test('dispose',function(){
    var div = document.body.appendChild(document.createElement("div"));
	$(div).css('width', '100px').css('height', '200px').css('border', 'solid')
			.css('color', 'black');
	div.id = "div_test";
	var options = {
		ondispose : function(){
			ok(true,"it's dispose");
		}
	};
	var scrollbar = new baidu.ui.ScrollBar(options);
	scrollbar.render(div);
	scrollbar.dispose();
    equal(scrollbar.getMain(),null,'main removed');
    ok(!scrollbar._slider,'check _slider not exist');
    ok(!scrollbar._next,'check next not exist');
	ok(!scrollbar._prev,'check prev not exist');
	
});

