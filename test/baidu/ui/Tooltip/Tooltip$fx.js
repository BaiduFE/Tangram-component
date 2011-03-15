module('baidu.ui.Tooltip.Tooltip$fx');

test('Open a common tooltip(fadeIn) and '
		+'close a common tooltip(fadeOut)', function() {
 	expect(3);
	var div = testingElement.dom[0];
    var tp = new baidu.ui.Tooltip();
	tp.render(div);
	equal($(tp.getMain()).css('opacity'), 1, 
			'Before the tooltip fadeIn, the opacity is');
    tp.open();
    equal($(tp.getMain()).css('opacity'), 0, 
    		'After the tooltip fadeIn, the opacity is');
    tp.close();
    equal($(tp.getMain()).css('opacity'), 1, 
    		'After the tooltip fadeOut, the opacity is');
});

test('Open a common tooltip(zoomIn) and '
		+'close a common tooltip(zoomOut)', function() {
	expect(2);
	stop();
	var check = function() {
		var div = testingElement.dom[0];
	    var tp = new baidu.ui.Tooltip({
		    showFx : baidu.fx.zoomIn,
		    hideFx : baidu.fx.zoomOut
		    });
	    tp.render(div);
	    var a = tp.getMain().getAttribute('att_baidu_fx_scale'); 
	    tp.open();
	    var b = tp.getMain().getAttribute('att_baidu_fx_scale'); 
	    ok(a != b, 'The tooltip zoomIn');
	    tp.close();
	    var c = tp.getMain().getAttribute('att_baidu_fx_scale'); 
	    ok(b != c, 'The tooltip zoomOut');
	    start();
	};
	ua.importsrc('baidu.fx.zoomIn,baidu.fx.zoomOut', 
			check ,'baidu.fx.zoomIn', 'baidu.ui.Tooltip.Tooltip$fx');
});

test('Open a common tooltip(fadeIn) and '
		+'close a common tooltip(fadeOut) with options', function() {
 	expect(2);
	var div = testingElement.dom[0];
    var tp = new baidu.ui.Tooltip({
    	showFxOptions : {
    		onbeforestart : function() {
        		ok(true, 'The tooltip fadeIn '
        				+'with a custom onbeforestart function');
        	}
    	},
    	hideFxOptions : {
    		onbeforestart : function() {
        		ok(true, 'The tooltip fadeOut '
        				+'with a custom onbeforestart function');
        	}
    	}
    });
	tp.render(div);
    tp.open();
    tp.close();
});
