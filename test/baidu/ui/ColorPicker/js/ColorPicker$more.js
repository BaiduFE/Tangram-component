module('baidu.ui.colorPicker.ColorPicker$more');

function createColorPicker(options) {
    var colorPicker = baidu.ui.create(baidu.ui.colorPicker.ColorPicker,
    baidu.object.extend({
        autoRender: true,
        element: testingElement.dom[0]
    }, options || {}));
    testingElement.obj.push(colorPicker);
    return colorPicker;
}

test("more", function(){
  var colorPicker = createColorPicker();
  colorPicker.open();
  ok(colorPicker.colorPalette,
          "Check colorPalette obj exists or not");
  ok(colorPicker.colorPaletteDialog,
          "Check colorPaletteDialog obj exists or not");
})
