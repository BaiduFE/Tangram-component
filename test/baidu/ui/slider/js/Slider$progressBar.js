module('baidu.ui.slider.Slider$progressBar');
/**
 * 由于考虑到滑块长度可能比进度条本身的宽度要大，因此滑块可能会溢出进度条以外
 */

/**
 * 
 * @param ele
 * @param x
 * @param progress
 * @param left
 * @param thumb
 * @returns
 */


//TODO 到底滑块的滑动范围是多少？？？？？
var dragFunc = function(ele, x , finalLeft, thumb) {
	ua.mousemove(ele, {
		clientX : x
	});
	ua.mousedown(ele, {
		clientX : x
	});
	ua.mouseup(ele, {
		clientX : x
	});
	equal($(thumb).css('left'), finalLeft+'px', 'left');
}

test('mouse within range',function(){
	var sp = new baidu.ui.slider.Slider();
	var div = te.dom[0];
	sp.render(div);
	var thumb = sp.getThumb();
	var pb = sp.progressBar;
	var progress = pb.getValue()*200/100;//200 is width of div
	var body = sp.getBody();
	var x = parseInt(baidu.dom.getPosition(body)['left']);
	var left = parseInt($(thumb).css('left'));
	ok(pb, 'progress bar is created');
	x += progress;/*滑动在范围以内*/
	dragFunc(body,x,left + progress-parseInt(thumb.offsetWidth/2),thumb);

});
/**
 * 边界值测试
 */
test('mouse outof range', function() {
	var sp = new baidu.ui.slider.Slider();
	var div = te.dom[0];
	sp.render(div);
	var thumb = sp.getThumb();
	var pb = sp.progressBar;
	var ratio = (parseInt($(div).css('width'))-thumb.offsetWidth) / 100;
	var body = sp.getBody();

	var x = parseInt(baidu.dom.getPosition(body)['left']);
	var left = baidu.dom.getPosition(thumb)['left'];
	ok(pb, 'progress bar is created');
	/*mouse outof range*/
	dragFunc(body, x + 40 , pb.getValue()*ratio, thumb);
});