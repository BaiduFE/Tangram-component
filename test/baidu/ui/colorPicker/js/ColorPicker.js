module('baidu.ui.colorPicker.ColorPicker');
ua.importsrc("baidu.object.extend");

function createColorPicker(options) {
    var colorPicker = baidu.ui.create(baidu.ui.colorPicker.ColorPicker,
    baidu.object.extend({
        autoRender: true,
        element: testingElement.dom[0]
    }, options || {}));
    testingElement.obj.push(colorPicker);
    return colorPicker;
}

test("create colorPicker and open", function() {
    var colorPicker = createColorPicker();
    colorPicker.open();
    ok(isShown(colorPicker.getBody()), 'colorPicker is shown');
});

test("onchosen", function() {
    var colorPicker = createColorPicker({
        onchosen: function(colorObj) {
            ok(true, 'color chosen');
            equal('#B22222', colorObj.color);
        }
    });
    colorPicker.open();
    $('#' + colorPicker.getId('B22222')).click();
});

test("dispose", function() {
  var colorPicker = createColorPicker(),
      colorPickerId = colorPicker.getId();
  colorPicker.open();
  colorPicker.dispose();
  equals(baidu.g(colorPickerId), null,
          "Check colorPicker element exists or not");
})
