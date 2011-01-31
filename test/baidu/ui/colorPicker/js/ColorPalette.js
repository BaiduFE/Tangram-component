module('baidu.ui.colorPicker.ColorPalette');

function createColorPalette(options) {
    var colorPalette = baidu.ui.create(baidu.ui.colorPicker.ColorPalette,
    baidu.object.extend({
        autoRender: true,
        element:'div_test'
    }, options || {}));
    testingElement.obj.push(colorPalette);
    return colorPalette;
}

test("create colorPalette and test color", function() {
	stop();
	setTimeout(function(){
		var colorPalette = createColorPalette();
	    ok(isShown(colorPalette.getBody()), 'colorPalette is shown');
	    equal(360, colorPalette.hue);
	    equal(100, colorPalette.saturation);
	    equal(100, colorPalette.brightness);
	    equal('#ff0000', colorPalette.hex);
	    start();
	},30);
	
});

test("click", function() {
	stop();
	setTimeout(function(){
		var options = {
			_onPadClick: function(){
				ok(true,"pad click");
			}
		};
		var colorPalette = new baidu.ui.colorPicker.ColorPalette(options);
		colorPalette.render('div_test');
		var left = $(colorPalette.getPad()).css('left'),
		    top = $(colorPalette.getPad()).css('top');
        ua.click(colorPalette.getPad(),{
        	clientX:0,
        	clientY:50
        });
        equal($(colorPalette.getPadDot()).css('top'),top,"check padDot move top");
	    start();
	},30);
	
});

test("dispose", function() {
	stop();
	var colorPalette = createColorPalette(),
	    colorPaletteId = colorPalette.getId();
	setTimeout(function(){
	  colorPalette.dispose();
	  equals(baidu.g(colorPaletteId), null,"Check colorPalette element exists or not");
	  start();
   },30);
})