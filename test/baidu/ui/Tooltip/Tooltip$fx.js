module('baidu.ui.Tooltip.Tooltip$fx');

test('Open a common tooltip(fadeIn) and '
		+'close a common tooltip(fadeOut)', function() {
 	expect(2);
	stop();
	var check = function() {
		var div = testingElement.dom[0];
		var tp = new baidu.ui.Tooltip();
	    tp.addEventListener('onopen', function(){
	    	var len = baidu.fx.current(tp.getMain()).length;
			equal(baidu.fx.current(tp.getMain())[len-1]['_className'], 
					'baidu.fx.fadeIn', 'The tooltip fadeIn');
			tp.close();
	    });
	    tp.addEventListener('beforeclose', function(){
	    	var len = baidu.fx.current(tp.getMain()).length;
		    equal(baidu.fx.current(tp.getMain())[len-1]['_className'], 
					'baidu.fx.fadeOut', 'The tooltip fadeOut');
		    setTimeout(start,500);
	    });
	 
		tp.render(div);
	    tp.open();
	    te.obj.push(tp);
	};
	ua.importsrc('baidu.fx.current', 
			check ,'baidu.fx.current', 'baidu.ui.Tooltip.Tooltip$fx');
});

test('Open a common tooltip(expand) and '
		+'close a common tooltip(collapse)', function() {
	expect(2);
	stop();
	var check = function() {
		var div = testingElement.dom[0];
	    var tp = new baidu.ui.Tooltip({
		    showFx : baidu.fx.expand,
		    hideFx : baidu.fx.collapse
		    });
	    tp.addEventListener('onopen', function(){
	    	var len = baidu.fx.current(tp.getMain()).length;
		    var len = baidu.fx.current(tp.getMain()).length;
		    var fx = baidu.fx.current(tp.getMain())[len-1]['_className'];
		    var guid = baidu.fx.current(tp.getMain())[len-1]['guid'];
		    ok(fx == 'baidu.fx.expand_collapse', 'The tooltip expand');
		    tp.close();
	    });
	    tp.addEventListener('beforeclose', function(){
	    	var len = baidu.fx.current(tp.getMain()).length;
		    var fx = baidu.fx.current(tp.getMain())[len-1]['_className'];
		    var guid = baidu.fx.current(tp.getMain())[len-1]['guid'];
	    	ok((fx == 'baidu.fx.expand_collapse') &&
		    		guid != baidu.fx.current(tp.getMain())[len-1]['_guid'],
		    		'The tooltip collapse');
	    	setTimeout(start,500);
	    });
		
	    tp.render(div);
	    tp.open();
	    te.obj.push(tp);
	    };
	ua.importsrc('baidu.fx.expand,baidu.fx.collapse,baidu.fx.current', 
			check ,'baidu.fx.expand', 'baidu.ui.Tooltip.Tooltip$fx');
});

test('Open a common tooltip(fadeIn) and '
		+'close a common tooltip(fadeOut) with options', function() {
 	expect(4);
	var div = testingElement.dom[0];
    var tp = new baidu.ui.Tooltip({
        showFxOptions : {
    			onbeforestart : function() {
    	    		ok(true, 'The tooltip fadeIn '
    	    				+'with a custom onbeforestart function');
    	    	},
    	    	onafterfinish : function() {
    	    		ok(true, 'The tooltip fadeIn '
    	    				+'with a custom onafterfinish function');
    	    		tp.close();
    	    	}
    		},
    	hideFxOptions : {
    			onbeforestart : function() {
    	    		ok(true, 'The tooltip fadeOut '
    	    				+'with a custom onbeforestart function');
    	    	},
    	    	onafterfinish : function() {
    	    		ok(true, 'The tooltip fadeOut '
    	    				+'with a custom onafterfinish function');
    			    start();
    	    	}
    		}
    });
 	stop();
	tp.render(div);
    tp.open();
});

test('Clear the tooltip when the fx is showing', function() {
 	expect(1);
	stop();
	var check = function() {
		var div = testingElement.dom[0];
		var tp = new baidu.ui.Tooltip();
	    tp.addEventListener('onopen', function(){
			tp.close();
	    });
	    tp.addEventListener('beforeclose', function(){
		    start();
		    ok(false, "用例跑完后会报错：Cannot read property 'style' of null,PUBLICGE-330");
	    });
		tp.render(div);
	    tp.open();
	    te.obj.push(tp);
	};
	ua.importsrc('baidu.fx.current', 
			check ,'baidu.fx.current', 'baidu.ui.Tooltip.Tooltip$fx');
});