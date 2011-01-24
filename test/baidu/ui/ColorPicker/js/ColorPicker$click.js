module('baidu.ui.colorPicker.ColorPicker$click');

function createColorPicker(options) {
    var colorPicker = baidu.ui.create(baidu.ui.colorPicker.ColorPicker,
    baidu.object.extend({
        autoRender: true,
        element: testingElement.dom[0]
    }, options || {}));
    testingElement.obj.push(colorPicker);
    return colorPicker;
}

test('click', function() {
    var colorPicker = createColorPicker();
    UserAction.click($('#b1')[0]);
    ok(isShown(colorPicker.getBody()), 'shown after click');
    
    var div = document.createElement('div');
    testingElement.dom.push(div);
    document.body.appendChild(div);
    UserAction.click(div);
    ok(!isShown(colorPicker.getBody()), 'hide after click');
});

