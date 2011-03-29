module('baidu.ui.ScrollBar.ScrollBar$container');

test('init',function(){
	stop();
	ua.loadcss(upath+'style.css',function(){
		var div = document.body.appendChild(document.createElement("div"));
		$(div).css('width', '200px').css('height', '200px').css('border', 'red solid 1px')
			.css('color', 'black').css('overflow','hidden').css('float','left');
		div.id = "mydev";
		var div1 = document.body.appendChild(document.createElement("div"));
		$(div1).css('width', '15px').css('height', '200px').css('border', 'green solid 1px').css('float','left');
		div1.id = 'vScrollbarId';
		var options = {
			skin: 'scrollbar',
			container: div,
			onbeforeupdate : function(){
				ok(true,'onbeforeupdate');
			}
		};
		var scrollbar = new baidu.ui.ScrollBar(options);
		scrollbar.render(div1);	
		equal(scrollbar.dimension,100,'check init dimension');
	    equal(scrollbar.value,0,'check init value');
	    start();
		te.dom.push(div);
		te.dom.push(div1);
	});

});

test('scroll',function(){
		var div = document.body.appendChild(document.createElement("div"));
		$(div).css('width', '200px').css('height', '200px').css('border', 'red solid 1px')
			.css('color', 'black').css('overflow','hidden').css('float','left');
		var divcontent = '1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>';	
		div.id = "mydev";
		div.innerHTML = divcontent;
		var div1 = document.body.appendChild(document.createElement("div"));
		$(div1).css('width', '15px').css('height', '200px').css('border', 'green solid 1px').css('float','left');
		div1.id = 'vScrollbarId';
		var options = {
			skin: 'scrollbar',
			container: div
//			onscroll : function(){
//				
//			}
		};
		var scrollbar = new baidu.ui.ScrollBar(options);
		var container = scrollbar.getContainer();
		scrollbar.render(div1);
		equal(scrollbar.dimension,Math.round(container.clientHeight/container.scrollHeight*100),'check init dimension');
	    equal(scrollbar.value,0,'check init value');
		var thumb = scrollbar._slider.getThumb();
		var thumbtop = Math.round(parseInt(baidu.dom.getStyle(thumb,'top')));//初始滑块top值
		var sliderheight = Math.round(parseInt(baidu.dom.getStyle(scrollbar._slider.getMain(),'height')));//滑动区域高度
		var thumbheight = Math.round(sliderheight*parseFloat(baidu.dom.getStyle(thumb,'height'))*0.01);//滑块高度 thumbtop+sliderheight-thumbheight：滑块可滑动区域

		ua.mousedown(scrollbar._next.getBody());
		ua.mouseup(scrollbar._next.getBody());
		equal(baidu.dom.getStyle(thumb,'top'),Math.round((thumbtop+sliderheight-thumbheight)*(scrollbar.step)*0.01)+'px','click next step 1');
		equal(container.scrollTop,scrollbar._slider.getValue()/100*(container.scrollHeight-container.clientHeight),'check container scrollTop');
		start();

		te.dom.push(div);
    	te.dom.push(div1);

});