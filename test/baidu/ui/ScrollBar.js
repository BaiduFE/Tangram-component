module('baidu.ui.ScrollBar');

/**
 * getString
 * render
 * update
 * flushUI
 * _registMouseWheelEvt
 * dispose
*/

/**
 * render 提供渲染功能，创建3个对象，prev（button） slider next（button） ,这三个组成滚动条
 */
test('init render',function(){
	stop();
	ua.loadcss(upath+'ScrollBar/style.css',function(){
		var div = document.body.appendChild(document.createElement("div"));
		$(div).css('width', '100px').css('height', '200px').css('border', 'solid')
			.css('color', 'black');
		div.id = "div_test";
		var options = {
			skin: 'scrollbar-a',
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
		equal(scrollbar.getSize().height,200,'check scrollbar height');
		var nextwidth  = baidu.dom.getStyle(scrollbar._next.getBody(),'width'),
		    nextheight = baidu.dom.getStyle(scrollbar._next.getBody(),'height'),
		    prevheight = baidu.dom.getStyle(scrollbar._prev.getBody(),'height');
		equal(scrollbar.getSize().width+'px',nextwidth,'check scrollbar width');
		equal(scrollbar._slider.getMain().style['height'],(200-parseInt(nextheight)-parseInt(prevheight))+'px','check slider height');
		equal(baidu.dom.getStyle(scrollbar._slider.getThumb(),'height'),scrollbar.dimension+'%','check thumb height');
		te.dom.push(div);
		start();
	});

});

/**
 * 验证分别鼠标点击 前后按钮时，滑块移动到像素值
 */
test('mousedown prev next',function(){
	stop();
	ua.loadcss(upath+'ScrollBar/style.css',function(){
	    var div = document.body.appendChild(document.createElement("div"));
		$(div).css('width', '100px').css('height', '200px').css('border', 'solid')
				.css('color', 'black');
		div.id = "div_test";
		var options = {
			skin: 'scrollbar-a',
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
		equal(baidu.dom.getStyle(thumb,'top'),Math.round((thumbtop+sliderheight-thumbheight)*(scrollbar.step)*0.01)+'px','click next step 1');
		
		ua.mousedown(scrollbar._next.getBody());
		ua.mouseup(scrollbar._next.getBody());
		ua.mousedown(scrollbar._next.getBody());
		ua.mouseup(scrollbar._next.getBody());
		equal(baidu.dom.getStyle(thumb,'top'),Math.round((thumbtop+sliderheight-thumbheight)*(scrollbar.step*3)*0.01)+'px','click next step 3');
		
		ua.mousedown(scrollbar._prev.getBody());
		ua.mouseup(scrollbar._next.getBody());
		equal(baidu.dom.getStyle(thumb,'top'),Math.round((thumbtop+sliderheight-thumbheight)*(scrollbar.step*2)*0.01)+'px','click prev step 1');
		
		ua.mousedown(scrollbar._slider.getThumb());
		ua.mouseup(scrollbar._next.getBody());
		equal(baidu.dom.getStyle(thumb,'top'),Math.round((thumbtop+sliderheight-thumbheight)*(scrollbar.step*2)*0.01)+'px','click thumb ');
		
		ua.mousedown(scrollbar._prev.getBody());
		ua.mouseup(scrollbar._next.getBody());
		ua.mousedown(scrollbar._prev.getBody());
		ua.mouseup(scrollbar._next.getBody());
		equal(baidu.dom.getStyle(thumb,'top'),Math.round(thumbtop)+'px','click prev step 3');
	    te.dom.push(div);
	    start();
   });
});

/**
 * 验证横向时 点击前后按钮时的情况
 */
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
	equal(baidu.dom.getStyle(thumb,'left'),Math.round((thumbleft+sliderwidth-thumbwidth)*(scrollbar.step)*0.01)+'px','click next step 1');
	
	ua.mousedown(scrollbar._next.getBody());
	ua.mouseup(scrollbar._next.getBody());
	ua.mousedown(scrollbar._next.getBody());
	ua.mouseup(scrollbar._next.getBody());
	equal(baidu.dom.getStyle(thumb,'left'),Math.round((thumbleft+sliderwidth-thumbwidth)*(scrollbar.step*3)*0.01)+'px','click next step 3');
	
	ua.mousedown(scrollbar._prev.getBody());
	ua.mouseup(scrollbar._next.getBody());
	equal(baidu.dom.getStyle(thumb,'left'),Math.round((thumbleft+sliderwidth-thumbwidth)*(scrollbar.step*2)*0.01)+'px','click prev step 1');
	
	ua.mousedown(scrollbar._slider.getThumb());
	ua.mouseup(scrollbar._next.getBody());
	equal(baidu.dom.getStyle(thumb,'left'),Math.round((thumbleft+sliderwidth-thumbwidth)*(scrollbar.step*2)*0.01)+'px','click thumb ');
	
	ua.mousedown(scrollbar._prev.getBody());
	ua.mouseup(scrollbar._next.getBody());
	ua.mousedown(scrollbar._prev.getBody());
	ua.mouseup(scrollbar._next.getBody());
	equal(baidu.dom.getStyle(thumb,'left'),Math.round(thumbleft)+'px','click prev step 3');
    te.dom.push(div);
});

/**
 * 验证拖动滑块时，滑块像素值与鼠标拖动的距离之间的对应值
 */
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
            te.obj.push(scrollbar);
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

/**
 * 鼠标点在滑动距离内时，滑块跟着移动的最终坐标值
 */
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

/**
 * flushUI的作用：设定_scrollBarSize值，设置滑动距离（总长度减去两个按钮的长度），跟进dimension和滑动距离设置滑块长度
 */
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

/**
 * dispose作用：删除生成的html元素，删除生成事件，这里通过执行两个button ，一个 slider  dispose()方法来完成dispose操作，实现思路没问题
 * 但是经验证，事件并没有完全删除，因此提了bug：PUBLICGE-343。分析是由于Button，Slider的dispose（）没有完全删除事件
 * 
 */
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
	var l1 = baidu.event._listeners.length;
	var scrollbar = new baidu.ui.ScrollBar(options);
	scrollbar.render(div);
	scrollbar.dispose();
    equal(scrollbar.getMain(),null,'main removed');
    ok(!scrollbar._slider,'check _slider not exist');
    ok(!scrollbar._next,'check next not exist');
	ok(!scrollbar._prev,'check prev not exist');
	equals(baidu.event._listeners.length, l1, 'event removed all');
});

