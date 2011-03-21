module('baidu.ui.ColorPicker.ColorPicker$more');

// colorPalate的校验在colorPalate中进行，此处仅校验交互接口
test("base", function() {
	stop();
	ua.loadcss(upath + 'css/colorpicker.css',
			function() {
				var cp = new baidu.ui.ColorPicker({
					posable : true,
					autoRender : true,
					element : te.dom[1]
				});
				te.obj.push(cp);
				ok(cp.more, 'more is set');
				cp.render();
				cp.open();
				ok(cp.colorPalette, "Check colorPalette obj exists or not");
				ok(cp.colorPaletteDialog,
						"Check colorPaletteDialog obj exists or not");
				start();
			}, 'tangram-dialog-cancel', 'height', '20px');
});