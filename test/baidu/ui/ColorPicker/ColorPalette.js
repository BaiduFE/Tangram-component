module('baidu.ui.ColorPicker.ColorPalette');

function createColorPalette(options) {
    var colorPalette = baidu.ui.create(baidu.ui.ColorPicker.ColorPalette,
    baidu.object.extend({
        autoRender: true,
        element:'div_test'
    }, options || {}));
    testingElement.obj.push(colorPalette);
    return colorPalette;
}

test("create colorPalette and test color", function() {
    var colorPalette = createColorPalette();
    ok(isShown(colorPalette.getBody()), 'colorPalette is shown');
    equal(360, colorPalette.hue);
    equal(100, colorPalette.saturation);
    equal(100, colorPalette.brightness);
    equal('#ff0000', colorPalette.hex);
});

test("dispose", function() {
  var colorPalette = createColorPalette(),
      colorPaletteId = colorPalette.getId();
  colorPalette.dispose();
  equals(baidu.g(colorPaletteId), null,
          "Check colorPalette element exists or not");
})