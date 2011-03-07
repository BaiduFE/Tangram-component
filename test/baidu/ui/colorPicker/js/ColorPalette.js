module('baidu.ui.colorPicker.ColorPalette');

function createColorPalette() {
	var colorPalette =
		new baidu.ui.colorPicker.ColorPalette({});
//		baidu.ui.create(baidu.ui.colorPicker.ColorPalette,
////			baidu.object.extend(
//					{
//				autoRender : true,
//				element : 'div_test'
//			}
////	, options || {})
//	);
	testingElement.obj.push(colorPalette);
	colorPalette.render('div_test');
	return colorPalette;
}

test("create colorPalette and test color", function() {
	var colorPalette = createColorPalette();
	ok(isShown(colorPalette.getBody()), 'colorPalette is shown');
	equal(360, colorPalette.hue, 'check hue');
	equal(100, colorPalette.saturation, 'check saturation');
	equal(100, colorPalette.brightness, 'check brightness');
	equal('#ff0000', colorPalette.hex, 'check hex');
});

test("dispose", function() {
	var colorPalette = createColorPalette(), colorPaletteId = colorPalette
			.getId();
	colorPalette.dispose();
	equals(baidu.g(colorPaletteId), null,
			"Check colorPalette element exists or not");
})